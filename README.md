# evangeliza.me

> *"A Bíblia é o registro de como Deus agiu no passado. evangeliza.me é o registro de como Deus age hoje."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-black)](https://evangeliza.me)

---

## O que é

**evangeliza.me** é um arquivo vivo de testemunhos cristãos.

Um lugar onde qualquer pessoa pode contar como Deus agiu na sua vida — agora, na semana passada, no hospital, na falência, no vício, no silêncio de madrugada. Sem precisar criar conta. Sem algoritmo. Sem ego. Só histórias.

Não é uma rede social. É um altar digital.

---

## Como funciona

### Para quem quer postar
- Acesse [evangeliza.me](https://evangeliza.me)
- Clique em **"Compartilhe seu testemunho"**
- Digite — anônimo ou com seu nome, você escolhe
- Adicione foto ou vídeo do YouTube (opcional)
- Envie — seu testemunho vai para revisão dos Zeladores

### Para quem quer ler
- O feed mostra testemunhos aprovados, mais recentes primeiro
- Compartilhe com um clique no WhatsApp, Instagram ou link direto
- Sem cadastro necessário para ler

---

## Os Zeladores

Os Zeladores são os guardiões da comunidade do evangeliza.me.

Inspirados em Ezequiel 33, são voluntários que leem cada testemunho antes de ser publicado — não para censurar, mas para proteger a comunidade de spam, conteúdo inadequado ou material falso.

**Como se tornar um Zelador:**
- O processo é por convite
- Zeladores aprovados recebem o link do grupo privado de WhatsApp dos Zeladores
- A única exigência: disponibilidade para revisar testemunhos com cuidado e amor

---

## Funcionalidades

| Funcionalidade | Status |
|---|---|
| Post de testemunho sem cadastro | ✅ MVP |
| Feed público de testemunhos aprovados | ✅ MVP |
| Upload de foto | ✅ MVP |
| Embed de vídeo YouTube | ✅ MVP |
| Compartilhamento (WhatsApp + link) | ✅ MVP |
| Painel dos Zeladores | ✅ MVP |
| Cadastro e login | 🔜 v0.2 |
| Reações (Amém / Orando / Tocou) | 🔜 v0.2 |
| Comentários públicos | 🔜 v0.2 |
| Bot WhatsApp | 🔜 v0.4 |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL 17 + Edge Functions Deno) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Hospedagem | Vercel |

---

## Como rodar localmente

```bash
git clone https://github.com/jpmortaza/evangeliza.me.git
cd evangeliza.me
cp .env.example .env.local
# preencha as variáveis no .env.local com as chaves do Supabase
npm install
npm run dev
```

Acesse `http://localhost:5173`

---

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WHATSAPP_GROUP_LINK=
```

> ⚠️ Nunca commite `.env.local`. Está no `.gitignore`.

---

## Banco de dados

Execute as migrations em ordem no SQL Editor do Supabase:

```
supabase/migrations/20260511_000000_schema_inicial.sql
```

---

## Contribuindo

Este é um projeto open source e de missão. PRs são bem-vindos.

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/minha-contribuicao`
3. Commit: `git commit -m "feat: descricao"`
4. Push e abra um Pull Request

---

## Licença

MIT — use, adapte, evangeliza.

---

*"Ide por todo o mundo e pregai o evangelho a toda criatura." — Marcos 16:15*
