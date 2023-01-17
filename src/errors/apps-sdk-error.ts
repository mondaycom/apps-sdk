export enum ERROR_CODE {
  GENERAL = 'general',
  RECORD_NOT_FOUND = 'recordNotFound',
  CONFLICT = 'conflict',
}
export class ServiceError extends Error {
  constructor(public errorCode: ERROR_CODE, public title: string, public message: string) {
    super(message);
  }
}
