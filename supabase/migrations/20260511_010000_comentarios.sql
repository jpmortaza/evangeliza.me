-- Tabela de comentários em testemunhos (requer autenticação)
create table if not exists public.comentarios (
  id             uuid        primary key default gen_random_uuid(),
  testemunho_id  uuid        not null references public.testemunhos(id) on delete cascade,
  usuario_id     uuid        not null references public.usuarios(id)    on delete cascade,
  conteudo       text        not null check (char_length(conteudo) between 1 and 500),
  criado_em      timestamptz not null default now()
);

create index if not exists comentarios_testemunho_idx
  on public.comentarios(testemunho_id, criado_em desc);

alter table public.comentarios enable row level security;

create policy "comentarios_select"
  on public.comentarios for select
  using (true);

create policy "comentarios_insert"
  on public.comentarios for insert
  with check (auth.uid() = usuario_id);

create policy "comentarios_delete"
  on public.comentarios for delete
  using (auth.uid() = usuario_id);
