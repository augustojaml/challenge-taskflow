import { BaseError } from '../abstracts/base-error'
import { ErrorCodes } from '../enums/error-codes'

export class UnauthorizedError extends BaseError {
  constructor() {
    super('Unauthorized', 401, ErrorCodes.UNAUTHORIZED)
    this.name = 'UnauthorizedError'
  }
}
