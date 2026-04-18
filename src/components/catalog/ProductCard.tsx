import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  clientSlug: string
  managerToken?: string
}

export function ProductCard({ product, clientSlug, managerToken }: ProductCardProps) {
  const stockColor =
    product.stock === 'В наличии'
      ? 'bg-green-100 text-green-800'
      : product.stock === 'Под заказ'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800'

  return (
    <Link href={`/catalog/${clientSlug}/${product.slug}${managerToken ? `?m=${managerToken}` : ''}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 flex flex-col gap-3">
          {product.image_url ? (
            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          ) : (
            <div className="w-full aspect-square rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Нет фото
            </div>
          )}

          <div className="flex flex-col gap-1 flex-1">
            <p className="text-xs text-gray-500">Арт. {product.sku}</p>
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-base">
              {product.price.toLocaleString('ru-RU')} ₽
              <span className="text-xs font-normal text-gray-500 ml-1">
                / {product.unit}
              </span>
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockColor}`}>
              {product.stock}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
