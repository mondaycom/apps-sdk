import { JsonValue } from './general';
export type Token = string;
export declare enum Period {
    DAILY = "DAILY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}
export type Options = {
    shared?: boolean;
    previousVersion?: string;
};
export type CounterOptions = {
    incrementBy?: number;
    kind?: string;
    renewalDate?: Date;
};
export type GetServerResponse<T extends JsonValue> = {
    version?: string;
    value: T | null;
};
export type GetResponse<T extends JsonValue> = {
    success: boolean;
    error?: string;
} & GetServerResponse<T>;
export type CounterResponse = {
    message: string;
    newCounterValue: number;
    error?: string;
};
export type SetResponse = {
    version?: string;
    success: boolean;
    error?: string;
};
export type DeleteResponse = {
    success: boolean;
    error?: string;
};
export type ErrorResponse = {
    error?: string;
} | undefined | null;
export type IStorageInstance = {
    set: <T extends JsonValue>(key: string, value: T, options?: Options) => Promise<SetResponse>;
    get: <T extends JsonValue>(key: string, options?: Options) => Promise<GetResponse<T>>;
    delete: (key: string, options?: Options) => Promise<DeleteResponse>;
};
