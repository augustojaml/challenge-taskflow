import { DefaultError } from '@/shared/components/custom/error-page'

export default function NotFound() {
  return (
    <DefaultError
      errorCode={404}
      title="Página nao encontrada"
      message="A página que você está procurando não existe ou foi movida."
    />
  )
}
