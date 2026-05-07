-- BrewLotto V1: Support request tracking table

create table if not exists public.support_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid null references auth.users(id) on delete set null,
    contact_email text null,
    category text not null,
    subject text not null,
    message text not null,
    page text null,
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

create index if not exists support_requests_created_at_idx
    on public.support_requests (created_at desc);

create index if not exists support_requests_status_idx
    on public.support_requests (status);

create index if not exists support_requests_category_idx
    on public.support_requests (category);

create index if not exists support_requests_user_id_idx
    on public.support_requests (user_id);

alter table public.support_requests enable row level security;

drop policy if exists "Service role can manage support requests" on public.support_requests;
create policy "Service role can manage support requests" on public.support_requests
    for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

