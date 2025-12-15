import { ErrorCodes } from '@/shared/core/error-codes'

class BaseError extends Error {
  public readonly statusCode: number
  public readonly errorCode: ErrorCodes

  constructor(
    message: string,
    statusCode = 400,
    errorCode: ErrorCodes = ErrorCodes.GENERIC_ERROR,
  ) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}

export { BaseError }
