'use client'

import { useEffect } from 'react'

export function TMAInit() {
  useEffect(() => {
    let isMounted = true

    async function initTMA() {
      try {
        const sdk = await import('@tma.js/sdk')
        if (!isMounted) return

        sdk.init()

        if (sdk.miniApp.isSupported() && !sdk.miniApp.isMounted()) {
          sdk.miniApp.mount()
        }

        if (!sdk.themeParams.isMounted()) {
          try {
            sdk.themeParams.mount()
            sdk.themeParams.bindCssVars()
          } catch { /* themeParams not available */ }
        }

        if (!sdk.viewport.isMounted()) {
          try {
            await sdk.viewport.mount()
            if (isMounted) {
              sdk.viewport.expand()
              sdk.viewport.bindCssVars()
            }
          } catch { /* viewport not available */ }
        }
      } catch (err) {
        console.warn('[TMA] Not in Telegram WebApp context — running in browser mode', err)
      }
    }

    initTMA()

    return () => {
      isMounted = false
      import('@tma.js/sdk').then((sdk) => {
        try {
          if (sdk.themeParams.isMounted()) sdk.themeParams.unmount()
          if (sdk.miniApp.isMounted()) sdk.miniApp.unmount()
        } catch { /* ignore cleanup errors */ }
      }).catch(() => { /* ignore if sdk not loaded */ })
    }
  }, [])

  return null
}
