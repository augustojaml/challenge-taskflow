import { ErrorCodes } from '@/shared/core/error-codes'

import { BaseError } from './base-error'

export class UnauthorizedError extends BaseError {
  constructor() {
    super('Unauthorized', 401, ErrorCodes.UNAUTHORIZED)
    this.name = 'UnauthorizedError'
  }
}
