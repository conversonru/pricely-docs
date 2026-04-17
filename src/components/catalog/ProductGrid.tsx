'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { ProductCard } from './ProductCard'
import { slugify } from '@/lib/slugify'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  clientSlug: string
  categories: string[]
  activeCategory?: string   // передаётся с SSR-страницы категории
}

export function ProductGrid({ products, clientSlug, categories, activeCategory }: ProductGridProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (search === '') return products
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    )
  }, [products, search])

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Поиск по названию или артикулу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm bg-white"
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/catalog/${clientSlug}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            Все
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/catalog/${clientSlug}/category/${slugify(cat)}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        {search
          ? `Найдено ${filtered.length} из ${products.length} товаров`
          : `${products.length} товаров${activeCategory ? ` · ${activeCategory}` : ''}`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Ничего не найдено</p>
          <p className="text-sm mt-1">Попробуйте изменить запрос</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} clientSlug={clientSlug} />
          ))}
        </div>
      )}
    </div>
  )
}
