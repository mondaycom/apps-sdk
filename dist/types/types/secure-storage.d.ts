import { JsonValue } from './general';
export type ISecureStorageInstance = {
    set: <T extends JsonValue>(key: string, value: T) => Promise<boolean>;
    get: <T extends JsonValue>(key: string) => Promise<T | null>;
    delete: (key: string) => Promise<boolean>;
};
export type Token = string;
export type ExpireTime = string;
export type AppId = string;
export type ConnectionData = {
    token: Token;
    expireTime: ExpireTime;
    id: AppId;
    identityToken: Token;
};
export type VaultBaseResponse = {
    errors?: Array<string>;
    data?: {
        data: object;
    };
};
export type VaultLookupResponse = {
    expire_time: ExpireTime;
};
export type VaultGcpLoginResponse = {
    auth: {
        client_token: Token;
    };
};
