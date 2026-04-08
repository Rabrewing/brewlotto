-- BrewLotto V1: deactivate empty duplicate lottery_games placeholders.

WITH duplicate_placeholders AS (
    SELECT unnest(ARRAY[
        '966b31c3-919a-4e34-a05e-fe6c168abbf1'::uuid,
        '07752836-3514-45e7-855c-bb57461972e9'::uuid,
        '087c6490-be14-4e2b-a12e-5e86652dbf85'::uuid,
        'ee92df03-4c00-4dc2-8d7c-3a741e1268ee'::uuid,
        'a68a9b07-f3ce-4235-bd49-3e1d272ed77d'::uuid,
        'b7a29d49-26af-4287-83f8-cb5aaa90a50b'::uuid,
        'cfac68f4-8429-479c-975c-5fd0cd47d41e'::uuid,
        'db0ab5ce-3f7d-4e07-9f72-d8e49c2e88d0'::uuid,
        '83a8a166-51c0-4e01-a27e-e1a3698fed43'::uuid,
        '8c4e3b18-6390-4ff5-8282-56c774b65eb9'::uuid
    ]) AS game_id
)
UPDATE public.lottery_games lg
SET is_active = false,
    updated_at = now()
FROM duplicate_placeholders dp
WHERE lg.id = dp.game_id
  AND lg.is_active = true;

DELETE FROM public.draw_freshness_status dfs
WHERE dfs.game_id IN (
    '966b31c3-919a-4e34-a05e-fe6c168abbf1'::uuid,
    '07752836-3514-45e7-855c-bb57461972e9'::uuid,
    '087c6490-be14-4e2b-a12e-5e86652dbf85'::uuid,
    'ee92df03-4c00-4dc2-8d7c-3a741e1268ee'::uuid,
    'a68a9b07-f3ce-4235-bd49-3e1d272ed77d'::uuid,
    'b7a29d49-26af-4287-83f8-cb5aaa90a50b'::uuid,
    'cfac68f4-8429-479c-975c-5fd0cd47d41e'::uuid,
    'db0ab5ce-3f7d-4e07-9f72-d8e49c2e88d0'::uuid,
    '83a8a166-51c0-4e01-a27e-e1a3698fed43'::uuid,
    '8c4e3b18-6390-4ff5-8282-56c774b65eb9'::uuid
);

SELECT public.refresh_draw_freshness_status();
