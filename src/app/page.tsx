import Link from 'next/link'
import type { Metadata } from 'next'
import { TARIFF_PRICES } from '@/types'

export const metadata: Metadata = {
  title: 'Price-on — онлайн-каталог для оптовых компаний',
  description:
    'Загрузите Excel-прайс и получите SEO-каталог для Яндекса и Telegram Mini App для клиентов. Оптовый B2B-каталог за 10 минут.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Навбар ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg tracking-tight">Price-on</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/catalog/demo"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Демо-каталог
            </Link>
            <a
              href="https://t.me/pricely_demo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Подключиться
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Работает на 152-ФЗ — данные в России
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
            SEO-каталог и Telegram Mini App<br className="hidden sm:block" /> для оптового бизнеса
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Загружаете Excel-прайс — получаете каталог, который Яндекс индексирует,
            и мини-приложение для заказов прямо в Telegram.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://t.me/pricely_demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Подключить каталог
            </a>
            <Link
              href="/catalog/demo"
              className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Смотреть демо →
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">Без регистрации — просто напишите нам</p>
        </section>

        {/* ── Как это работает ────────────────────────────────────── */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Три шага до готового каталога
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Загружаете прайс',
                  desc: 'Отправляете Excel-файл с товарами через Google Таблицы или напрямую. Формат — любой, поможем настроить.',
                },
                {
                  step: '02',
                  title: 'Получаете каталог',
                  desc: 'Через 10 минут работает ваш сайт demo.price-on.ru с карточками товаров, ценами и кнопками заказа.',
                },
                {
                  step: '03',
                  title: 'Яндекс индексирует',
                  desc: 'Все страницы отдаются в HTML — поисковик видит каждый товар и начинает показывать их в выдаче.',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex flex-col gap-3">
                  <span className="text-4xl font-bold text-blue-100">{step}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Фичи ────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Что входит в каждый тариф
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '🔍', title: 'SEO-оптимизация', desc: 'Title, description и Schema.org для каждого товара. Яндекс показывает цену прямо в сниппете.' },
                { icon: '📱', title: 'Telegram Mini App', desc: 'Встроенное приложение в Telegram: клиенты листают каталог и делают заказ не выходя из мессенджера.' },
                { icon: '📂', title: 'Категории', desc: 'Товары автоматически разбиваются по разделам. Каждая категория — отдельная SEO-страница.' },
                { icon: '🔗', title: 'Ваш поддомен', desc: 'Каталог живёт на адресе yourname.price-on.ru или на вашем собственном домене.' },
                { icon: '📊', title: 'Скачать прайс', desc: 'Покупатели могут скачать актуальный прайс-лист в Excel одним кликом прямо из каталога.' },
                { icon: '💬', title: 'MAX, Telegram, WhatsApp', desc: 'Кнопки заказа ведут в удобный для клиента мессенджер с предзаполненным текстом.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                  <span className="text-2xl">{icon}</span>
                  <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Тарифы ──────────────────────────────────────────────── */}
        <section className="bg-gray-50 py-16" id="pricing">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Тарифы</h2>
            <p className="text-gray-500 text-center mb-12">Один платёж в месяц, без скрытых комиссий</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  name: 'Telegram',
                  price: TARIFF_PRICES.telegram,
                  limit: '100 товаров',
                  features: ['SEO-каталог', 'Telegram Mini App', 'Поддомен price-on.ru', 'Кнопки MAX/TG/WA'],
                  highlight: false,
                },
                {
                  name: 'Business',
                  price: TARIFF_PRICES.business,
                  limit: '500 товаров',
                  features: ['Всё из Telegram', 'Категории как SEO-страницы', 'Скачать прайс XLS', 'Кастомный домен'],
                  highlight: true,
                },
                {
                  name: 'Pro',
                  price: TARIFF_PRICES.pro,
                  limit: 'Безлимит',
                  features: ['Всё из Business', 'Приоритетная поддержка', 'Выгрузка аналитики', 'Интеграция с 1С (скоро)'],
                  highlight: false,
                },
              ].map(({ name, price, limit, features, highlight }) => (
                <div
                  key={name}
                  className={`relative rounded-2xl p-6 flex flex-col gap-5 ${
                    highlight
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Популярный
                    </span>
                  )}
                  <div>
                    <p className={`text-sm font-medium ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>
                      {name}
                    </p>
                    <p className={`text-3xl font-bold mt-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>
                      {price.toLocaleString('ru-RU')} ₽
                      <span className={`text-sm font-normal ml-1 ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                        /мес
                      </span>
                    </p>
                    <p className={`text-sm mt-1 ${highlight ? 'text-blue-100' : 'text-gray-400'}`}>{limit}</p>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className={highlight ? 'text-blue-200' : 'text-green-500'}>✓</span>
                        <span className={highlight ? 'text-blue-50' : 'text-gray-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://t.me/pricely_demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${
                      highlight
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Подключить
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="py-20 text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900">Готовы попробовать?</h2>
            <p className="mt-3 text-gray-500">
              Напишите нам в Telegram — настроим каталог и загрузим первый прайс вместе.
              Первые 7 дней бесплатно.
            </p>
            <a
              href="https://t.me/pricely_demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Написать в Telegram
            </a>
          </div>
        </section>

      </main>

      {/* ── Футер ───────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <span>© {new Date().getFullYear()} Price-on</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Политика конфиденциальности</Link>
            <Link href="/offer" className="hover:text-gray-600 transition-colors">Оферта</Link>
            <Link href="/catalog/demo" className="hover:text-gray-600 transition-colors">Демо</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
