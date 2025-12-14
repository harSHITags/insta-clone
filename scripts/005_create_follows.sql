-- Create follows table for user relationships
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

-- Enable RLS
alter table public.follows enable row level security;

-- RLS Policies for follows
create policy "Follows are viewable by everyone"
  on public.follows for select
  using (true);

create policy "Users can insert their own follows"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can delete their own follows"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- Create indexes for faster queries
create index follows_follower_id_idx on public.follows(follower_id);
create index follows_following_id_idx on public.follows(following_id);
