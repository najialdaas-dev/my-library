'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function TransitionOverlay() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleTransition = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>
      setMessage(customEvent.detail.message)
      setLoading(true)
    }

    window.addEventListener('page-transition', handleTransition)
    return () => {
      window.removeEventListener('page-transition', handleTransition)
    }
  }, [])

  // إخفاء شاشة الانتقال بمجرد تغيير المسار (اكتمال تحميل الصفحة الجديدة)
  useEffect(() => {
    setLoading(false)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[99999999] flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-md text-white p-6 animate-fade-in">
      <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4">
        {/* توهج جمالي خلفي */}
        <div className="absolute -z-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* مؤشر التحميل الدوار */}
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        
        <div className="space-y-2" dir="rtl">
          <p className="text-slate-100 font-bold text-base leading-relaxed">{message}</p>
          <p className="text-slate-400 text-xs">جاري تحضير المحتوى، يرجى الانتظار...</p>
        </div>
      </div>
    </div>
  )
}
