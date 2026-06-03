import { Navbar } from '@/components/Navbar'

export default function TutorialDetailsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <div className="mb-6">
          <div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse ml-auto" />
        </div>

        <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Video Placeholder (Aspect-video) */}
          <div className="relative aspect-video w-full bg-slate-100 flex items-center justify-center animate-pulse border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-slate-200/80 flex items-center justify-center">
              <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-slate-300 translate-x-[2px]" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6 sm:p-10 text-right">
            {/* Category & Tags Shimmer */}
            <div className="flex flex-wrap gap-1.5 justify-end mb-5">
              <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
            </div>

            {/* Title Shimmer */}
            <div className="h-8 w-5/6 bg-slate-200 rounded-lg animate-pulse mb-6 ml-auto" />

            {/* Meta Row Shimmer */}
            <div className="flex flex-wrap gap-4 justify-end items-center border-b border-slate-100 pb-5 mb-6">
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            </div>

            {/* Paragraphs Shimmer */}
            <div className="space-y-4">
              <div className="h-4 w-full bg-slate-200/80 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-200/80 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-slate-200/80 rounded animate-pulse ml-auto" />
              <div className="h-4 w-9/12 bg-slate-200/80 rounded animate-pulse ml-auto" />
              <div className="h-4 w-10/12 bg-slate-200/80 rounded animate-pulse ml-auto" />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
