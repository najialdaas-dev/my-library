export type Book = {
  id: string
  title: string
  slug: string
  description: string
  coverImage?: string | null
  fileUrl: string
  fileName: string
  fileSize: number
  category: Category
  difficulty: string
  tags: string[]
  downloadCount: number
  viewCount: number
  featured: boolean
  createdAt: Date
}

export type Tutorial = {
  id: string
  title: string
  slug: string
  description: string
  thumbnail?: string | null
  content: string
  videoUrl?: string | null
  category: Category
  difficulty: string
  estimatedTime?: number | null
  tags: string[]
  viewCount: number
  featured: boolean
  createdAt: Date
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  color: string
  icon: string
}
