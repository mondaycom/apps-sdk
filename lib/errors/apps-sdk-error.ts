export enum ERROR_CODE {
  GENERAL = 'general'
}
export class BaseError extends Error {
  constructor(public errorCode: ERROR_CODE, public message: string) {
    super(message);
  }
}
