/**
 * Sends a Telegram message to the admin chat.
 * Errors are logged but never thrown — webhook must not fail due to notification issues.
 */
export async function notifyAdmin(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  if (!token || !chatId) {
    console.error('[telegram-notify] TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is not set')
    return
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const body = await res.text()
      console.error('[telegram-notify] Telegram API error:', res.status, body)
    }
  } catch (err) {
    console.error('[telegram-notify] Failed to send notification:', err)
  }
}
