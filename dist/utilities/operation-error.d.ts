import { HttpStatusCode } from './http-status-code';
export type OperationErrorMessage = 'UNKNOWN_ERROR' | 'EMAIL_IN_USE' | 'NOT_FOUND' | 'INVALID_EMAIL' | 'USERNAME_IS_ALREADY_USED' | 'NOT_CREATED' | 'UNAUTHORIZED ROLE' | 'ERROR_PASSWORD' | 'UNKNOWN_TOKEN' | 'TOKEN_EXPIRED';
export declare class OperationError extends Error {
    readonly status: HttpStatusCode;
    constructor(message: OperationErrorMessage, status: HttpStatusCode);
}
