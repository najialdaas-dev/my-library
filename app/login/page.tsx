'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Extract the secret path segment dynamically from window location path
  // E.g., /naji-secret-route/login -> naji-secret-route
  const getSecretPath = () => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/')
      return parts[1] || 'admin-naji'
    }
    return 'admin-naji'
  }
  
  const secretPath = getSecretPath()
  const redirect = searchParams.get('redirect') || `/${secretPath}/dashboard`

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'كلمة السر غير صحيحة، حاول مرة أخرى.')
        setLoading(false)
        return
      }

      // Redirect to dashboard
      router.push(redirect)
      router.refresh()
    } catch {
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-indigo-950"
      dir="rtl"
    >
      {/* Background image watermark */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-luminosity pointer-events-none z-0"
        style={{ backgroundImage: "url('/images/NajiAlDaas2026.png')" }}
      ></div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-indigo-950/90 to-black/95 z-0"></div>

      {/* Glowing orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/40 overflow-hidden">
          {/* Card Header */}
          <div className="px-10 pt-10 pb-8 text-center border-b border-white/10">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs font-black mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>منطقة المشرف الخاص</span>
            </div>

            <h1 className="text-2xl font-black text-white mb-2">
              تسجيل دخول لوحة التحكم
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              هذه المنطقة محمية وخاصة بمشرف المنصة فقط.
              <br />
              أدخل كلمة السر للمتابعة.
            </p>
          </div>

          {/* Card Body */}
          <div className="px-10 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl px-4 py-3 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-black text-slate-300 mb-2.5">
                  كلمة السر السرية
                </label>
                <div className="relative">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة السر هنا..."
                    required
                    autoFocus
                    className="w-full text-right pr-12 pl-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 text-sm font-medium transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>جاري التحقق...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>دخول لوحة التحكم</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="px-10 pb-8 text-center">
            <p className="text-slate-600 text-xs">
              🔒 هذه الصفحة غير مرئية للزوار العاديين
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
          >
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-indigo-950">
        <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
