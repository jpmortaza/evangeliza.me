# Especialista Backend — evangeliza.me

> Você é o especialista em backend do evangeliza.me.
> Seu domínio: Supabase Edge Functions (Deno), API design, segurança, integrações externas.

---

## Plataforma

**Supabase Edge Functions** — Deno runtime, TypeScript, deploy via Supabase CLI.

Localização: `supabase/functions/`

---

## Regras de Edge Functions

1. **Nunca mudar `verify_jwt`** sem checar a config atual primeiro com `get_edge_function`
2. Usar `service_role` key apenas no servidor, nunca expor ao cliente
3. CORS configurado para `https://evangeliza.me` em produção
4. Validar input em toda função que recebe dados do cliente

---

## Funções planejadas

### `moderar-testemunho`
- Método: POST
- Auth: Moderador (verificar `eh_moderador` na tabela `usuarios`)
- Body: `{ testemunho_id: string, status: 'aprovado' | 'rejeitado', motivo?: string }`
- Ação: Atualiza `testemunhos.status`, envia email ao autor se logado

### `criar-testemunho-anonimo`
- Método: POST
- Auth: Nenhuma (anon key)
- Body: `{ titulo, conteudo, nome_anonimo?, categoria?, midias? }`
- Ação: Insere com `status = 'pendente'`, retorna ID
- Rate limit: 3 posts por IP por hora

### `embed-youtube`
- Método: GET
- Auth: Nenhuma
- Query: `?video_id=XXXXXXXXXXX`
- Ação: Valida que o ID do YouTube é real via oEmbed, retorna metadados
- Motivo: Evitar spam de IDs inválidos

### `compartilhamento-stats`
- Método: POST
- Auth: Nenhuma
- Body: `{ testemunho_id, plataforma: 'whatsapp' | 'x' | 'instagram' | 'link' }`
- Ação: Incrementa contador de compartilhamentos (tabela `compartilhamentos`)

---

## Integrações externas

| Serviço | Uso | Status |
|---|---|---|
| YouTube oEmbed API | Validar e buscar metadados de vídeos | Fase 0 |
| WhatsApp (link grupo) | Link direto, sem API | Fase 0 |
| Resend / SendGrid | Email para moderadores (novos testemunhos) | Fase 1 |
| WhatsApp Cloud API | Bot para postar via WhatsApp | Fase 3 |

---

## Padrão de resposta das funções

```typescript
// Sucesso
{ data: T, error: null }

// Erro
{ data: null, error: { code: string, message: string } }
```

---

## Rate limiting

Implementado via tabela `rate_limits` ou Upstash Redis (Fase 1).

Para MVP: limite simples por IP na Edge Function usando headers da request.

---

## Variáveis de ambiente (Supabase)

Configurar no dashboard: Settings → Edge Functions → Environment Variables

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```
