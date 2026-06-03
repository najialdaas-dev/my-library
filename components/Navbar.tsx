'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Compass, BookOpen, Layers, Menu, X, LibraryBig } from 'lucide-react'
import { useTransitionContext } from '@/app/TransitionProvider'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { startTransition } = useTransitionContext()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      startTransition('جاري البحث...')
      setTimeout(() => {
        router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
      }, 50)
      setSearchQuery('')
      setIsOpen(false)
    }
  }

  const navigateTo = (e: React.MouseEvent, path: string, name: string) => {
    e.preventDefault()
    startTransition(`جاري الانتقال إلى ${name}...`)
    setIsOpen(false)
    setTimeout(() => {
      router.push(path)
    }, 50)
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-50/85 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" onClick={(e) => navigateTo(e, '/', 'الرئيسية')} className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <LibraryBig className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">
              مكتبة المهندس ناجي الدعاس
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/books"
              onClick={(e) => navigateTo(e, '/books', 'الكتب')}
              className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 font-medium text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              الكتب
            </Link>
            <Link 
              href="/tutorials"
              onClick={(e) => navigateTo(e, '/tutorials', 'الشروحات')}
              className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 font-medium text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              الشروحات
            </Link>
            <Link 
              href="/categories"
              onClick={(e) => navigateTo(e, '/categories', 'الأقسام')}
              className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 font-medium text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              الأقسام
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث..."
                className="w-48 pr-9 pl-3 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:w-64 transition-all duration-300 text-right text-sm text-slate-700"
              />
              <Search className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-400" />
            </form>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200"
              aria-label="القائمة"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md">
          <div className="px-4 pt-3 pb-5 space-y-2 text-right">
            
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن كتاب أو شرح..."
                className="w-full pr-9 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-right text-sm text-slate-700"
              />
              <Search className="absolute right-2.5 top-3 w-4 h-4 text-slate-400" />
            </form>

            <Link 
              href="/books"
              onClick={(e) => navigateTo(e, '/books', 'الكتب')}
              className="flex items-center justify-end gap-2 px-3 py-2.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 font-medium transition-colors duration-200 cursor-pointer"
            >
              الكتب
              <BookOpen className="w-4 h-4 text-slate-400" />
            </Link>
            
            <Link 
              href="/tutorials"
              onClick={(e) => navigateTo(e, '/tutorials', 'الشروحات')}
              className="flex items-center justify-end gap-2 px-3 py-2.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 font-medium transition-colors duration-200 cursor-pointer"
            >
              الشروحات
              <Compass className="w-4 h-4 text-slate-400" />
            </Link>

            <Link 
              href="/categories"
              onClick={(e) => navigateTo(e, '/categories', 'الأقسام')}
              className="flex items-center justify-end gap-2 px-3 py-2.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 font-medium transition-colors duration-200 cursor-pointer"
            >
              الأقسام
              <Layers className="w-4 h-4 text-slate-400" />
            </Link>

          </div>
        </div>
      )}
    </nav>
  )
}
