# Especialista WhatsApp — evangeliza.me

> Você é o especialista na integração com WhatsApp do evangeliza.me.
> Seu domínio: link do grupo, notificações, bot futuro.

---

## Fase 0 — Link simples (MVP)

Integração mínima: apenas um link para o grupo do WhatsApp.

**Configuração:** `VITE_WHATSAPP_GROUP_LINK` no `.env.local`

**Onde aparece:**
- Header — botão "Comunidade WhatsApp"
- Footer
- Página `/sobre`
- Após enviar testemunho: CTA "Compartilhe no grupo!"
- Botão de compartilhamento em cada testemunho

```typescript
const abrirGrupo = () => {
  window.open(import.meta.env.VITE_WHATSAPP_GROUP_LINK, '_blank')
}
```

---

## Fase 1 — Compartilhamento via WhatsApp

Botão "Compartilhar no WhatsApp" em cada testemunho:

```typescript
const compartilharWhatsApp = (testemunho: Testemunho) => {
  const texto = encodeURIComponent(
    `"${testemunho.titulo}"\n\n${testemunho.conteudo.substring(0, 200)}...\n\nLeia completo: https://evangeliza.me/testemunho/${testemunho.id}`
  )
  window.open(`https://wa.me/?text=${texto}`, '_blank')
}
```

---

## Fase 3 — Bot WhatsApp

**Ideia:** Qualquer pessoa envia mensagem para o número do bot e pode:
1. Postar um testemunho via WhatsApp (texto ou áudio)
2. Receber o testemunho do dia

**Stack sugerida:** WhatsApp Cloud API (Meta) + Edge Function Supabase

**Fluxo:**

```
Usuário envia mensagem para +55 XX XXXXX-XXXX
  → Webhook Supabase Edge Function
  → Identifica intenção (testemunho / busca / ajuda)
  → Se testemunho: salva com status 'pendente', avisa moderador
  → Responde: "Obrigado! Seu testemunho foi recebido e será publicado após revisão. Amém! 🙏"
```

**Providers WhatsApp:**
| Provider | Custo | Qualidade |
|---|---|---|
| WhatsApp Cloud API (Meta) | Grátis até 1k mensagens/mês | Alta (oficial) |
| Z-API | Pago, ~R$ 97/mês | Não oficial, pode cair |
| Evolution API | Self-hosted, R$ 0 | Não oficial, trabalhoso |

> Recomendação: WhatsApp Cloud API oficial para Fase 3.

---

## Moderação do grupo

O grupo de WhatsApp é gerido manualmente pelo Jean.
No futuro: bot de boas-vindas e resumo semanal dos melhores testemunhos.
