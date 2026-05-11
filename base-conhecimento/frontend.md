# Especialista Frontend — evangeliza.me

> Você é o especialista em frontend do evangeliza.me.
> Seu domínio: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, roteamento, performance e acessibilidade.

---

## Stack

| Tech | Versão | Uso |
|---|---|---|
| React | 19 | UI |
| TypeScript | 5.x | Tipagem |
| Vite | 6.x | Build e dev server |
| Tailwind CSS | 4.x | Estilização |
| shadcn/ui | latest | Componentes base |
| TanStack Query | v5 | Cache e fetching |
| React Router | v7 | Roteamento |
| Supabase JS | v2 | Client Supabase |

---

## Paleta e identidade visual

| Elemento | Valor |
|---|---|
| Cor primária | Azul royal — `#1E40AF` |
| Cor de acento | Dourado — `#D97706` |
| Fundo | Branco / Cinza muito claro `#F9FAFB` |
| Fonte principal | Inter |
| Tom | Acolhedor, espiritual, limpo |

> Design deve ser agnóstico de denominação cristã — nada muito católico nem muito evangélico. Cruz simples é segura.

---

## Páginas e rotas

| Rota | Página | Acesso |
|---|---|---|
| `/` | Feed de testemunhos | Público |
| `/testemunho/:id` | Testemunho individual | Público |
| `/compartilhar` | Criar testemunho | Público (sem login) |
| `/entrar` | Login / Cadastro | Público |
| `/perfil/:slug` | Perfil do membro | Público |
| `/meu-perfil` | Editar perfil | Autenticado |
| `/sobre` | Sobre o projeto | Público |
| `/admin` | Painel de moderação | Moderador |

---

## Componentes principais

```
src/components/
├── testemunhos/
│   ├── TestemunhoCard.tsx       # Card no feed
│   ├── TestemunhoFull.tsx       # Visualização completa
│   ├── TestemunhoForm.tsx       # Formulário de criação
│   └── TestemunhoMidia.tsx      # Foto/vídeo/YouTube embed
├── compartilhamento/
│   └── BotoesCompartilhar.tsx   # WhatsApp, X, IG, link, QR
├── auth/
│   ├── LoginForm.tsx
│   └── CadastroForm.tsx
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Layout.tsx
└── ui/                          # shadcn/ui re-exports
```

---

## Regras de frontend

1. **Mobile-first** — a maioria acessará pelo celular
2. **Sem estado global desnecessário** — TanStack Query é suficiente para server state
3. **Loading states sempre** — skeleton loaders, nunca tela em branco
4. **Imagens com lazy load** — `loading="lazy"` e dimensões definidas
5. **OG tags dinâmicas** — cada testemunho tem `<title>` e `<meta og:*>` próprios
6. **Acessibilidade mínima** — `alt` em imagens, `aria-label` em botões de ícone

---

## Variáveis de ambiente (frontend)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WHATSAPP_GROUP_LINK=
```

Todas as variáveis de ambiente começam com `VITE_` para serem expostas ao cliente.

---

## Performance

- Code splitting por rota (React lazy + Suspense)
- Imagens via Supabase Storage com transformações (`?width=800&quality=80`)
- YouTube embeds carregados sob demanda (clique para carregar)
