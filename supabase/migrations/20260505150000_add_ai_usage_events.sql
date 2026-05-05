-- BrewLotto AI usage ledger for BrewCommand monitoring

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  route text not null,
  operation text not null,
  provider text not null,
  model text not null,
  status text not null,
  latency_ms integer,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  estimated_cost_usd numeric(12,6),
  user_id uuid,
  user_email text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists ai_usage_events_created_at_idx
  on public.ai_usage_events (created_at desc);

create index if not exists ai_usage_events_provider_idx
  on public.ai_usage_events (provider);

create index if not exists ai_usage_events_model_idx
  on public.ai_usage_events (model);

create index if not exists ai_usage_events_status_idx
  on public.ai_usage_events (status);

alter table public.ai_usage_events enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_usage_events'
      and policyname = 'Service role can manage AI usage events'
  ) then
    create policy "Service role can manage AI usage events"
      on public.ai_usage_events
      for all
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;
end $$;
