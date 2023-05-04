export type Token = string;

export type Options = {
  token?: Token,
  previousVersion?: string
}

export type SetResponse = {
  version: string
}

export type IStorageInstance = {
  set: <T extends object>(key: string, value: T, options?: Options) => Promise<SetResponse>
  get: <T extends object>(key: string, options?: Options) => Promise<T>
  delete: (key: string, options?: Options) => Promise<boolean>
}
