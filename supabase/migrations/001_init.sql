-- Enable UUIDs
create extension if not exists "pgcrypto";

-- Teams
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id text not null, -- Clerk user id
  created_at timestamptz not null default now()
);

-- Members
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id text not null, -- Clerk user id
  role text not null check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

-- SOPs (skeleton for dashboard listing)
create table if not exists public.sops (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  created_by text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_sops_team_id on public.sops(team_id);