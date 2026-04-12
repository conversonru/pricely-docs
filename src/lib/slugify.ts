// src/lib/slugify.ts

const RU_MAP: Record<string, string> = {
  а: 'a',  б: 'b',  в: 'v',  г: 'g',  д: 'd',
  е: 'e',  ё: 'yo', ж: 'zh', з: 'z',  и: 'i',
  й: 'j',  к: 'k',  л: 'l',  м: 'm',  н: 'n',
  о: 'o',  п: 'p',  р: 'r',  с: 's',  т: 't',
  у: 'u',  ф: 'f',  х: 'kh', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sch',ъ: '',   ы: 'y',  ь: '',
  э: 'e',  ю: 'yu', я: 'ya',
}

/**
 * Транслитерирует русский текст в URL-friendly slug.
 * Пример: "Втулка резиновая 50х30" → "vtulka-rezinovaya-50h30"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((c) => RU_MAP[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

/**
 * Генерирует slug для товара из названия + артикула.
 * Артикул добавляется в конец для уникальности.
 * Пример: name="Болт М10x50", sku="B-042" → "bolt-m10x50-b-042"
 */
export function productSlug(name: string, sku: string): string {
  const namePart = slugify(name)
  const skuPart = slugify(sku)
  return `${namePart}-${skuPart}`.replace(/-+/g, '-').slice(0, 100)
}
