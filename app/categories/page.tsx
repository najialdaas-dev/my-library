import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { BookOpen, Video } from 'lucide-react'

export const revalidate = 60

async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          books: true,
          tutorials: true,
        },
      },
    },
  })
  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">الأقسام</h1>
          <p className="text-indigo-200 text-sm sm:text-base">
            تصفح المحتوى حسب التخصص.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Color accent bar */}
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: cat.color }}
              />

              <div className="p-6 text-right flex-grow">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-xl mb-4"
                  style={{ backgroundColor: `${cat.color}12`, color: cat.color }}
                >
                  {cat.icon}
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-2">{cat.name}</h3>

                <p className="text-slate-500 mb-5 text-sm leading-relaxed min-h-[40px]">
                  {cat.description || 'تصفح الكتب والشروحات في هذا القسم.'}
                </p>

                {/* Counts */}
                <div className="flex gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {cat._count.books} كتاب
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" />
                    {cat._count.tutorials} شرح
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 p-4 flex gap-2 justify-end">
                <Link
                  href={`/tutorials?categoryId=${cat.slug}`}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                >
                  الشروحات
                </Link>
                <Link
                  href={`/books?categoryId=${cat.slug}`}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                >
                  الكتب
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
