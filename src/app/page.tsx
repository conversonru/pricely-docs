import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, Search, MessageCircle, Zap, FileSpreadsheet,
  Shield, TrendingUp, Check, ChevronDown, Download,
} from 'lucide-react'
import { TARIFF_PRICES } from '@/types'

export const metadata: Metadata = {
  title: 'Price-on — сайт-каталог из Excel за 10 минут для оптовых компаний',
  description:
    'Создайте сайт с каталогом товаров из вашего прайса в Excel за 10 минут. SEO-каталог в Яндексе и Telegram Mini App для заказов. Без программистов.',
}

/* ── Маленькие переиспользуемые элементы ───────────────── */

function CheckItem({ text, light }: { text: string; light?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
        light ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-600'
      }`}>
        <Check size={11} strokeWidth={3} />
      </span>
      <span className={`text-sm leading-relaxed ${light ? 'text-slate-300' : 'text-slate-600'}`}>{text}</span>
    </li>
  )
}

/* ── Макет карточки товара (Hero visual) ────────────────── */
function ProductCardMockup() {
  return (
    <div className="lp-float relative w-[220px]">
      {/* Свечение позади */}
      <div className="lp-glow-pulse absolute -inset-8 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 bg-[#141B2D]">
        {/* Фото-заглушка */}
        <div className="h-[130px] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1 opacity-40">
            <div className="w-10 h-10 rounded-full bg-slate-600" />
            <div className="w-16 h-2 rounded bg-slate-600" />
          </div>
          {/* "В наличии" бейдж */}
          <span className="absolute top-3 left-3 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            В наличии
          </span>
        </div>
        {/* Инфо */}
        <div className="p-4">
          <p className="text-[10px] text-slate-500 mb-0.5">Арт. FIT-50-PN</p>
          <p className="text-sm font-semibold text-white leading-tight">Фитинг компрессионный 50мм</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Сантехника · Фитинги</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-white">450 <span className="text-slate-400 text-sm font-normal">₽/шт</span></span>
            <button className="text-[11px] font-semibold bg-amber-400 text-slate-900 px-3 py-1.5 rounded-lg">
              Заказать
            </button>
          </div>
        </div>
      </div>

      {/* Яндекс-сниппет внизу */}
      <div className="mt-3 rounded-xl bg-[#141B2D] border border-white/8 p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 rounded bg-red-500/80 flex items-center justify-center">
            <span className="text-[7px] font-bold text-white">Я</span>
          </div>
          <span className="text-[10px] text-slate-400">Яндекс · 1-е место</span>
        </div>
        <p className="text-[11px] text-blue-400 leading-tight">Фитинг 50мм купить оптом — demo.price-on.ru</p>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">450 ₽/шт · В наличии · Доставка от 500 ₽</p>
      </div>
    </div>
  )
}

/* ── Excel-заглушка ─────────────────────────────────────── */
function ExcelMockup() {
  const rows = [
    ['FIT-50', 'Фитинг 50мм', '450', 'В наличии'],
    ['MUF-32', 'Муфта 32мм', '280', 'Под заказ'],
    ['KRN-M8', 'Кронштейн М8', '65', 'В наличии'],
    ['VTL-40', 'Втулка 40мм', '120', 'В наличии'],
  ]
  return (
    <div className="w-[220px] rounded-xl overflow-hidden border border-white/10 shadow-xl shadow-black/40 bg-[#1A2235] text-[10px]">
      {/* Заголовок */}
      <div className="bg-emerald-800/60 px-3 py-2 flex items-center gap-2">
        <FileSpreadsheet size={12} className="text-emerald-400" />
        <span className="text-emerald-300 font-medium">prajs_2025.xlsx</span>
      </div>
      {/* Шапка таблицы */}
      <div className="grid grid-cols-4 bg-[#243048] px-2 py-1.5 text-slate-400 font-medium">
        <span>SKU</span><span className="col-span-2">Наименование</span><span>Цена</span>
      </div>
      {/* Строки */}
      {rows.map(([sku, name, price], i) => (
        <div key={sku} className={`grid grid-cols-4 px-2 py-1.5 ${i % 2 === 0 ? 'bg-[#141B2D]' : 'bg-[#161E30]'} text-slate-400`}>
          <span className="text-slate-500">{sku}</span>
          <span className="col-span-2 text-slate-300 truncate">{name}</span>
          <span className="text-slate-300">{price}₽</span>
        </div>
      ))}
      <div className="px-3 py-2 text-slate-600 bg-[#141B2D]">... ещё 234 строки</div>
    </div>
  )
}

/* ── СТРАНИЦА ───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-manrope)' }}>

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#07091A]/90 backdrop-blur-md border-b border-white/6">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Price<span className="text-amber-400">-on</span>
          </span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            <a href="#how" className="hover:text-white transition-colors">Как работает</a>
            <a href="#benefits" className="hover:text-white transition-colors">Преимущества</a>
            <a href="#pricing" className="hover:text-white transition-colors">Тарифы</a>
            <Link href="/catalog/demo" className="hover:text-white transition-colors">Демо</Link>
          </nav>
          <a
            href="https://t.me/pricely_demo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold bg-amber-400 text-slate-900 px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors"
          >
            Подключить каталог
            <ArrowRight size={14} />
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* ══ HERO ═════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#07091A] pt-20 pb-24">
          {/* Фоновые глоу-пятна */}
          <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
          {/* Dot-grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Текст */}
              <div>
                <div className="lp-badge-in inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Ваши конкуренты уже в Яндексе
                </div>

                <h1
                  className="lp-slide-up lp-delay-1 text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  Создайте сайт с каталогом товаров из вашего прайса в Excel{' '}
                  <span className="lp-shimmer-text">за&nbsp;10&nbsp;минут</span>
                </h1>

                <p className="lp-slide-up lp-delay-2 mt-5 text-lg text-slate-400 leading-relaxed max-w-lg">
                  Загружаете Excel → через 10 минут ваши товары видны в поиске
                  и доступны для заказа в Telegram. Без программистов и дизайнеров.
                </p>

                <ul className="lp-slide-up lp-delay-3 mt-6 space-y-2.5">
                  <CheckItem light text="Каждый товар — отдельная страница в Яндексе" />
                  <CheckItem light text="Клиенты заказывают из Telegram не выходя из мессенджера" />
                  <CheckItem light text="Обновили таблицу — сайт обновился автоматически" />
                </ul>

                <div className="lp-slide-up lp-delay-4 mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://t.me/pricely_demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-amber-400 text-slate-900 font-bold px-6 py-3.5 rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
                  >
                    Попробовать бесплатно
                    <ArrowRight size={16} />
                  </a>
                  <Link
                    href="/catalog/demo"
                    className="flex items-center justify-center gap-2 border border-white/12 text-slate-300 font-medium px-6 py-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all"
                  >
                    Смотреть демо-каталог
                  </Link>
                </div>
                <p className="lp-fade-in lp-delay-5 mt-3 text-xs text-slate-600">7 дней бесплатно · Без кредитной карты</p>
              </div>

              {/* Визуал: Excel → Каталог */}
              <div className="lp-fade-in lp-delay-3 flex items-center justify-center gap-6">
                <ExcelMockup />
                {/* Стрелка */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                    <ArrowRight size={14} className="text-amber-400" />
                  </div>
                  <span className="text-[9px] text-slate-600 font-medium text-center leading-tight">10<br/>мин</span>
                </div>
                <ProductCardMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS STRIP ══════════════════════════════════════ */}
        <section className="bg-[#0D1225] border-y border-white/6 py-8">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { n: '10 мин', label: 'от прайса до сайта' },
              { n: '100%', label: 'SSR — Яндекс видит всё' },
              { n: '3', label: 'мессенджера для заказов' },
              { n: '152-ФЗ', label: 'данные в России' },
            ].map(({ n, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className="text-2xl font-extrabold text-amber-400"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >{n}</span>
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
        <section id="how" className="bg-[#F8F5EE] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Как это работает</p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-slate-900"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                От таблицы до продаж за один день
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
              {/* Соединительная линия */}
              <div className="hidden sm:block absolute top-9 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 opacity-40" />

              {[
                {
                  num: '01',
                  icon: <FileSpreadsheet size={22} />,
                  title: 'Отправляете прайс',
                  desc: 'Загружаете Excel или Google Таблицу с товарами. Помогаем настроить формат — это займёт 15 минут при первом запуске.',
                },
                {
                  num: '02',
                  icon: <Zap size={22} />,
                  title: 'Каталог готов',
                  desc: 'Через 10 минут работает yourname.price-on.ru с карточками, ценами, категориями и кнопками заказа.',
                },
                {
                  num: '03',
                  icon: <TrendingUp size={22} />,
                  title: 'Клиенты находят вас',
                  desc: 'Яндекс индексирует каждый товар. Клиенты ищут "купить [товар] оптом" и находят ваш каталог.',
                },
              ].map(({ num, icon, title, desc }) => (
                <div key={num} className="lp-card-hover relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                        {icon}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-300 tracking-widest">{num}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5 mb-2">{title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BENEFITS ═════════════════════════════════════════ */}
        <section id="benefits" className="bg-[#07091A] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Что вы получаете</p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Инструменты, которые приносят заказы
              </h2>
              <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                Не просто красивый сайт — а система, которая привлекает новых клиентов
                и упрощает работу с текущими.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: <Search size={20} />,
                  accent: 'text-amber-400',
                  bg: 'bg-amber-400/10',
                  title: 'Новые клиенты из Яндекса',
                  desc: 'Каждый товар получает SEO-страницу с правильными метатегами и Schema.org. Клиенты находят вас по запросам "купить [товар] оптом".',
                  tag: 'SEO',
                },
                {
                  icon: <MessageCircle size={20} />,
                  accent: 'text-blue-400',
                  bg: 'bg-blue-400/10',
                  title: 'Заказы прямо из Telegram',
                  desc: 'Встроенный Mini App в Telegram: клиент листает каталог и оформляет заявку в один клик — не выходя из мессенджера.',
                  tag: 'Telegram',
                },
                {
                  icon: <Zap size={20} />,
                  accent: 'text-emerald-400',
                  bg: 'bg-emerald-400/10',
                  title: 'Готово без программистов',
                  desc: 'Никаких CMS, хостингов и разработчиков. Загрузили прайс — через 10 минут сайт работает. Обновили таблицу — каталог обновился.',
                  tag: 'Автоматизация',
                },
                {
                  icon: <FileSpreadsheet size={20} />,
                  accent: 'text-purple-400',
                  bg: 'bg-purple-400/10',
                  title: 'Прайс всегда актуален',
                  desc: 'Больше никаких "пришли актуальный Excel". Клиент сам скачивает свежий прайс одним кликом — прямо из каталога.',
                  tag: 'Удобство',
                },
                {
                  icon: <TrendingUp size={20} />,
                  accent: 'text-rose-400',
                  bg: 'bg-rose-400/10',
                  title: 'Все каналы связи в одном',
                  desc: 'MAX, Telegram, WhatsApp — кнопки заказа ведут в удобный для клиента мессенджер с предзаполненным текстом заявки.',
                  tag: 'Мессенджеры',
                },
                {
                  icon: <Shield size={20} />,
                  accent: 'text-slate-300',
                  bg: 'bg-slate-400/10',
                  title: 'Данные в России по 152-ФЗ',
                  desc: 'Серверы в Москве, полное соответствие закону о персональных данных. Ваша клиентская база защищена.',
                  tag: 'Безопасность',
                },
              ].map(({ icon, accent, bg, title, desc, tag }) => (
                <div
                  key={title}
                  className="lp-card-hover group bg-[#0D1225] rounded-2xl p-6 border border-white/6 hover:border-white/12"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${bg} ${accent} flex items-center justify-center flex-shrink-0`}>
                      {icon}
                    </div>
                    <span className={`text-[10px] font-semibold ${accent} bg-white/5 px-2 py-0.5 rounded-full border border-white/6`}>
                      {tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2 leading-tight">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BEFORE / AFTER ═══════════════════════════════════ */}
        <section className="bg-[#F8F5EE] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-slate-900"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Как было и как будет
              </h2>
              <p className="mt-3 text-slate-500">Для оптовых компаний, которые хотят расти</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* До */}
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="font-bold text-slate-900">Сейчас</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Excel-прайс отправляете вручную по WhatsApp',
                    'Клиенты теряют файл, просят прислать снова',
                    'Новые клиенты не находят вас в Яндексе',
                    'Заказы принимаете по телефону или в мессенджерах',
                    'Сайт стоит от 100 000 ₽ и делается месяцами',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-slate-500">
                      <span className="mt-0.5 text-red-400 flex-shrink-0">✕</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              {/* После */}
              <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-900">С Price-on</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Каталог с актуальными ценами доступен 24/7 онлайн',
                    'Клиент сам скачивает прайс в один клик',
                    'Товары в топе Яндекса по целевым запросам',
                    'Заявки приходят сами в Telegram/WhatsApp/MAX',
                    'Готово за 10 минут — без разработчиков',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="mt-0.5 text-emerald-500 flex-shrink-0">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══ PRICING ══════════════════════════════════════════ */}
        <section id="pricing" className="bg-[#07091A] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Тарифы</p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Один платёж — полный каталог
              </h2>
              <p className="mt-3 text-slate-400">Без скрытых комиссий и setup fee. Первые 7 дней — бесплатно.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {[
                {
                  name: 'Telegram',
                  price: TARIFF_PRICES.telegram,
                  limit: 'до 100 товаров',
                  highlight: false,
                  features: [
                    'SEO-каталог на поддомене',
                    'Telegram Mini App',
                    'Кнопки MAX / TG / WhatsApp',
                    'Скачать прайс в Excel',
                    'SSL + хостинг включён',
                  ],
                },
                {
                  name: 'Business',
                  price: TARIFF_PRICES.business,
                  limit: 'до 500 товаров',
                  highlight: true,
                  features: [
                    'Всё из тарифа Telegram',
                    'Категории как SEO-страницы',
                    'Кастомный домен',
                    'Приоритетная поддержка',
                    'Ранний доступ к новым функциям',
                  ],
                },
                {
                  name: 'Pro',
                  price: TARIFF_PRICES.pro,
                  limit: 'Безлимит товаров',
                  highlight: false,
                  features: [
                    'Всё из тарифа Business',
                    'Безлимитный каталог',
                    'Выгрузка аналитики',
                    'Интеграция с 1С (скоро)',
                    'Выделенный менеджер',
                  ],
                },
              ].map(({ name, price, limit, highlight, features }) => (
                <div
                  key={name}
                  className={`relative lp-card-hover rounded-2xl p-6 flex flex-col gap-5 ${
                    highlight
                      ? 'bg-amber-400 text-slate-900 shadow-xl shadow-amber-400/20'
                      : 'bg-[#0D1225] border border-white/8 text-white'
                  }`}
                >
                  {highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-400/30">
                      ★ Популярный
                    </span>
                  )}
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${highlight ? 'text-slate-700' : 'text-slate-400'}`}>{name}</p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="text-4xl font-extrabold"
                        style={{ fontFamily: 'var(--font-syne)' }}
                      >
                        {price.toLocaleString('ru-RU')}
                      </span>
                      <span className={`text-sm ${highlight ? 'text-slate-700' : 'text-slate-500'}`}>₽/мес</span>
                    </div>
                    <p className={`text-xs mt-1 ${highlight ? 'text-slate-600' : 'text-slate-500'}`}>{limit}</p>
                  </div>

                  <ul className="flex-1 space-y-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className={`mt-0.5 flex-shrink-0 ${highlight ? 'text-slate-700' : 'text-amber-400'}`}>✓</span>
                        <span className={highlight ? 'text-slate-800' : 'text-slate-300'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://t.me/pricely_demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center text-sm font-bold py-3 rounded-xl transition-all ${
                      highlight
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'border border-amber-400/30 text-amber-400 hover:bg-amber-400/10'
                    }`}
                  >
                    Начать бесплатно
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══════════════════════════════════════════════ */}
        <section className="bg-[#F8F5EE] py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h2
              className="text-3xl font-extrabold text-slate-900 text-center mb-10"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Частые вопросы
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Нужно ли разбираться в технологиях?',
                  a: 'Нет. Вы работаете только с Excel или Google Таблицами — всё остальное мы берём на себя. Настройка при первом запуске занимает 15–20 минут с нашей помощью.',
                },
                {
                  q: 'Как обновлять цены и остатки?',
                  a: 'Обновляете строки в таблице — изменения автоматически попадают в каталог. Можно настроить автосинхронизацию через Google Sheets или загружать файл вручную.',
                },
                {
                  q: 'Будет ли мой каталог в Яндексе?',
                  a: 'Да. Все страницы отдаются как HTML с правильными метатегами, Schema.org и sitemap.xml. Яндекс начинает индексировать их в течение нескольких дней после запуска.',
                },
                {
                  q: 'Можно ли использовать свой домен?',
                  a: 'Да, с тарифа Business. По умолчанию каталог работает на yourname.price-on.ru — это бесплатно.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group bg-white rounded-xl border border-slate-100 shadow-sm">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer font-semibold text-slate-900 text-sm list-none">
                    {q}
                    <ChevronDown size={16} className="text-slate-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#07091A] py-24">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[300px] rounded-full bg-amber-400/8 blur-[80px]" />
          </div>
          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">Начните сегодня</p>
            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white leading-tight"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Ваши товары увидят{' '}
              <span className="lp-shimmer-text">тысячи покупателей</span>
            </h2>
            <p className="mt-5 text-slate-400 text-lg">
              Первые 7 дней бесплатно. Напишите нам в Telegram —
              настроим каталог и загрузим первый прайс вместе.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://t.me/pricely_demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 text-base"
              >
                Подключить каталог
                <ArrowRight size={18} />
              </a>
              <Link
                href="/catalog/demo"
                className="flex items-center justify-center gap-2 border border-white/12 text-slate-300 font-medium px-8 py-4 rounded-xl hover:bg-white/5 hover:text-white transition-all text-base"
              >
                <Download size={16} />
                Демо-каталог
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="bg-[#07091A] border-t border-white/6 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Price<span className="text-amber-400">-on</span>
              </span>
              <p className="text-slate-500 text-sm mt-1 max-w-xs">
                SEO-каталог и Telegram Mini App для оптовых компаний России
              </p>
            </div>
            <div className="flex gap-10 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-xs uppercase tracking-wider mb-1">Продукт</span>
                <Link href="/catalog/demo" className="text-slate-400 hover:text-white transition-colors">Демо-каталог</Link>
                <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Тарифы</a>
                <a href="#how" className="text-slate-400 hover:text-white transition-colors">Как работает</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-xs uppercase tracking-wider mb-1">Компания</span>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Конфиденциальность</Link>
                <Link href="/offer" className="text-slate-400 hover:text-white transition-colors">Оферта</Link>
                <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Telegram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} Price-on. Все права защищены.</span>
            <span>Данные хранятся в России · 152-ФЗ</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
