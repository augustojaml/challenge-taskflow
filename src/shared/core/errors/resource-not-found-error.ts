import { BaseError } from '../abstracts/base-error'
import { ErrorCodes } from '../enums/error-codes'

export class ResourceNotFoundError extends BaseError {
  constructor() {
    super('Resource not found', 404, ErrorCodes.RESOURCE_NOT_FOUND)
    this.name = 'ResourceNotFoundError'
  }
}
