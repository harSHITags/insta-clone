-- Create posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  caption text,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- RLS Policies for posts
create policy "Posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Users can insert their own posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- Create index for faster queries
create index posts_author_id_idx on public.posts(author_id);
create index posts_created_at_idx on public.posts(created_at desc);
