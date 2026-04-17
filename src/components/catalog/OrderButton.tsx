import { buildWhatsAppUrl, buildTelegramUrl, buildMaxUrl } from '@/lib/catalog'
import type { Client, Product } from '@/types'

interface OrderButtonProps {
  client: Client
  product: Product
}

export function OrderButton({ client, product }: OrderButtonProps) {
  const hasMax = Boolean(client.vk)
  const hasTelegram = Boolean(client.telegram)
  const hasWhatsApp = Boolean(client.whatsapp)

  if (!hasMax && !hasTelegram && !hasWhatsApp) return null

  return (
    <div className="flex flex-col gap-2 w-full">
      {hasMax && (
        <a
          href={buildMaxUrl(client.vk!, product.name, product.sku)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#0077FF] hover:bg-[#0066DD] text-white font-semibold rounded-xl transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.27h-1.5c-.57 0-.74-.45-1.76-1.49-.88-.86-1.27-.98-1.49-.98-.3 0-.39.09-.39.51v1.36c0 .36-.11.57-1.05.57-1.55 0-3.26-.94-4.47-2.7-1.82-2.55-2.31-4.46-2.31-4.85 0-.22.09-.42.51-.42h1.5c.38 0 .52.17.67.57.74 2.12 1.97 3.98 2.48 3.98.19 0 .28-.09.28-.57V9.38c-.06-1.03-.6-1.12-.6-1.49 0-.18.15-.36.39-.36h2.36c.32 0 .43.17.43.54v2.9c0 .32.14.43.23.43.19 0 .35-.11.7-.47 1.08-1.21 1.85-3.07 1.85-3.07.1-.22.28-.42.66-.42h1.5c.45 0 .55.23.45.54-.19.88-2.03 3.47-2.03 3.47-.16.26-.22.38 0 .67.16.22.68.67 1.03 1.08.64.73 1.13 1.34 1.26 1.76.14.41-.08.62-.51.62z"/>
          </svg>
          Заказать в MAX
        </a>
      )}
      {hasTelegram && (
        <a
          href={buildTelegramUrl(client.telegram!, product.name, product.sku)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Заказать в Telegram
        </a>
      )}
      {hasWhatsApp && (
        <a
          href={buildWhatsAppUrl(client.whatsapp!, product.name, product.sku)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Заказать в WhatsApp
        </a>
      )}
    </div>
  )
}
