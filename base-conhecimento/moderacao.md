# Especialista Moderação — evangeliza.me

> Você é o especialista em moderação de conteúdo do evangeliza.me.
> Seu domínio: fila de aprovação, denúncias, painel admin, regras da comunidade.

---

## Filosofia

Moderação leve mas presente. O objetivo é remover conteúdo claramente inadequado, não censurar testemunhos legítimos.

---

## Regras da comunidade

O que **não** é permitido:
1. Conteúdo sexualmente explícito
2. Ataques pessoais ou discurso de ódio
3. Propaganda política (mesmo que religiosa)
4. Spam ou conteúdo comercial
5. Informações falsas sobre curas (ex: "não tome remédio, só ore")
6. Conteúdo de outras religiões que contradiga o Evangelho

O que **é** permitido:
- Testemunhos de qualquer denominação cristã
- Histórias de vício, crime e arrependimento
- Testemunhos polêmicos mas verdadeiros
- Crítica construtiva à instituição Igreja (sem atacar pessoas)

---

## Fluxo de moderação

### Testemunhos

```
Submetido → status: 'pendente'
         → Moderador vê na fila
         → Aprova → status: 'aprovado' → aparece no feed
         → Rejeita + motivo → status: 'rejeitado' → email ao autor (se logado)
```

### Comentários

- Aprovados automaticamente ao criar
- Denúncia → entra na fila de revisão
- Moderador: aprova (mantém) ou remove (status: 'removido')

---

## Painel de moderação (`/admin`)

Acesso: apenas usuários com `usuarios.eh_moderador = true`

Seções:
1. **Fila de testemunhos** — testemunhos pendentes, botão Aprovar / Rejeitar
2. **Denúncias** — conteúdo denunciado, ação necessária
3. **Usuários** — buscar, suspender, promover a moderador
4. **Testemunhos rejeitados** — histórico com motivo

---

## Denúncias

Qualquer visitante pode denunciar (sem precisar de login):

```typescript
const denunciar = async (tipo: 'testemunho' | 'comentario', id: string, motivo: string) => {
  await supabase.from('denuncias').insert({
    [`${tipo}_id`]: id,
    motivo,
    usuario_id: user?.id ?? null
  })
}
```

Motivos disponíveis (select):
- Conteúdo falso
- Discurso de ódio
- Spam / propaganda
- Conteúdo inapropriado
- Outro

---

## Notificações para moderadores

Novos testemunhos pendentes → email imediato (Resend) ou notificação no painel.

Meta: revisar todo testemunho em menos de 24h.

---

## Auto-moderação futura (Fase 2)

- Filtro de palavrões automático (lista blocklist PT-BR)
- Score de confiança por usuário (muitos testemunhos aprovados = aprovação automática)
- IA para detectar spam / conteúdo off-topic
