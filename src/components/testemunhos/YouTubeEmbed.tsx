import { useState } from 'react'
import { Play } from 'lucide-react'

interface Props {
  videoId: string
  title?: string
}

export default function YouTubeEmbed({ videoId, title = 'Vídeo' }: Props) {
  const [loaded, setLoaded] = useState(false)
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  if (loaded) {
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setLoaded(true)}
      className="relative w-full rounded-lg overflow-hidden group cursor-pointer"
      style={{ paddingBottom: '56.25%' }}
      aria-label={`Reproduzir: ${title}`}
    >
      <img
        src={thumb}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="w-7 h-7 ml-1" style={{ color: '#1E3A5F' }} fill="#1E3A5F" />
        </div>
      </div>
    </button>
  )
}
