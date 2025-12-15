import { BaseError } from '../abstracts/base-error'
import { ErrorCodes } from '../enums/error-codes'

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super('User already exists', 409, ErrorCodes.USER_ALREADY_EXISTS)
    this.name = 'UserAlreadyExistsError'
  }
}
