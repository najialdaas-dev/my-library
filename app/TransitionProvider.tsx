'use client'

import React, { createContext, useContext, useState, useEffect, Suspense, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type TransitionContextType = {
  isLoading: boolean;
  message: string;
  startTransition: (message: string) => void;
  stopTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

function NavigationEvents({ stopTransition }: { stopTransition: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    stopTransition()
  }, [pathname, searchParams, stopTransition])

  return null
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const startTransition = useCallback((msg: string) => {
    setMessage(msg)
    setIsLoading(true)
  }, [])

  const stopTransition = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Listen for the "popstate" event to handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => stopTransition()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [stopTransition])

  // Removed overflow:hidden to prevent layout shifts/scroll jumping

  return (
    <TransitionContext.Provider value={{ isLoading, message, startTransition, stopTransition }}>
      {children}
      
      <Suspense fallback={null}>
        <NavigationEvents stopTransition={stopTransition} />
      </Suspense>

      {isLoading && (
        <div style={{ zIndex: 9999 }} className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-slate-100/50 max-w-sm mx-4 text-center transition-transform duration-300">
            <div className="relative flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 leading-snug">{message}</h3>
            <p className="text-sm text-slate-500 font-medium">يرجى الانتظار قليلاً...</p>
          </div>
        </div>
      )}
    </TransitionContext.Provider>
  )
}

export function useTransitionContext() {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error('useTransitionContext must be used within a TransitionProvider')
  }
  return context
}
