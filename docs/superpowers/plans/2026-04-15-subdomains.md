# День 6 — Поддомены Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Каждый клиент получает поддомен `demo.price-on.ru`, который открывает его SEO-каталог через Nginx proxy → Next.js middleware rewrite.

**Architecture:** DNS wildcard `*.price-on.ru` → VPS (72.56.5.159) → Nginx добавляет заголовок `X-Client-Slug` и проксирует на Vercel → Next.js middleware переписывает путь на `/catalog/{slug}`.

**Tech Stack:** Next.js 16 middleware (Edge Runtime), Nginx, Certbot (Let's Encrypt wildcard), Cloudflare DNS (для авторенью SSL)

---

## Файловая структура

| Файл | Действие | Назначение |
|---|---|---|
| `middleware.ts` | Создать | Читает `x-client-slug`, делает rewrite на `/catalog/{slug}` |
| `/etc/nginx/sites-available/priceon-subdomains` | Создать на VPS | Wildcard proxy с заголовком X-Client-Slug |
| `.env.local` | Изменить | Добавить `NEXT_PUBLIC_APP_DOMAIN=price-on.ru` |

---

## Task 1: Купить домен и настроить DNS через Cloudflare

> Ручные шаги. Cloudflare нужен для автоматического авторенью wildcard SSL.

**Files:**
- Нет файлов

- [ ] **Step 1: Купить домен**

Зайди на любой регистратор (reg.ru, nic.ru, 2domains.ru) и купи `price-on.ru`.

- [ ] **Step 2: Создать аккаунт Cloudflare**

Зайди на https://cloudflare.com → Sign up (бесплатно).

- [ ] **Step 3: Добавить домен в Cloudflare**

В Cloudflare → Add a Site → введи `price-on.ru` → выбери Free план → Continue.

Cloudflare покажет два NS-сервера, например:
```
aria.ns.cloudflare.com
brad.ns.cloudflare.com
```

- [ ] **Step 4: Поменять NS у регистратора**

Зайди в панель регистратора → управление доменом `price-on.ru` → смени nameservers на те, что показал Cloudflare. Ждёт распространения до 24 часов (обычно 15-30 минут).

- [ ] **Step 5: Добавить DNS записи в Cloudflare**

В Cloudflare → DNS → Add record:

```
Тип: A
Имя: *
Значение: 72.56.5.159
Проксирование: OFF (серая иконка, не оранжевая!)
TTL: Auto
```

```
Тип: A
Имя: @
Значение: 72.56.5.159
Проксирование: OFF
TTL: Auto
```

> ⚠️ Проксирование ДОЛЖНО быть выключено (серая иконка). Иначе Cloudflare будет терминировать SSL сам, и наш Nginx не получит запросы напрямую.

- [ ] **Step 6: Проверить распространение DNS**

Подожди 5-15 минут, затем выполни на своём компьютере:

```bash
nslookup demo.price-on.ru
```

Ожидаемый результат:
```
Address: 72.56.5.159
```

---

## Task 2: Получить wildcard SSL сертификат на VPS

> Выполняется на VPS. Certbot с DNS-01 challenge через Cloudflare API.

**Files:**
- `/etc/letsencrypt/live/price-on.ru/fullchain.pem` (создаётся certbot)
- `/etc/letsencrypt/live/price-on.ru/privkey.pem` (создаётся certbot)
- `/root/.secrets/certbot/cloudflare.ini` (создать вручную)

- [ ] **Step 1: Подключиться к VPS**

```bash
ssh root@72.56.5.159
```

- [ ] **Step 2: Установить certbot и плагин Cloudflare**

```bash
apt-get update && apt-get install -y certbot python3-certbot-dns-cloudflare
```

- [ ] **Step 3: Получить Cloudflare API Token**

В браузере: Cloudflare → My Profile → API Tokens → Create Token → Edit zone DNS (template) → Zone Resources: Include → Specific zone → price-on.ru → Continue → Create Token.

Скопируй токен (показывается один раз).

- [ ] **Step 4: Создать файл с токеном на VPS**

```bash
mkdir -p /root/.secrets/certbot
chmod 700 /root/.secrets/certbot
cat > /root/.secrets/certbot/cloudflare.ini << 'EOF'
dns_cloudflare_api_token = ТВОЙ_ТОКЕН_ЗДЕСЬ
EOF
chmod 600 /root/.secrets/certbot/cloudflare.ini
```

Замени `ТВОЙ_ТОКЕН_ЗДЕСЬ` на реальный токен.

- [ ] **Step 5: Получить wildcard сертификат**

```bash
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/certbot/cloudflare.ini \
  -d "price-on.ru" \
  -d "*.price-on.ru" \
  --email твой@email.com \
  --agree-tos \
  --non-interactive
```

Ожидаемый результат:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/price-on.ru/fullchain.pem
Key is saved at: /etc/letsencrypt/live/price-on.ru/privkey.pem
```

- [ ] **Step 6: Проверить сертификат**

```bash
certbot certificates
```

Ожидаемый результат:
```
Found the following certs:
  Certificate Name: price-on.ru
  Domains: price-on.ru *.price-on.ru
  Expiry Date: ...
  Certificate Path: /etc/letsencrypt/live/price-on.ru/fullchain.pem
```

- [ ] **Step 7: Настроить авторенью**

```bash
echo "0 3 * * * root certbot renew --quiet" >> /etc/crontab
```

---

## Task 3: Настроить Nginx для поддоменов

> Выполняется на VPS. Nginx уже установлен (использовался в День 2).

**Files:**
- Создать: `/etc/nginx/sites-available/priceon-subdomains`
- Симлинк: `/etc/nginx/sites-enabled/priceon-subdomains`

- [ ] **Step 1: Убедиться что Nginx установлен**

```bash
nginx -v
```

Ожидаемый результат:
```
nginx version: nginx/1.x.x
```

- [ ] **Step 2: Создать конфиг**

```bash
cat > /etc/nginx/sites-available/priceon-subdomains << 'EOF'
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name ~^(?<slug>[^.]+)\.price-on\.ru$;
    return 301 https://$host$request_uri;
}

# HTTPS proxy → Vercel
server {
    listen 443 ssl;
    server_name ~^(?<slug>[^.]+)\.price-on\.ru$;

    ssl_certificate /etc/letsencrypt/live/price-on.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/price-on.ru/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass https://pricely-docs.vercel.app;
        proxy_set_header Host pricely-docs.vercel.app;
        proxy_set_header X-Client-Slug $slug;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_ssl_server_name on;
    }
}
EOF
```

- [ ] **Step 3: Открыть порт 443 в UFW**

```bash
ufw allow 443/tcp
ufw status
```

Ожидаемый результат — в списке должно быть:
```
443/tcp                    ALLOW IN    Anywhere
```

- [ ] **Step 4: Включить конфиг**

```bash
ln -s /etc/nginx/sites-available/priceon-subdomains /etc/nginx/sites-enabled/
nginx -t
```

Ожидаемый результат:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

- [ ] **Step 5: Перезагрузить Nginx**

```bash
systemctl reload nginx
```

- [ ] **Step 6: Проверить Nginx без SSL (промежуточный тест)**

```bash
curl -I http://demo.price-on.ru
```

Ожидаемый результат:
```
HTTP/1.1 301 Moved Permanently
Location: https://demo.price-on.ru/
```

---

## Task 4: Создать Next.js middleware

**Files:**
- Создать: `middleware.ts` (корень проекта, рядом с `next.config.ts`)

- [ ] **Step 1: Создать файл middleware.ts**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const slug = request.headers.get('x-client-slug')

  if (!slug) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  url.pathname = `/catalog/${slug}${pathname === '/' ? '' : pathname}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico).*)',
  ],
}
```

- [ ] **Step 2: Проверить сборку**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
npm run build
```

Ожидаемый результат — сборка без ошибок:
```
✓ Compiled successfully
```

- [ ] **Step 3: Локальный тест middleware**

```bash
npm run dev
```

В другом терминале:
```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "X-Client-Slug: demo" \
  http://localhost:3000/
```

Ожидаемый результат:
```
200
```

```bash
curl -s -H "X-Client-Slug: demo" http://localhost:3000/ | grep -o "товаров"
```

Ожидаемый результат:
```
товаров
```

- [ ] **Step 4: Проверить что обычные пути не ломаются**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/catalog/demo
```

Ожидаемый результат:
```
200
```

- [ ] **Step 5: Обновить .env.local**

Добавь строку в `.env.local`:
```
NEXT_PUBLIC_APP_DOMAIN=price-on.ru
```

- [ ] **Step 6: Commit**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
git add middleware.ts .env.local
git commit -m "feat: add subdomain routing middleware"
```

---

## Task 5: Деплой и финальный тест

**Files:**
- Vercel env vars (через UI)

- [ ] **Step 1: Запушить изменения**

```bash
cd /Users/andreykudrasov/Claude/pricely-app
git push origin main
```

Дождись деплоя на Vercel (1-2 минуты).

- [ ] **Step 2: Добавить env var в Vercel**

Зайди на https://vercel.com → проект `pricely-docs` → Settings → Environment Variables → Add:

```
Key:   NEXT_PUBLIC_APP_DOMAIN
Value: price-on.ru
```

Выбери: Production, Preview, Development → Save.

Нажми **Redeploy** последнего деплоя.

- [ ] **Step 3: Финальный тест через Nginx**

После деплоя:

```bash
curl -s -o /dev/null -w "%{http_code}" https://demo.price-on.ru/
```

Ожидаемый результат:
```
200
```

```bash
curl -s https://demo.price-on.ru/ | grep -o "товаров"
```

Ожидаемый результат:
```
товаров
```

- [ ] **Step 4: Проверить карточку товара**

Открой https://demo.price-on.ru/ в браузере → кликни на любой товар → убедись что URL вида `demo.price-on.ru/название-товара` открывается корректно.

- [ ] **Step 5: Обновить GUIDE.md**

В `docs/GUIDE.md` обнови секцию "Текущий статус":

```markdown
| День 6 | Поддомены (`demo.price-on.ru`) | ✅ Готово |
```

- [ ] **Step 6: Commit**

```bash
git add docs/GUIDE.md
git commit -m "docs: mark Day 6 complete"
git push origin main
```
