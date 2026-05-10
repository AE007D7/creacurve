-- ── Content Automation Schema ─────────────────────────────────────────────
-- Run this in your Supabase SQL Editor AFTER the main schema.sql

-- Business profiles (one per brand/client)
create table if not exists public.content_profiles (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  niche       text not null,
  audience    text not null,
  tone        text not null default 'professional and approachable',
  services    text[] not null default '{}',
  usp         text not null default '',
  cta_url     text not null default '',
  platforms   text[] not null default '{instagram,x,linkedin}',
  is_default  boolean default false,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Generated content pieces
create table if not exists public.content_pieces (
  id            uuid default uuid_generate_v4() primary key,
  profile_id    uuid references public.content_profiles(id) on delete cascade not null,
  category      text not null check (category in ('educational','promotional','authority','engagement','lead_gen')),
  topic         text not null,
  posts         jsonb not null default '[]',    -- PlatformPost[]
  blog_idea     jsonb,                           -- BlogIdea | null
  email_subject text not null default '',
  repurpose_tip text not null default '',
  status        text not null default 'draft' check (status in ('draft','approved','scheduled','posted')),
  scheduled_at  timestamptz,
  posted_at     timestamptz,
  created_at    timestamptz default now() not null
);

-- Indexes
create index if not exists idx_content_pieces_profile   on public.content_pieces(profile_id);
create index if not exists idx_content_pieces_status    on public.content_pieces(status);
create index if not exists idx_content_pieces_scheduled on public.content_pieces(scheduled_at);
create index if not exists idx_content_pieces_created   on public.content_pieces(created_at desc);

-- RLS (admin-only via service role key)
alter table public.content_profiles enable row level security;
alter table public.content_pieces   enable row level security;

-- Allow all access from service role (server-side only)
create policy "service role full access profiles"
  on public.content_profiles for all
  using (true) with check (true);

create policy "service role full access pieces"
  on public.content_pieces for all
  using (true) with check (true);
