import { ErrorCodes } from '@/shared/core/error-codes'

import { BaseError } from './base-error'

export class ResourceNotFoundError extends BaseError {
  constructor() {
    super('Resource not found', 404, ErrorCodes.RESOURCE_NOT_FOUND)
    this.name = 'ResourceNotFoundError'
  }
}
