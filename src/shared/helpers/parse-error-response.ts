import { AxiosError } from 'axios'

import { ErrorCodes } from '../core/enums/error-codes'

export type ErrorCode = keyof typeof ErrorCodes
export type ErrorCodeValue = (typeof ErrorCodes)[ErrorCode]

export const getResponseErrorCode = (
  error: unknown,
  returnType: 'message' | 'key' = 'message',
): string => {
  if (error instanceof AxiosError) {
    const code = error.response?.data?.code ?? error.code

    if (
      typeof code === 'string' &&
      Object.values(ErrorCodes).includes(code as ErrorCodeValue)
    ) {
      return returnType === 'key' ? (code as ErrorCode) : code
    }
  }

  if (error instanceof Error) {
    return returnType === 'key' ? ErrorCodes.GENERIC_ERROR : error.message
  }

  return returnType === 'key' ? ErrorCodes.GENERIC_ERROR : 'Unexpected error'
}
