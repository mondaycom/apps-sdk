export type Token = string;
export enum Period {
  DAILY='DAILY',
  MONTHLY='MONTHLY',
  YEARLY='YEARLY'
}


export type Options = {
  shared?: boolean,
  previousVersion?: string
}

export type counterOptions = {
  incrementBy?: number,
  kind?: string
}

export type GetResponse = {
  version?: string
  success: boolean
  error?: string
}


export type CounterResponse = {
  message: string
  newCounterValue: number
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
