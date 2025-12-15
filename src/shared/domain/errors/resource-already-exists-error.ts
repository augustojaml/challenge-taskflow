import { ErrorCodes } from '@/shared/core/error-codes'

import { BaseError } from './base-error'

export class ResourceAlreadyExistsError extends BaseError {
  constructor() {
    super('Resource already exists', 409, ErrorCodes.RESOURCE_ALREADY_EXISTS)
    this.name = 'ResourceAlreadyExistsError'
  }
}
