-- Jump Force Companion Supabase Schema
-- Assumptions:
-- - Single private league, created via bootstrap_league
-- - Lazy membership via ensure_membership() on app start

create extension if not exists "pgcrypto";

-- Allowlist
create table if not exists public.allowlist_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.league_members (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (league_id, user_id)
);

create table if not exists public.player_stats (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  elo int not null default 1000,
  wins int not null default 0,
  losses int not null default 0,
  games int not null default 0,
  updated_at timestamptz not null default now(),
  unique (league_id, user_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  played_at timestamptz not null,
  player_a uuid not null references auth.users(id),
  player_b uuid not null references auth.users(id),
  winner uuid not null references auth.users(id),
  mode text not null,
  rules jsonb not null default '{}'::jsonb,
  team_a jsonb not null,
  team_b jsonb not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists matches_league_played_at_idx on public.matches(league_id, played_at desc);
create index if not exists matches_players_idx on public.matches(player_a, player_b);
create index if not exists stats_league_elo_idx on public.player_stats(league_id, elo desc);

-- RLS helpers
create or replace function public.is_allowlisted(email text)
returns boolean
language sql
stable
as $$
  select exists (select 1 from public.allowlist_emails a where lower(a.email) = lower(email));
$$;

create or replace function public.is_league_member(league uuid, user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.league_members m
    where m.league_id = league and m.user_id = user_id
  );
$$;

alter table public.allowlist_emails enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.player_stats enable row level security;
alter table public.matches enable row level security;

-- Policies: allowlisted + member
create policy allowlist_select on public.allowlist_emails
  for select
  to authenticated
  using (public.is_allowlisted(auth.email()));

create policy leagues_select on public.leagues
  for select
  to authenticated
  using (public.is_allowlisted(auth.email()));

create policy league_members_select on public.league_members
  for select
  to authenticated
  using (public.is_allowlisted(auth.email()) and public.is_league_member(league_id, auth.uid()));

create policy player_stats_select on public.player_stats
  for select
  to authenticated
  using (public.is_allowlisted(auth.email()) and public.is_league_member(league_id, auth.uid()));

create policy matches_select on public.matches
  for select
  to authenticated
  using (public.is_allowlisted(auth.email()) and public.is_league_member(league_id, auth.uid()));

-- Only RPC writes
create policy matches_insert_denied on public.matches
  for insert
  to authenticated
  with check (false);

create policy stats_update_denied on public.player_stats
  for update
  to authenticated
  using (false);

create policy stats_insert_denied on public.player_stats
  for insert
  to authenticated
  with check (false);

-- Bootstrap league: inserts allowlist and creates league
create or replace function public.bootstrap_league(league_name text, allowed_emails text[])
returns uuid
language plpgsql
security definer
as $$
declare
  new_league_id uuid;
  v_email text;
begin
  insert into public.leagues(name)
  values (league_name)
  returning id into new_league_id;

  foreach v_email in array allowed_emails loop
    insert into public.allowlist_emails(email)
    values (v_email)
    on conflict (email) do nothing;
  end loop;

  return new_league_id;
end;
$$;

-- Lazy membership: add allowlisted users to league and initialize stats
create or replace function public.ensure_membership(league_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  current_email text;
begin
  current_email := auth.email();

  if current_email is null or not public.is_allowlisted(current_email) then
    raise exception 'not allowlisted';
  end if;

  insert into public.league_members(league_id, user_id)
  values (league_id, auth.uid())
  on conflict (league_id, user_id) do nothing;

  insert into public.player_stats(league_id, user_id)
  values (league_id, auth.uid())
  on conflict (league_id, user_id) do nothing;
end;
$$;

-- Record match + update ELO
create or replace function public.record_match(
  league_id uuid,
  player_a uuid,
  player_b uuid,
  winner uuid,
  team_a jsonb,
  team_b jsonb,
  mode text,
  rules jsonb
)
returns table(match_id uuid, elo_a int, elo_b int)
language plpgsql
security definer
as $$
declare
  rating_a int;
  rating_b int;
  expected_a numeric;
  expected_b numeric;
  score_a int;
  score_b int;
  k constant int := 24;
begin
  if not public.is_allowlisted(auth.email()) then
    raise exception 'not allowlisted';
  end if;

  if player_a = player_b then
    raise exception 'player_a and player_b must differ';
  end if;

  if winner <> player_a and winner <> player_b then
    raise exception 'winner must be player_a or player_b';
  end if;

  if not public.is_league_member(league_id, player_a) or not public.is_league_member(league_id, player_b) then
    raise exception 'players must be league members';
  end if;

  select elo into rating_a from public.player_stats where league_id = record_match.league_id and user_id = player_a;
  select elo into rating_b from public.player_stats where league_id = record_match.league_id and user_id = player_b;

  if rating_a is null or rating_b is null then
    raise exception 'missing player stats';
  end if;

  score_a := case when winner = player_a then 1 else 0 end;
  score_b := case when winner = player_b then 1 else 0 end;

  expected_a := 1 / (1 + power(10, ((rating_b - rating_a)::numeric / 400)));
  expected_b := 1 / (1 + power(10, ((rating_a - rating_b)::numeric / 400)));

  elo_a := round(rating_a + k * (score_a - expected_a));
  elo_b := round(rating_b + k * (score_b - expected_b));

  insert into public.matches(
    league_id, played_at, player_a, player_b, winner, mode, rules, team_a, team_b, created_by
  ) values (
    record_match.league_id, now(), player_a, player_b, winner, mode, rules, team_a, team_b, auth.uid()
  ) returning id into match_id;

  update public.player_stats
    set elo = elo_a,
        wins = wins + score_a,
        losses = losses + score_b,
        games = games + 1,
        updated_at = now()
  where league_id = record_match.league_id and user_id = player_a;

  update public.player_stats
    set elo = elo_b,
        wins = wins + score_b,
        losses = losses + score_a,
        games = games + 1,
        updated_at = now()
  where league_id = record_match.league_id and user_id = player_b;

  return next;
end;
$$;
