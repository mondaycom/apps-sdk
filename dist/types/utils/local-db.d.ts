import { ILocalStorageInstance } from '../types/secure-storage.local';
export declare const deleteDb: (dbName?: string) => void;
export declare class LocalMemoryDb implements ILocalStorageInstance {
    set<T>(key: string, value: T): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    get<T>(key: string): Promise<T | null>;
}
export declare class LocalDb implements ILocalStorageInstance {
    private readonly dbFilePath;
    private memoryData;
    constructor(dbFileName?: string);
    set<T>(key: string, value: T): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    get<T>(key: string): Promise<T | null>;
}
export declare const initDb: (dbName?: string) => LocalMemoryDb | LocalDb;
