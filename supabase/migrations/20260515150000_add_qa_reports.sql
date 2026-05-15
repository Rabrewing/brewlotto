-- BrewLotto V1: QA report tracking table for approved testers

create table if not exists public.qa_reports (
    id uuid primary key default gen_random_uuid(),
    user_id uuid null references auth.users(id) on delete set null,
    contact_email text null,
    tester_name text null,
    tier_tested text not null default 'free',
    journey_stage text not null default 'start_here',
    feature_area text not null default 'dashboard',
    page_path text null,
    loaded_as_expected boolean not null default true,
    tier_matched boolean not null default true,
    next_step_matched boolean not null default true,
    fireball_relevant boolean not null default false,
    timepulse_relevant boolean not null default false,
    expected_behavior text not null,
    actual_behavior text not null,
    notes text null,
    browser_info jsonb not null default '{}'::jsonb,
    status text not null default 'open',
    priority text not null default 'normal',
    screenshot_count integer not null default 0,
    screenshot_payload jsonb not null default '[]'::jsonb,
    alert_event_id uuid null references public.alert_events(id) on delete set null,
    admin_notes text null,
    first_response_at timestamptz null,
    resolved_at timestamptz null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists qa_reports_created_at_idx
    on public.qa_reports (created_at desc);

create index if not exists qa_reports_status_idx
    on public.qa_reports (status);

create index if not exists qa_reports_priority_idx
    on public.qa_reports (priority);

create index if not exists qa_reports_tier_tested_idx
    on public.qa_reports (tier_tested);

create index if not exists qa_reports_user_id_idx
    on public.qa_reports (user_id);

alter table public.qa_reports enable row level security;

drop policy if exists "Service role can manage qa reports" on public.qa_reports;
create policy "Service role can manage qa reports" on public.qa_reports
    for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');
