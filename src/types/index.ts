export type TestemunhoStatus = 'pendente' | 'aprovado' | 'rejeitado'
export type MidiaTipo = 'imagem' | 'youtube'
export type Categoria = 'cura' | 'provisao' | 'salvacao' | 'familia' | 'libertacao' | 'milagre' | 'outro'

export const CATEGORIAS: Record<Categoria, string> = {
  cura: 'Cura e saúde',
  provisao: 'Provisão',
  salvacao: 'Salvação',
  familia: 'Família',
  libertacao: 'Libertação',
  milagre: 'Milagre',
  outro: 'Outro',
}

export interface Midia {
  id: string
  testemunho_id: string
  tipo: MidiaTipo
  url: string
  ordem: number
}

export interface Testemunho {
  id: string
  usuario_id: string | null
  nome_anonimo: string | null
  titulo: string
  conteudo: string
  categoria: Categoria | null
  status: TestemunhoStatus
  eh_anonimo: boolean
  motivo_rejeicao: string | null
  visualizacoes: number
  aprovado_em: string | null
  criado_em: string
  atualizado_em: string
  usuarios?: { nome: string; slug: string; avatar_url: string | null } | null
  midias?: Midia[]
}
