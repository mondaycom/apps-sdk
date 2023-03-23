export type ISecureStorageInstance = {
  set: <T extends object>(key: string, value: T) => Promise<boolean>
  get: <T extends object>(key: string) => Promise<T>
  delete: (key: string) => Promise<boolean>
}

export type Token = string;
export type ExpireTime = string;
export type AppId = string;

export type ConnectionData = {
  token: Token,
  expireTime: ExpireTime,
  id: AppId
}

export type VaultBaseResponse = {
  errors?: Array<string>,
  data?: {
    data: object
  }
}

export type VaultLookupResponse = {
  expire_time: ExpireTime
}

export type VaultGcpLoginResponse = {
  auth: {
    client_token: Token
  }
}
