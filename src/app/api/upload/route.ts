// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadProducts } from '@/lib/upload-service'
import type { UploadPayload } from '@/types/upload'

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Проверить авторизацию
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const expectedSecret = process.env.UPLOAD_SECRET

  if (!expectedSecret) {
    console.error('[upload] UPLOAD_SECRET is not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  if (!token || token !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Распарсить тело запроса
  let payload: UploadPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 3. Базовая валидация структуры
  if (!payload.client_slug || typeof payload.client_slug !== 'string') {
    return NextResponse.json({ error: 'Missing client_slug' }, { status: 400 })
  }

  if (!Array.isArray(payload.products) || payload.products.length === 0) {
    return NextResponse.json({ error: 'products must be a non-empty array' }, { status: 400 })
  }

  // 4. Загрузить товары
  try {
    const result = await uploadProducts(payload)

    const status = result.failed === 0 ? 200 : result.imported === 0 ? 422 : 207
    return NextResponse.json(result, { status })
  } catch (err) {
    console.error('[upload] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Отклонить все остальные методы
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
