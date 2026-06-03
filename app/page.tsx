import Link from 'next/link'
import { prisma } from '@/lib/db'
import { BookCard } from '@/components/BookCard'
import { TutorialCard } from '@/components/TutorialCard'
import { Navbar } from '@/components/Navbar'
import { Book, Tutorial } from '@/lib/types'
import { ArrowLeft, BookOpen, Video, FolderOpen } from 'lucide-react'

export const revalidate = 60

async function getLatestContent() {
  const [books, tutorials, categories, bookCount, tutorialCount] = await Promise.all([
    prisma.book.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      where: { active: true },
    }),
    prisma.tutorial.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      where: { active: true },
    }),
    prisma.category.findMany(),
    prisma.book.count({ where: { active: true } }),
    prisma.tutorial.count({ where: { active: true } }),
  ])

  return { books, tutorials, categories, bookCount, tutorialCount }
}

export default async function Home() {
  const { books, tutorials, categories, bookCount, tutorialCount } = await getLatestContent()

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />
      
      {/* Hero */}
      <section className="relative bg-indigo-950 text-white py-20 sm:py-28 overflow-hidden text-right">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none z-0" 
          style={{ backgroundImage: "url('/images/NajiAlDaas2026.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-indigo-900/70 via-indigo-950/90 to-black/95 z-0" />
        <div className="absolute top-[-15%] right-[-8%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mr-0 ml-auto">
            <p className="text-indigo-300 text-sm font-medium mb-4">المهندس ناجي الدّعاس</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              كتب وشروحات برمجية{' '}
              <span className="text-indigo-300">عربية مجانية</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
              كتب للتحميل المباشر وشروحات فيديو في تطوير الويب والأمن السيبراني والذكاء الاصطناعي.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/books"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-2"
              >
                تصفح الكتب
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link 
                href="/tutorials"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/15 px-6 py-3 rounded-lg font-medium text-sm transition-colors duration-200"
              >
                شاهد الشروحات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats — only shown if we have meaningful numbers */}
      {(bookCount + tutorialCount) > 5 && (
        <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-md p-6 sm:p-8">
            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 text-center">
              
              <div className="px-4">
                <BookOpen className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{bookCount}</div>
                <p className="text-slate-500 text-xs mt-1">كتاب</p>
              </div>

              <div className="px-4">
                <Video className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{tutorialCount}</div>
                <p className="text-slate-500 text-xs mt-1">شرح</p>
              </div>

              <div className="px-4">
                <FolderOpen className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{categories.length}</div>
                <p className="text-slate-500 text-xs mt-1">قسم</p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Latest Books */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 text-right">
          <Link 
            href="/books" 
            className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            عرض الكل
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">أحدث الكتب</h2>
            <p className="text-slate-500 text-sm">كتب جديدة متاحة للتحميل المجاني.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: Book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Latest Tutorials — different layout */}
      <section className="py-16 bg-slate-100/50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 text-right">
            <Link 
              href="/tutorials" 
              className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              عرض الكل
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">شروحات فيديو</h2>
              <p className="text-slate-500 text-sm">دروس عملية خطوة بخطوة مع فيديوهات يوتيوب.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial: Tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
