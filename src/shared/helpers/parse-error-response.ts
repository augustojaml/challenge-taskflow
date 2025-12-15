import { AxiosError } from 'axios'

import { ErrorCodes } from '@/shared/core/enums/error-codes'

export type ErrorCode = keyof typeof ErrorCodes
export type ErrorCodeValue = (typeof ErrorCodes)[ErrorCode]

export const getResponseErrorCode = (
  error: unknown,
  returnType: 'message' | 'key' = 'message',
): string => {
  const ptBrMap: Partial<Record<ErrorCodeValue, string>> = {
    USER_ALREADY_EXISTS: 'Já existe um usuário com esses dados!',
    RESOURCE_NOT_FOUND: 'Recurso não encontrado',
    UNAUTHORIZED: 'Acesso não autorizado',
    VALIDATION_ERROR: 'Erro de validação',
    INVALID_STATUS_TYPE: 'Tipo de status inválido',
    INVALID_BID_AMOUNT: 'Valor do lance inválido',
    GENERIC_ERROR: 'Ocorreu um erro inesperado',
  }
  console.log('Error received in getResponseErrorCode:', error)

  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | {
          error?: {
            errorCode?: string
          }
        }
      | undefined

    const code = responseData?.error?.errorCode

    if (
      typeof code === 'string' &&
      Object.values(ErrorCodes).includes(code as ErrorCodeValue)
    ) {
      if (returnType === 'key') {
        return code
      }

      return ptBrMap[code as ErrorCodeValue] ?? 'Ocorreu um erro inesperado'
    }
  }

  if (error instanceof Error) {
    return returnType === 'key' ? ErrorCodes.GENERIC_ERROR : error.message
  }

  return returnType === 'key'
    ? ErrorCodes.GENERIC_ERROR
    : 'Ocorreu um erro inesperado'
}
