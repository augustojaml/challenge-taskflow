import { BaseError } from '../abstracts/base-error'
import { ErrorCodes } from '../enums/error-codes'

export class ResourceAlreadyExistsError extends BaseError {
  constructor() {
    super('Resource already exists', 409, ErrorCodes.RESOURCE_ALREADY_EXISTS)
    this.name = 'ResourceAlreadyExistsError'
  }
}
