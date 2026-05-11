# Especialista Compartilhamento — evangeliza.me

> Você é o especialista em compartilhamento e viralização do evangeliza.me.
> Seu domínio: botões sociais, OG tags, Web Share API, QR Code, deep links.

---

## Princípio

Compartilhar um testemunho deve ser possível com **1 clique**. Sem fricção.
O compartilhamento é o motor de crescimento da plataforma.

---

## Botões de compartilhamento

Exibir em: card do feed + visualização individual + página "sobre"

| Plataforma | Ação | Prioridade |
|---|---|---|
| WhatsApp | Abre wa.me com texto + link | Alta — público cristão usa WhatsApp |
| X (Twitter) | Tweet com link | Média |
| Facebook | Share link | Média |
| Copiar link | Web Share API (mobile) ou clipboard | Alta |
| QR Code | Modal com QR do link | Fase 1 |

### URL de compartilhamento

```
WhatsApp: https://wa.me/?text=Leia este testemunho: [TITULO]%0A[URL]
X: https://x.com/intent/tweet?text=Leia este testemunho&url=[URL]
Facebook: https://www.facebook.com/sharer/sharer.php?u=[URL]
```

### Web Share API (mobile nativo)

```typescript
const compartilhar = async (testemunho: Testemunho) => {
  const url = `https://evangeliza.me/testemunho/${testemunho.id}`
  
  if (navigator.share) {
    await navigator.share({
      title: testemunho.titulo,
      text: testemunho.conteudo.substring(0, 150) + '...',
      url,
    })
  } else {
    await navigator.clipboard.writeText(url)
    // toast("Link copiado!")
  }
}
```

---

## OG Tags (Open Graph)

Cada testemunho deve ter OG tags dinâmicas para preview rico no WhatsApp e redes.

```html
<!-- /testemunho/:id -->
<title>{titulo} | evangeliza.me</title>
<meta property="og:title" content="{titulo}" />
<meta property="og:description" content="{primeiros 200 chars do conteúdo}" />
<meta property="og:image" content="{imagem do testemunho ou og-default.jpg}" />
<meta property="og:url" content="https://evangeliza.me/testemunho/{id}" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

**Implementação:** React Helmet ou `react-helmet-async`.

Para SSR real (melhor para WhatsApp): considerar Remix ou Vite SSR na Fase 2.
No MVP: Edge Function que retorna HTML com OG tags injetadas para crawlers.

---

## Rastreamento de compartilhamentos

```typescript
// Chamar ao clicar em compartilhar
const registrarCompartilhamento = async (testemunhoId: string, plataforma: string) => {
  await supabase.functions.invoke('compartilhamento-stats', {
    body: { testemunho_id: testemunhoId, plataforma }
  })
}
```

Tabela: `compartilhamentos` (testemunho_id, plataforma, criado_em)

---

## Link do grupo WhatsApp

Exibir em:
- Header (botão "Entrar no grupo")
- Footer
- Página /sobre
- Após postar um testemunho: "Compartilhe no nosso grupo!"

```typescript
const WHATSAPP_GROUP = import.meta.env.VITE_WHATSAPP_GROUP_LINK
```

---

## QR Code (Fase 1)

Biblioteca: `qrcode.react`

```tsx
<QRCodeSVG
  value={`https://evangeliza.me/testemunho/${id}`}
  size={200}
  includeMargin
/>
```

Exibir em modal, permitir download como PNG.
