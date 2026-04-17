import { createHmac, timingSafeEqual } from 'crypto'
import type { Tariff } from '@/types/index'
import { TARIFF_PRICES } from '@/types/index'

/**
 * Verifies Prodamus HMAC-SHA256 signature.
 * Algorithm: sort all fields (excluding 'sign') by key → join as key=value&...
 * → HMAC-SHA256 → compare with payload.sign
 */
export function verifySign(payload: Record<string, string>, secret: string): boolean {
  const { sign, ...rest } = payload
  if (!sign) return false

  const message = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join('&')

  const expected = createHmac('sha256', secret).update(message).digest('hex')

  // Constant-time comparison to prevent timing attacks
  try {
    return timingSafeEqual(Buffer.from(sign, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    // Buffer lengths differ → invalid hex in sign
    return false
  }
}

/** Resolves tariff by payment amount. Returns null if amount doesn't match any plan. */
export function parseTariff(sum: number): Tariff | null {
  // Cast needed: TypeScript widens Object.entries to [string, number][], but keys are Tariff
  const entry = (Object.entries(TARIFF_PRICES) as [Tariff, number][]).find(
    ([, price]) => price === sum
  )
  return entry ? entry[0] : null
}
