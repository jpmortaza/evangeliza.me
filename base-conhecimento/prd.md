# PRD — evangeliza.me
## Product Requirements Document

> Versão: 1.0 | Data: maio/2026 | Autor: Jean Mortaza + Claude (Maestro)

---

## A ideia central

A Bíblia é o registro de como Deus agiu no passado.
**evangeliza.me é o registro de como Deus age hoje.**

Não é uma rede social. Não é um app de igreja. É um arquivo vivo de testemunhos — um monumento digital construído por pessoas comuns que encontraram Deus no meio da vida real: no hospital, no desemprego, no divórcio, na dependência química, no silêncio de um quarto às 3 da manhã.

É um presente para Deus. E também para quem ainda não acredita, mas que está procurando uma razão para isso.

---

## Problema que resolvemos

A maioria das pessoas nunca ouviu o testemunho do vizinho.
Não porque ele não tenha um — mas porque não havia onde contar.

A Igreja resolve isso aos domingos, para quem aparece. As redes sociais deixam isso enterrado no algoritmo. O evangelismo porta a porta morreu.

**Falta um lugar específico para isso**: simples, bonito, sem algoritmo político, sem ego, sem seguidores. Só histórias de Deus.

---

## Para quem é

### Quem posta (quem temos que conquistar primeiro)
1. **O cristão que viveu algo e quer registrar** — já tem o testemunho, só precisa de um lugar que valha a pena
2. **O anônimo com vergonha** — viveu algo intenso (vício, adultério, depressão, milagre de saúde) mas não quer se identificar
3. **O novo convertido** — quer contar, mas ainda não tem linguagem religiosa sofisticada
4. **O pastor / líder de célula** — vai indicar para a comunidade dele usar

### Quem lê (quem vamos impactar)
1. **O cético curioso** — não acredita, mas vai cair aqui por compartilhamento e vai ler
2. **O cristão em crise de fé** — precisa ver que Deus age em outras pessoas para continuar acreditando
3. **O recém-convertido** — está descobrindo o que significa essa fé
4. **O que está sofrendo agora** — abre o WhatsApp às 2h da manhã e alguém compartilhou um testemunho

---

## Proposta de valor

**Para quem posta:** "Seu testemunho vai durar. E pode salvar alguém."

**Para quem lê:** "Deus não ficou no passado. Veja o que ele fez na semana passada."

---

## Princípios de produto (não negociáveis)

### 1. Zero fricção para a primeira palavra
Do momento em que alguém abre o site até postar o testemunho: menos de 60 segundos. Sem cadastro. Sem verificação de email. Sem CAPTCHA. Digita, envia, pronto. Isso é sagrado.

### 2. Dignidade do testemunho
Cada testemunho merece ser bonito. Design limpo, tipografia generosa, espaço para respirar. Não é feed de Twitter nem mural de Facebook. É altar.

### 3. A viralização é o ministério
Um testemunho que ninguém vê não cumpre seu propósito. Cada post precisa querer ser compartilhado. Compartilhar é o ato de evangelizar. O botão de compartilhar é o botão mais importante do produto.

### 4. Anônimo é sagrado
Muitos testemunhos poderosos nunca serão contados se exigirem identificação. O anonimato não é covardia — é o que torna possível falar de vício, de infidelidade, de suicídio. Protegemos isso.

### 5. Sem política, sem denominação, sem ego
Não existe "melhor testemunho". Não existe ranking de seguidores. Não existe feed de polêmica. O único critério para aparecer: passou pela moderação de conteúdo adequado.

---

## Funcionalidades — o que construímos e em que ordem

### FASE 0 — O essencial (MVP, v0.1) — AGORA

**O único objetivo desta fase: publicar um testemunho em menos de 60 segundos.**

| # | Funcionalidade | Decisão do Maestro |
|---|---|---|
| 1 | Formulário de testemunho (sem login) | Título + texto obrigatório. Nome opcional. |
| 2 | Feed público de testemunhos aprovados | Mais recentes primeiro. Cards simples. |
| 3 | Página individual do testemunho | URL única compartilhável |
| 4 | Botão compartilhar (WhatsApp + copiar link) | Só esses dois no MVP. |
| 5 | Upload de uma foto (opcional) | Via Supabase Storage |
| 6 | Embed de vídeo YouTube (opcional) | URL → embed automático |
| 7 | Moderação simples | Painel `/admin` com aprovar/rejeitar |
| 8 | Link do grupo WhatsApp no header | Variável de ambiente |

**O que NÃO entra no MVP mesmo que pareça simples:**
- Login / cadastro
- Comentários
- Categorias
- Busca
- Reações (Amém etc.)
- Notificações

> **Razão:** A única coisa que importa no lançamento é que alguém posta e outra pessoa lê e compartilha. Tudo mais distrai.

---

### FASE 1 — A comunidade (v0.2) — após validação

Quando o MVP tiver os primeiros 100 testemunhos aprovados, abrimos a comunidade.

| # | Funcionalidade | Decisão do Maestro |
|---|---|---|
| 1 | Cadastro e login (email + Google) | Supabase Auth |
| 2 | Perfil público do membro | `/perfil/:slug` — lista de testemunhos |
| 3 | Reações: Amém / Orando / Tocou | 3 tipos, sem like genérico |
| 4 | Comentários públicos | Só logados. Sem reply. |
| 5 | Categorias de testemunho | Cura / Provisão / Salvação / Família / Outro |
| 6 | Denúncia de conteúdo | Botão discreto. Vai para fila do moderador. |
| 7 | OG tags dinâmicas | Preview rico no WhatsApp |

---

### FASE 2 — Crescimento (v0.3)

| # | Funcionalidade |
|---|---|
| 1 | Busca por texto e categoria |
| 2 | Testemunho do dia (curadoria manual) |
| 3 | PWA — funciona como app no celular |
| 4 | QR Code de cada testemunho |
| 5 | Testemunhos em áudio (narração) |
| 6 | Múltiplas fotos (até 3) |

---

### FASE 3 — Bot e escala (v0.4)

| # | Funcionalidade |
|---|---|
| 1 | Bot WhatsApp — posta testemunho via mensagem |
| 2 | Auto-post no Instagram (testemunho do dia) |
| 3 | Newsletter semanal por email |
| 4 | API pública para igrejas embedarem em seus sites |

---

## Design — decisões tomadas

**Identidade visual:**
- Nome: evangeliza.me — mas o produto se apresenta como "Evangeliza"
- Tagline: *"Deus não ficou no passado."*
- Ícone: Cruz simples, minimalista — agnóstica de denominação
- Paleta: Azul profundo (`#1E3A5F`) + Dourado (`#C9933B`) + Branco
- Fonte: Inter para corpo, talvez Lora (serif) para títulos de testemunho — dá dignidade
- Mood: Acolhedor. Sério mas não pesado. Esperançoso.

**Tom de voz:**
- Primeira pessoa do plural: "nosso espaço", "nossa comunidade"
- Sem jargão religioso excessivo (não falar "aleluia" no produto — isso é da boca das pessoas)
- Linguagem de inclusão: "independente de denominação"

**Tela principal:**
- Hero simples: tagline + botão "Compartilhe seu testemunho"
- Logo abaixo: feed dos testemunhos aprovados
- Sem sidebar. Sem banners. Sem anúncios. Nunca.

---

## O que não somos (e nunca seremos)

| Não somos | Por quê |
|---|---|
| Uma rede social com seguidores e likes | Cria vaidade, não comunidade |
| Um marketplace de igrejas | Desvirtua o propósito |
| Uma plataforma com anúncios | Fé não tem patrocinador |
| Um app exclusivo de uma denominação | A ação de Deus não tem denominação |
| Um substituto da Igreja | Somos complemento, nunca concorrência |

---

## Métricas de sucesso

### MVP (Fase 0)
- Primeiro testemunho aprovado: Dia 1 do lançamento
- 50 testemunhos aprovados na primeira semana
- Taxa de compartilhamento: >30% dos visitantes compartilham pelo menos 1 testemunho

### 90 dias
- 500 testemunhos aprovados
- 5.000 visualizações únicas/mês
- 1 testemunho viral (>1.000 compartilhamentos)

### 1 ano
- 5.000 testemunhos
- 50.000 visualizações únicas/mês
- Presença em 5 países de língua portuguesa

---

## Decisão de stack — por que essa e não outra

**React 19 + Supabase + Vercel**

Por quê não WordPress: Precisamos de post anônimo sem cadastro, upload de mídia, moderação em tempo real e compartilhamento com OG tags dinâmicas. WordPress seria um hack em cima de um hack.

Por quê não outro banco: Supabase já está pago, Jean já conhece, Edge Functions resolvem o rate limiting do post anônimo sem custo extra de infraestrutura.

Por quê não Next.js: Vite + React 19 é mais simples de manter para um projeto solo. SSR real pode entrar na Fase 2 se OG tags precisarem (solucionável com Edge Function de crawler).

---

## Próxima ação — o que o Maestro manda fazer agora

1. Scaffold React 19 + Vite no diretório atual
2. Instalar dependências: Supabase JS, TanStack Query, React Router, shadcn/ui
3. Criar migration inicial no Supabase (tabelas: `testemunhos`, `midias`, `moderadores`)
4. Construir as 3 telas do MVP: feed, formulário, painel admin
5. Deploy automático via Vercel (já conectado)

---

*"Ide por todo o mundo e pregai o evangelho a toda criatura." — Marcos 16:15*

*Este produto é nossa obediência digital a esse versículo.*
