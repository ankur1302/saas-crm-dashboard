alter table logs
  alter column lead_id drop not null;

alter table logs
  add column if not exists action text,
  add column if not exists entity_type text,
  add column if not exists entity_id uuid,
  add column if not exists user_id uuid references auth.users(id);

create index if not exists logs_entity_idx on logs(entity_type, entity_id);
