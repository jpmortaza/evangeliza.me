-- Reações a testemunhos: Amém / Orando / Tocou
-- Identificação por session_key (UUID gerado no client, salvo em localStorage)
-- Sem autenticação obrigatória — zero fricção
create table if not exists public.reacoes (
  testemunho_id uuid        not null references public.testemunhos(id) on delete cascade,
  tipo          text        not null check (tipo in ('amem', 'orando', 'tocou')),
  session_key   text        not null,
  criado_em     timestamptz not null default now(),
  primary key (testemunho_id, tipo, session_key)
);

create index if not exists reacoes_testemunho_idx
  on public.reacoes(testemunho_id, tipo);

alter table public.reacoes enable row level security;

create policy "reacoes_select"
  on public.reacoes for select using (true);

create policy "reacoes_insert"
  on public.reacoes for insert with check (true);

create policy "reacoes_delete"
  on public.reacoes for delete using (true);
