import { describe, it, expect } from 'vitest'
import { createHmac } from 'crypto'
import { verifySign, parseTariff } from '../prodamus'

// Helper: build a valid signature for a payload
function buildSign(payload: Record<string, string>, secret: string): string {
  const sorted = Object.keys(payload)
    .filter((k) => k !== 'sign')
    .sort()
    .map((k) => `${k}=${payload[k]}`)
    .join('&')
  return createHmac('sha256', secret).update(sorted).digest('hex')
}

const SECRET = 'test-secret'

describe('verifySign', () => {
  it('returns true for a valid signature', () => {
    const payload = { order_num: 'demo', sum: '1490', payment_status: 'success' }
    const sign = buildSign(payload, SECRET)
    expect(verifySign({ ...payload, sign }, SECRET)).toBe(true)
  })

  it('returns false when signature does not match', () => {
    const payload = { order_num: 'demo', sum: '1490', payment_status: 'success', sign: 'bad' }
    expect(verifySign(payload, SECRET)).toBe(false)
  })

  it('returns false when sign field is missing', () => {
    const payload = { order_num: 'demo', sum: '1490', payment_status: 'success' }
    expect(verifySign(payload, SECRET)).toBe(false)
  })

  it('sign field is excluded from HMAC computation', () => {
    // same payload with different extra field order should still verify
    const base = { order_num: 'demo', sum: '990', payment_status: 'success' }
    const sign = buildSign(base, SECRET)
    expect(verifySign({ payment_status: 'success', sign, sum: '990', order_num: 'demo' }, SECRET)).toBe(true)
  })
})

describe('parseTariff', () => {
  it('maps 990 → telegram', () => {
    expect(parseTariff(990)).toBe('telegram')
  })

  it('maps 1490 → business', () => {
    expect(parseTariff(1490)).toBe('business')
  })

  it('maps 2490 → pro', () => {
    expect(parseTariff(2490)).toBe('pro')
  })

  it('returns null for unknown amount', () => {
    expect(parseTariff(0)).toBeNull()
    expect(parseTariff(1000)).toBeNull()
    expect(parseTariff(-1)).toBeNull()
  })
})
