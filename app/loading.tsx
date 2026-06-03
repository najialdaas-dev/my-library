import { Navbar } from '@/components/Navbar'

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 flex flex-col">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4">
        {/* Animated Glowing Library Icon */}
        <div className="relative mb-6">
          {/* Glowing Ring */}
          <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl scale-125 animate-pulse" />
          
          <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white"
            >
              <path d="m16 6 4 14" />
              <path d="M12 6v14" />
              <path d="M8 8v12" />
              <path d="M4 4v16" />
            </svg>
          </div>
        </div>

        {/* Text and small spinner */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg font-bold text-slate-700 tracking-wide">جاري تحميل الصفحة...</p>
          <p className="text-xs text-slate-400">يرجى الانتظار قليلاً</p>
          
          {/* Shimmering bar */}
          <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden mt-2">
            <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-[shimmer_1.5s_infinite] origin-left" 
                 style={{
                   animation: 'loadingProgress 1.8s ease-in-out infinite'
                 }}
            />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loadingProgress {
          0% {
            transform: translateX(-100%) scaleX(0.5);
          }
          50% {
            transform: translateX(0%) scaleX(1.2);
          }
          100% {
            transform: translateX(100%) scaleX(0.5);
          }
        }
      `}} />
    </div>
  )
}
