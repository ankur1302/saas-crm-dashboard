create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'done')) default 'pending',
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  assigned_to uuid references auth.users(id),
  due_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table tasks enable row level security;

-- Policies
create policy "Users can view their own tasks" on tasks
  for select using (auth.uid() = assigned_to);

create policy "Users can insert their own tasks" on tasks
  for insert with check (auth.uid() = assigned_to);

create policy "Users can update their own tasks" on tasks
  for update using (auth.uid() = assigned_to);

create policy "Users can delete their own tasks" on tasks
  for delete using (auth.uid() = assigned_to);
