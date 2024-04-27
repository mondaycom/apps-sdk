import { JsonValue } from '../types/general';
import { ISecureStorageInstance } from '../types/secure-storage';
export declare class SecureStorage implements ISecureStorageInstance {
    constructor();
    delete(key: string): Promise<boolean>;
    get<T>(key: string): Promise<T | null>;
    set<T extends JsonValue>(key: string, value: T): Promise<boolean>;
}
