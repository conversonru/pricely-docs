import { getClientBySlug } from '@/lib/catalog'
import { CatalogHeader } from '@/components/catalog/CatalogHeader'
import { CatalogFooter } from '@/components/catalog/CatalogFooter'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ clientSlug: string }>
}

export default async function ClientCatalogLayout({ children, params }: LayoutProps) {
  const { clientSlug } = await params
  const client = await getClientBySlug(clientSlug)

  if (!client) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CatalogHeader client={client} clientSlug={clientSlug} />
      <div className="flex-1">{children}</div>
      <CatalogFooter client={client} />
    </div>
  )
}
