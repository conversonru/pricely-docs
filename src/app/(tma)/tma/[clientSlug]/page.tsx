'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  getClientBySlugClient,
  getProductsClient,
} from '@/lib/catalog-client'
import type { Client, Product } from '@/types'

export default function TMACatalogPage() {
  const params = useParams<{ clientSlug: string }>()
  const clientSlug = params.clientSlug

  const [client, setClient] = useState<Client | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    async function load() {
      const c = await getClientBySlugClient(clientSlug)
      if (!c) { setLoading(false); return }
      const p = await getProductsClient(c.id)
      setClient(c)
      setProducts(p)
      setLoading(false)
    }
    load()
  }, [clientSlug])

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    return unique.sort()
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || p.category === category
      return matchSearch && matchCat
    })
  }, [products, search, category])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <p className="text-gray-500">Каталог не найден</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Заголовок */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--tg-theme-hint-color, #e5e7eb)' }}>
        <h1 className="text-lg font-bold" style={{ color: 'var(--tg-theme-text-color, #111827)' }}>
          {client.company_name}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
          {products.length} товаров
        </p>
      </div>

      {/* Поиск */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--tg-theme-hint-color, #e5e7eb)' }}>
        <input
          type="search"
          placeholder="Поиск по названию или артикулу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
          style={{
            background: 'var(--tg-theme-secondary-bg-color, #f9fafb)',
            borderColor: 'var(--tg-theme-hint-color, #e5e7eb)',
            color: 'var(--tg-theme-text-color, #111827)',
          }}
        />
      </div>

      {/* Фильтры категорий */}
      {categories.length > 0 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-b" style={{ borderColor: 'var(--tg-theme-hint-color, #e5e7eb)' }}>
          <button
            onClick={() => setCategory('all')}
            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors"
            style={
              category === 'all'
                ? { background: 'var(--tg-theme-button-color, #3b82f6)', color: 'var(--tg-theme-button-text-color, #fff)' }
                : { background: 'var(--tg-theme-secondary-bg-color, #f3f4f6)', color: 'var(--tg-theme-text-color, #374151)' }
            }
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={
                category === cat
                  ? { background: 'var(--tg-theme-button-color, #3b82f6)', color: 'var(--tg-theme-button-text-color, #fff)' }
                  : { background: 'var(--tg-theme-secondary-bg-color, #f3f4f6)', color: 'var(--tg-theme-text-color, #374151)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Список товаров */}
      <div className="flex-1 px-4 py-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--tg-theme-hint-color, #9ca3af)' }}>
            <p>Ничего не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/tma/${clientSlug}/${product.slug}`}
                className="flex flex-col rounded-xl overflow-hidden border active:opacity-70 transition-opacity"
                style={{
                  background: 'var(--tg-theme-secondary-bg-color, #fff)',
                  borderColor: 'var(--tg-theme-hint-color, #e5e7eb)',
                }}
              >
                {/* Изображение */}
                <div className="relative aspect-square bg-gray-100">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--tg-theme-hint-color, #9ca3af)' }}>
                      Нет фото
                    </div>
                  )}
                </div>

                {/* Информация */}
                <div className="p-2 flex flex-col gap-1">
                  <p className="text-xs" style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
                    Арт. {product.sku}
                  </p>
                  <p className="text-xs font-medium leading-tight line-clamp-2" style={{ color: 'var(--tg-theme-text-color, #111827)' }}>
                    {product.name}
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: 'var(--tg-theme-text-color, #111827)' }}>
                    {product.price.toLocaleString('ru-RU')} ₽
                    <span className="text-xs font-normal ml-1" style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
                      /{product.unit}
                    </span>
                  </p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full self-start font-medium"
                    style={
                      product.stock === 'В наличии'
                        ? { background: '#dcfce7', color: '#166534' }
                        : product.stock === 'Под заказ'
                        ? { background: '#fef9c3', color: '#854d0e' }
                        : { background: '#fee2e2', color: '#991b1b' }
                    }
                  >
                    {product.stock}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
