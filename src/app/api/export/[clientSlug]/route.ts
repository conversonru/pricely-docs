import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getClientBySlug, getProducts } from '@/lib/catalog'

interface RouteParams {
  params: Promise<{ clientSlug: string }>
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { clientSlug } = await params

  const client = await getClientBySlug(clientSlug)
  if (!client) {
    return NextResponse.json({ error: 'Клиент не найден' }, { status: 404 })
  }

  const products = await getProducts(client.id)
  if (products.length === 0) {
    return NextResponse.json({ error: 'Товары не найдены' }, { status: 404 })
  }

  // Формируем строки таблицы
  const rows = products.map((p) => ({
    'Артикул': p.sku,
    'Наименование': p.name,
    'Категория': p.category,
    'Цена (₽)': p.price,
    'Ед. изм.': p.unit,
    'Наличие': p.stock,
    'Описание': p.description ?? '',
  }))

  // Создаём книгу Excel
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)

  // Ширина колонок
  ws['!cols'] = [
    { wch: 14 },  // Артикул
    { wch: 40 },  // Наименование
    { wch: 20 },  // Категория
    { wch: 12 },  // Цена
    { wch: 8 },   // Ед. изм.
    { wch: 14 },  // Наличие
    { wch: 40 },  // Описание
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Прайс-лист')

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const filename = `prajs-${clientSlug}.xlsx`

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Cache-Control': 'no-store',
    },
  })
}
