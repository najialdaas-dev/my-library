'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Compass, BookOpen, Layers, LayoutDashboard, Menu, X, LibraryBig } from 'lucide-react'

export function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin === true))
      .catch(() => setIsAdmin(false))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-50/85 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
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
              className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 font-medium text-sm flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              الكتب
            </Link>
            <Link 
              href="/tutorials" 
              className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 font-medium text-sm flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              الشروحات
            </Link>
            <Link 
              href="/categories" 
              className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 font-medium text-sm flex items-center gap-1.5"
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
            
            {isAdmin && (
              <Link 
                href="/dashboard" 
                className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                لوحة التحكم
              </Link>
            )}

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
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-end gap-2 px-3 py-2.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 font-medium transition-colors duration-200"
            >
              الكتب
              <BookOpen className="w-4 h-4 text-slate-400" />
            </Link>
            
            <Link 
              href="/tutorials" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-end gap-2 px-3 py-2.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 font-medium transition-colors duration-200"
            >
              الشروحات
              <Compass className="w-4 h-4 text-slate-400" />
            </Link>

            <Link 
              href="/categories" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-end gap-2 px-3 py-2.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 font-medium transition-colors duration-200"
            >
              الأقسام
              <Layers className="w-4 h-4 text-slate-400" />
            </Link>

            {isAdmin && (
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                لوحة التحكم
              </Link>
            )}

          </div>
        </div>
      )}
    </nav>
  )
}
