# CLAUDE.md — evangeliza.me

> Memória e instruções do Claude Code para o projeto evangeliza.me.
> Leia este arquivo antes de qualquer tarefa de desenvolvimento.
> Última atualização: maio/2026

---

## O projeto

**evangeliza.me** é uma rede social cristã de testemunhos.

- Site: https://evangeliza.me
- Repo: https://github.com/jpmortaza/evangeliza.me (público — nunca commitar chaves)
- Supabase: https://supabase.com/dashboard/project/wggicrswdvncokngwxhk
- Project ID Supabase: `wggicrswdvncokngwxhk`

---

## Stack

| Camada | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Supabase — PostgreSQL 17 + Edge Functions (Deno) |
| Auth | Supabase Auth — cadastro opcional, post anônimo sem login |
| Storage | Supabase Storage — imagens e vídeos |
| Hospedagem | Vercel (auto-deploy `main`) |

---

## Arquitetura de usuários

Três perfis de uso:

1. **Visitante anônimo** — pode postar testemunho sem criar conta (nome fictício ou "Anônimo")
2. **Membro autenticado** — conta criada, pode comentar em público, tem perfil
3. **Moderador** — aprova testemunhos, remove conteúdo impróprio

---

## Módulos principais

| Módulo | Arquivo de spec |
|---|---|
| Testemunhos | `base-conhecimento/testemunhos.md` |
| Autenticação | `base-conhecimento/autenticacao.md` |
| Mídia | `base-conhecimento/midia.md` |
| Mensagens públicas | `base-conhecimento/mensagens.md` |
| Compartilhamento | `base-conhecimento/compartilhamento.md` |
| WhatsApp | `base-conhecimento/whatsapp.md` |
| Moderação | `base-conhecimento/moderacao.md` |
| Banco de dados | `base-conhecimento/banco-de-dados.md` |
| Frontend | `base-conhecimento/frontend.md` |
| Backend | `base-conhecimento/backend.md` |

---

## Regras críticas de desenvolvimento

### Segurança (repo público!)
- **Nunca** commitar `chaves.md`, `.env`, `.env.local`
- **Nunca** hardcodar API keys, tokens ou senhas no código
- Todas as chaves via variáveis de ambiente (`VITE_*` no frontend, env no Deno)
- Checar `.gitignore` antes de qualquer `git add`

### Banco de dados
- Toda tabela tem `tenant_id`? Não — este projeto é **single-tenant** (uma plataforma pública)
- RLS ativo em todas as tabelas com dados sensíveis
- Usuário anônimo pode INSERT em `testemunhos` com `usuario_id = null`
- Moderação: `testemunhos.status` ∈ `['pendente', 'aprovado', 'rejeitado']`

### Commits
- Em português sem acentos, padrão: `tipo(escopo): resumo`
- Exemplos: `feat(testemunhos): adiciona upload de foto`, `fix(auth): corrige redirect apos login`
- Nunca `git add -A` — adicionar arquivos explicitamente

### Changelog
- Toda mudança relevante → entrada no TOPO de `src/data/changelog.ts`
- Semver: `MAJOR.MINOR.PATCH`
- Versão atual: `0.1.0`

### Edge Functions (Supabase Deno)
- Nunca mudar `verify_jwt` sem checar primeiro
- Funções em `supabase/functions/`

---

## Estrutura de pastas esperada

```
evangeliza.me/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas (roteamento)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # supabase client, utils
│   ├── types/           # TypeScript types
│   └── data/            # changelog.ts, constantes
├── supabase/
│   ├── functions/       # Edge Functions Deno
│   └── migrations/      # SQL migrations
├── public/              # Assets estáticos
├── base-conhecimento/   # Specs por módulo (não vai ao build)
├── CLAUDE.md            # Este arquivo
├── README.md
├── chaves.md            # NUNCA ao GitHub
└── .gitignore
```

---

## Especialistas disponíveis

Ver `base-conhecimento/maestro.md` para o mapa completo dos especialistas e como acioná-los.

---

## Histórico de sessões dev

| Data | O que foi feito |
|---|---|
| 2026-05-11 | Setup inicial — estrutura, CLAUDE.md, base de conhecimento |
