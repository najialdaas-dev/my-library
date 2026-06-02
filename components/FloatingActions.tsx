'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowRight, ChevronUp } from 'lucide-react'

export function FloatingActions() {
  const router = useRouter()
  const pathname = usePathname()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = pathname === '/'

  return (
    <>
      {/* Back button — top right below navbar (hidden on mobile to prevent covering text) */}
      {!isHomePage && (
        <div className="hidden md:block fixed top-20 right-4 sm:right-6 z-40">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-colors duration-200 font-medium text-sm cursor-pointer"
            title="رجوع"
            aria-label="رجوع للصفحة السابقة"
          >
            رجوع
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scroll to top — bottom left */}
      {showScrollTop && (
        <div className="fixed bottom-5 left-5 z-40">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 shadow-sm transition-colors duration-200 cursor-pointer"
            title="للأعلى"
            aria-label="الذهاب للأعلى"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  )
}
