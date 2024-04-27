import { StatusCodes } from 'http-status-codes';
export declare enum ERROR_CODE {
    GENERAL = "general",
    NOT_IMPLEMENTED = "not implemented",
    FORBIDDEN = "forbidden",
    NOT_FOUND = "not found",
    BAD_REQUEST = "bad request",
    INTERNAL_SERVER = "internal server error"
}
export declare class BaseError extends Error {
    errorCode: ERROR_CODE;
    message: string;
    status: StatusCodes;
    constructor(errorCode: ERROR_CODE, message: string, status: StatusCodes);
}
export declare class ImplementationError extends BaseError {
    message: string;
    constructor(message: string);
}
export declare class NotFoundError extends BaseError {
    message: string;
    constructor(message: string);
}
export declare class BadRequestError extends BaseError {
    message: string;
    constructor(message: string);
}
export declare class InternalServerError extends BaseError {
    message: string;
    constructor(message: string);
}
export declare class ForbiddenError extends BaseError {
    message: string;
    constructor(message: string);
}
