'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
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
  const [visible, setVisible] = useState(false)
  const [topBarWidth, setTopBarWidth] = useState(0)
  const pathname = usePathname()
  const delayTimer = useRef<NodeJS.Timeout | null>(null)
  const topBarIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // عند تغير المسار (اكتمال الانتقال)، نقوم بإتمام التحميل وتأثير التلاشي التدريجي
  useEffect(() => {
    if (delayTimer.current) {
      clearTimeout(delayTimer.current)
    }
    if (topBarIntervalRef.current) {
      clearInterval(topBarIntervalRef.current)
    }

    // إيصال شريط التحميل لـ 100% فوراً
    setTopBarWidth(100)
    
    // تلاشي تدريجي مريح وناعم
    const fadeTimer = setTimeout(() => {
      setVisible(false)
      setTopBarWidth(0)
      setLoader(null)
    }, 250)

    return () => {
      clearTimeout(fadeTimer)
    }
  }, [pathname])

  const startLoading = (type: 'book' | 'tutorial', title: string) => {
    // تنظيف المؤقتات السابقة
    if (delayTimer.current) clearTimeout(delayTimer.current)
    if (topBarIntervalRef.current) clearInterval(topBarIntervalRef.current)

    setLoader({ type, title })
    setVisible(false)
    setTopBarWidth(15)

    // حركة شريط التحميل العلوي القياسي
    topBarIntervalRef.current = setInterval(() => {
      setTopBarWidth(prev => {
        if (prev >= 90) {
          if (topBarIntervalRef.current) clearInterval(topBarIntervalRef.current)
          return prev
        }
        // يتقدم بنسب متفاوتة ليعطي انطباعاً حركياً طبيعياً
        const increment = prev < 50 ? 8 : prev < 75 ? 4 : 1
        return prev + increment
      })
    }, 180)

    // تأخير عرض الكارت العائم بمقدار 180ms لمنع "وميض التحميل الفلاشي" إذا فتحت الصفحة بسرعة البرق
    delayTimer.current = setTimeout(() => {
      setVisible(true)
    }, 180)
  }

  const stopLoading = () => {
    if (delayTimer.current) clearTimeout(delayTimer.current)
    if (topBarIntervalRef.current) clearInterval(topBarIntervalRef.current)
    setVisible(false)
    setTopBarWidth(0)
    setLoader(null)
  }

  return (
    <NavigationLoaderContext.Provider value={{ startLoading, stopLoading }}>
      {children}
      
      {/* 1. شريط التحميل المضيء أعلى الصفحة (NProgress Style) */}
      {topBarWidth > 0 && (
        <div 
          className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[99999999] shadow-[0_0_12px_rgba(99,102,241,0.6)] transition-all duration-300 ease-out"
          style={{ width: `${topBarWidth}%` }}
        />
      )}

      {/* 2. الكرت العائم الاحترافي والغير حاجب للشاشة (Toast Notification Style) */}
      {loader && (
        <div 
          className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:bottom-8 z-[99999998] flex justify-center md:justify-end pointer-events-none select-none transition-all duration-300 ease-out ${
            visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          }`}
        >
          {/* حاوية الكارت */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl p-4 rounded-2xl flex items-center gap-3.5 max-w-sm w-full md:w-[280px] text-right pointer-events-auto">
            
            {/* مؤشر التحميل الدائري داخل أيقونة ملونة */}
            <div className="flex-shrink-0 relative">
              <div className={`absolute inset-0 rounded-full ${
                loader.type === 'book' ? 'bg-indigo-500/20' : 'bg-purple-500/20'
              } blur-md scale-125`} />
              
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                loader.type === 'book' ? 'bg-indigo-600' : 'bg-purple-600'
              }`}>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            </div>

            {/* تفاصيل النص */}
            <div className="flex-grow min-w-0">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                {loader.type === 'book' ? 'جاري الانتقال للكتاب...' : 'جاري فتح الشرح...'}
              </span>
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                {loader.title}
              </p>
            </div>

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
