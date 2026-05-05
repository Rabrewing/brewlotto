-- BrewCommand settings for alert routing and admin-control defaults

create table if not exists public.brewcommand_settings (
  setting_key text primary key,
  setting_value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.brewcommand_settings (setting_key, setting_value)
values ('alert_notification_recipient_email', 'command@brewlotto.app')
on conflict (setting_key) do update
set setting_value = excluded.setting_value,
    updated_at = now();

alter table public.brewcommand_settings enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'brewcommand_settings'
      and policyname = 'Service role can manage brewcommand settings'
  ) then
    create policy "Service role can manage brewcommand settings"
      on public.brewcommand_settings
      for all
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;
end $$;
