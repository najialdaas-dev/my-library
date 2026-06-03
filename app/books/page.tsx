'use client'

import { useState, useEffect, useRef } from 'react'
import { BookCard } from '@/components/BookCard'
import { Book, Category } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

export default function BooksPage() {
  const [categories, setCategories] = useState<Category[]>([])
  
  // State Initialization from sessionStorage
  const [books, setBooks] = useState<Book[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('books_state_data')
      if (cached) return JSON.parse(cached)
    }
    return []
  })
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('books_state_search') || ''
    return ''
  })
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('books_state_category') || ''
    return ''
  })
  const [difficulty, setDifficulty] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('books_state_difficulty') || ''
    return ''
  })
  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') return Number(sessionStorage.getItem('books_state_page')) || 1
    return 1
  })
  const [totalPages, setTotalPages] = useState(() => {
    if (typeof window !== 'undefined') return Number(sessionStorage.getItem('books_state_total')) || 1
    return 1
  })
  
  const [loading, setLoading] = useState(() => books.length === 0)
  
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data || [])
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    // Save state to session storage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('books_state_search', search)
      sessionStorage.setItem('books_state_category', selectedCategory)
      sessionStorage.setItem('books_state_difficulty', difficulty)
      sessionStorage.setItem('books_state_page', page.toString())
    }

    const fetchBooks = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (difficulty) params.append('difficulty', difficulty)
        if (selectedCategory) params.append('categoryId', selectedCategory)
        params.append('page', page.toString())
        params.append('limit', '9')

        const response = await fetch(`/api/books?${params}`, {
          signal: abortControllerRef.current.signal
        })
        
        const data = await response.json()
        const newBooks = data.data || []
        const newTotalPages = data.pagination?.pages || 1
        
        setBooks(newBooks)
        setTotalPages(newTotalPages)
        
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('books_state_data', JSON.stringify(newBooks))
          sessionStorage.setItem('books_state_total', newTotalPages.toString())
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchBooks()
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [search, difficulty, selectedCategory, page])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      {/* Header */}
      <div className="bg-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            الكتب
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base">
            كتب برمجية عربية للتحميل المجاني المباشر.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-8 text-right">
          <div className="flex items-center justify-end gap-2 mb-4">
            <span className="font-medium text-slate-600 text-sm">تصفية</span>
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full text-right pr-4 pl-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm transition-all duration-200"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full text-right pr-4 pl-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">كل الأقسام</option>
              {categories.map((cat) => (
                 <option key={cat.slug} value={cat.slug}>
                   {cat.icon} {cat.name}
                 </option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              className="w-full text-right pr-4 pl-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">كل المستويات</option>
              <option value="Beginner">مبتدئ</option>
              <option value="Intermediate">متوسط</option>
              <option value="Advanced">متقدم</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading && books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
            <p className="text-slate-500 text-sm">جاري التحميل...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-slate-700 mb-1">لا توجد نتائج</h3>
            <p className="text-slate-500 text-sm">جرّب تغيير كلمة البحث أو الفلاتر.</p>
          </div>
        ) : (
          <div className={loading ? 'opacity-50 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 border-t border-slate-200 pt-6 flex-row-reverse">
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  السابقة
                </button>
                
                <span className="text-slate-500 text-sm">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer flex items-center gap-1"
                >
                  التالية
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
