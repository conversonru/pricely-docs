import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — Price-on',
  description: 'Политика обработки персональных данных сервиса Price-on',
}

export default function PrivacyPage() {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'price-on.ru'

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-8 block">
        ← На главную
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Политика конфиденциальности
      </h1>
      <p className="text-sm text-gray-500 mb-10">Последнее обновление: апрель 2025 г.</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки
            персональных данных пользователей сервиса Price-on, размещённого по адресу{' '}
            <strong>{domain}</strong> (далее — «Сервис»).
          </p>
          <p className="mt-3">
            Используя Сервис, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны
            с её условиями — пожалуйста, прекратите использование Сервиса.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Оператор персональных данных</h2>
          <p>
            Оператором персональных данных является ИП или юридическое лицо, управляющее Сервисом
            Price-on. Сервер с данными расположен на территории Российской Федерации (г. Москва),
            что соответствует требованиям Федерального закона № 152-ФЗ «О персональных данных».
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Какие данные мы собираем</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Имя, адрес электронной почты, номер телефона — при регистрации в Сервисе;</li>
            <li>Данные об организации: наименование, ИНН, ОГРН, адрес;</li>
            <li>Технические данные: IP-адрес, тип браузера, данные cookies — автоматически при посещении;</li>
            <li>Данные об использовании Сервиса: просмотренные страницы, время посещения.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Цели обработки данных</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Предоставление доступа к функциям Сервиса;</li>
            <li>Обработка платежей и ведение учёта подписок;</li>
            <li>Техническая поддержка и связь с пользователем;</li>
            <li>Улучшение качества работы Сервиса;</li>
            <li>Соблюдение требований законодательства РФ.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Хранение и защита данных</h2>
          <p>
            Данные хранятся на серверах, расположенных в России, и защищены техническими и
            организационными мерами: шифрование соединения (HTTPS/TLS), ограничение доступа,
            регулярное резервное копирование.
          </p>
          <p className="mt-3">
            Мы не передаём ваши данные третьим лицам, за исключением случаев, предусмотренных
            законодательством РФ.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Права пользователя</h2>
          <p>В соответствии с ФЗ-152 вы вправе:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Получить информацию об обрабатываемых данных;</li>
            <li>Потребовать исправления неточных данных;</li>
            <li>Потребовать удаления данных («право на забвение»);</li>
            <li>Отозвать согласие на обработку данных.</li>
          </ul>
          <p className="mt-3">
            Для реализации своих прав направьте запрос на электронную почту, указанную на сайте.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Файлы cookies</h2>
          <p>
            Сервис использует cookies для корректной работы и аналитики. Вы можете отключить
            cookies в настройках браузера, однако это может повлиять на функциональность Сервиса.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Изменения в Политике</h2>
          <p>
            Мы оставляем за собой право обновлять настоящую Политику. Актуальная версия всегда
            доступна по адресу{' '}
            <strong>
              {domain}/privacy
            </strong>
            . Продолжение использования Сервиса после обновления означает согласие с новой редакцией.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Контакты</h2>
          <p>
            По вопросам обработки персональных данных обращайтесь:{' '}
            <a href={`mailto:info@${domain}`} className="text-blue-600 hover:underline">
              info@{domain}
            </a>
          </p>
        </section>

      </div>
    </main>
  )
}
