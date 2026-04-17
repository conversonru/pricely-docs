import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Страница не найдена | Price-on',
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-100 select-none">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Страница не найдена
        </h1>
        <p className="text-gray-500 mt-3 max-w-sm mx-auto">
          Возможно, ссылка устарела или товар был удалён из каталога.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          На главную
        </Link>
      </div>
    </main>
  )
}
