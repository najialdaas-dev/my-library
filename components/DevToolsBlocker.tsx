'use client'

import { useEffect } from 'react'

export function DevToolsBlocker() {
  useEffect(() => {
    // تعطيل الحماية في وضع التطوير المحلي حتى يتمكن المهندس من برمجة واختبار الموقع بسهولة
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    const blockMsg = `
      <div style="
        position: fixed;
        inset: 0;
        z-index: 99999999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #090203;
        color: #f8fafc;
        font-family: system-ui, -apple-system, sans-serif;
        direction: rtl;
        padding: 20px;
        text-align: center;
        user-select: none;
      ">
        <div style="
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 16px;
          border-radius: 50%;
          margin-bottom: 24px;
          border: 2px solid #ef4444;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: bold;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
        ">⚠️</div>
        <h1 style="font-size: 26px; font-weight: bold; margin-bottom: 12px; color: #f8fafc;">عذراً، تم حظر تصفح الموقع لدواعي أمنية</h1>
        <p style="font-size: 16px; color: #94a3b8; max-width: 480px; line-height: 1.8; margin-bottom: 20px;">
          تم اكتشاف محاولة فتح أدوات المطورين (DevTools) أو فحص العناصر (Inspect Element). لحماية البيانات والكود من السرقة، تم إيقاف الموقع.
        </p>
        <p style="font-size: 14px; color: #ef4444; font-weight: 500;">
          يرجى إغلاق نافذة الفحص وإعادة تحميل الصفحة لتتمكن من التصفح بأمان.
        </p>
      </div>
    `

    const triggerBlock = () => {
      try {
        document.body.innerHTML = blockMsg
        document.body.style.pointerEvents = 'none'
        document.body.style.overflow = 'hidden'
      } catch (err) {
        console.error('Security action failed:', err)
      }
    }

    // 1. حظر اختصارات لوحة المفاتيح الشائعة لفتح أدوات المطورين وعرض السورس كود
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) ||
        (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j' || e.key === 'c' || e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
        (e.metaKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))
      ) {
        e.preventDefault()
        return false
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // 2. حظر القائمة التي تظهر عند الضغط بالزر الأيمن للفأرة (Right-Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    window.addEventListener('contextmenu', handleContextMenu)

    // 3. كشف أدوات المطورين الجانبية أو السفلية (المثبتة بالمتصفح) عبر فحص تغييرات المقاسات
    const threshold = 160
    const checkSize = () => {
      const widthDev = window.outerWidth - window.innerWidth > threshold
      const heightDev = window.outerHeight - window.innerHeight > threshold
      if (widthDev || heightDev) {
        triggerBlock()
      }
    }
    window.addEventListener('resize', checkSize)
    // تشغيل الفحص فوراً عند التحميل
    checkSize()

    // 4. كشف أدوات المطورين المنفصلة عبر استخدام جملة Debugger وقياس فارق الوقت
    const detectDevTools = () => {
      const start = performance.now()
      debugger
      const end = performance.now()
      if (end - start > 100) {
        triggerBlock()
      }
    }
    
    const interval = setInterval(detectDevTools, 1000)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('resize', checkSize)
      clearInterval(interval)
    }
  }, [])

  return null
}
