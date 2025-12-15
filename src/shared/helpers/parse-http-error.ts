import { AxiosError } from 'axios'

type HttpErrorResponse = [{ error: string }, { status: number }]

export function toHttpErrorResponse(error: unknown): HttpErrorResponse {
  // AxiosError
  if (error instanceof AxiosError) {
    return [
      {
        error:
          (error.response?.data as { message?: string })?.message ??
          error.message ??
          'Erro interno',
      },
      {
        status: error.response?.status ?? 500,
      },
    ]
  }

  // Error padrão ou custom (com statusCode)
  if (error instanceof Error) {
    const status =
      'statusCode' in error &&
      typeof (error as { statusCode?: unknown }).statusCode === 'number'
        ? (error as { statusCode: number }).statusCode
        : 500

    return [{ error: error.message || 'Erro interno' }, { status }]
  }

  // Fallback
  return [{ error: 'Erro interno' }, { status: 500 }]
}
