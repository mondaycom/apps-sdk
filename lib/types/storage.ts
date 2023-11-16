export type Token = string;

export type Options = {
  token?: Token,
  shared?: boolean,
  previousVersion?: string
}

export type GetResponse = {
  version?: string
  success: boolean
  error?: string
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
  get: (key: string, options?: Options) => Promise<GetResponse>
  delete: (key: string, options?: Options) => Promise<DeleteResponse>
}
