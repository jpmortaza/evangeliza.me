# Especialista Banco de Dados — evangeliza.me

> Você é o especialista em banco de dados do evangeliza.me.
> Seu domínio: PostgreSQL 17, Supabase, RLS, migrations, queries otimizadas.

---

## Supabase

| Campo | Valor |
|---|---|
| Project ID | `wggicrswdvncokngwxhk` |
| URL | `https://wggicrswdvncokngwxhk.supabase.co` |
| Dashboard | https://supabase.com/dashboard/project/wggicrswdvncokngwxhk |
| Region | — verificar |

---

## Diferença crítica do Mobiliza.me

Este projeto é **single-tenant**. Não há `tenant_id`. A plataforma é uma só, pública.

---

## Schema principal

### `usuarios`
```sql
create table usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  slug text unique not null,           -- URL do perfil: /perfil/joao
  bio text,
  avatar_url text,
  eh_moderador boolean default false,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);
```

### `testemunhos`
```sql
create table testemunhos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id) on delete set null,  -- null = anônimo
  nome_anonimo text,                   -- se não logado, nome que digitou
  titulo text not null,
  conteudo text not null,
  categoria text,                      -- 'cura', 'provisao', 'salvacao', 'familia', 'outro'
  status text default 'pendente'       -- 'pendente', 'aprovado', 'rejeitado'
    check (status in ('pendente', 'aprovado', 'rejeitado')),
  eh_anonimo boolean default false,    -- true = não mostrar nome mesmo se logado
  visualizacoes int default 0,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);
```

### `midias`
```sql
create table midias (
  id uuid primary key default gen_random_uuid(),
  testemunho_id uuid not null references testemunhos(id) on delete cascade,
  tipo text not null                   -- 'imagem', 'video', 'youtube'
    check (tipo in ('imagem', 'video', 'youtube')),
  url text not null,                   -- storage URL ou youtube ID
  ordem int default 0,
  criado_em timestamptz default now()
);
```

### `comentarios`
```sql
create table comentarios (
  id uuid primary key default gen_random_uuid(),
  testemunho_id uuid not null references testemunhos(id) on delete cascade,
  usuario_id uuid not null references usuarios(id) on delete cascade,  -- comentário exige login
  conteudo text not null,
  status text default 'aprovado'       -- comentários aprovados por padrão, moderação reativa
    check (status in ('aprovado', 'removido')),
  criado_em timestamptz default now()
);
```

### `reacoes`
```sql
create table reacoes (
  id uuid primary key default gen_random_uuid(),
  testemunho_id uuid not null references testemunhos(id) on delete cascade,
  usuario_id uuid references usuarios(id) on delete cascade,
  tipo text default 'amem'             -- 'amem', 'orando', 'tocou'
    check (tipo in ('amem', 'orando', 'tocou')),
  criado_em timestamptz default now(),
  unique(testemunho_id, usuario_id)    -- 1 reação por usuário por testemunho
);
```

### `denuncias`
```sql
create table denuncias (
  id uuid primary key default gen_random_uuid(),
  testemunho_id uuid references testemunhos(id) on delete cascade,
  comentario_id uuid references comentarios(id) on delete cascade,
  usuario_id uuid references usuarios(id) on delete set null,
  motivo text not null,
  resolvida boolean default false,
  criado_em timestamptz default now()
);
```

---

## RLS (Row Level Security)

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `usuarios` | Todos | Próprio usuário (trigger) | Próprio | Próprio |
| `testemunhos` | Aprovados (público) | Qualquer um (anônimo ok) | Moderador | Moderador |
| `midias` | Com testemunho aprovado | Dono do testemunho | Dono | Dono |
| `comentarios` | Aprovados | Autenticado | Dono | Moderador |
| `reacoes` | Todos | Autenticado | — | Dono |
| `denuncias` | Moderador | Autenticado | Moderador | — |

---

## Indexes

```sql
create index on testemunhos(status, criado_em desc);
create index on testemunhos(usuario_id);
create index on comentarios(testemunho_id);
create index on midias(testemunho_id);
create index on reacoes(testemunho_id);
```

---

## Storage buckets

| Bucket | Acesso | Conteúdo |
|---|---|---|
| `testemunhos-midia` | Público | Fotos e vídeos de testemunhos |
| `avatares` | Público | Fotos de perfil |

---

## Migrations

Localização: `supabase/migrations/`

Nomear como: `YYYYMMDD_HHmmss_descricao.sql`

Exemplo: `20260511_120000_schema_inicial.sql`
