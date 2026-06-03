import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { ArrowRight, Clock, Eye, Calendar, User, Film } from 'lucide-react'
import { ViewTracker } from '@/components/ViewTracker'
import { ScrollToTop } from '@/components/ScrollToTop'

export const revalidate = 60

async function getTutorial(slug: string) {
  const decodedSlug = decodeURIComponent(slug)
  const tutorial = await prisma.tutorial.findUnique({
    where: { slug: decodedSlug },
    include: { category: true },
  })
  return tutorial
}

export default async function TutorialDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const tutorial = await getTutorial(resolvedParams.slug)

  if (!tutorial) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />
      <ViewTracker id={tutorial.id} type="tutorial" />
      <ScrollToTop />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-purple-600 text-sm font-medium transition-colors"
          >
            العودة للشروحات
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {/* Video or Thumbnail */}
          {tutorial.videoId ? (
            <div className="relative aspect-video w-full bg-slate-900">
              <iframe
                src={`https://www.youtube.com/embed/${tutorial.videoId}`}
                title={tutorial.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : tutorial.videoUrl ? (
            <div className="relative aspect-video w-full bg-slate-900">
              <video
                src={tutorial.videoUrl}
                controls
                controlsList="nodownload"
                className="absolute inset-0 w-full h-full object-cover"
                poster={tutorial.thumbnail || undefined}
              />
            </div>
          ) : tutorial.thumbnail ? (
            <div className="relative aspect-video w-full bg-slate-50/50 overflow-hidden border-b border-slate-100">
              <Image
                src={tutorial.thumbnail}
                alt={tutorial.title}
                fill
                sizes="(max-width: 1000px) 100vw, 1000px"
                className="object-contain"
              />
            </div>
          ) : null}

          {/* Content */}
          <div className="p-6 sm:p-10 text-right">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 justify-end items-center mb-4">
              {tutorial.tags.map((tag) => (
                <span key={tag} className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded text-xs font-medium">
                  {tag}
                </span>
              ))}
              <span
                className="px-2.5 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: tutorial.category.color }}
              >
                {tutorial.category.icon} {tutorial.category.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 leading-tight">
              {tutorial.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 justify-end items-center text-xs text-slate-400 border-b border-slate-100 pb-5 mb-6">
              
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {tutorial.viewCount + 1} مشاهدة
              </span>
              
              {tutorial.estimatedTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {tutorial.estimatedTime} دقيقة
                </span>
              )}

              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(tutorial.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>

              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {tutorial.author || 'م. ناجي الدّعاس'}
              </span>
            </div>

            {/* Article body */}
            <div className="text-slate-600 text-base leading-8 space-y-4">
              {tutorial.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                return (
                  <p key={index}>
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* External video link */}
            {tutorial.videoUrl && !tutorial.videoId && (
              <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-right">
                <div className="flex items-center gap-2.5 flex-row-reverse">
                  <Film className="w-5 h-5 text-purple-500" />
                  <div>
                    <span className="font-medium text-slate-700 block text-sm">فيديو مرفق</span>
                    <span className="text-xs text-slate-400">شاهد الفيديو على يوتيوب</span>
                  </div>
                </div>
                
                <a
                  href={tutorial.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  مشاهدة الفيديو
                </a>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
