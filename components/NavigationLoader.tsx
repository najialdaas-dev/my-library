'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface LoaderState {
  type: 'book' | 'tutorial'
  title: string
}

interface NavigationLoaderContextProps {
  startLoading: (type: 'book' | 'tutorial', title: string) => void
  stopLoading: () => void
}

const NavigationLoaderContext = createContext<NavigationLoaderContextProps | undefined>(undefined)

export function NavigationLoaderProvider({ children }: { children: React.ReactNode }) {
  const [loader, setLoader] = useState<LoaderState | null>(null)
  const pathname = usePathname()

  // إخفاء شاشة التحميل تلقائياً بمجرد تغير المسار (وصول المستخدم للصفحة الجديدة)
  useEffect(() => {
    setLoader(null)
  }, [pathname])

  const startLoading = (type: 'book' | 'tutorial', title: string) => {
    setLoader({ type, title })
  }

  const stopLoading = () => {
    setLoader(null)
  }

  return (
    <NavigationLoaderContext.Provider value={{ startLoading, stopLoading }}>
      {children}
      
      {/* شاشة التحميل الاحترافية والشفافة */}
      {loader && (
        <div className="fixed inset-0 z-[99999999] flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md text-white select-none transition-all duration-300">
          {/* كارد التحميل المضيء */}
          <div className="bg-slate-900/90 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 flex flex-col items-center max-w-sm mx-4 text-center animate-pulse">
            
            {/* الأيقونة الدائرية المتحركة */}
            <div className="relative mb-6">
              <div className={`absolute inset-0 rounded-full ${
                loader.type === 'book' ? 'bg-indigo-500/30' : 'bg-purple-500/30'
              } blur-xl scale-125`} />
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative ${
                loader.type === 'book' ? 'bg-indigo-600' : 'bg-purple-600'
              }`}>
                {/* Spinner inside */}
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            </div>

            {/* نصوص الحالة */}
            <h2 className="text-lg font-bold text-white mb-2 tracking-wide">
              {loader.type === 'book' ? 'جاري فتح الكتاب...' : 'جاري فتح الشرح...'}
            </h2>
            
            <p className="text-sm text-slate-400 font-medium line-clamp-2 px-2 mt-1 leading-relaxed">
              {loader.title}
            </p>
            
            <span className="text-[10px] text-slate-500 mt-4 uppercase tracking-wider">
              يرجى الانتظار قليلاً
            </span>
          </div>
        </div>
      )}
    </NavigationLoaderContext.Provider>
  )
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext)
  if (!context) {
    throw new Error('useNavigationLoader must be used within a NavigationLoaderProvider')
  }
  return context
}
