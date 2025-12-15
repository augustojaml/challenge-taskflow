import { DefaultError } from '@/shared/components/custom/error-page'

export default function NotFound() {
  return <DefaultError errorCode={404} />
}
