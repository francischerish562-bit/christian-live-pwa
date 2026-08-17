-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ==========================
-- ADMINS
-- ==========================

create table public.admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- ==========================
-- LIVE STREAMS
-- ==========================

create table public.live_streams (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  stream_type text not null check (
    stream_type in ('hls','youtube','embed')
  ),

  stream_url text,
  embed_url text,

  is_live boolean default false,

  started_at timestamptz,
  ended_at timestamptz,

  created_by uuid references public.admins(id),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================
-- SERMONS
-- ==========================

create table public.sermons (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  preacher text,
  description text,

  thumbnail text,
  video_url text,

  duration integer,

  created_by uuid references public.admins(id),

  created_at timestamptz default now()
);

-- ==========================
-- HYMNS
-- ==========================

create table public.hymns (
  id uuid primary key default gen_random_uuid(),

  hymn_number integer unique,
  title text not null,

  lyrics text not null,

  category text,

  created_at timestamptz default now()
);

-- ==========================
-- BIBLE BOOKS
-- ==========================

create table public.bible_books (
  id uuid primary key default gen_random_uuid(),

  book text not null,
  chapter integer not null,
  verse integer not null,

  scripture text not null
);

-- ==========================
-- SETTINGS
-- ==========================

create table public.settings (
  id uuid primary key default gen_random_uuid(),

  ministry_name text,
  logo text,

  primary_color text default '#1D4ED8',

  updated_at timestamptz default now()
);

-- ==========================
-- NOTIFICATIONS
-- ==========================

create table public.notifications (
  id uuid primary key default gen_random_uuid(),

  title text,
  message text,

  sent boolean default false,

  created_at timestamptz default now()
);

-- ==========================
-- VIEWER SESSIONS
-- ==========================

create table public.viewer_sessions (
  id uuid primary key default gen_random_uuid(),

  session_id text unique,

  device text,

  joined_at timestamptz default now(),
  left_at timestamptz
);

-- ==========================
-- UPDATE TRIGGER
-- ==========================

create or replace function public.update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_live_streams
before update on public.live_streams
for each row
execute function public.update_timestamp();

alter table public.admins enable row level security;
alter table public.live_streams enable row level security;
alter table public.sermons enable row level security;
alter table public.hymns enable row level security;
alter table public.bible_books enable row level security;
alter table public.settings enable row level security;
alter table public.notifications enable row level security;
alter table public.viewer_sessions enable row level security;

-- Public can read

create policy "Public read stream"
on public.live_streams
for select
using (true);

create policy "Public read sermons"
on public.sermons
for select
using (true);

create policy "Public read hymns"
on public.hymns
for select
using (true);

create policy "Public read bible"
on public.bible_books
for select
using (true);

create policy "Public read settings"
on public.settings
for select
using (true);

-- Admin full access

create policy "Admins manage streams"
on public.live_streams
for all
to authenticated
using (true)
with check (true);

create policy "Admins manage sermons"
on public.sermons
for all
to authenticated
using (true)
with check (true);

create policy "Admins manage hymns"
on public.hymns
for all
to authenticated
using (true)
with check (true);

create policy "Admins manage settings"
on public.settings
for all
to authenticated
using (true)
with check (true);

create policy "Admins manage notifications"
on public.notifications
for all
to authenticated
using (true)
with check (true);

create policy "Anyone create viewer session"
on public.viewer_sessions
for insert
with check (true);

create policy "Anyone update viewer session"
on public.viewer_sessions
for update
using (true);

