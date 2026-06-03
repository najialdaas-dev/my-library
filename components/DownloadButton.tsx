'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

type DownloadButtonProps = {
  bookId: string
  fileUrl: string
  fileName: string
}

export function DownloadButton({ bookId, fileUrl, fileName }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (downloading) return

    setDownloading(true)
    try {
      await fetch('/api/analytics/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: bookId,
          resourceType: 'book',
        }),
      })

      const downloadProxyUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`
      const link = document.createElement('a')
      link.href = downloadProxyUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Download tracking failed:', err)
      window.open(fileUrl, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`w-full sm:w-auto inline-flex items-center justify-center font-medium px-8 py-3.5 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
        downloading 
          ? 'bg-slate-700 text-slate-300'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      {downloading ? (
        <>
          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
          <span>جاري التحميل...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 ml-2" />
          <span>تحميل الكتاب</span>
        </>
      )}
    </button>
  )
}
