-- BrewLotto V1: backfill and refresh draw_freshness_status from live draw data.

CREATE OR REPLACE FUNCTION public.next_scheduled_draw_at(
    p_schedule_config jsonb,
    p_timezone text,
    p_reference timestamptz DEFAULT now()
) RETURNS timestamptz
LANGUAGE sql
STABLE
AS $$
WITH normalized_windows AS (
    SELECT
        item ->> 'label' AS label,
        item ->> 'time' AS local_time,
        ARRAY(
            SELECT CASE lower(value)
                WHEN 'mon' THEN 1
                WHEN 'monday' THEN 1
                WHEN 'tue' THEN 2
                WHEN 'tues' THEN 2
                WHEN 'tuesday' THEN 2
                WHEN 'wed' THEN 3
                WHEN 'wednesday' THEN 3
                WHEN 'thu' THEN 4
                WHEN 'thurs' THEN 4
                WHEN 'thursday' THEN 4
                WHEN 'fri' THEN 5
                WHEN 'friday' THEN 5
                WHEN 'sat' THEN 6
                WHEN 'saturday' THEN 6
                WHEN 'sun' THEN 7
                WHEN 'sunday' THEN 7
                ELSE NULL
            END
            FROM jsonb_array_elements_text(COALESCE(item -> 'days', '[]'::jsonb)) AS day_values(value)
        ) AS active_days
    FROM jsonb_array_elements(COALESCE(p_schedule_config -> 'windows', '[]'::jsonb)) AS item

    UNION ALL

    SELECT 'time', p_schedule_config ->> 'time', NULL::integer[]
    WHERE p_schedule_config ? 'time'

    UNION ALL

    SELECT 'day', p_schedule_config ->> 'day', NULL::integer[]
    WHERE p_schedule_config ? 'day'

    UNION ALL

    SELECT 'night', p_schedule_config ->> 'night', NULL::integer[]
    WHERE p_schedule_config ? 'night'

    UNION ALL

    SELECT 'monday', p_schedule_config ->> 'mon', ARRAY[1]
    WHERE p_schedule_config ? 'mon'

    UNION ALL

    SELECT 'tuesday', p_schedule_config ->> 'tue', ARRAY[2]
    WHERE p_schedule_config ? 'tue'

    UNION ALL

    SELECT 'wednesday', p_schedule_config ->> 'wed', ARRAY[3]
    WHERE p_schedule_config ? 'wed'

    UNION ALL

    SELECT 'thursday', p_schedule_config ->> 'thu', ARRAY[4]
    WHERE p_schedule_config ? 'thu'

    UNION ALL

    SELECT 'friday', p_schedule_config ->> 'fri', ARRAY[5]
    WHERE p_schedule_config ? 'fri'

    UNION ALL

    SELECT 'saturday', p_schedule_config ->> 'sat', ARRAY[6]
    WHERE p_schedule_config ? 'sat'

    UNION ALL

    SELECT 'sunday', p_schedule_config ->> 'sun', ARRAY[7]
    WHERE p_schedule_config ? 'sun'
), valid_windows AS (
    SELECT
        label,
        local_time,
        active_days
    FROM normalized_windows
    WHERE local_time IS NOT NULL
      AND local_time <> ''
), candidate_datetimes AS (
    SELECT
        (((((p_reference AT TIME ZONE p_timezone)::date + offset_days)::text) || ' ' || local_time)::timestamp AT TIME ZONE p_timezone) AS candidate_at
    FROM valid_windows
    CROSS JOIN generate_series(0, 7) AS offset_days
    WHERE active_days IS NULL
       OR array_length(active_days, 1) IS NULL
       OR extract(isodow FROM ((p_reference AT TIME ZONE p_timezone)::date + offset_days))::integer = ANY(active_days)
)
SELECT MIN(candidate_at)
FROM candidate_datetimes
WHERE candidate_at > p_reference;
$$;

CREATE OR REPLACE FUNCTION public.refresh_draw_freshness_status()
RETURNS void
LANGUAGE sql
AS $$
WITH latest_draw AS (
    SELECT DISTINCT ON (od.game_id)
        od.game_id,
        od.id AS latest_draw_id,
        od.draw_datetime_local
    FROM public.official_draws od
    ORDER BY od.game_id, od.draw_datetime_local DESC, od.created_at DESC
), latest_run AS (
    SELECT DISTINCT ON (dir.game_id)
        dir.game_id,
        dir.id AS latest_ingestion_run_id,
        dir.status,
        dir.finished_at,
        dir.started_at
    FROM public.draw_ingestion_runs dir
    WHERE dir.game_id IS NOT NULL
    ORDER BY dir.game_id, dir.started_at DESC
), computed AS (
    SELECT
        lg.id AS game_id,
        ld.latest_draw_id,
        ld.draw_datetime_local AS latest_draw_datetime_local,
        lr.latest_ingestion_run_id,
        CASE
            WHEN ld.draw_datetime_local IS NULL THEN public.next_scheduled_draw_at(lg.schedule_config, s.timezone, now())
            ELSE public.next_scheduled_draw_at(lg.schedule_config, s.timezone, ld.draw_datetime_local + interval '1 minute')
        END AS expected_next_draw_at,
        CASE
            WHEN ld.draw_datetime_local IS NULL THEN NULL
            ELSE GREATEST(0, floor(extract(epoch FROM (now() - ld.draw_datetime_local)) / 60))::integer
        END AS staleness_minutes,
        CASE
            WHEN ld.draw_datetime_local IS NULL THEN 'failed'
            WHEN lr.status = 'failed' THEN 'failed'
            WHEN CASE
                WHEN ld.draw_datetime_local IS NULL THEN public.next_scheduled_draw_at(lg.schedule_config, s.timezone, now())
                ELSE public.next_scheduled_draw_at(lg.schedule_config, s.timezone, ld.draw_datetime_local + interval '1 minute')
            END IS NULL THEN
                CASE
                    WHEN GREATEST(0, floor(extract(epoch FROM (now() - ld.draw_datetime_local)) / 60))::integer <= 180 THEN 'healthy'
                    WHEN GREATEST(0, floor(extract(epoch FROM (now() - ld.draw_datetime_local)) / 60))::integer <= 720 THEN 'delayed'
                    ELSE 'stale'
                END
            WHEN now() <= CASE
                WHEN ld.draw_datetime_local IS NULL THEN public.next_scheduled_draw_at(lg.schedule_config, s.timezone, now())
                ELSE public.next_scheduled_draw_at(lg.schedule_config, s.timezone, ld.draw_datetime_local + interval '1 minute')
            END + interval '180 minutes' THEN 'healthy'
            WHEN now() <= CASE
                WHEN ld.draw_datetime_local IS NULL THEN public.next_scheduled_draw_at(lg.schedule_config, s.timezone, now())
                ELSE public.next_scheduled_draw_at(lg.schedule_config, s.timezone, ld.draw_datetime_local + interval '1 minute')
            END + interval '720 minutes' THEN 'delayed'
            ELSE 'stale'
        END AS status
    FROM public.lottery_games lg
    JOIN public.states s ON s.code = lg.state_code
    LEFT JOIN latest_draw ld ON ld.game_id = lg.id
    LEFT JOIN latest_run lr ON lr.game_id = lg.id
    WHERE lg.is_active = true
)
INSERT INTO public.draw_freshness_status (
    game_id,
    latest_draw_id,
    latest_draw_datetime_local,
    latest_ingestion_run_id,
    expected_next_draw_at,
    staleness_minutes,
    status,
    updated_at
)
SELECT
    game_id,
    latest_draw_id,
    latest_draw_datetime_local,
    latest_ingestion_run_id,
    expected_next_draw_at,
    staleness_minutes,
    status,
    now()
FROM computed
ON CONFLICT (game_id) DO UPDATE
SET latest_draw_id = EXCLUDED.latest_draw_id,
    latest_draw_datetime_local = EXCLUDED.latest_draw_datetime_local,
    latest_ingestion_run_id = EXCLUDED.latest_ingestion_run_id,
    expected_next_draw_at = EXCLUDED.expected_next_draw_at,
    staleness_minutes = EXCLUDED.staleness_minutes,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;
$$;

SELECT public.refresh_draw_freshness_status();
