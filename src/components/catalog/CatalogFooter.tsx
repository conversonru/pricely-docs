import type { Client } from '@/types'

interface CatalogFooterProps {
  client: Client
}

export function CatalogFooter({ client }: CatalogFooterProps) {
  const year = new Date().getFullYear()
  const phone = client.phone ?? client.whatsapp

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Реквизиты */}
          <div>
            <h3 className="text-white font-semibold mb-3">{client.company_name}</h3>
            {client.inn && (
              <p className="text-sm">ИНН: {client.inn}</p>
            )}
            {client.ogrn && (
              <p className="text-sm">ОГРН: {client.ogrn}</p>
            )}
            {client.address && (
              <p className="text-sm mt-2">{client.address}</p>
            )}
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold mb-3">Контакты</h3>
            {phone && (
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="block text-sm hover:text-white transition-colors">
                {phone}
              </a>
            )}
            {client.email && (
              <a href={`mailto:${client.email}`} className="block text-sm hover:text-white transition-colors mt-1">
                {client.email}
              </a>
            )}
            <div className="flex gap-3 mt-3">
              {client.vk && (
                <a href={`https://max.ru/u/${client.vk.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors">MAX</a>
              )}
              {client.telegram && (
                <a href={`https://t.me/${client.telegram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors">Telegram</a>
              )}
              {client.whatsapp && (
                <a href={`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors">WhatsApp</a>
              )}
            </div>
          </div>

          {/* Доставка */}
          <div>
            <h3 className="text-white font-semibold mb-3">Доставка</h3>
            <ul className="text-sm space-y-1">
              <li>🚚 По городу — от 500 ₽</li>
              <li>📦 По России — СДЭК, Деловые Линии</li>
              <li>🏪 Самовывоз — бесплатно</li>
            </ul>
            <p className="text-xs mt-3 text-gray-500">
              Срок обработки заказа: 1–2 рабочих дня
            </p>
          </div>
        </div>

        {/* Низ footer */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© {year} {client.company_name}. Все права защищены.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="/offer" className="hover:text-white transition-colors">
              Оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
