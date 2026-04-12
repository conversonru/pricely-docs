/**
 * Pricely — Генератор ключей для self-hosted Supabase
 * Запуск: node infra/generate-keys.js
 *
 * Генерирует:
 *   - POSTGRES_PASSWORD
 *   - JWT_SECRET
 *   - ANON_KEY (JWT токен)
 *   - SERVICE_ROLE_KEY (JWT токен)
 *   - REALTIME_SECRET_KEY_BASE
 */

const crypto = require('crypto')

// Простой JWT без внешних зависимостей
function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function createJWT(payload, secret) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(payload))
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  return `${header}.${body}.${signature}`
}

function randomSecret(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url')
}

// ── Генерация ─────────────────────────────────────────────────────────────────
const POSTGRES_PASSWORD = randomSecret(24)
const JWT_SECRET = randomSecret(32)
const REALTIME_SECRET = randomSecret(48)

const ANON_KEY = createJWT(
  {
    role: 'anon',
    iss: 'supabase',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60), // 10 лет
  },
  JWT_SECRET
)

const SERVICE_ROLE_KEY = createJWT(
  {
    role: 'service_role',
    iss: 'supabase',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60),
  },
  JWT_SECRET
)

// ── Вывод ─────────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════')
console.log('  Pricely — Сгенерированные ключи')
console.log('  Скопируй в infra/.env')
console.log('═══════════════════════════════════════════════════════\n')

console.log(`POSTGRES_PASSWORD=${POSTGRES_PASSWORD}`)
console.log(`JWT_SECRET=${JWT_SECRET}`)
console.log(`REALTIME_SECRET_KEY_BASE=${REALTIME_SECRET}`)
console.log(`ANON_KEY=${ANON_KEY}`)
console.log(`SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}`)

console.log('\n─── Для .env.local в Next.js ────────────────────────────')
console.log(`NEXT_PUBLIC_SUPABASE_URL=http://YOUR_VPS_IP:8000`)
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}`)
console.log(`SUPABASE_SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}`)
console.log('\n⚠️  Сохрани эти ключи в безопасном месте!')
console.log('⚠️  Никогда не коммить .env в git!\n')
