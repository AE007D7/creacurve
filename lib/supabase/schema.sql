-- CreaCurve Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  created_at timestamptz default now() not null
);

-- Projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  logo_url text not null,
  original_filename text,
  brand_name text,
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')) not null,
  brand_data jsonb,
  zip_url text,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  error_message text,
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

-- Assets table
create table public.assets (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  category text not null,
  name text not null,
  url text not null,
  thumbnail_url text,
  width integer,
  height integer,
  file_size integer,
  created_at timestamptz default now() not null
);

-- Payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete set null,
  stripe_session_id text unique not null,
  amount integer not null,
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')) not null,
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz default now() not null
);

-- RLS Policies

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.assets enable row level security;
alter table public.payments enable row level security;

-- Users: only own profile
create policy "users_own" on public.users
  for all using (auth.uid() = id);

-- Projects: user owns their projects
create policy "projects_own" on public.projects
  for all using (auth.uid() = user_id);

-- Assets: accessible via project ownership
create policy "assets_via_project" on public.assets
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = assets.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Payments: own payments
create policy "payments_own" on public.payments
  for select using (auth.uid() = user_id);

-- Storage Buckets (run after creating buckets in dashboard)
-- logos bucket: authenticated users can upload
-- assets bucket: public read
-- zips bucket: private, signed URLs only

-- Function: auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index projects_user_id_idx on public.projects(user_id);
create index projects_status_idx on public.projects(status);
create index assets_project_id_idx on public.assets(project_id);
create index assets_category_idx on public.assets(category);
create index payments_stripe_session_id_idx on public.payments(stripe_session_id);
