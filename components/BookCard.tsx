'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Download, Eye, ArrowLeft, Star, CircleDot } from 'lucide-react'
import { Book } from '@/lib/types'
import { useTransitionContext } from '@/app/TransitionProvider'

const difficultyConfig = {
  Beginner: { label: 'مبتدئ', color: 'text-emerald-600 bg-emerald-50' },
  Intermediate: { label: 'متوسط', color: 'text-amber-600 bg-amber-50' },
  Advanced: { label: 'متقدم', color: 'text-red-600 bg-red-50' },
} as const

export function BookCard({ book }: { book: Book }) {
  const difficulty = difficultyConfig[book.difficulty as keyof typeof difficultyConfig]
  const router = useRouter()
  const { startTransition } = useTransitionContext()

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault()
    startTransition(`جاري تحميل كتاب: ${book.title}`)
    setTimeout(() => {
      router.push(`/books/${book.slug}`)
    }, 250) // Small delay to guarantee the loading screen appears before Next.js instantly swaps cached routes
  }

  return (
    <Link href={`/books/${book.slug}`} onClick={handleNavigation} className="group block h-full cursor-pointer">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm group-hover:shadow-md group-hover:border-indigo-300 group-hover:-translate-y-1.5 active:scale-[0.985] active:translate-y-0 transition-all duration-300 ease-out overflow-hidden h-full flex flex-col justify-between">
        
        {/* Cover */}
        <div>
          <div className="relative h-64 bg-slate-50/80 flex items-center justify-center overflow-hidden border-b border-slate-100">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-3 group-hover:scale-[1.03] transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
                <CircleDot className="w-10 h-10 text-indigo-200" />
              </div>
            )}
            
            {book.featured && (
              <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-md text-xs font-medium shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3" />
                مميز
              </div>
            )}

            {difficulty && (
              <div className={`absolute bottom-3 right-3 px-2 py-0.5 rounded text-xs font-medium ${difficulty.color}`}>
                {difficulty.label}
              </div>
            )}
          </div>

          <div className="p-5 text-right">
            <div className="mb-2">
              <span 
                className="inline-block px-2.5 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: book.category.color }}
              >
                {book.category.icon} {book.category.name}
              </span>
            </div>

            <h3 className="font-semibold text-base text-slate-800 line-clamp-2 mb-1.5 group-hover:text-indigo-600 transition-colors duration-200 leading-snug">
              {book.title}
            </h3>
            
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>{book.downloadCount}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Eye className="w-3.5 h-3.5" />
              <span>{book.viewCount}</span>
            </div>
          </div>

          <span className="text-xs font-medium text-indigo-600 flex items-center gap-1">
            اقرأ المزيد
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>

      </div>
    </Link>
  )
}
