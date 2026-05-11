# Especialista Testemunhos — evangeliza.me

> Você é o especialista no módulo central de testemunhos.
> Seu domínio: feed, criação, categorias, moderação, busca, visualização individual.

---

## O que é um testemunho

Relato de como Deus agiu na vida de alguém. Pode ser:
- Texto (obrigatório, mínimo 100 caracteres)
- Título (obrigatório, máximo 100 caracteres)
- Foto (opcional)
- Vídeo (opcional — upload ou embed YouTube)
- Categoria (opcional)
- Autor identificado ou anônimo

---

## Categorias disponíveis

| Slug | Label |
|---|---|
| `cura` | Cura e saúde |
| `provisao` | Provisão financeira |
| `salvacao` | Salvação e conversão |
| `familia` | Família e relacionamentos |
| `libertacao` | Libertação |
| `milagre` | Milagre |
| `outro` | Outro |

---

## Status de moderação

```
pendente → aprovado  (aparece no feed)
         → rejeitado (não aparece, autor notificado se logado)
```

Testemunhos anônimos ficam `pendente` até moderação.
Testemunhos de membros verificados (futuro: badge) podem ser aprovados automaticamente.

---

## Feed principal

- Exibe apenas `status = 'aprovado'`
- Ordenação padrão: mais recentes primeiro
- Paginação: 10 por página (cursor-based)
- Filtros: categoria, busca por texto (full-text search PostgreSQL)

### Query base

```sql
select
  t.*,
  u.nome, u.slug, u.avatar_url,
  m.url as midia_url, m.tipo as midia_tipo,
  count(r.id) as total_reacoes
from testemunhos t
left join usuarios u on u.id = t.usuario_id
left join midias m on m.testemunho_id = t.id and m.ordem = 0
left join reacoes r on r.testemunho_id = t.id
where t.status = 'aprovado'
group by t.id, u.nome, u.slug, u.avatar_url, m.url, m.tipo
order by t.criado_em desc
limit 10;
```

---

## Formulário de criação

Campos:
1. **Título** — obrigatório, max 100 chars
2. **Conteúdo** — textarea, obrigatório, min 100 chars
3. **Seu nome** — opcional (se não logado). Deixar vazio = "Anônimo"
4. **Categoria** — select, opcional
5. **Mídia** — upload foto ou URL YouTube (opcional)
6. **Checkbox "Postar como anônimo"** — se logado, pode ocultar identidade

Validação client-side antes do submit. Sem CAPTCHA no MVP (rate limit na Edge Function).

---

## Visualização individual (`/testemunho/:id`)

Conteúdo da página:
- Título + conteúdo completo
- Autor (ou "Anônimo") + data
- Mídia (foto, vídeo ou embed YouTube)
- Reações (Amém / Orando por você / Tocou meu coração)
- Botões de compartilhamento
- Seção de comentários (se logado)
- Botão "Denunciar"

---

## Busca full-text

```sql
-- Habilitar busca
alter table testemunhos add column busca tsvector
  generated always as (
    to_tsvector('portuguese', titulo || ' ' || conteudo)
  ) stored;

create index on testemunhos using gin(busca);

-- Query
select * from testemunhos
where busca @@ plainto_tsquery('portuguese', 'cura cancer');
```

---

## Contagem de visualizações

Incrementar via Edge Function (não diretamente do cliente para evitar spam):
```
GET /testemunho/:id → chama edge function `registrar-visualizacao`
```
