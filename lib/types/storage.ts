export type Token = string;

export type Options = {
  token?: Token,
  shared?: boolean,
  previousVersion?: string
}

export type SetResponse = {
  version?: string
  success: boolean
  error?: string
}

export type DeleteResponse = {
  success: boolean
  error?: string
}

export type ErrorResponse = {
  error?: string
} | undefined | null

export type IStorageInstance = {
  set: <T extends object>(key: string, value: T, options?: Options) => Promise<SetResponse>
  get: <T extends object>(key: string, options?: Options) => Promise<T | null>
  delete: (key: string, options?: Options) => Promise<DeleteResponse>
}
