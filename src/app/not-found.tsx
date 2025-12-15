import { ErrorPage } from '@/shared/components'

export default function NotFound() {
  return (
    <ErrorPage
      errorCode={404}
      title="Página não encontrada"
      message="A página que você está procurando não existe ou foi movida."
      homeHref="/"
      showRetry={false}
    />
  )
}
