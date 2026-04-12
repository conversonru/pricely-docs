'use client'

import { useEffect } from 'react'

export function TMAInit() {
  useEffect(() => {
    async function initTMA() {
      try {
        const sdk = await import('@tma.js/sdk')
        sdk.init()

        if (sdk.miniApp.isSupported()) {
          sdk.miniApp.mount()
        }

        if (sdk.themeParams.isSupported()) {
          sdk.themeParams.mount()
          sdk.themeParams.bindCssVars()
        }

        if (sdk.viewport.isSupported()) {
          await sdk.viewport.mount()
          sdk.viewport.expand()
          sdk.viewport.bindCssVars()
        }
      } catch {
        // Вне Telegram — нормально для dev в браузере
        console.warn('[TMA] Not in Telegram WebApp context — running in browser mode')
      }
    }

    initTMA()
  }, [])

  return null
}
