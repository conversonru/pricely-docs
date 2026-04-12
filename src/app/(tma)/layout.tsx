import Script from 'next/script'
import { TMAInit } from '@/components/tma/TMAInit'

export default function TMALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Telegram WebApp SDK — обязательно для работы Mini App */}
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
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
