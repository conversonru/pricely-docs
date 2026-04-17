import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Публичная оферта — Price-on',
  description: 'Договор публичной оферты на использование сервиса Price-on',
}

export default function OfferPage() {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'
  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-8 block">
        ← На главную
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Публичная оферта
      </h1>
      <p className="text-sm text-gray-500 mb-10">Последнее обновление: апрель 2025 г.</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Общие положения</h2>
          <p>
            Настоящий документ является публичной офертой (предложением) заключить договор на
            использование SaaS-сервиса Price-on, размещённого по адресу{' '}
            <strong>{domain}</strong> (далее — «Сервис»).
          </p>
          <p className="mt-3">
            Акцептом (принятием) оферты является регистрация в Сервисе или оплата тарифа.
            С момента акцепта договор считается заключённым.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Предмет договора</h2>
          <p>
            Исполнитель предоставляет Пользователю доступ к Сервису на условиях выбранного
            тарифного плана. Сервис позволяет создавать онлайн-каталоги товаров и Telegram
            Mini App для оптовой торговли.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Тарифы и оплата</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Telegram</strong> — до 100 товаров. Стоимость: 990 ₽/месяц.
            </li>
            <li>
              <strong>Business</strong> — до 500 товаров. Стоимость: 1 490 ₽/месяц.
            </li>
            <li>
              <strong>Pro</strong> — безлимитное количество товаров. Стоимость: 2 490 ₽/месяц.
            </li>
          </ul>
          <p className="mt-3">
            Оплата производится авансом за расчётный период (месяц). Все цены указаны в рублях РФ
            и включают НДС при наличии.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Порядок активации и продления</h2>
          <p>
            Доступ к Сервису активируется автоматически после подтверждения оплаты. При
            автоматическом продлении подписки Пользователь уведомляется не позднее чем
            за 3 дня до списания.
          </p>
          <p className="mt-3">
            При отсутствии оплаты по истечении расчётного периода доступ к Сервису
            приостанавливается. Данные сохраняются в течение 30 дней с момента приостановки.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Права и обязанности сторон</h2>
          <p className="font-medium text-gray-800">Исполнитель обязуется:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Обеспечивать доступность Сервиса не менее 99% времени в месяц;</li>
            <li>Хранить данные Пользователя на серверах в РФ;</li>
            <li>Не передавать данные третьим лицам без согласия Пользователя;</li>
            <li>Уведомлять о плановых технических работах заранее.</li>
          </ul>
          <p className="font-medium text-gray-800 mt-4">Пользователь обязуется:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Своевременно оплачивать выбранный тариф;</li>
            <li>Не использовать Сервис для распространения незаконного контента;</li>
            <li>Не передавать учётные данные третьим лицам;</li>
            <li>Соблюдать законодательство РФ при использовании Сервиса.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Возврат средств</h2>
          <p>
            Пользователь вправе отказаться от подписки в любое время. Возврат средств за
            неиспользованный период производится по письменному запросу в течение 14 дней
            с момента оплаты. По истечении 14 дней возврат не осуществляется.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Ограничение ответственности</h2>
          <p>
            Исполнитель не несёт ответственности за упущенную выгоду, косвенные убытки и потерю
            данных, возникшие в результате использования или невозможности использования Сервиса.
            Максимальная ответственность Исполнителя ограничена суммой оплаты за последний расчётный
            период.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Применимое право</h2>
          <p>
            Настоящий договор регулируется законодательством Российской Федерации. Все споры
            разрешаются путём переговоров, а при недостижении согласия — в суде по месту
            нахождения Исполнителя.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Контакты</h2>
          <p>
            По вопросам, связанным с настоящей офертой:{' '}
            <a href={`mailto:info@${domain}`} className="text-blue-600 hover:underline">
              info@{domain}
            </a>
          </p>
        </section>

      </div>
    </main>
  )
}
