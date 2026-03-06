-- 002_sop_runs.sql
create extension if not exists "pgcrypto";

-- SOP Steps
create table if not exists public.sop_steps (
  id uuid primary key default gen_random_uuid(),
  sop_id uuid not null references public.sops(id) on delete cascade,
  step_order int not null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (sop_id, step_order)
);

create index if not exists idx_sop_steps_sop_id on public.sop_steps(sop_id);

-- Runs
create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  sop_id uuid not null references public.sops(id) on delete cascade,
  status text not null check (status in ('in_progress','completed')) default 'in_progress',
  started_by text not null, -- clerk user id
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_runs_team_id on public.runs(team_id);
create index if not exists idx_runs_sop_id on public.runs(sop_id);

-- Run Steps (per-run completion state)
create table if not exists public.run_steps (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.runs(id) on delete cascade,
  step_id uuid not null references public.sop_steps(id) on delete cascade,
  step_order int not null,
  is_done boolean not null default false,
  done_at timestamptz,
  done_by text, -- clerk user id
  unique (run_id, step_id)
);

create index if not exists idx_run_steps_run_id on public.run_steps(run_id);