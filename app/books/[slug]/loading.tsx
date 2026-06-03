import { Navbar } from '@/components/Navbar'

export default function BookDetailsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button Placeholder */}
        <div className="mb-6">
          <div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse ml-auto" />
        </div>

        {/* Book Detail Card Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-10">
            
            {/* Cover Skeleton */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative w-56 h-80 rounded-xl bg-slate-100/80 overflow-hidden border border-slate-200 flex items-center justify-center animate-pulse">
                {/* Shimmer gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>

            {/* Details Skeleton */}
            <div className="md:col-span-2 flex flex-col justify-between text-right">
              <div>
                {/* Category & Tags Shimmer */}
                <div className="flex flex-wrap gap-1.5 justify-end mb-6">
                  <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
                </div>

                {/* Title Shimmer */}
                <div className="h-8 w-3/4 bg-slate-200 rounded-lg animate-pulse mb-4 ml-auto" />
                
                {/* Author Shimmer */}
                <div className="h-4 w-1/3 bg-slate-200 rounded-md animate-pulse mb-6 ml-auto" />

                {/* Description Shimmer */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6 space-y-2.5">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto" />
                  <div className="h-3 w-full bg-slate-200/80 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-slate-200/80 rounded animate-pulse ml-auto" />
                  <div className="h-3 w-4/6 bg-slate-200/80 rounded animate-pulse ml-auto" />
                </div>
              </div>

              <div>
                {/* Specs Shimmer */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3 flex flex-col items-center gap-1.5">
                      <div className="h-3 w-10 bg-slate-200 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Stats + Buttons Shimmer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-5">
                  <div className="flex gap-4">
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="h-11 w-full sm:w-32 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-11 w-full sm:w-36 bg-slate-200 rounded-lg animate-pulse" />
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
