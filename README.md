# evangeliza.me

> Uma rede social de testemunhos cristãos — anônima ou identificada, sem barreiras para compartilhar o que Deus fez na sua vida.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## O que é

**evangeliza.me** é uma plataforma aberta onde qualquer pessoa pode compartilhar seu testemunho de fé — sem precisar criar conta, sem julgamento, só gratidão e encorajamento.

- **Sem cadastro obrigatório** — poste seu testemunho agora mesmo
- **Anônimo ou identificado** — você escolhe
- **Fotos, vídeos e embeds do YouTube** — conte como quiser
- **Mensagens públicas** — sem DMs, tudo à luz do dia
- **Compartilhamento com um clique** — WhatsApp, Instagram, X, link direto

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL 17 + Edge Functions Deno) |
| Auth | Supabase Auth (anônimo opcional) |
| Storage | Supabase Storage |
| Hospedagem | Vercel |

---

## Módulos

| Módulo | Descrição |
|---|---|
| Testemunhos | Feed público, criação anônima/autenticada, aprovação moderada |
| Mídia | Upload de foto/vídeo, embed YouTube |
| Autenticação | Cadastro opcional, perfil público |
| Mensagens | Comentários e mensagens públicas entre membros |
| Compartilhamento | Botões sociais, link direto, QR Code |
| WhatsApp | Link do grupo e integração futura com bot |
| Moderação | Denúncia de conteúdo, fila de aprovação |

---

## Como rodar localmente

```bash
git clone https://github.com/jpmortaza/evangeliza.me.git
cd evangeliza.me
cp .env.example .env.local
# preencha as variáveis no .env.local
npm install
npm run dev
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WHATSAPP_GROUP_LINK=
```

> ⚠️ Nunca commite `.env.local` ou `chaves.md`. Ambos estão no `.gitignore`.

---

## Contribuindo

Este é um projeto open source e de missão. PRs são bem-vindos.

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m "feat: descrição"`
4. Push: `git push origin feat/minha-feature`
5. Abra um Pull Request

---

## Licença

MIT — use, adapte, evangeliza.

---

*"Ide por todo o mundo e pregai o evangelho a toda criatura." — Marcos 16:15*
