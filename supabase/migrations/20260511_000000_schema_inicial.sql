-- ============================================================
-- evangeliza.me — Schema inicial
-- Executar no SQL Editor do Supabase
-- ============================================================

-- Habilitar extensões
create extension if not exists "uuid-ossp";
create extension if not exists "unaccent";

-- ============================================================
-- TABELAS
-- ============================================================

-- Perfis de usuários autenticados
create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default 'Membro',
  slug text unique not null,
  bio text,
  avatar_url text,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- Zeladores — guardiões da comunidade
create table if not exists public.zeladores (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  nome text,
  ativo boolean default true,
  aprovado_por uuid references public.usuarios(id) on delete set null,
  criado_em timestamptz default now()
);

-- Testemunhos — tabela principal
create table if not exists public.testemunhos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  nome_anonimo text,
  titulo text not null check (char_length(titulo) between 5 and 150),
  conteudo text not null check (char_length(conteudo) >= 30),
  categoria text check (categoria in ('cura', 'provisao', 'salvacao', 'familia', 'libertacao', 'milagre', 'outro')),
  status text not null default 'pendente'
    check (status in ('pendente', 'aprovado', 'rejeitado')),
  eh_anonimo boolean not null default false,
  motivo_rejeicao text,
  visualizacoes int not null default 0,
  aprovado_por uuid references public.usuarios(id) on delete set null,
  aprovado_em timestamptz,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now(),
  -- busca full-text
  busca tsvector generated always as (
    to_tsvector('portuguese', titulo || ' ' || conteudo)
  ) stored
);

-- Mídias vinculadas a testemunhos
create table if not exists public.midias (
  id uuid primary key default gen_random_uuid(),
  testemunho_id uuid not null references public.testemunhos(id) on delete cascade,
  tipo text not null check (tipo in ('imagem', 'youtube')),
  url text not null,
  ordem int not null default 0,
  criado_em timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_testemunhos_status_criado on public.testemunhos(status, criado_em desc);
create index if not exists idx_testemunhos_busca on public.testemunhos using gin(busca);
create index if not exists idx_midias_testemunho on public.midias(testemunho_id);

-- ============================================================
-- TRIGGER: criar perfil ao registrar
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_slug text;
  final_slug text;
  counter int := 0;
begin
  base_slug := lower(regexp_replace(
    unaccent(coalesce(new.raw_user_meta_data->>'nome', 'membro')),
    '[^a-z0-9]+', '-', 'g'
  ));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;

  loop
    exit when not exists (select 1 from public.usuarios where slug = final_slug);
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;

  insert into public.usuarios (id, nome, slug)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', 'Membro'),
    final_slug
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- RLS — Row Level Security
-- ============================================================

alter table public.usuarios enable row level security;
alter table public.zeladores enable row level security;
alter table public.testemunhos enable row level security;
alter table public.midias enable row level security;

-- Helper: verificar se o usuário atual é zelador
create or replace function public.is_zelador()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.zeladores
    where email = auth.email() and ativo = true
  );
$$;

-- Usuários: leitura pública, edição própria
create policy "usuarios_select" on public.usuarios for select using (true);
create policy "usuarios_update" on public.usuarios for update using (auth.uid() = id);

-- Zeladores: apenas zeladores leem
create policy "zeladores_select" on public.zeladores for select using (is_zelador());

-- Testemunhos: visitantes veem aprovados, zeladores veem todos, qualquer um insere
create policy "testemunhos_select_publico" on public.testemunhos
  for select using (status = 'aprovado');

create policy "testemunhos_select_zelador" on public.testemunhos
  for select using (is_zelador());

create policy "testemunhos_insert" on public.testemunhos
  for insert with check (status = 'pendente');

create policy "testemunhos_update_zelador" on public.testemunhos
  for update using (is_zelador());

-- Mídias: leitura pública (filtrada via join), insert junto com testemunho
create policy "midias_select" on public.midias for select using (true);
create policy "midias_insert" on public.midias for insert with check (true);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public)
values ('testemunhos-midia', 'testemunhos-midia', true)
on conflict (id) do nothing;

create policy "midia_select_public" on storage.objects
  for select using (bucket_id = 'testemunhos-midia');

create policy "midia_insert_public" on storage.objects
  for insert with check (bucket_id = 'testemunhos-midia');

-- ============================================================
-- ZELADOR INICIAL: Jean Mortaza
-- ============================================================

insert into public.zeladores (email, nome, ativo)
values ('mortaza@protonmail.com', 'Jean Mortaza', true)
on conflict (email) do nothing;
