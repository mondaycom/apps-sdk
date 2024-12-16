import { JsonValue } from 'types/general';

export type Token = string;

export enum Period {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}


export type Options = {
  shared?: boolean,
  previousVersion?: string
}

export type CounterOptions = {
  incrementBy?: number,
  kind?: string
  renewalDate?: Date
}

export type SearchOptions = {
  cursor?: string
}

export type GetServerResponse<T extends JsonValue> = {
  version?: string
  value: T | null
}

export type GetResponse<T extends JsonValue> = {
  success: boolean
  error?: string
} & GetServerResponse<T>

export type SearchEntity<T extends JsonValue> = {
  key: string
  value: T
  backendOnly: boolean
}

export type SearchServerResponse<T extends JsonValue> = {
  records: Array<SearchEntity<T>> | null
  cursor?: string
  error?: string
}

export type SearchResponse<T extends JsonValue> = {
  success: boolean
  error?: string
} & SearchServerResponse<T>

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
  set: <T extends JsonValue>(key: string, value: T, options?: Options) => Promise<SetResponse>
  get: <T extends JsonValue>(key: string, options?: Options) => Promise<GetResponse<T>>
  delete: (key: string, options?: Options) => Promise<DeleteResponse>
}
