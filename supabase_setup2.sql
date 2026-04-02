-- Tabela de clubes/clientes
create table if not exists clubs (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  plan          text not null,
  monthly_value numeric not null default 0,
  active_users  int not null default 0,
  active_upsells int not null default 0,
  status        text not null default 'active' check (status in ('active', 'inactive', 'trial')),
  responsible   text not null default '',
  created_at    timestamptz not null default now()
);

-- Tabela de contratos
create sequence if not exists contract_seq start 1;

create table if not exists contracts (
  id            text primary key default 'CNT-' || lpad(nextval('contract_seq')::text, 3, '0'),
  club_name     text not null,
  plan          text not null,
  monthly_value numeric not null default 0,
  start_date    date not null,
  end_date      date not null,
  location      text not null default '',
  email         text not null default '',
  phone         text not null default '',
  upsells       text[] not null default '{}',
  status        text not null default 'active' check (status in ('active', 'pending', 'expired')),
  created_at    timestamptz not null default now()
);

-- Tabela de usuários internos
create table if not exists internal_users (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  role        text not null,
  permissions text[] not null default '{}',
  password    text not null,
  created_at  timestamptz not null default now()
);

-- Permissões (RLS)
alter table clubs enable row level security;
alter table contracts enable row level security;
alter table internal_users enable row level security;

create policy "allow all clubs" on clubs for all using (true) with check (true);
create policy "allow all contracts" on contracts for all using (true) with check (true);
create policy "allow all internal_users" on internal_users for all using (true) with check (true);
