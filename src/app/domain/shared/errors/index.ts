/**
 * Shared Errors
 * 
 * 共享的錯誤類型,可在所有領域模型中使用
 */

export {
  DomainError,
  isDomainError,
  fromUnknownError,
  GenericDomainError,
  NotFoundError,
  ConflictError,
  BusinessRuleViolationError,
} from './domain.error';

export {
  ValidationError,
  ValidationFieldError,
  RequiredFieldError,
  InvalidFormatError,
  OutOfRangeError,
  InvalidLengthError,
  DuplicateValueError,
} from './validation.error';

export {
  AuthorizationError,
  UnauthenticatedError,
  InsufficientPermissionError,
  InsufficientRoleError,
  NotResourceOwnerError,
  QuotaExceededError,
} from './authorization.error';
