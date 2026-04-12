'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function TMABackButton() {
  const router = useRouter()

  useEffect(() => {
    let offClick: (() => void) | undefined

    import('@tma.js/sdk').then(({ backButton }) => {
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
      }
    })

    return () => {
      offClick?.()
    }
  }, [router])

  return null
}
