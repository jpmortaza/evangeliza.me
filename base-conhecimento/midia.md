# Especialista Mídia — evangeliza.me

> Você é o especialista em mídia do evangeliza.me.
> Seu domínio: upload de imagens e vídeos, embed YouTube, otimização, storage.

---

## Tipos de mídia suportados

| Tipo | Formato | Limite |
|---|---|---|
| Imagem | JPG, PNG, WebP, HEIC | 10 MB |
| Vídeo | MP4, MOV | 100 MB |
| YouTube | URL ou ID | — |

---

## Storage Supabase

**Bucket:** `testemunhos-midia` (público)

### Path convention
```
testemunhos-midia/
├── imagens/
│   └── {testemunho_id}/{uuid}.webp
└── videos/
    └── {testemunho_id}/{uuid}.mp4
```

### Upload de imagem

```typescript
// Converter para WebP antes de enviar (client-side via canvas)
const uploadImagem = async (file: File, testemunhoId: string) => {
  const webpBlob = await converterParaWebP(file, { maxWidth: 1200, quality: 0.85 })
  const path = `imagens/${testemunhoId}/${crypto.randomUUID()}.webp`
  
  const { error } = await supabase.storage
    .from('testemunhos-midia')
    .upload(path, webpBlob)
    
  if (error) throw error
  
  const { data } = supabase.storage
    .from('testemunhos-midia')
    .getPublicUrl(path)
    
  return data.publicUrl
}
```

---

## YouTube embed

### Validação do ID

```typescript
const extrairYoutubeId = (input: string): string | null => {
  // Aceita: URL completa, URL curta (youtu.be), ID direto
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/
  ]
  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) return match[1]
  }
  return null
}
```

### Componente de embed (lazy load)

```tsx
// YouTubeEmbed.tsx
// Exibe thumbnail clicável. Só carrega o iframe quando o usuário clica.
// Economiza banda e melhora performance do feed.
```

Thumbnail URL: `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg`

---

## Otimização de imagens

No Supabase Storage, usar parâmetros de transformação na URL:

```
https://...supabase.co/storage/v1/render/image/public/testemunhos-midia/imagens/...?
  width=800&
  quality=80&
  format=webp
```

No feed (thumbnail): `?width=400&quality=70`
Na visualização completa: `?width=1200&quality=85`

---

## Regras

1. Máximo 1 vídeo por testemunho (YouTube OU upload, não ambos)
2. Máximo 3 imagens por testemunho
3. Imagem e vídeo não podem coexistir (ou foto ou vídeo)
4. YouTube tem prioridade se usuário enviou ID + foto (mostrar YouTube)
5. Mídia de testemunho rejeitado: deletar do storage (Edge Function de cleanup)

---

## RLS do storage

```sql
-- Leitura pública do bucket
create policy "midia publica"
  on storage.objects for select
  using (bucket_id = 'testemunhos-midia');

-- Upload apenas via service role (Edge Function) ou usuário autenticado
create policy "upload autenticado"
  on storage.objects for insert
  with check (
    bucket_id = 'testemunhos-midia'
    and auth.uid() is not null
  );
```
