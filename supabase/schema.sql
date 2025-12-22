-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type lead_status as enum ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
create type lead_priority as enum ('low', 'medium', 'high', 'urgent');
create type task_status as enum ('pending', 'in_progress', 'completed', 'cancelled');
create type task_priority as enum ('low', 'medium', 'high');

-- Teams (Organizations)
create table teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lead Categories (Tags/Segments)
create table lead_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Log Categories (Call, Email, Meeting, Note)
create table log_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads
create table leads (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references teams(id) on delete cascade,
  category_id uuid references lead_categories(id) on delete set null,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  company text,
  status lead_status default 'new',
  priority lead_priority default 'medium',
  source text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Logs (Activity History)
create table logs (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  category_id uuid references log_categories(id) on delete set null,
  title text not null,
  details text,
  occurred_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tasks
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  assigned_to uuid, -- References auth.users(id) theoretically, but keeping generic for now
  title text not null,
  description text,
  due_date timestamptz,
  status task_status default 'pending',
  priority task_priority default 'medium',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Updated At Trigger Function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

-- Triggers
create trigger update_teams_modtime before update on teams for each row execute procedure update_updated_at_column();
create trigger update_lead_categories_modtime before update on lead_categories for each row execute procedure update_updated_at_column();
create trigger update_log_categories_modtime before update on log_categories for each row execute procedure update_updated_at_column();
create trigger update_leads_modtime before update on leads for each row execute procedure update_updated_at_column();
create trigger update_logs_modtime before update on logs for each row execute procedure update_updated_at_column();
create trigger update_tasks_modtime before update on tasks for each row execute procedure update_updated_at_column();

-- Indexes
create index idx_leads_team_id on leads(team_id);
create index idx_leads_status on leads(status);
create index idx_leads_email on leads(email);
create index idx_logs_lead_id on logs(lead_id);
create index idx_tasks_lead_id on tasks(lead_id);
create index idx_tasks_assigned_to on tasks(assigned_to);
create index idx_tasks_status on tasks(status);

-- Team Roles and Members
create type team_role as enum ('owner', 'admin', 'member');

create table team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references teams(id) on delete cascade,
  user_id uuid not null, -- references auth.users(id),
  role team_role default 'member',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(team_id, user_id)
);

-- Invitations
create table invitations (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references teams(id) on delete cascade,
  email text not null,
  role team_role default 'member',
  token text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Triggers for new tables
create trigger update_team_members_modtime before update on team_members for each row execute procedure update_updated_at_column();
create trigger update_invitations_modtime before update on invitations for each row execute procedure update_updated_at_column();

-- Indexes for new tables
create index idx_team_members_team_id on team_members(team_id);
create index idx_team_members_user_id on team_members(user_id);
create index idx_invitations_team_id on invitations(team_id);
create index idx_invitations_email on invitations(email);
create index idx_invitations_token on invitations(token);

-- Performance Indexes
create index idx_leads_composite on leads(team_id, status, priority);
create index idx_tasks_composite on tasks(assigned_to, status, priority);
create index idx_logs_lead_occurred on logs(lead_id, occurred_at desc);
create index idx_leads_created_at on leads(created_at desc);
create index idx_tasks_created_at on tasks(created_at desc);
