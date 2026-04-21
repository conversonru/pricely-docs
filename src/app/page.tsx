import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, Search, MessageCircle, Zap, FileSpreadsheet,
  Shield, TrendingUp, Check, ChevronDown, Download, Send,
} from 'lucide-react'
import { TARIFF_PRICES } from '@/types'

export const metadata: Metadata = {
  title: 'Price-on — онлайн-каталог из Excel за 5 минут для оптового бизнеса',
  description:
    'Загрузите Excel-прайс — получите готовый сайт с поиском, категориями и кнопками заказа в WhatsApp/Telegram. Заявки падают прямо в мессенджер. Без программистов.',
}

/* ── Phone mockup (product detail + animated tap) ────────── */
function PhoneMockup() {
  return (
    <div className="lp-float relative flex justify-center">
      <div className="lp-glow-pulse absolute inset-0 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

      <div className="relative w-[220px]">
        {/* Корпус телефона */}
        <div className="relative bg-[#0D1117] rounded-[36px] border-2 border-white/10 shadow-2xl shadow-black/70 overflow-hidden">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-16 h-1 rounded-full bg-white/10" />
          </div>

          {/* Экран — карточка товара */}
          <div className="mx-1 mb-1 rounded-[28px] overflow-hidden bg-[#F8F6F0]" style={{ height: 420 }}>
            {/* Шапка */}
            <div className="bg-white border-b border-gray-100 px-3 py-2 flex items-center gap-2">
              <div className="w-4 h-4 text-gray-400">‹</div>
              <span className="text-[10px] font-bold text-gray-900">УралОпт</span>
            </div>

            {/* Фото товара */}
            <div className="mx-2 mt-2 rounded-xl h-[110px] bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-slate-400/50" />
              <span className="absolute top-2 left-2 text-[8px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">В наличии</span>
            </div>

            {/* Инфо */}
            <div className="px-3 mt-2">
              <p className="text-[9px] text-gray-400">Арт. FIT-50-PN · Фитинги</p>
              <p className="text-[11px] font-bold text-gray-900 mt-0.5 leading-tight">Фитинг компрессионный 50мм</p>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-[16px] font-extrabold text-gray-900">450 ₽</span>
                <span className="text-[9px] text-gray-400">/ шт</span>
              </div>
            </div>

            {/* Кнопки заказа */}
            <div className="px-3 mt-3 flex flex-col gap-1.5">
              {/* WhatsApp кнопка с анимацией тапа */}
              <div className="relative">
                <div className="lp-tap lp-tap-delay flex items-center justify-center gap-1.5 bg-green-500 rounded-lg py-2 px-3">
                  <svg className="w-3 h-3" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-[9px] font-bold text-white">Заказать в WhatsApp</span>
                </div>
                {/* Анимированный палец */}
                <div className="lp-tap absolute -right-3 -bottom-2 text-lg pointer-events-none select-none" style={{ animationDelay: '2s' }}>
                  👆
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-blue-500 rounded-lg py-2 px-3">
                <svg className="w-3 h-3" fill="white" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-[9px] font-bold text-white">Заказать в Telegram</span>
              </div>
            </div>
          </div>
        </div>

        {/* Уведомление о заказе */}
        <div className="absolute -right-6 -bottom-2 w-[170px] bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 lp-badge-in lp-delay-5">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-900">Новый заказ!</p>
              <p className="text-[8px] text-gray-500 leading-tight mt-0.5">Фитинг 50мм — 20 шт.<br/>от Иван Петров</p>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] text-green-600 font-medium">только что</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Floating support widget ────────────────────────────── */
function FloatingWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      <a
        href="https://t.me/pricely_demo"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all px-4 py-2.5 hover:pr-5"
        title="Написать в Telegram"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span className="text-sm font-semibold">Написать нам</span>
      </a>
    </div>
  )
}

/* ── СТРАНИЦА ───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-manrope)' }}>
      <FloatingWidget />

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#07091A]/90 backdrop-blur-md border-b border-white/6">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
            Price<span className="text-amber-400">-on</span>
          </span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            <a href="#how" className="hover:text-white transition-colors">Как работает</a>
            <a href="#benefits" className="hover:text-white transition-colors">Преимущества</a>
            <a href="#pricing" className="hover:text-white transition-colors">Тарифы</a>
            <Link href="/catalog/demo" className="hover:text-white transition-colors">Демо</Link>
          </nav>
          <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold bg-amber-400 text-slate-900 px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors">
            Создать каталог <ArrowRight size={14} />
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* ══ HERO ═════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#07091A] pt-20 pb-28">
          <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="lp-badge-in inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Заявки — прямо в ваш мессенджер
                </div>

                {/* Крупный заголовок */}
                <h1
                  className="lp-slide-up lp-delay-1 text-5xl sm:text-6xl font-extrabold text-white leading-[1.05] tracking-tight"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  <span className="lp-shimmer-text">Продавайте<br />больше</span> —<br />
                  <span className="text-4xl sm:text-5xl">дайте клиентам<br />удобный каталог<br />вместо Excel</span>
                </h1>

                {/* Более светлый подзаголовок */}
                <p className="lp-slide-up lp-delay-2 mt-5 text-base text-slate-500 leading-relaxed max-w-lg">
                  Загрузите файл — получите готовый сайт с категориями, поиском
                  и кнопками заказа в WhatsApp/Telegram. Без программистов и дизайнеров.
                </p>

                <ul className="lp-slide-up lp-delay-3 mt-5 space-y-2">
                  {[
                    'Клиент открывает ссылку на телефоне — видит удобный каталог',
                    'Нашёл товар, нажал кнопку — заявка упала вам в мессенджер',
                    'Прайс всегда актуален — обновили Excel, каталог обновился сам',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-amber-400/20 text-amber-300">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-400">{t}</span>
                    </li>
                  ))}
                </ul>

                <div className="lp-slide-up lp-delay-4 mt-8 flex flex-col sm:flex-row gap-3">
                  <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-amber-400 text-slate-900 font-bold px-6 py-3.5 rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20">
                    Создать мой первый каталог
                    <ArrowRight size={16} />
                  </a>
                  <Link href="/catalog/demo"
                    className="flex items-center justify-center gap-2 border border-white/12 text-slate-300 font-medium px-6 py-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all">
                    Посмотреть демо-каталог →
                  </Link>
                </div>
                <p className="lp-fade-in lp-delay-5 mt-3 text-xs text-slate-600">7 дней бесплатно · Без кредитной карты · Готово за 5 минут</p>
              </div>

              <div className="lp-fade-in lp-delay-3 flex items-center justify-center py-8">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ══ МЕССЕНДЖЕРЫ ══════════════════════════════════════ */}
        <section className="bg-[#0D1225] border-y border-white/6 py-6">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-4">Заявки приходят в ваши мессенджеры</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {[
                { label: 'WhatsApp', color: 'bg-green-500', icon: <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
                { label: 'Telegram', color: 'bg-blue-500', icon: <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
                { label: 'MAX', color: 'bg-[#0077FF]', icon: <svg className="w-5 h-5" viewBox="0 0 720 720" fill="none"><path fill="#fff" d="M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z"/></svg> },
              ].map(({ label, color, icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center`}>{icon}</div>
                  <span className="text-sm font-semibold text-slate-300">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-300">Телефон</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
        <section id="how" className="bg-[#F8F5EE] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Это почти магия</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Три шага до первого заказа
              </h2>
              <p className="mt-3 text-slate-500">Меньше времени, чем обеденный перерыв</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
              <div className="hidden sm:block absolute top-9 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 opacity-40" />
              {[
                { num: '01', time: '1 минута', icon: <FileSpreadsheet size={22} />, title: 'Загрузите Excel-прайс', desc: 'Отправляете нам свой файл. Поможем настроить формат при первом запуске.' },
                { num: '02', time: '2 минуты', icon: <MessageCircle size={22} />, title: 'Укажите контакты', desc: 'Добавляете WhatsApp, Telegram или MAX. Клиенты смогут написать прямо из каталога.' },
                { num: '03', time: 'Готово!', icon: <Send size={22} />, title: 'Отправьте ссылку клиентам', desc: 'Вместо Excel-файла — отправляете ссылку. Клиент открывает, находит товар, нажимает «Заказать».' },
              ].map(({ num, time, icon, title, desc }) => (
                <div key={num} className="lp-card-hover relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  {/* Бейдж времени */}
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                    {time}
                  </span>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">{icon}</div>
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

        {/* ══ BEFORE / AFTER ═══════════════════════════════════ */}
        <section className="bg-[#07091A] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Узнаёте себя?</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                Каждый день менеджеры тратят время впустую
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-white/8 bg-[#0D1225] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="font-bold text-white">Как сейчас</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Клиент просит прайс — менеджер ищет файл, отправляет вручную',
                    'Excel не открывается на телефоне — клиент отказывается',
                    'Скопилось 10 версий файла — клиент звонит уточнять цену',
                    'Менеджер объясняет наличие вместо того, чтобы продавать',
                    'Новый клиент не может найти вас в интернете',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className="mt-0.5 text-red-400 flex-shrink-0">✕</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border-2 border-amber-400/40 bg-amber-400/5 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-white">С Price-on</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Менеджер отправляет ссылку — клиент сам смотрит каталог',
                    'Удобный интерфейс как в маркетплейсе — работает на любом телефоне',
                    'Одна ссылка, всегда актуальная — обновили прайс, и всё',
                    'Заявка приходит сама с нужным товаром и количеством',
                    'Каждый товар виден в Яндексе — новые клиенты находят сами',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="mt-0.5 text-emerald-400 flex-shrink-0">✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══ BENEFITS ═════════════════════════════════════════ */}
        <section id="benefits" className="bg-[#F8F5EE] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Что вы получаете</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Инструменты, которые приносят заказы
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: <Search size={20} />, accent: 'text-amber-600', bg: 'bg-amber-50', title: 'Новые клиенты из Яндекса', desc: 'Каждый товар — отдельная SEO-страница. Клиенты находят вас по запросам "купить [товар] оптом" без вложений в рекламу.' },
                { icon: <MessageCircle size={20} />, accent: 'text-blue-600', bg: 'bg-blue-50', title: 'Заявки прямо в мессенджер', desc: 'Клиент нашёл товар, нажал кнопку — вы получаете заявку в Telegram/WhatsApp/MAX с названием товара и артикулом.' },
                { icon: <Zap size={20} />, accent: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Готово за 5 минут', desc: 'Никаких разработчиков и CMS. Загрузили Excel — сайт работает. Поддомен, SSL и хостинг включены в тариф.' },
                { icon: <FileSpreadsheet size={20} />, accent: 'text-purple-600', bg: 'bg-purple-50', title: 'Прайс всегда актуален', desc: 'Больше никаких "скинь актуальный". Обновили Excel — каталог обновился. Ссылка одна и та же — навсегда.' },
                { icon: <TrendingUp size={20} />, accent: 'text-rose-600', bg: 'bg-rose-50', title: 'Персональные ссылки менеджеров', desc: 'Каждый менеджер получает свою ссылку. Клиент открывает каталог — видит контакты именно своего менеджера.' },
                { icon: <Shield size={20} />, accent: 'text-slate-600', bg: 'bg-slate-50', title: 'Данные в России по 152-ФЗ', desc: 'Серверы в Москве. Полное соответствие закону о персональных данных. Ваша клиентская база защищена.' },
              ].map(({ icon, accent, bg, title, desc }) => (
                <div key={title} className="lp-card-hover bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200">
                  <div className={`w-10 h-10 rounded-xl ${bg} ${accent} flex items-center justify-center mb-4`}>{icon}</div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ПРИМЕРЫ КАТАЛОГОВ ════════════════════════════════ */}
        <section className="bg-[#07091A] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Живые примеры</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                Посмотрите как это выглядит
              </h2>
              <p className="mt-3 text-slate-400">Настоящие каталоги — откройте прямо сейчас</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {[
                { emoji: '🔩', title: 'Промышленные товары', desc: 'Фитинги, крепёж, резинотехника — с поиском по артикулу и фильтрами по категориям', tag: 'Производство' },
                { emoji: '🏗️', title: 'Стройматериалы', desc: 'Инструмент, крепёж, отделочные материалы — с ценами, наличием и кнопками заказа', tag: 'Строительство' },
                { emoji: '👕', title: 'Одежда и текстиль', desc: 'Опт по размерам и цветам, скачать прайс в Excel одним кликом', tag: 'Лёгкая пром.' },
              ].map(({ emoji, title, desc, tag }) => (
                <Link key={title} href="/catalog/demo"
                  className="lp-card-hover group block bg-[#0D1225] rounded-2xl p-6 border border-white/8 hover:border-amber-400/30 transition-all">
                  <div className="text-3xl mb-4">{emoji}</div>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">{tag}</span>
                  <h3 className="font-bold text-white text-base mt-3 mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{desc}</p>
                  <span className="text-xs font-semibold text-amber-400 group-hover:gap-2 flex items-center gap-1 transition-all">
                    Открыть демо <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══════════════════════════════════════════ */}
        <section id="pricing" className="bg-[#F8F5EE] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">Тарифы</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Один платёж — полный каталог
              </h2>
              <p className="mt-3 text-slate-500">Хостинг, SSL и поддомен включены. Первые 7 дней — бесплатно.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {[
                { name: 'Telegram', price: TARIFF_PRICES.telegram, limit: 'до 100 товаров', highlight: false,
                  features: ['SEO-каталог на поддомене', 'Telegram Mini App', 'Кнопки MAX / TG / WhatsApp', 'Скачать прайс в Excel', 'Менеджерские ссылки', 'SSL + хостинг включён'] },
                { name: 'Business', price: TARIFF_PRICES.business, limit: 'до 500 товаров', highlight: true,
                  features: ['Всё из тарифа Telegram', 'Категории как SEO-страницы', 'Кастомный домен', 'Приоритетная поддержка', 'Ранний доступ к новым функциям'] },
                { name: 'Pro', price: TARIFF_PRICES.pro, limit: 'Безлимит товаров', highlight: false,
                  features: ['Всё из тарифа Business', 'Безлимитный каталог', 'Выгрузка аналитики', 'Интеграция с 1С (скоро)', 'Выделенный менеджер'] },
              ].map(({ name, price, limit, highlight, features }) => (
                <div key={name} className={`relative lp-card-hover rounded-2xl p-6 flex flex-col gap-5 ${highlight ? 'bg-amber-400 shadow-xl shadow-amber-200' : 'bg-white border border-slate-200'}`}>
                  {highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-400/30">★ Популярный</span>}
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${highlight ? 'text-slate-700' : 'text-slate-400'}`}>{name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold" style={{ fontFamily: 'var(--font-syne)' }}>{price.toLocaleString('ru-RU')}</span>
                      <span className={`text-sm ${highlight ? 'text-slate-700' : 'text-slate-400'}`}>₽/мес</span>
                    </div>
                    <p className={`text-xs mt-1 ${highlight ? 'text-slate-600' : 'text-slate-400'}`}>{limit}</p>
                  </div>
                  <ul className="flex-1 space-y-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className={`mt-0.5 flex-shrink-0 ${highlight ? 'text-slate-700' : 'text-amber-500'}`}>✓</span>
                        <span className={highlight ? 'text-slate-800' : 'text-slate-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
                    className={`text-center text-sm font-bold py-3 rounded-xl transition-all ${highlight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border border-amber-400 text-amber-600 hover:bg-amber-50'}`}>
                    Начать бесплатно
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══════════════════════════════════════════════ */}
        <section className="bg-[#07091A] py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-white text-center mb-10" style={{ fontFamily: 'var(--font-syne)' }}>
              Частые вопросы
            </h2>
            <div className="space-y-3">
              {[
                { q: 'Нужно ли разбираться в технологиях?', a: 'Нет. Вы работаете только с Excel или Google Таблицами — всё остальное берём на себя. При первом запуске помогаем настроить формат файла — это 15–20 минут вместе с нами.' },
                { q: 'А если у меня 1 000 или 5 000 товаров?', a: 'Сервис работает стабильно с каталогами до 1 500 товаров без изменений. Если у вас больше — напишите нам, настроим пагинацию специально для вашего каталога. Входит в тариф Pro.' },
                { q: 'Нужно ли платить за хостинг отдельно?', a: 'Нет. Хостинг, SSL-сертификат и поддомен yourname.price-on.ru включены в любой тариф. Никаких скрытых платежей.' },
                { q: 'Можно ли подключить свой домен?', a: 'Да, с тарифа Business. Вы добавляете свой домен (например opt.vashacompany.ru), мы настраиваем — каталог работает на нём.' },
                { q: 'Как обновлять цены и остатки?', a: 'Обновляете строки в Excel или Google Таблице — изменения попадают в каталог автоматически. Можно настроить синхронизацию по расписанию или загружать файл вручную.' },
                { q: 'Будут ли мои товары в Яндексе?', a: 'Да. Все страницы отдаются как HTML с правильными метатегами и Schema.org. Яндекс начинает индексировать их в течение нескольких дней. Каждый товар — отдельная страница в поиске.' },
              ].map(({ q, a }) => (
                <details key={q} className="group bg-[#0D1225] rounded-xl border border-white/8">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer font-semibold text-white text-sm list-none">
                    {q}
                    <ChevronDown size={16} className="text-slate-500 flex-shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/6 pt-3">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#F8F5EE] py-24">
          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-4">Начните сегодня</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-syne)' }}>
              Первый заказ через{' '}
              <span style={{ color: '#d97706' }}>каталог — сегодня</span>
            </h2>
            <p className="mt-5 text-slate-500 text-lg">
              Напишите нам в Telegram — загрузим первый прайс вместе.
              Семь дней бесплатно, без кредитной карты.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/pricely_demo" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/30 text-base">
                Создать мой первый каталог
                <ArrowRight size={18} />
              </a>
              <Link href="/catalog/demo"
                className="flex items-center justify-center gap-2 border border-slate-200 text-slate-600 font-medium px-8 py-4 rounded-xl hover:bg-slate-50 transition-all text-base">
                <Download size={16} />
                Посмотреть демо
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="bg-[#07091A] border-t border-white/6 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-syne)' }}>
                Price<span className="text-amber-400">-on</span>
              </span>
              <p className="text-slate-500 text-sm mt-1 max-w-xs">
                Онлайн-каталог из Excel для оптового бизнеса России
              </p>
              {/* Реквизиты — требование Точки */}
              <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                <p>ООО «Прайс-он» · ИНН: 0000000000</p>
                <p>ОГРН: 0000000000000</p>
                <p>Россия, г. Москва</p>
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
