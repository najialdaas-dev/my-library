import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { ArrowRight, Download, Eye, Calendar, Globe, FileText, Cpu, Star, CircleDot } from 'lucide-react'
import { DownloadButton } from '@/components/DownloadButton'
import { ViewTracker } from '@/components/ViewTracker'

export const revalidate = 60

async function getBook(slug: string) {
  const decodedSlug = decodeURIComponent(slug)
  const book = await prisma.book.findUnique({
    where: { slug: decodedSlug },
    include: { category: true },
  })
  return book
}

export default async function BookDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const book = await getBook(resolvedParams.slug)

  if (!book) {
    notFound()
  }

  const fileSizeMB = (book.fileSize / (1024 * 1024)).toFixed(2)

  const difficultyLabel = {
    Beginner: 'مبتدئ',
    Intermediate: 'متوسط',
    Advanced: 'متقدم',
  }[book.difficulty] || book.difficulty

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />
      <ViewTracker id={book.id} type="book" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors"
          >
            العودة للكتب
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Book Detail Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-10">
            
            {/* Cover */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative w-56 h-80 rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-2"
                  />
                ) : (
                  <CircleDot className="w-12 h-12 text-slate-200" />
                )}
                
                {book.featured && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-md text-xs font-medium shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    مميز
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2 flex flex-col justify-between text-right">
              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 justify-end mb-4">
                  {book.tags.map((tag) => (
                    <span key={tag} className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                  <span
                    className="px-2.5 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: book.category.color }}
                  >
                    {book.category.icon} {book.category.name}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 leading-tight">
                  {book.title}
                </h1>

                <p className="text-sm text-slate-500 mb-5">
                  بواسطة <span className="text-slate-700 font-medium">{book.author || 'م. ناجي الدعاس'}</span>
                </p>

                {/* Description */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6">
                  <h3 className="font-semibold text-slate-800 mb-2 text-sm">عن الكتاب</h3>
                  <p className="text-slate-600 text-sm leading-7">
                    {book.description}
                  </p>
                </div>
              </div>

              <div>
                {/* Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="block text-xs text-slate-400 mb-1">اللغة</span>
                    <span className="font-medium text-slate-700 text-sm flex items-center justify-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      {book.language === 'Arabic' ? 'العربية' : book.language}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="block text-xs text-slate-400 mb-1">الحجم</span>
                    <span className="font-medium text-slate-700 text-sm flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      {fileSizeMB} MB
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="block text-xs text-slate-400 mb-1">المستوى</span>
                    <span className="font-medium text-slate-700 text-sm flex items-center justify-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                      {difficultyLabel}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="block text-xs text-slate-400 mb-1">النشر</span>
                    <span className="font-medium text-slate-700 text-sm flex items-center justify-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {new Date(book.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>

                {/* Stats + Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-5">
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {book.viewCount + 1} مشاهدة
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {book.downloadCount} تحميل
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <a
                      href={book.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center font-medium px-6 py-3 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 cursor-pointer text-sm"
                    >
                      قراءة أونلاين
                    </a>

                    <DownloadButton
                      bookId={book.id}
                      fileUrl={book.fileUrl}
                      fileName={book.fileName}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
