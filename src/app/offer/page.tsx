import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Оферта и оплата — Price-on',
  description: 'Публичная оферта, способы оплаты, условия доставки и возврата сервиса Price-on',
}

export default function OfferPage() {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-8 block">
        ← На главную
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Оферта и оплата
      </h1>
      <p className="text-sm text-gray-500 mb-10">Последнее обновление: апрель 2025 г.</p>

      {/* ── Реквизиты продавца ─────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10 text-sm text-gray-700 space-y-1">
        <p className="font-semibold text-gray-900 mb-2">Продавец (Исполнитель)</p>
        <p>ИП Кудряшов Андрей Николаевич</p>
        <p>ИНН: 344406952308 · ОГРНИП: 319344300052539</p>
        <p>Юридический адрес: 400005, Волгоградская обл., г. Волгоград, ул. Бакинская, д. 3, кв. 25</p>
        <p>
          E-mail:{' '}
          <a href={`mailto:info@${domain}`} className="text-blue-600 hover:underline">
            info@{domain}
          </a>
        </p>
        <p>
          Сайт:{' '}
          <a href={`https://${domain}`} className="text-blue-600 hover:underline">
            {domain}
          </a>
        </p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

        {/* 1. Общие положения */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Общие положения</h2>
          <p>
            Настоящий документ является публичной офертой (предложением) ИП Кудряшов Андрей Николаевич заключить
            договор на использование SaaS-сервиса Price-on, размещённого по адресу{' '}
            <strong>{domain}</strong> (далее — «Сервис»).
          </p>
          <p className="mt-3">
            Акцептом (принятием) оферты является регистрация в Сервисе или оплата тарифного плана.
            С момента акцепта договор считается заключённым на условиях настоящей оферты.
          </p>
        </section>

        {/* 2. Предмет договора */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Предмет договора</h2>
          <p>
            Исполнитель предоставляет Пользователю доступ к Сервису на условиях выбранного
            тарифного плана. Сервис позволяет загружать прайс-листы из Excel и автоматически
            создавать SEO-каталоги товаров и Telegram Mini App для оптовых продаж.
          </p>
          <p className="mt-3">
            Сервис является цифровым продуктом (программным обеспечением, предоставляемым по
            модели SaaS). Доступ предоставляется через сеть Интернет.
          </p>
        </section>

        {/* 3. Тарифы */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Тарифы</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-800">
                  <th className="text-left p-3 font-semibold border border-gray-200 rounded-tl-lg">Тариф</th>
                  <th className="text-left p-3 font-semibold border border-gray-200">Товаров</th>
                  <th className="text-left p-3 font-semibold border border-gray-200 rounded-tr-lg">Цена/мес</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Telegram</td>
                  <td className="p-3 border border-gray-200">до 100</td>
                  <td className="p-3 border border-gray-200">990 ₽</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Business</td>
                  <td className="p-3 border border-gray-200">до 500</td>
                  <td className="p-3 border border-gray-200">1 490 ₽</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Pro</td>
                  <td className="p-3 border border-gray-200">без лимита</td>
                  <td className="p-3 border border-gray-200">2 490 ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Все цены указаны в рублях РФ. Оплата производится авансом за расчётный период (1 месяц).
          </p>
        </section>

        {/* 4. Способы оплаты */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Способы оплаты</h2>
          <p>Оплата принимается следующими способами:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>Банковская карта</strong> — Visa, Mastercard, МИР. Оплата
              производится через защищённую форму платёжного сервиса. Данные карты не
              хранятся на наших серверах.
            </li>
            <li>
              <strong>Система быстрых платежей (СБП)</strong> — оплата по QR-коду или
              через банковское приложение.
            </li>
            <li>
              <strong>Банковский перевод</strong> — по реквизитам, указанным в счёте.
              Для юридических лиц и ИП.
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            Платёж обрабатывается через платёжный сервис. Соединение защищено протоколом TLS.
          </p>
        </section>

        {/* 5. Условия доставки / активации */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Условия активации (доставки)</h2>
          <p>
            Сервис является <strong>цифровым продуктом</strong>. Физическая доставка не
            предусмотрена.
          </p>
          <p className="mt-3">
            Доступ к Сервису активируется <strong>автоматически и мгновенно</strong> после
            подтверждения оплаты (как правило, в течение нескольких секунд — максимум 15 минут
            при задержке платёжного шлюза).
          </p>
          <p className="mt-3">
            Уведомление об активации направляется на e-mail или в Telegram, указанные
            при регистрации.
          </p>
          <p className="mt-3">
            При автоматическом продлении подписки Пользователь уведомляется не позднее чем за
            3 дня до списания. При отсутствии оплаты по истечении расчётного периода доступ
            приостанавливается, данные сохраняются 30 дней.
          </p>
        </section>

        {/* 6. Возврат и отмена */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Возврат и отмена</h2>
          <p>
            В соответствии со ст. 26.1 Закона РФ «О защите прав потребителей» и особенностями
            цифровых сервисов:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              Пользователь вправе отказаться от подписки в любой момент через личный кабинет или
              по письменному запросу на{' '}
              <a href={`mailto:info@${domain}`} className="text-blue-600 hover:underline">
                info@{domain}
              </a>
              .
            </li>
            <li>
              <strong>Возврат в течение 14 дней</strong> с момента оплаты возможен, если
              Пользователь не приступил к активному использованию Сервиса (не загружал
              прайс-листы и не создавал каталоги).
            </li>
            <li>
              Если Сервис был использован (прайс загружен, каталог создан), возврат
              не производится, так как цифровой контент был предоставлен в полном объёме.
            </li>
            <li>
              В случае технической ошибки или сбоя по вине Исполнителя возврат производится
              в полном объёме вне зависимости от факта использования.
            </li>
          </ul>
          <p className="mt-3">
            Срок обработки возврата — до 10 рабочих дней. Средства возвращаются тем же
            способом, которым была произведена оплата.
          </p>
        </section>

        {/* 7. Права и обязанности */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Права и обязанности сторон</h2>
          <p className="font-medium text-gray-800">Исполнитель обязуется:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Обеспечивать доступность Сервиса не менее 99% времени в месяц;</li>
            <li>Хранить данные Пользователя на серверах в РФ (152-ФЗ);</li>
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

        {/* 8. Ограничение ответственности */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Ограничение ответственности</h2>
          <p>
            Исполнитель не несёт ответственности за упущенную выгоду, косвенные убытки и потерю
            данных, возникшие в результате использования или невозможности использования Сервиса.
            Максимальная ответственность Исполнителя ограничена суммой оплаты за последний
            расчётный период.
          </p>
        </section>

        {/* 9. Применимое право */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Применимое право</h2>
          <p>
            Настоящий договор регулируется законодательством Российской Федерации. Все споры
            разрешаются путём переговоров, а при недостижении согласия — в суде по месту
            нахождения Исполнителя.
          </p>
        </section>

        {/* 10. Контакты */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Контакты</h2>
          <p>По вопросам оплаты, возврата и сотрудничества:</p>
          <ul className="list-none mt-2 space-y-1">
            <li>
              E-mail:{' '}
              <a href={`mailto:info@${domain}`} className="text-blue-600 hover:underline">
                info@{domain}
              </a>
            </li>
            <li>Telegram: <a href="https://t.me/price_on_ru" className="text-blue-600 hover:underline">@price_on_ru</a></li>
            <li>Режим работы: пн–пт, 9:00–18:00 МСК</li>
          </ul>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 space-y-1">
        <Link href="/privacy" className="text-blue-600 hover:underline block">
          Политика конфиденциальности
        </Link>
      </div>
    </main>
  )
}
