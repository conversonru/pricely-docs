import Link from 'next/link'
import type { Metadata } from 'next'
import { Logo } from '@/components/Logo'
import {
  ArrowRight, Search, MessageCircle, Zap, FileSpreadsheet,
  Shield, TrendingUp, Check, ChevronDown, Download,
} from 'lucide-react'
import { TARIFF_PRICES } from '@/types'

export const metadata: Metadata = {
  title: 'Price-on — онлайн-каталог из Excel за 5 минут для оптового бизнеса',
  description:
    'Загрузите Excel-прайс — получите готовый сайт с поиском, категориями и кнопками заказа в WhatsApp/Telegram. Заявки падают прямо в мессенджер. Без программистов.',
}

/* ── Browser mockup ──────────────────────────────────────── */
function BrowserMockup() {
  return (
    <div className="relative w-full max-w-[580px] mx-auto">
      {/* Subtle glow */}
      <div className="absolute -inset-4 bg-amber-400/8 rounded-3xl blur-2xl pointer-events-none" />

      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/10">
        {/* Browser chrome */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 flex items-center gap-2 border border-slate-200">
            <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            <span className="text-xs text-slate-500 font-medium">demo.price-on.ru</span>
            <div className="ml-auto">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="bg-white">
          {/* Catalog header */}
          <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">УралОпт — Оптовый каталог</span>
            <div className="flex items-center gap-2">
              <div className="w-28 h-7 bg-slate-100 rounded-md flex items-center px-2 gap-1">
                <Search size={11} className="text-slate-400" />
                <span className="text-[10px] text-slate-400">Поиск...</span>
              </div>
            </div>
          </div>

          {/* Category strip */}
          <div className="flex gap-2 px-4 py-2.5 border-b border-slate-100 overflow-hidden">
            {['Все', 'Фитинги', 'Крепёж', 'Резинотехника', 'Инструмент'].map((cat, i) => (
              <span key={cat} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${i === 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>
                {cat}
              </span>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-3 gap-2 p-3">
            {[
              { name: 'Фитинг 50мм', price: '450 ₽', sku: 'FIT-50', stock: 'В наличии', stockColor: 'text-emerald-600 bg-emerald-50' },
              { name: 'Втулка рез. 30×20', price: '85 ₽', sku: 'VTL-30', stock: 'В наличии', stockColor: 'text-emerald-600 bg-emerald-50' },
              { name: 'Болт М12×80', price: '12 ₽', sku: 'BLT-M12', stock: 'Под заказ', stockColor: 'text-amber-600 bg-amber-50' },
              { name: 'Гайка М10 DIN', price: '5 ₽', sku: 'NUT-M10', stock: 'В наличии', stockColor: 'text-emerald-600 bg-emerald-50' },
              { name: 'Кольцо рез. 40мм', price: '28 ₽', sku: 'RNG-40', stock: 'В наличии', stockColor: 'text-emerald-600 bg-emerald-50' },
              { name: 'Шайба М8 ГОСТ', price: '3 ₽', sku: 'WSH-M8', stock: 'В наличии', stockColor: 'text-emerald-600 bg-emerald-50' },
            ].map(({ name, price, sku, stock, stockColor }) => (
              <div key={sku} className="border border-slate-100 rounded-lg overflow-hidden">
                <div className="h-14 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-300/60" />
                </div>
                <div className="p-1.5">
                  <p className="text-[8px] text-slate-400">{sku}</p>
                  <p className="text-[9px] font-bold text-slate-900 leading-tight">{name}</p>
                  <p className="text-[10px] font-extrabold text-slate-900 mt-0.5">{price}</p>
                  <span className={`text-[7px] font-semibold px-1 py-0.5 rounded mt-0.5 inline-block ${stockColor}`}>{stock}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order notification */}
          <div className="mx-3 mb-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Check size={10} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-emerald-800">Заявка отправлена в WhatsApp!</p>
              <p className="text-[8px] text-emerald-600">Фитинг 50мм — 20 шт · Менеджер ответит в течение часа</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
          <Check size={11} className="text-white" strokeWidth={3} />
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-900">Яндекс индексирует</p>
          <p className="text-[8px] text-slate-500">SEO готово из коробки</p>
        </div>
      </div>
    </div>
  )
}

/* ── Floating widget ─────────────────────────────────────── */
function FloatingWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#229ED9] hover:bg-[#1a8bbf] text-white rounded-full shadow-lg px-4 py-2.5 transition-all">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span className="text-sm font-semibold">Написать нам</span>
      </a>
    </div>
  )
}

/* ── PAGE ────────────────────────────────────────────────── */
export default function HomePageV2() {
  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'var(--font-manrope)' }}>
      <FloatingWidget />

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="dark" height={30} />
          <nav className="hidden sm:flex items-center gap-7 text-sm text-slate-500 font-medium">
            <a href="#how" className="hover:text-slate-900 transition-colors">Как работает</a>
            <a href="#benefits" className="hover:text-slate-900 transition-colors">Возможности</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Тарифы</a>
            <Link href="/catalog/demo" className="hover:text-slate-900 transition-colors">Демо</Link>
          </nav>
          <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors">
            Создать каталог <ArrowRight size={14} />
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* ══ HERO ═════════════════════════════════════════════ */}
        <section className="bg-white pt-16 pb-20 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left — text */}
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Яндекс индексирует каждый товар
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight"
                  style={{ fontFamily: 'var(--font-syne)' }}>
                  Каталог из вашего прайса —{' '}
                  <span className="text-amber-500">за 5 минут</span>
                </h1>

                <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg">
                  Загрузите Excel — получите готовый сайт с поиском, категориями
                  и кнопками заказа. Клиенты пишут прямо в WhatsApp или Telegram.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    'Каждый товар — отдельная страница в Яндексе',
                    'Заявка приходит с товаром и контактом клиента',
                    'Обновили Excel — каталог обновился сам',
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                        <Check size={11} className="text-amber-600" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-slate-600">{t}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-amber-400 text-slate-900 font-bold px-6 py-3.5 rounded-xl hover:bg-amber-300 transition-all text-base">
                    Создать мой каталог
                    <ArrowRight size={16} />
                  </a>
                  <Link href="/catalog/demo"
                    className="flex items-center justify-center gap-2 border border-slate-200 text-slate-600 font-medium px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-all text-base">
                    Посмотреть демо →
                  </Link>
                </div>

                <p className="mt-3 text-xs text-slate-400">7 дней бесплатно · Без кредитной карты</p>
              </div>

              {/* Right — browser mockup */}
              <div className="flex items-center justify-center lg:justify-end py-4">
                <BrowserMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS BAR ════════════════════════════════════════ */}
        <section className="bg-slate-50 border-y border-slate-100 py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { num: '5', unit: 'минут', label: 'от прайса до сайта' },
                { num: '5 000', unit: 'товаров', label: 'поддерживает каталог' },
                { num: '3', unit: 'клика', label: 'до заявки в мессенджер' },
                { num: '100%', unit: 'SEO', label: 'Яндекс индексирует' },
              ].map(({ num, unit, label }) => (
                <div key={label}>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900"
                      style={{ fontFamily: 'var(--font-syne)' }}>{num}</span>
                    <span className="text-base font-bold text-amber-500">{unit}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
        <section id="how" className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Как это работает</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Три шага до первого заказа
              </h2>
              <p className="mt-3 text-slate-500 max-w-lg mx-auto">
                Без программистов, без CMS, без настройки сервера
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
              {/* Connector line */}
              <div className="hidden sm:block absolute top-8 left-[calc(16.6%+2rem)] right-[calc(16.6%+2rem)] h-px bg-slate-200" />

              {[
                { num: '1', time: '~1 мин', icon: <FileSpreadsheet size={24} className="text-amber-500" />, title: 'Загрузите Excel-прайс', desc: 'Отправляете нам свой файл. Поможем настроить формат при первом запуске. Подойдёт любая структура.' },
                { num: '2', time: '~2 мин', icon: <MessageCircle size={24} className="text-amber-500" />, title: 'Укажите контакты', desc: 'Добавляете WhatsApp, Telegram или MAX. Клиенты смогут написать прямо из карточки товара.' },
                { num: '3', time: 'Готово!', icon: <Zap size={24} className="text-amber-500" />, title: 'Отправьте ссылку клиентам', desc: 'Вместо Excel-файла — ссылка на каталог. Клиент открывает, находит товар, нажимает «Заказать».' },
              ].map(({ num, time, icon, title, desc }) => (
                <div key={num} className="relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all">
                  {/* Step number */}
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
                    {num}
                  </div>
                  {/* Time badge */}
                  <span className="absolute top-5 right-5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    {time}
                  </span>
                  <div className="mb-3">{icon}</div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BEFORE / AFTER ═══════════════════════════════════ */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Узнаёте себя?</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Каждый день менеджеры тратят время впустую
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Как сейчас */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 font-bold text-sm">✕</span>
                  </div>
                  <span className="font-bold text-slate-700">Как сейчас — с Excel</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Клиент просит прайс — менеджер ищет файл, отправляет вручную',
                    'Excel не открывается на телефоне — клиент раздражён',
                    'Скопилось 10 версий файла — никто не знает какой актуальный',
                    'Менеджер объясняет наличие вместо того, чтобы продавать',
                    'Новый клиент не может найти вас в Яндексе',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-slate-500">
                      <span className="mt-0.5 text-red-400 flex-shrink-0 font-bold">✕</span>{t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* С Price ON */}
              <div className="bg-white rounded-2xl p-6 border-2 border-amber-300">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-amber-100">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Check size={14} className="text-amber-600" strokeWidth={3} />
                  </div>
                  <span className="font-bold text-slate-900">С Price ON</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Менеджер отправляет ссылку — клиент сам смотрит каталог',
                    'Удобный интерфейс как в маркетплейсе — работает на любом телефоне',
                    'Одна ссылка, всегда актуальная — обновили прайс, и всё',
                    'Заявка приходит сама с нужным товаром и количеством',
                    'Каждый товар виден в Яндексе — новые клиенты находят сами',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 text-amber-500 flex-shrink-0 font-bold">✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══ BENEFITS ═════════════════════════════════════════ */}
        <section id="benefits" className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Возможности</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Всё что нужно оптовому бизнесу
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: <Search size={20} />, title: 'Новые клиенты из Яндекса', desc: 'Каждый товар — отдельная SEO-страница. Клиенты находят вас по запросам «купить [товар] оптом» без вложений в рекламу.', color: 'bg-amber-50 text-amber-600' },
                { icon: <MessageCircle size={20} />, title: 'Заявки в мессенджер', desc: 'Клиент нашёл товар, нажал кнопку — вы получаете заявку в Telegram/WhatsApp/MAX с названием товара и артикулом.', color: 'bg-blue-50 text-blue-600' },
                { icon: <Zap size={20} />, title: 'Готово за 5 минут', desc: 'Никаких разработчиков и CMS. Загрузили Excel — сайт работает. Поддомен, SSL и хостинг включены в тариф.', color: 'bg-emerald-50 text-emerald-600' },
                { icon: <FileSpreadsheet size={20} />, title: 'Прайс всегда актуален', desc: 'Больше никаких «скинь актуальный». Обновили Excel — каталог обновился. Ссылка одна и та же — навсегда.', color: 'bg-purple-50 text-purple-600' },
                { icon: <TrendingUp size={20} />, title: 'Персональные ссылки менеджеров', desc: 'Каждый менеджер получает свою ссылку. Клиент открывает каталог — видит контакты именно своего менеджера.', color: 'bg-rose-50 text-rose-600' },
                { icon: <Shield size={20} />, title: 'Данные в России по 152-ФЗ', desc: 'Серверы в Москве. Полное соответствие закону о персональных данных. Ваша клиентская база защищена.', color: 'bg-slate-100 text-slate-600' },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-default">
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>{icon}</div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ПРИМЕРЫ ══════════════════════════════════════════ */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Живые примеры</p>
              <h2 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Посмотрите как это выглядит
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { emoji: '🔩', title: 'Промышленные товары', desc: 'Фитинги, крепёж, резинотехника — с поиском по артикулу и фильтрами', tag: 'Производство' },
                { emoji: '🏗️', title: 'Стройматериалы', desc: 'Инструмент, крепёж, отделочные материалы — с ценами и наличием', tag: 'Строительство' },
                { emoji: '👕', title: 'Одежда и текстиль', desc: 'Опт по размерам и цветам, скачать прайс в Excel одним кликом', tag: 'Лёгкая пром.' },
              ].map(({ emoji, title, desc, tag }) => (
                <Link key={title} href="/catalog/demo"
                  className="group block bg-white rounded-2xl p-6 border border-slate-100 hover:border-amber-300 hover:shadow-md transition-all">
                  <div className="text-3xl mb-3">{emoji}</div>
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{tag}</span>
                  <h3 className="font-bold text-slate-900 text-base mt-3 mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{desc}</p>
                  <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Открыть демо <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══════════════════════════════════════════ */}
        <section id="pricing" className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Тарифы</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Один платёж — полный каталог
              </h2>
              <p className="mt-3 text-slate-500">Хостинг, SSL и поддомен включены. Первые 7 дней — бесплатно.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { name: 'Telegram', price: TARIFF_PRICES.telegram, limit: 'до 100 товаров', highlight: false,
                  features: ['SEO-каталог на поддомене', 'Telegram Mini App', 'WhatsApp / Telegram / MAX', 'Скачать прайс в Excel', 'Менеджерские ссылки', 'SSL + хостинг включён'] },
                { name: 'Business', price: TARIFF_PRICES.business, limit: 'до 500 товаров', highlight: true,
                  features: ['Всё из тарифа Telegram', 'Категории как SEO-страницы', 'Кастомный домен', 'Приоритетная поддержка', 'Ранний доступ к новым функциям'] },
                { name: 'Pro', price: TARIFF_PRICES.pro, limit: 'Безлимит товаров', highlight: false,
                  features: ['Всё из тарифа Business', 'Безлимитный каталог', 'Выгрузка аналитики', 'Интеграция с 1С (скоро)', 'Выделенный менеджер'] },
              ].map(({ name, price, limit, highlight, features }) => (
                <div key={name} className={`relative rounded-2xl p-6 flex flex-col gap-5 ${highlight ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-200'}`}>
                  {highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full">★ Популярный</span>}
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>{name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${highlight ? 'text-white' : 'text-slate-900'}`}
                        style={{ fontFamily: 'var(--font-syne)' }}>{price.toLocaleString('ru-RU')}</span>
                      <span className={`text-sm ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>₽/мес</span>
                    </div>
                    <p className={`text-xs mt-1 ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>{limit}</p>
                  </div>
                  <ul className="flex-1 space-y-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className={`mt-0.5 flex-shrink-0 font-bold ${highlight ? 'text-amber-400' : 'text-amber-500'}`}>✓</span>
                        <span className={highlight ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
                    className={`text-center text-sm font-bold py-3 rounded-xl transition-all ${highlight ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                    Начать бесплатно
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══════════════════════════════════════════════ */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10" style={{ fontFamily: 'var(--font-syne)' }}>
              Частые вопросы
            </h2>
            <div className="space-y-2">
              {[
                { q: 'Нужно ли разбираться в технологиях?', a: 'Нет. Вы работаете только с Excel или Google Таблицами — всё остальное берём на себя. При первом запуске помогаем настроить формат файла — это 15–20 минут вместе с нами.' },
                { q: 'А если у меня 1 000 или 5 000 товаров?', a: 'Сервис работает стабильно с каталогами до 1 500 товаров без изменений. Если у вас больше — напишите нам, настроим пагинацию специально для вашего каталога. Входит в тариф Pro.' },
                { q: 'Нужно ли платить за хостинг отдельно?', a: 'Нет. Хостинг, SSL-сертификат и поддомен yourname.price-on.ru включены в любой тариф. Никаких скрытых платежей.' },
                { q: 'Можно ли подключить свой домен?', a: 'Да, с тарифа Business. Вы добавляете свой домен (например opt.vashacompany.ru), мы настраиваем — каталог работает на нём.' },
                { q: 'Как обновлять цены и остатки?', a: 'Обновляете строки в Excel — изменения попадают в каталог. Можно настроить синхронизацию по расписанию или загружать файл вручную.' },
                { q: 'Будут ли мои товары в Яндексе?', a: 'Да. Все страницы отдаются как HTML с правильными метатегами и Schema.org. Яндекс начинает индексировать их в течение нескольких дней.' },
              ].map(({ q, a }) => (
                <details key={q} className="group bg-white rounded-xl border border-slate-100">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer font-semibold text-slate-900 text-sm list-none">
                    {q}
                    <ChevronDown size={16} className="text-slate-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ════════════════════════════════════════ */}
        <section className="bg-amber-400 py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight"
              style={{ fontFamily: 'var(--font-syne)' }}>
              Первый заказ через каталог — уже сегодня
            </h2>
            <p className="mt-4 text-slate-700 text-lg">
              Напишите нам — загрузим первый прайс вместе. 7 дней бесплатно.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-700 transition-all text-base">
                Создать мой каталог
                <ArrowRight size={18} />
              </a>
              <Link href="/catalog/demo"
                className="flex items-center justify-center gap-2 bg-white/30 text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-white/50 transition-all text-base">
                <Download size={16} />
                Посмотреть демо
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-700/70">Без кредитной карты · Готово за 5 минут</p>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="bg-slate-900 border-t border-white/6 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <Logo variant="light" height={28} />
              <p className="text-slate-500 text-sm mt-2 max-w-xs">
                Онлайн-каталог из Excel для оптового бизнеса России
              </p>
              <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                <p>ИП Кудряшов Андрей Николаевич</p>
                <p>ИНН: 344406952308 · ОГРНИП: 319344300052539</p>
                <p>400005, г. Волгоград, ул. Бакинская, д. 3, кв. 25</p>
                <p><a href="mailto:info@price-on.ru" className="hover:text-slate-400 transition-colors">info@price-on.ru</a></p>
              </div>
            </div>
            <div className="flex gap-10 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-xs uppercase tracking-wider mb-1">Продукт</span>
                <Link href="/catalog/demo" className="text-slate-400 hover:text-white transition-colors">Демо-каталог</Link>
                <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Тарифы</a>
                <a href="#how" className="text-slate-400 hover:text-white transition-colors">Как работает</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-xs uppercase tracking-wider mb-1">Правовая info</span>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Конфиденциальность</Link>
                <Link href="/offer" className="text-slate-400 hover:text-white transition-colors">Оферта и оплата</Link>
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
