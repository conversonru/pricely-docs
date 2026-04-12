'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import {
  getClientBySlugClient,
  getProductBySlugClient,
} from '@/lib/catalog-client'
import { TMABackButton } from '@/components/tma/TMABackButton'
import { TMAOrderButton } from '@/components/tma/TMAOrderButton'
import type { Client, Product } from '@/types'

export default function TMAProductPage() {
  const params = useParams<{ clientSlug: string; productSlug: string }>()
  const { clientSlug, productSlug } = params

  const [client, setClient] = useState<Client | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const c = await getClientBySlugClient(clientSlug)
      if (!c) { setLoading(false); return }
      const p = await getProductBySlugClient(c.id, productSlug)
      setClient(c)
      setProduct(p)
      setLoading(false)
    }
    load()
  }, [clientSlug, productSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!client || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <p style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>Товар не найден</p>
      </div>
    )
  }

  const stockStyle =
    product.stock === 'В наличии'
      ? { color: '#16a34a' }
      : product.stock === 'Под заказ'
      ? { color: '#ca8a04' }
      : { color: '#dc2626' }

  return (
    <>
      {/* Нативная кнопка "Назад" в шапке Telegram */}
      <TMABackButton />

      <div className="flex flex-col min-h-screen pb-6">
        {/* Фото */}
        <div className="relative w-full aspect-square bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #9ca3af)' }}
            >
              Нет фото
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="flex flex-col gap-4 px-4 pt-4">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
              Арт. {product.sku} · {product.category}
            </p>
            <h1
              className="text-xl font-bold leading-tight"
              style={{ color: 'var(--tg-theme-text-color, #111827)' }}
            >
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color: 'var(--tg-theme-text-color, #111827)' }}>
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
            <span style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
              / {product.unit}
            </span>
          </div>

          <p className="font-medium text-sm" style={stockStyle}>
            {product.stock}
          </p>

          {/* Кнопки заказа */}
          <TMAOrderButton client={client} product={product} />

          {/* Описание */}
          {product.description && (
            <div
              className="border-t pt-4"
              style={{ borderColor: 'var(--tg-theme-hint-color, #e5e7eb)' }}
            >
              <h2
                className="font-semibold mb-2 text-sm"
                style={{ color: 'var(--tg-theme-text-color, #111827)' }}
              >
                Описание
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--tg-theme-hint-color, #374151)' }}
              >
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
