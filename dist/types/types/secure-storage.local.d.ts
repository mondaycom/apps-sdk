export type ILocalStorageInstance = {
    set: <T>(key: string, value: T) => Promise<boolean>;
    get: <T>(key: string) => Promise<T | null>;
    delete: (key: string) => Promise<boolean>;
};
