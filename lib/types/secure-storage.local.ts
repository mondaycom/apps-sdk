export type ILocalStorageInstance = {
  set: <T>(key: string, value: T) => Promise<boolean>;
  get: <T>(key: string) => Promise<T>;
  delete: (key: string) => Promise<boolean>;
}
