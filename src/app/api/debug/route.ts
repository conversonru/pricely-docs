import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  try {
    const res = await fetch(`${url}/rest/v1/clients?select=slug&slug=eq.demo`, {
      headers: { apikey: key!, Authorization: `Bearer ${key!}` },
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json()
    return NextResponse.json({ ok: true, status: res.status, data, url })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err), url })
  }
}
