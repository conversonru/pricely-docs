import Script from 'next/script'
import { TMAInit } from '@/components/tma/TMAInit'

export default function TMALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Telegram WebApp SDK — загружается до интерактивности страницы */}
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
      />
      <TMAInit />
      <div
        className="min-h-screen"
        style={{ background: 'var(--tg-theme-bg-color, #f9fafb)' }}
      >
        {children}
      </div>
    </>
  )
}
