'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Video,
  BarChart3,
  Download,
  Eye,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
  color: string
  icon: string
}

type StatsSummary = {
  books: number
  tutorials: number
  categories: number
  views: number
  downloads: number
}

type Book = {
  id: string
  title: string
  slug: string
  downloadCount: number
  category: Category
}

type Tutorial = {
  id: string
  title: string
  slug: string
  viewCount: number
  category: Category
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'stats' | 'add-book' | 'add-tutorial' | 'manage' | 'add-category'>('stats')
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<StatsSummary | null>(null)
  const [topBooks, setTopBooks] = useState<Book[]>([])
  const [topTutorials, setTopTutorials] = useState<Tutorial[]>([])
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [allTutorials, setAllTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  // Status and Alerts
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // File Upload Loading States
  const [bookFileUploading, setBookFileUploading] = useState(false)
  const [coverImageUploading, setCoverImageUploading] = useState(false)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)

  // Book Form State
  const [bookForm, setBookForm] = useState({
    title: '',
    slug: '',
    description: '',
    author: 'المهندس ناجي الدّعاس',
    categoryId: '',
    fileUrl: '/books/sample.pdf',
    fileName: 'sample.pdf',
    fileSize: '10485760',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
    difficulty: 'Intermediate',
    tags: '',
  })

  // Tutorial Form State
  const [tutorialForm, setTutorialForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    author: 'المهندس ناجي الدّعاس',
    categoryId: '',
    thumbnail: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&w=400&q=80',
    videoUrl: '',
    difficulty: 'Intermediate',
    estimatedTime: '20',
    tags: '',
  })

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#8a1228', // default Burgundy!
    icon: '📚',
  })

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: 'books' | 'covers' | 'thumbnails' | 'videos'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (folder === 'books') setBookFileUploading(true)
    else if (folder === 'covers') setCoverImageUploading(true)
    else if (folder === 'thumbnails') setThumbnailUploading(true)
    else if (folder === 'videos') setVideoUploading(true)

    setSuccessMsg('')
    setErrorMsg('')

    try {
      let publicUrl = ''
      let finalFileName = file.name
      let fileSizeStr = file.size.toString()

      // Files larger than 2MB are uploaded directly via signed URL to bypass Vercel 4.5MB request limit
      if (file.size > 2 * 1024 * 1024) {
        console.log('Using direct client-side upload via signed URL to bypass server limits...')
        
        const signRes = await fetch('/api/upload/sign-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            folder: folder,
          }),
        })

        const signData = await signRes.json()
        if (!signRes.ok) {
          throw new Error(signData.error || 'فشل الحصول على رابط الرفع المباشر')
        }

        // Upload the file directly to Supabase using the signed URL
        const uploadRes = await fetch(signData.signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': signData.contentType,
          },
        })

        if (!uploadRes.ok) {
          throw new Error('فشل الرفع المباشر للملف إلى مساحة التخزين')
        }

        publicUrl = signData.publicUrl
        finalFileName = signData.fileName
      } else {
        // Small files (<2MB): upload via Next.js server route
        console.log('Using server-side upload for small file...')
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text()
          console.error('Non-JSON response:', text)
          throw new Error('الخادم رجع استجابة غير متوقعة. يرجى المحاولة مرة أخرى.')
        }

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'فشل رفع الملف')
        }

        publicUrl = data.fileUrl
        finalFileName = data.fileName
        fileSizeStr = data.fileSize.toString()
      }

      setSuccessMsg(`🎉 تم رفع الملف [${file.name}] بنجاح وتخزينه بأمان في التخزين السحابي!`)

      if (folder === 'books') {
        setBookForm((prev) => ({
          ...prev,
          fileUrl: publicUrl,
          fileName: finalFileName,
          fileSize: fileSizeStr,
        }))
      } else if (folder === 'covers') {
        setBookForm((prev) => ({
          ...prev,
          coverImage: publicUrl,
        }))
      } else if (folder === 'thumbnails') {
        setTutorialForm((prev) => ({
          ...prev,
          thumbnail: publicUrl,
        }))
      } else if (folder === 'videos') {
        setTutorialForm((prev) => ({
          ...prev,
          videoUrl: publicUrl,
        }))
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء رفع الملف'
      setErrorMsg(msg)
    } finally {
      if (folder === 'books') setBookFileUploading(false)
      else if (folder === 'covers') setCoverImageUploading(false)
      else if (folder === 'thumbnails') setThumbnailUploading(false)
      else if (folder === 'videos') setVideoUploading(false)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // Load stats & top items
      const statsRes = await fetch('/api/analytics')
      const statsData = await statsRes.json()
      setStats(statsData.summary)
      setTopBooks(statsData.topBooks || [])
      setTopTutorials(statsData.topTutorials || [])

      // Load all books & tutorials for management
      const booksRes = await fetch('/api/books?limit=100')
      const booksData = await booksRes.json()
      setAllBooks(booksData.data || [])

      const tutorialsRes = await fetch('/api/tutorials?limit=100')
      const tutorialsData = await tutorialsRes.json()
      setAllTutorials(tutorialsData.data || [])

      // Load categories
      const catRes = await fetch('/api/categories')
      const catData = await catRes.json()
      setCategories(catData)

      // Set default category for forms
      if (catData.length > 0) {
        setBookForm((prev) => ({ ...prev, categoryId: catData[0].id }))
        setTutorialForm((prev) => ({ ...prev, categoryId: catData[0].id }))
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleDeleteItem = async (id: string, type: 'book' | 'tutorial') => {
    if (!confirm(type === 'book' ? 'هل أنت متأكد تماماً من رغبتك في حذف هذا الكتاب نهائياً من قاعدة البيانات وسيرفر الموقع؟' : 'هل أنت متأكد تماماً من رغبتك في حذف هذا الشرح نهائياً من قاعدة البيانات؟')) {
      return
    }

    setSuccessMsg('')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/${type === 'book' ? 'books' : 'tutorials'}?id=${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'فشل حذف العنصر')

      setSuccessMsg(type === 'book' ? '🎉 تم حذف الكتاب بنجاح وتحديث لوحة التحكم!' : '🎉 تم حذف الشرح بنجاح وتحديث لوحة التحكم!')
      loadData() // Refresh list and stats
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الحذف'
      setErrorMsg(msg)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'فشل إضافة القسم الجديد')

      setSuccessMsg('🎉 تم إضافة القسم التقني الجديد بنجاح ونشره في الموقع!')
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        color: '#8a1228',
        icon: '📚',
      })
      loadData() // Refresh categories
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء إضافة القسم'
      setErrorMsg(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد تماماً من رغبتك في حذف قسم [${name}] نهائياً؟ تنبيه: لا يمكن حذف قسم إذا كانت هناك كتب أو شروحات مرتبطة به حالياً.`)) {
      return
    }

    setSuccessMsg('')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'فشل حذف القسم')

      setSuccessMsg(`🎉 تم حذف القسم [${name}] بنجاح وتحديث القوائم!`)
      loadData()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء حذف القسم'
      setErrorMsg(msg)
    }
  }

  // Auto-generate Slugs
  const handleTitleChange = (type: 'book' | 'tutorial' | 'category', val: string) => {
    const cleanSlug = val
      .trim()
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF-]/g, '') // keeps Arabic letters, spaces, alphanumeric, dashes
      .replace(/\s+/g, '-')
    
    if (type === 'book') {
      setBookForm((prev) => ({ ...prev, title: val, slug: cleanSlug }))
    } else if (type === 'tutorial') {
      setTutorialForm((prev) => ({ ...prev, title: val, slug: cleanSlug }))
    } else if (type === 'category') {
      setCategoryForm((prev) => ({ ...prev, name: val, slug: cleanSlug }))
    }
  }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const payload = {
        ...bookForm,
        tags: bookForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('فشل إدخال بيانات الكتاب لقاعدة البيانات')

      setSuccessMsg('🎉 تم إضافة الكتاب بنجاح ونشره في المكتبة!')
      setBookForm({
        title: '',
        slug: '',
        description: '',
        author: 'المهندس ناجي الدّعاس',
        categoryId: categories[0]?.id || '',
        fileUrl: '/books/sample.pdf',
        fileName: 'sample.pdf',
        fileSize: '10485760',
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
        difficulty: 'Intermediate',
        tags: '',
      })
      loadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء إضافة الكتاب'
      setErrorMsg(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleTutorialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const payload = {
        ...tutorialForm,
        tags: tutorialForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }

      const res = await fetch('/api/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('فشل إدخال بيانات الشرح لقاعدة البيانات')

      setSuccessMsg('🎉 تم إضافة الشرح بنجاح ونشره في المدوّنة التقنية!')
      setTutorialForm({
        title: '',
        slug: '',
        description: '',
        content: '',
        author: 'المهندس ناجي الدّعاس',
        categoryId: categories[0]?.id || '',
        thumbnail: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&w=400&q=80',
        videoUrl: '',
        difficulty: 'Intermediate',
        estimatedTime: '20',
        tags: '',
      })
      loadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء إضافة الشرح'
      setErrorMsg(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Futuristic Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 border-b border-slate-200 pb-8 text-right relative">
          
          <div className="flex items-center space-x-3 space-x-reverse mr-auto ml-0 mb-6 md:mb-0 gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 rounded-2xl text-sm font-black transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
            <span className="bg-indigo-150 text-indigo-700 border border-indigo-200/50 text-xs px-4 py-2 rounded-2xl font-black shadow-sm">
              بوابة المسؤول الشاملة 2026
            </span>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 flex items-center gap-3 justify-end leading-tight tracking-tight">
              لوحة تحكم المكتبة الشاملة
              <div className="bg-indigo-550 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              </div>
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base mt-2">
              إدارة الإحصائيات، إضافة الكتب الرقمية، ونشر الشروحات التقنية لقاعدة البيانات.
            </p>
          </div>

        </div>

        {/* Dynamic Tab Selection Pills */}
        <div className="flex justify-end space-x-4 space-x-reverse mb-10 overflow-x-auto pb-2">
          
          <button
            onClick={() => { setActiveTab('stats'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -translate-y-0.5'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            الإحصائيات والتحليلات
            <BarChart3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => { setActiveTab('add-book'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'add-book'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -translate-y-0.5'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            إضافة كتاب رقمي
            <PlusCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setActiveTab('add-tutorial'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'add-tutorial'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -translate-y-0.5'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            إضافة شرح تفاعلي
            <PlusCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setActiveTab('manage'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -translate-y-0.5'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            إدارة الكتب والشروحات
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setActiveTab('add-category'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'add-category'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -translate-y-0.5'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            إضافة قسم تقني
            <PlusCircle className="w-4 h-4" />
          </button>

        </div>

        {/* Status Alerts */}
        {successMsg && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200/50 rounded-2xl p-5 flex items-center justify-end gap-3 text-emerald-800 font-extrabold shadow-sm text-right pulse-neon">
            <span>{successMsg}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        )}
        {errorMsg && (
          <div className="mb-8 bg-rose-50 border border-rose-200/50 rounded-2xl p-5 flex items-center justify-end gap-3 text-rose-800 font-extrabold shadow-sm text-right">
            <span>{errorMsg}</span>
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
        )}

        {/* Dashboard Panels */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-600 font-black">جاري تحديث بيانات لوحة التحكم...</p>
          </div>
        ) : (
          <div>
            {/* stats tab */}
            {activeTab === 'stats' && stats && (
              <div className="space-y-12">
                {/* Glowing Premium Stats Widgets */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-right flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
                    <span className="text-xs font-black text-slate-400 block mb-1">إجمالي الكتب</span>
                    <span className="text-3xl font-black text-slate-800 block mt-2 group-hover:text-indigo-600 transition-colors">{stats.books}</span>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-right flex flex-col justify-between hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group">
                    <span className="text-xs font-black text-slate-400 block mb-1">الشروحات التقنية</span>
                    <span className="text-3xl font-black text-slate-800 block mt-2 group-hover:text-purple-600 transition-colors">{stats.tutorials}</span>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-right flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group">
                    <span className="text-xs font-black text-slate-400 block mb-1">الأقسام الرئيسية</span>
                    <span className="text-3xl font-black text-slate-800 block mt-2 group-hover:text-amber-600 transition-colors">{stats.categories}</span>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-right flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
                    <span className="text-xs font-black text-slate-400 block mb-1 flex items-center justify-end gap-1">
                      المشاهدات
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                    </span>
                    <span className="text-3xl font-black text-slate-800 block mt-2 group-hover:text-blue-600 transition-colors">{stats.views}</span>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-right flex flex-col justify-between col-span-2 lg:col-span-1 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group">
                    <span className="text-xs font-black text-slate-400 block mb-1 flex items-center justify-end gap-1">
                      التحميلات
                      <Download className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                    <span className="text-3xl font-black text-slate-800 block mt-2 group-hover:text-emerald-600 transition-colors">{stats.downloads}</span>
                  </div>

                </div>

                {/* Popular lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Top Books */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 sm:p-10 shadow-xl shadow-slate-100/50">
                    <h3 className="text-xl font-black text-slate-800 mb-6 text-right flex items-center justify-end gap-2.5">
                      أكثر الكتب تحميلاً للجمهور
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </h3>
                    {topBooks.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-10 font-bold">لا توجد بيانات متاحة بعد.</p>
                    ) : (
                      <div className="space-y-4">
                        {topBooks.map((b) => (
                          <div key={b.id} className="flex justify-between items-center bg-slate-50/80 hover:bg-slate-100/50 p-4 rounded-2xl border border-slate-200/40 flex-row-reverse text-right transition">
                            <div>
                              <span className="font-extrabold text-slate-800 text-sm sm:text-base">{b.title}</span>
                              <span className="block text-xs text-slate-400 font-bold mt-1">{b.category.name}</span>
                            </div>
                            <span className="bg-indigo-50 text-indigo-700 text-xs px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-sm">
                              {b.downloadCount} تحميل
                              <Download className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Top Tutorials */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 sm:p-10 shadow-xl shadow-slate-100/50">
                    <h3 className="text-xl font-black text-slate-800 mb-6 text-right flex items-center justify-end gap-2.5">
                      أكثر الشروحات قراءة ومشاهدة
                      <Video className="w-5 h-5 text-purple-600" />
                    </h3>
                    {topTutorials.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-10 font-bold">لا توجد بيانات متاحة بعد.</p>
                    ) : (
                      <div className="space-y-4">
                        {topTutorials.map((t) => (
                          <div key={t.id} className="flex justify-between items-center bg-slate-50/80 hover:bg-slate-100/50 p-4 rounded-2xl border border-slate-200/40 flex-row-reverse text-right transition">
                            <div>
                              <span className="font-extrabold text-slate-800 text-sm sm:text-base">{t.title}</span>
                              <span className="block text-xs text-slate-400 font-bold mt-1">{t.category.name}</span>
                            </div>
                            <span className="bg-purple-50 text-purple-700 text-xs px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-sm">
                              {t.viewCount} مشاهدة
                              <Eye className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* add book tab */}
            {activeTab === 'add-book' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 md:p-12 shadow-xl shadow-slate-100/50 text-right relative overflow-hidden">
                <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <h3 className="text-2xl font-black text-slate-800 mb-2 relative z-10">إضافة كتاب رقمي جديد</h3>
                <p className="text-slate-500 text-sm sm:text-base font-bold mb-8 relative z-10">املأ الحقول التالية لإدخال معلومات الكتاب وربطه بقاعدة البيانات.</p>
                
                <form onSubmit={handleBookSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">عنوان الكتاب الرقمي</label>
                      <input
                        type="text"
                        required
                        value={bookForm.title}
                        onChange={(e) => handleTitleChange('book', e.target.value)}
                        className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                        placeholder="مثال: احترف هندسة الشبكات والراوترات"
                      />
                    </div>
                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">الرابط الفريد (Slug)</label>
                      <input
                        type="text"
                        required
                        value={bookForm.slug}
                        onChange={(e) => setBookForm({ ...bookForm, slug: e.target.value })}
                        className="w-full text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                        placeholder="computer-networks-guide"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">القسم التقني</label>
                      <div className="relative">
                        <select
                          value={bookForm.categoryId}
                          onChange={(e) => setBookForm({ ...bookForm, categoryId: e.target.value })}
                          className="w-full text-right pr-4 pl-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-extrabold transition appearance-none cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <div className="absolute left-4 top-4.5 pointer-events-none text-slate-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">المستوى المستهدف</label>
                      <div className="relative">
                        <select
                          value={bookForm.difficulty}
                          onChange={(e) => setBookForm({ ...bookForm, difficulty: e.target.value })}
                          className="w-full text-right pr-4 pl-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-extrabold transition appearance-none cursor-pointer"
                        >
                          <option value="Beginner">🟢 Beginner (مبتدئ)</option>
                          <option value="Intermediate">🟡 Intermediate (متوسط)</option>
                          <option value="Advanced">🔴 Advanced (متقدم)</option>
                        </select>
                        <div className="absolute left-4 top-4.5 pointer-events-none text-slate-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">اسم مؤلف الكتاب</label>
                      <input
                        type="text"
                        value={bookForm.author}
                        onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                        className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-extrabold transition"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2.5">وصف تفصيلي كامل ومبهر للكتاب</label>
                    <textarea
                      required
                      rows={5}
                      value={bookForm.description}
                      onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                      className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition leading-relaxed"
                      placeholder="صف أهداف ومحتويات الكتاب بإيجاز..."
                    />
                  </div>

                  {/* Book File Direct Upload Dropzone */}
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-500/40 rounded-3xl p-6 transition text-center relative group">
                    <input
                      type="file"
                      accept=".pdf,.epub"
                      onChange={(e) => handleFileUpload(e, 'books')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={bookFileUploading}
                    />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl mb-2 animate-pulse">📁</span>
                      <h4 className="font-extrabold text-slate-700 text-sm">
                        {bookFileUploading ? 'جاري رفع ملف الكتاب بأمان...' : 'اسحب وأفلت ملف الكتاب هنا أو اضغط للاختيار'}
                      </h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">تنسيقات مدعومة: PDF, EPUB (الحد الأقصى: 50 ميجابايت)</p>
                      {bookForm.fileName && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-xl text-xs font-black text-emerald-700 inline-flex items-center gap-1.5">
                          <span>✅ الملف النشط:</span>
                          <span>{bookForm.fileName} ({ (parseInt(bookForm.fileSize) / (1024 * 1024)).toFixed(2) } MB)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* File URL */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">رابط تحميل الملف الفعلي</label>
                      <input
                        type="text"
                        required
                        value={bookForm.fileUrl}
                        onChange={(e) => setBookForm({ ...bookForm, fileUrl: e.target.value })}
                        className="w-full text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                        placeholder="/books/filename.pdf"
                      />
                    </div>

                    {/* File Name */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">اسم الملف النهائي</label>
                      <input
                        type="text"
                        required
                        value={bookForm.fileName}
                        onChange={(e) => setBookForm({ ...bookForm, fileName: e.target.value })}
                        className="w-full text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                      />
                    </div>

                    {/* File Size */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">حجم الملف (بالبايت)</label>
                      <input
                        type="text"
                        required
                        value={bookForm.fileSize}
                        onChange={(e) => setBookForm({ ...bookForm, fileSize: e.target.value })}
                        className="w-full text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cover Image */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">صورة الغلاف الفنية (رفع مباشر أو رابط)</label>
                      <div className="flex gap-4">
                        <div className="relative bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-650 font-black px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center cursor-pointer transition w-1/3 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'covers')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={coverImageUploading}
                          />
                          <span>{coverImageUploading ? 'جاري الرفع...' : 'رفع صورة 📷'}</span>
                        </div>
                        <input
                          type="text"
                          value={bookForm.coverImage}
                          onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                          className="w-2/3 text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-sm transition"
                          placeholder="/covers/cover.jpg"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">الوسوم (مفصولة بفاصلة)</label>
                      <input
                        type="text"
                        value={bookForm.tags}
                        onChange={(e) => setBookForm({ ...bookForm, tags: e.target.value })}
                        className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                        placeholder="مثال: networking, router, cisco"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition disabled:opacity-50 flex items-center justify-center mr-auto ml-0 cursor-pointer"
                  >
                    {submitting ? 'جاري الحفظ الآمن...' : 'حفظ ونشر الكتاب الحقيقي'}
                  </button>
                </form>
              </div>
            )}

            {/* add tutorial tab */}
            {activeTab === 'add-tutorial' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 md:p-12 shadow-xl shadow-slate-100/50 text-right relative overflow-hidden">
                <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <h3 className="text-2xl font-black text-slate-800 mb-2 relative z-10">إضافة شرح تقني تفاعلي</h3>
                <p className="text-slate-500 text-sm sm:text-base font-bold mb-8 relative z-10">اكتب خطوات الشرح مع إمكانية إضافة رابط فيديو لشرح مرئي متكامل.</p>
                
                <form onSubmit={handleTutorialSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">عنوان الشرح التفصيلي</label>
                      <input
                        type="text"
                        required
                        value={tutorialForm.title}
                        onChange={(e) => handleTitleChange('tutorial', e.target.value)}
                        className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                        placeholder="مثال: بناء هيكل الحماية بالكامل في Next.js"
                      />
                    </div>
                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">الرابط الفريد (Slug)</label>
                      <input
                        type="text"
                        required
                        value={tutorialForm.slug}
                        onChange={(e) => setTutorialForm({ ...tutorialForm, slug: e.target.value })}
                        className="w-full text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                        placeholder="build-security-nextjs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">القسم الفني</label>
                      <div className="relative">
                        <select
                          value={tutorialForm.categoryId}
                          onChange={(e) => setTutorialForm({ ...tutorialForm, categoryId: e.target.value })}
                          className="w-full text-right pr-4 pl-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-extrabold transition appearance-none cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <div className="absolute left-4 top-4.5 pointer-events-none text-slate-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">مستوى الصعوبة</label>
                      <div className="relative">
                        <select
                          value={tutorialForm.difficulty}
                          onChange={(e) => setTutorialForm({ ...tutorialForm, difficulty: e.target.value })}
                          className="w-full text-right pr-4 pl-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-extrabold transition appearance-none cursor-pointer"
                        >
                          <option value="Beginner">🟢 Beginner (مبتدئ)</option>
                          <option value="Intermediate">🟡 Intermediate (متوسط)</option>
                          <option value="Advanced">🔴 Advanced (متقدم)</option>
                        </select>
                        <div className="absolute left-4 top-4.5 pointer-events-none text-slate-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">زمن القراءة (بالدقائق)</label>
                      <input
                        type="number"
                        required
                        value={tutorialForm.estimatedTime}
                        onChange={(e) => setTutorialForm({ ...tutorialForm, estimatedTime: e.target.value })}
                        className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-extrabold transition"
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">الكاتب المسؤول</label>
                      <input
                        type="text"
                        value={tutorialForm.author}
                        onChange={(e) => setTutorialForm({ ...tutorialForm, author: e.target.value })}
                        className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-extrabold transition"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2.5">وصف مختصر وجذاب للشرح</label>
                    <input
                      type="text"
                      required
                      value={tutorialForm.description}
                      onChange={(e) => setTutorialForm({ ...tutorialForm, description: e.target.value })}
                      className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                      placeholder="نبذة سريعة لتظهر في قائمة الشروحات..."
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2.5">محتوى الشرح العملي والبرمجي بالكامل</label>
                    <textarea
                      required
                      rows={8}
                      value={tutorialForm.content}
                      onChange={(e) => setTutorialForm({ ...tutorialForm, content: e.target.value })}
                      className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition leading-relaxed"
                      placeholder="اكتب خطوات الشرح والشفرات البرمجية هنا بالتفصيل..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thumbnail Direct Upload */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">الصورة المصغّرة للشرح (رفع مباشر أو رابط)</label>
                      <div className="flex gap-4">
                        <div className="relative bg-slate-100 hover:bg-purple-50 border border-slate-200 text-slate-650 font-black px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center cursor-pointer transition w-1/3 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'thumbnails')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={thumbnailUploading}
                          />
                          <span>{thumbnailUploading ? 'جاري الرفع...' : 'رفع صورة 📷'}</span>
                        </div>
                        <input
                          type="text"
                          value={tutorialForm.thumbnail}
                          onChange={(e) => setTutorialForm({ ...tutorialForm, thumbnail: e.target.value })}
                          className="w-2/3 text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-sm transition"
                          placeholder="/thumbnails/thumb.jpg"
                        />
                      </div>
                    </div>

                    {/* Video Upload or Link */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">فيديو الشرح (رفع مباشر أو رابط YouTube)</label>
                      <div className="flex gap-4">
                        <div className="relative bg-slate-100 hover:bg-purple-50 border border-slate-200 text-slate-650 font-black px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center cursor-pointer transition w-1/3 text-center">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(e, 'videos')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={videoUploading}
                          />
                          <span>{videoUploading ? 'جاري الرفع...' : 'رفع فيديو 🎥'}</span>
                        </div>
                        <input
                          type="text"
                          value={tutorialForm.videoUrl}
                          onChange={(e) => setTutorialForm({ ...tutorialForm, videoUrl: e.target.value })}
                          className="w-2/3 text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-sm transition"
                          placeholder="/videos/video.mp4 أو رابط YouTube"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2.5">الوسوم المعتمدة (مفصولة بفاصلة)</label>
                      <input
                        type="text"
                        value={tutorialForm.tags}
                        onChange={(e) => setTutorialForm({ ...tutorialForm, tags: e.target.value })}
                        className="w-full text-right px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                        placeholder="مثال: nextjs, cloud, learning"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition disabled:opacity-50 flex items-center justify-center mr-auto ml-0 cursor-pointer"
                  >
                    {submitting ? 'جاري نشر الشرح...' : 'حفظ ونشر الشرح التفاعلي'}
                  </button>
                </form>
              </div>
            )}

            {/* manage tab */}
            {activeTab === 'manage' && (
              <div className="space-y-12">
                
                {/* Books Management Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 sm:p-10 shadow-xl shadow-slate-100/50 text-right relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-2 relative z-10 flex items-center justify-end gap-2.5">
                    إدارة وجدول الكتب الرقمية المرفوعة
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </h3>
                  <p className="text-slate-500 text-sm font-bold mb-6 relative z-10">يمكنك هنا استعراض جميع كتبك المرفوعة وحذف أي كتاب لم تعد تريده نهائياً.</p>

                  {allBooks.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                      <span className="text-4xl block mb-2">📚</span>
                      <p className="text-slate-400 text-sm font-black">لا توجد كتب مرفوعة حالياً في مكتبتك.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200/60 z-10 relative">
                      <table className="w-full text-right border-collapse bg-white">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500">
                            <th className="p-4 sm:p-5">عنوان الكتاب</th>
                            <th className="p-4 sm:p-5">القسم</th>
                            <th className="p-4 sm:p-5 text-center">التحميلات</th>
                            <th className="p-4 sm:p-5 text-center">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                          {allBooks.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4 sm:p-5 font-black text-slate-800">{b.title}</td>
                              <td className="p-4 sm:p-5">
                                <span className="inline-block px-3 py-1 rounded-xl text-xs font-extrabold text-white" style={{ backgroundColor: b.category.color }}>
                                  {b.category.name}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 text-center">{b.downloadCount}</td>
                              <td className="p-4 sm:p-5 text-center">
                                <button
                                  onClick={() => handleDeleteItem(b.id, 'book')}
                                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-black transition-all hover:scale-102 active:scale-98 cursor-pointer"
                                >
                                  حذف الكتاب 🗑️
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Tutorials Management Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 sm:p-10 shadow-xl shadow-slate-100/50 text-right relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-2 relative z-10 flex items-center justify-end gap-2.5">
                    إدارة وجدول الشروحات والدروس التقنية
                    <Video className="w-5 h-5 text-purple-600" />
                  </h3>
                  <p className="text-slate-500 text-sm font-bold mb-6 relative z-10">استعرض جميع دروسك ومقالاتك التقنية المنشورة، مع إمكانية حذف أي درس فوراً.</p>

                  {allTutorials.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                      <span className="text-4xl block mb-2">🎥</span>
                      <p className="text-slate-400 text-sm font-black">لا توجد شروحات أو دروس منشورة حالياً.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200/60 z-10 relative">
                      <table className="w-full text-right border-collapse bg-white">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500">
                            <th className="p-4 sm:p-5">عنوان الدرس / الشرح</th>
                            <th className="p-4 sm:p-5">القسم</th>
                            <th className="p-4 sm:p-5 text-center">المشاهدات</th>
                            <th className="p-4 sm:p-5 text-center">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                          {allTutorials.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4 sm:p-5 font-black text-slate-800">{t.title}</td>
                              <td className="p-4 sm:p-5">
                                <span className="inline-block px-3 py-1 rounded-xl text-xs font-extrabold text-white" style={{ backgroundColor: t.category.color }}>
                                  {t.category.name}
                                </span>
                              </td>
                              <td className="p-4 sm:p-5 text-center">{t.viewCount}</td>
                              <td className="p-4 sm:p-5 text-center">
                                <button
                                  onClick={() => handleDeleteItem(t.id, 'tutorial')}
                                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-black transition-all hover:scale-102 active:scale-98 cursor-pointer"
                                >
                                  حذف الشرح 🗑️
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* add category tab */}
            {activeTab === 'add-category' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
                
                {/* Add Category Form (1 column on lg, full on mobile) */}
                <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-xl shadow-slate-100/50 relative overflow-hidden h-fit">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none"></div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-2 relative z-10 flex items-center justify-end gap-2.5">
                    إضافة قسم جديد
                    <PlusCircle className="w-5 h-5 text-indigo-600" />
                  </h3>
                  <p className="text-slate-500 text-xs font-bold mb-6 relative z-10">املأ البيانات بالأسفل لإنشاء تصنيف تقني جديد في المنصة.</p>
                  
                  <form onSubmit={handleCategorySubmit} className="space-y-5 relative z-10">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-2">اسم القسم</label>
                      <input
                        type="text"
                        required
                        value={categoryForm.name}
                        onChange={(e) => handleTitleChange('category', e.target.value)}
                        className="w-full text-right px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-sm transition"
                        placeholder="مثال: هندسة الشبكات"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-2">الرابط الفريد (Slug)</label>
                      <input
                        type="text"
                        required
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-sm transition"
                        placeholder="computer-networks"
                      />
                    </div>

                    {/* Icon & Color Row */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Icon Emoji */}
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-2">أيقونة القسم (Emoji)</label>
                        <input
                          type="text"
                          required
                          value={categoryForm.icon}
                          onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                          className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-sm transition"
                          placeholder="🌐"
                        />
                      </div>
                      
                      {/* Color Picker */}
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-2">لون القسم</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={categoryForm.color}
                            onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                            className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent p-0"
                          />
                          <input
                            type="text"
                            value={categoryForm.color}
                            onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                            className="w-full text-center px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-xs transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-2">وصف القسم</label>
                      <textarea
                        rows={3}
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full text-right px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-sm transition"
                        placeholder="كتب ومراجع لشبكات سيسكو وجونيبر..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center cursor-pointer text-sm"
                    >
                      {submitting ? 'جاري الحفظ...' : 'حفظ ونشر القسم الجديد'}
                    </button>
                  </form>
                </div>

                {/* Categories Management List (2 columns on lg) */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200/60 p-8 sm:p-10 shadow-xl shadow-slate-100/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-2 relative z-10 flex items-center justify-end gap-2.5">
                    إدارة الأقسام الحالية
                    <FileText className="w-5 h-5 text-purple-600" />
                  </h3>
                  <p className="text-slate-500 text-xs font-bold mb-6 relative z-10">استعرض الأقسام التقنية النشطة في موقعك، مع إمكانية حذف أي قسم غير مرتبط بكتب.</p>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/60 z-10 relative">
                    <table className="w-full text-right border-collapse bg-white">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500">
                          <th className="p-4">أيقونة</th>
                          <th className="p-4">اسم القسم</th>
                          <th className="p-4">الرابط الفريد</th>
                          <th className="p-4 text-center">اللون التمييزي</th>
                          <th className="p-4 text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                        {categories.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4 text-2xl">{c.icon}</td>
                            <td className="p-4 font-black text-slate-800">{c.name}</td>
                            <td className="p-4 text-left font-mono text-xs">{c.slug}</td>
                            <td className="p-4 text-center">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold text-white" style={{ backgroundColor: c.color }}>
                                {c.color}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteCategory(c.id, c.name)}
                                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-black transition-all hover:scale-102 active:scale-98 cursor-pointer"
                              >
                                حذف القسم 🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
