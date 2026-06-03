'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  id: string
  type: 'book' | 'tutorial'
}

export function ViewTracker({ id, type }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        const endpoint = type === 'book' ? '/api/books/view' : '/api/tutorials/view'
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }

    // Wait 1 second before incrementing views to filter out brief bounces and bots
    const timer = setTimeout(trackView, 1000)
    return () => clearTimeout(timer)
  }, [id, type])

  return null
}
