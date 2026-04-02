-- Sequência para IDs dos tickets (deve vir ANTES da tabela)
create sequence if not exists ticket_seq start 1;

-- Tabela de tickets (chamados)
create table if not exists tickets (
  id          text primary key default 'T-' || nextval('ticket_seq')::text,
  club_id     text not null,
  club_name   text not null,
  type        text not null check (type in ('support', 'bug', 'feature', 'upsell')),
  priority    text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  status      text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  responsible text,
  title       text not null,
  description text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Tabela de mensagens dos tickets
create table if not exists ticket_messages (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   text not null references tickets(id) on delete cascade,
  author_name text not null,
  author_role text not null check (author_role in ('admin', 'client')),
  content     text not null,
  created_at  timestamptz not null default now()
);

-- Habilitar real-time nas duas tabelas
alter publication supabase_realtime add table tickets;
alter publication supabase_realtime add table ticket_messages;

-- Permissões públicas de leitura e escrita
alter table tickets enable row level security;
alter table ticket_messages enable row level security;

create policy "allow all tickets" on tickets for all using (true) with check (true);
create policy "allow all messages" on ticket_messages for all using (true) with check (true);
