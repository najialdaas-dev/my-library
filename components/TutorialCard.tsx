'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Clock, Play, ArrowLeft } from 'lucide-react'
import { Tutorial } from '@/lib/types'
import { useTransitionContext } from '@/app/TransitionProvider'

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const router = useRouter()
  const { startTransition } = useTransitionContext()

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault()
    startTransition(`جاري تحميل شرح: ${tutorial.title}`)
    setTimeout(() => {
      router.push(`/tutorials/${tutorial.slug}`)
    }, 350)
  }

  return (
    <Link href={`/tutorials/${tutorial.slug}`} onClick={handleNavigation} className="group block h-full cursor-pointer">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm group-hover:shadow-md group-hover:border-purple-300 group-hover:-translate-y-1.5 active:scale-[0.985] active:translate-y-0 transition-all duration-300 ease-out overflow-hidden h-full flex flex-col justify-between">
        
        <div>
          {/* Thumbnail */}
          <div className="relative aspect-video bg-slate-50 overflow-hidden border-b border-slate-100">
            {tutorial.thumbnail ? (
              <Image
                src={tutorial.thumbnail}
                alt={tutorial.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain group-hover:scale-[1.03] transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-slate-100 flex items-center justify-center">
                <Play className="w-8 h-8 text-purple-200" />
              </div>
            )}
            
            {tutorial.videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition-colors duration-300">
                <div className="bg-white/90 text-purple-600 w-11 h-11 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
                </div>
              </div>
            )}

            <div className="absolute top-3 right-3 bg-slate-800/70 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-xs font-medium flex items-center gap-1">
              <span>{tutorial.category.icon}</span>
              <span>{tutorial.category.name}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 text-right">
            <h3 className="font-semibold text-base text-slate-800 line-clamp-2 mb-1.5 group-hover:text-purple-600 transition-colors duration-200 leading-snug">
              {tutorial.title}
            </h3>
            
            <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {tutorial.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 justify-end">
              {tutorial.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {tutorial.estimatedTime && (
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{tutorial.estimatedTime} د</span>
              </div>
            )}
            <span className="text-xs text-slate-400">
              {tutorial.difficulty === 'Beginner' && 'مبتدئ'}
              {tutorial.difficulty === 'Intermediate' && 'متوسط'}
              {tutorial.difficulty === 'Advanced' && 'متقدم'}
            </span>
          </div>

          <span className="text-xs font-medium text-purple-600 flex items-center gap-1">
            شاهد
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>

      </div>
    </Link>
  )
}
