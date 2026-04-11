-- ─────────────────────────────────────────────────────────────────────────────
-- Pricely — Схема базы данных
-- Миграция 001: основные таблицы
-- ─────────────────────────────────────────────────────────────────────────────

-- Расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- для полнотекстового поиска

-- ── Типы ──────────────────────────────────────────────────────────────────────
CREATE TYPE tariff_type AS ENUM ('telegram', 'business', 'pro');
CREATE TYPE payment_status AS ENUM ('trial', 'active', 'expired');
CREATE TYPE stock_status AS ENUM ('В наличии', 'Под заказ', 'Нет в наличии');
CREATE TYPE order_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');

-- ── Таблица: clients (клиенты сервиса Pricely) ───────────────────────────────
CREATE TABLE clients (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,         -- 'uralopt' → uralopt.pricely.ru
  company_name      TEXT NOT NULL,
  contact_name      TEXT NOT NULL,                -- ПД: локализация обязательна ✓
  telegram          TEXT,                         -- ПД
  whatsapp          TEXT,                         -- ПД
  email             TEXT NOT NULL UNIQUE,         -- ПД
  tariff            tariff_type NOT NULL DEFAULT 'telegram',
  products_limit    INTEGER NOT NULL DEFAULT 100, -- 100 / 500 / -1
  custom_domain     TEXT UNIQUE,                  -- catalog.client.ru
  payment_status    payment_status NOT NULL DEFAULT 'trial',
  next_billing_date DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE clients IS 'Клиенты сервиса Pricely (оптовые компании)';
COMMENT ON COLUMN clients.slug IS 'Уникальный URL-идентификатор: slug.pricely.ru';
COMMENT ON COLUMN clients.products_limit IS '-1 = безлимит (PRO тариф)';

-- ── Таблица: products (товары клиента) ───────────────────────────────────────
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sku             TEXT NOT NULL,                  -- артикул из прайса
  name            TEXT NOT NULL,
  price           NUMERIC(12, 2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'RUB',
  category        TEXT NOT NULL DEFAULT '',
  description     TEXT,
  image_url       TEXT,
  stock           stock_status NOT NULL DEFAULT 'В наличии',
  unit            TEXT NOT NULL DEFAULT 'шт',     -- шт, кг, м.п.
  seo_title       TEXT,
  seo_description TEXT,
  slug            TEXT NOT NULL,                  -- vtulka-rezinovaya-50h30
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(client_id, sku),
  UNIQUE(client_id, slug)
);

-- Индексы для быстрого поиска и фильтрации
CREATE INDEX idx_products_client_id ON products(client_id);
CREATE INDEX idx_products_client_category ON products(client_id, category);
CREATE INDEX idx_products_client_active ON products(client_id, is_active);
CREATE INDEX idx_products_client_price ON products(client_id, price);

-- Полнотекстовый поиск (русский)
CREATE INDEX idx_products_search ON products
  USING GIN(to_tsvector('russian', name || ' ' || COALESCE(description, '') || ' ' || sku));

COMMENT ON TABLE products IS 'Товары каталога клиента';

-- ── Таблица: orders (заказы — аналитика) ─────────────────────────────────────
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_name     TEXT,         -- ПД покупателя: локализация обязательна ✓
  customer_contact  TEXT,         -- ПД: телефон/telegram покупателя
  order_text        TEXT NOT NULL,
  status            order_status NOT NULL DEFAULT 'new',
  source            TEXT DEFAULT 'whatsapp',  -- 'whatsapp' | 'telegram'
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

COMMENT ON TABLE orders IS 'Заказы покупателей (аналитика)';

-- ── Таблица: price_uploads (история загрузок прайсов) ────────────────────────
CREATE TABLE price_uploads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  filename      TEXT NOT NULL,
  rows_total    INTEGER,
  rows_imported INTEGER,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending|processing|done|error
  error_log     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_uploads_client_id ON price_uploads(client_id);

-- ── Автоматическое обновление updated_at ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS (Row Level Security) ──────────────────────────────────────────────────
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_uploads ENABLE ROW LEVEL SECURITY;

-- Публичный доступ к активным товарам (для каталога)
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Клиент видит только свои данные (через service role из Next.js)
-- Остальные политики добавим при настройке Auth

-- ── Тестовые данные ───────────────────────────────────────────────────────────
INSERT INTO clients (slug, company_name, contact_name, telegram, whatsapp, email, tariff, products_limit, payment_status)
VALUES ('demo', 'Демо-каталог Pricely', 'Менеджер Pricely', '@pricely_demo', '+70000000000', 'demo@pricely.ru', 'business', 500, 'active');

-- ── RLS: Public read for active clients (catalog pages) ──────────────────────
CREATE POLICY "Public can view active clients"
  ON clients FOR SELECT
  USING (payment_status = 'active');
