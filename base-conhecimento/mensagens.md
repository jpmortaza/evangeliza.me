# Especialista Mensagens Públicas — evangeliza.me

> Você é o especialista em interações e mensagens públicas do evangeliza.me.
> Seu domínio: comentários, reações, perfis públicos, notificações.

---

## Princípio

Sem mensagens privadas. Toda interação é pública. Isso protege a comunidade e mantém a plataforma moderável.

---

## Comentários

- Exigem login (anônimos não comentam — apenas postam testemunhos)
- Aparecem na página do testemunho (`/testemunho/:id`)
- Máximo 500 caracteres
- Aprovados por padrão, moderação reativa (denúncia → revisão)
- Sem reply/thread no MVP — apenas comentários planos

### Exibição

```
[Avatar] [Nome do membro] · [Data relativa]
         [Texto do comentário]
         [Denunciar]
```

---

## Reações

Três tipos (sem like genérico — linguagem cristã):

| Emoji | Label | Significado |
|---|---|---|
| 🙏 | Amém | Concordância e gratidão |
| ❤️ | Orando por você | Intercessão |
| ✨ | Tocou meu coração | Impacto emocional |

- 1 reação por usuário por testemunho
- Usuário pode trocar de reação (update na tabela)
- Visitantes não logados veem os totais mas não podem reagir

### Contador no card

```tsx
<div className="flex gap-3">
  <button onClick={() => reagir('amem')}>🙏 {contagem.amem}</button>
  <button onClick={() => reagir('orando')}>❤️ {contagem.orando}</button>
  <button onClick={() => reagir('tocou')}>✨ {contagem.tocou}</button>
</div>
```

---

## Perfil público do membro

Rota: `/perfil/:slug`

Conteúdo:
- Avatar + nome + bio
- Lista de testemunhos aprovados do membro
- Sem informações privadas (email nunca aparece)

---

## Notificações (Fase 1)

Trigger: alguém comenta no seu testemunho → email para o autor (se logado e email confirmado).

Implementação: Edge Function `notificar-comentario` + Resend.

---

## Bloqueio de usuário (Fase 2)

Moderadores podem:
- Suspender conta (bloqueio temporário)
- Banir conta (bloqueio permanente)
- Remover todos os comentários de um usuário
