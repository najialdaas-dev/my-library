'use client'

import { useState, useEffect } from 'react'
import { BookCard } from '@/components/BookCard'
import { Book, Category } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

// ذاكرة تخزين مؤقتة خارج المكون للاحتفاظ بالكتب والأقسام عند التنقل والعودة لمنع وميض الصفحة وقفزات السكرول
let cachedBooks: Book[] = []
let cachedCategories: Category[] = []
let cachedTotalPages = 1

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(cachedBooks)
  const [categories, setCategories] = useState<Category[]>(cachedCategories)
  const [loading, setLoading] = useState(cachedBooks.length === 0)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(cachedTotalPages)

  useEffect(() => {
    const fetchCategories = async () => {
      if (cachedCategories.length > 0) return
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data || [])
        cachedCategories = data || []
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      // إظهار الهيكل البراق فقط عند تغير الفلاتر أو عند التحميل الأول
      const isInitialEmptyFilters = !search && !difficulty && !selectedCategory && page === 1;
      if (!isInitialEmptyFilters || cachedBooks.length === 0) {
        setLoading(true)
      }
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (difficulty) params.append('difficulty', difficulty)
        if (selectedCategory) params.append('categoryId', selectedCategory)
        params.append('page', page.toString())
        params.append('limit', '9')

        const response = await fetch(`/api/books?${params}`)
        const data = await response.json()
        const fetchedBooks = data.data || []
        setBooks(fetchedBooks)
        
        if (isInitialEmptyFilters) {
          cachedBooks = fetchedBooks
        }
        
        if (data.pagination) {
          const pages = data.pagination.pages || 1
          setTotalPages(pages)
          if (isInitialEmptyFilters) {
            cachedTotalPages = pages
          }
        }
      } catch (error) {
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden h-full flex flex-col justify-between animate-pulse">
                <div>
                  <div className="h-64 bg-slate-100/60" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-20 bg-slate-200 rounded ml-auto" />
                    <div className="h-5 w-3/4 bg-slate-200 rounded ml-auto" />
                    <div className="h-4 w-full bg-slate-200 rounded ml-auto" />
                  </div>
                </div>
                <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div className="h-4 w-12 bg-slate-200 rounded" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold text-slate-700 mb-1">لا توجد نتائج</h3>
            <p className="text-slate-500 text-sm">جرّب تغيير كلمة البحث أو الفلاتر.</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
