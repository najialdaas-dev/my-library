'use client'

import Link from 'next/link'
import { LibraryBig } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0102] text-slate-400 pt-20 pb-10 mt-16 border-t border-[#2a040b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-right">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <LibraryBig className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                مكتبة المهندس ناجي الدعاس
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              كتب وشروحات تقنية في البرمجة وتطوير الويب والأمن السيبراني.
            </p>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white mb-5">تواصل معي</span>
            <div className="flex gap-4">
              <a href="https://wa.me/96775635482" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors duration-200">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>واتساب</span>
              </a>
              <a href="https://www.tiktok.com/@4k_agt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v6.19c-.03 2.03-.67 4.07-2.03 5.56-1.5 1.64-3.76 2.45-5.97 2.19-2.43-.28-4.71-1.92-5.71-4.19C1.94 15.65.98 12.8 1.73 10c.53-2.01 1.93-3.8 3.79-4.72 1.67-.84 3.63-1.01 5.43-.53v4.08c-.73-.24-1.54-.25-2.27-.03-1.12.33-2.05 1.25-2.43 2.33-.53 1.49-.07 3.24 1.1 4.29 1.09.98 2.74 1.19 3.99.5 1.03-.57 1.62-1.68 1.65-2.87V.02z" />
                </svg>
                <span>تيك توك</span>
              </a>
              <a href="https://www.instagram.com/4k_ag" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>انستغرام</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white mb-5">روابط سريعة</span>
            <div className="flex flex-col gap-3">
              <Link href="/books" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">الكتب</Link>
              <Link href="/tutorials" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">الشروحات</Link>
              <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">عن الموقع</Link>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[#2a040b] text-center text-sm">
          <p className="text-slate-400 mb-4">
            جميع الحقوق محفوظة للمهندس ناجي الدعاس &copy; {new Date().getFullYear()}
          </p>
          <div className="flex justify-center gap-4 flex-wrap mt-2">
            <a
              href="https://najialdaas.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-indigo-100 text-sm font-medium hover:bg-indigo-900/60 hover:border-indigo-400/40 hover:shadow-[0_0_20px_rgba(138,18,40,0.2)] transition-all duration-300"
            >
              <svg className="text-indigo-400 group-hover:text-indigo-300 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              لطلب الخدمات من المهندس ناجي الدعاس
            </a>
            <a
              href="https://store.najialdaas.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-indigo-100 text-sm font-medium hover:bg-indigo-900/60 hover:border-indigo-400/40 hover:shadow-[0_0_20px_rgba(138,18,40,0.2)] transition-all duration-300"
            >
              <svg className="text-indigo-400 group-hover:text-indigo-300 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
              متجر المهندس ناجي الدعاس
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

