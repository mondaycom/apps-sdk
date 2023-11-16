import { StatusCodes } from 'http-status-codes';

export enum ERROR_CODE {
  GENERAL = 'general',
  NOT_IMPLEMENTED = 'not implemented',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not found',
  BAD_REQUEST = 'bad request',
  INTERNAL_SERVER = 'internal server error'
}

export class BaseError extends Error {
  constructor(public errorCode: ERROR_CODE, public message: string, public status: StatusCodes) {
    super(message);
  }
}

export class ImplementationError extends BaseError {
  constructor(public message: string) {
    super(ERROR_CODE.NOT_IMPLEMENTED, message, StatusCodes.NOT_IMPLEMENTED);
  }
}

export class NotFoundError extends BaseError {
  constructor(public message: string) {
    super(ERROR_CODE.NOT_FOUND, message, StatusCodes.NOT_FOUND);
  }
}

export class BadRequestError extends BaseError {
  constructor(public message: string) {
    super(ERROR_CODE.BAD_REQUEST, message, StatusCodes.BAD_REQUEST);
  }
}

export class InternalServerError extends BaseError {
  constructor(public message: string) {
    super(ERROR_CODE.INTERNAL_SERVER, message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export class ForbiddenError extends BaseError {
  constructor(public message: string) {
    super(ERROR_CODE.FORBIDDEN, message, StatusCodes.FORBIDDEN);
  }
}

