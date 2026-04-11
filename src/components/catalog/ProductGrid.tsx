'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  clientSlug: string
}

export function ProductGrid({ products, clientSlug }: ProductGridProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

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
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        Показано {filtered.length} из {products.length} товаров
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Ничего не найдено</p>
          <p className="text-sm mt-1">Попробуйте изменить запрос или фильтр</p>
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
