'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function TMABackButton() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    let offClick: (() => void) | undefined

    import('@tma.js/sdk').then(({ backButton }) => {
      if (cancelled) return
      try {
        if (!backButton.isMounted()) {
          backButton.mount()
        }
        backButton.show()

        const handleClick = () => router.back()
        backButton.onClick(handleClick)

        offClick = () => {
          backButton.offClick(handleClick)
          backButton.hide()
        }
      } catch {
        // Вне Telegram
        console.warn('[TMA] backButton not available — not in Telegram context')
      }
    })

    return () => {
      cancelled = true
      offClick?.()
    }
  }, [router])

  return null
}
