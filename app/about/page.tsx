import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { BookOpen, Code2, ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-indigo-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right">
          <h1 className="text-3xl font-bold text-white mb-3">عن الموقع</h1>
          <p className="text-indigo-200 text-base max-w-lg">
            مصادر تعليمية مجانية للمبرمجين العرب.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right">
        
        {/* Founder + Mission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row-reverse gap-8 items-start">
            
            {/* Photo */}
            <div className="w-full md:w-1/3 flex flex-col items-center text-center shrink-0">
              <div className="w-36 h-36 rounded-xl overflow-hidden border-2 border-slate-100">
                <img
                  src="/images/NajiAlDaas2026.png"
                  alt="م. ناجي الدّعاس"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mt-3">م. ناجي الدّعاس</h3>
              <p className="text-indigo-600 text-xs mt-0.5">مطور برمجيات ومؤسس الموقع</p>
            </div>

            {/* Text */}
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">الهدف من الموقع</h2>
              <p className="text-slate-600 text-base leading-7 mb-4">
                بدأت هذه المكتبة كمشروع شخصي لتجميع الكتب والشروحات اللي أكتبها وأسجلها في مجالات تطوير الويب والأمن السيبراني والذكاء الاصطناعي. الهدف بسيط: أي مبرمج عربي يقدر يحصل مصادر عملية مجانية بدون تعقيد.
              </p>
              <p className="text-slate-600 text-base leading-7">
                كل الكتب متاحة للتحميل المباشر، والشروحات مربوطة بفيديوهات يوتيوب مع خطوات تطبيقية واضحة. لا اشتراكات ولا رسوم.
              </p>
            </div>
          </div>
        </div>

        {/* Two pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <BookOpen className="w-5 h-5 text-indigo-500 mb-4" />
            <h3 className="text-base font-semibold text-slate-800 mb-2">كتب قابلة للتحميل</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              أدلة مكتوبة تغطي مواضيع محددة بأمثلة عملية وكود قابل للنسخ والتطبيق.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <Code2 className="w-5 h-5 text-purple-500 mb-4" />
            <h3 className="text-base font-semibold text-slate-800 mb-2">شروحات فيديو</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              فيديوهات تشرح بناء مشاريع حقيقية من الصفر باستخدام أدوات وتقنيات حديثة.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">ابدأ التصفح</h2>
          <p className="text-indigo-200 text-sm mb-6 max-w-md mx-auto">
            اختر من الكتب أو الشروحات المتاحة وابدأ التعلم مباشرة.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/tutorials"
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              الشروحات
            </Link>
            <Link
              href="/books"
              className="bg-white text-indigo-700 hover:bg-slate-50 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-1"
            >
              الكتب
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
