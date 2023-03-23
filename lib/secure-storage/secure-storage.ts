import { BadRequestError, InternalServerError } from 'errors/apps-sdk-error';
import { getGcpConnectionData } from 'lib/gcp/gcp';
import { RequestOptions } from 'types/fetch';
import { GcpConnectionData } from 'types/gcp';
import { allPropsNotNullOrUndefined, isDefined } from 'types/guards';
import {
  AppId,
  ConnectionData,
  ISecureStorageInstance,
  Token,
  VaultBaseResponse,
  VaultGcpLoginResponse, VaultLookupResponse
} from 'types/secure-storage';
import { getMondayCodeContext, validateEnvironment } from 'utils/env';
import { fetchWrapper } from 'utils/fetch-wrapper';
import { Logger } from 'utils/logger';
import { TIME_IN_MILLISECOND } from 'utils/time-enum';

const logger = new Logger('SecureStorage', { passThrough: false });
const MIN_TOKEN_EXPIRE_TTL_HOURS = 0.5;

const secureStorageFetch = async <T>(path: string, token: Token, options: RequestOptions) => {
  const { method = 'GET', body } = options;
  
  if (!isDefined(path)) {
    throw new BadRequestError('`path` must be provided');
  }
  
  const fetchObj = {
    headers: {
      ...(token && { 'X-Vault-Token': token }),
    },
    method,
    body: body ? JSON.stringify(body) : undefined
  };
  
  const result = await fetchWrapper<VaultBaseResponse>(path, fetchObj);
  
  if (isDefined(result.errors)) {
    logger.debug(`Errors occurred while communicating with secure storage.\nErrors: ${result.errors.join()}`);
    throw new BadRequestError('Provided input is invalid');
  }
  
  if (!isDefined(result.data)) {
    throw new InternalServerError('some thing went wrong when when communicating with secure storage');
  }
  
  return result.data as T;
};

const generateCrudPath = (path: string, id?: AppId) => {
  const { secureStorageAddress } = getMondayCodeContext();
  
  if (!isDefined(path)) {
    throw new BadRequestError('Missing secret key');
  }
  
  if (!isDefined(id)) {
    logger.debug('[generateCrudPath] projectId is not defined');
    throw new InternalServerError('An issue occurred while accessing secure storage');
  }
  
  const generalSecretPath = 'v1/kv/data';
  const fullPath = `${secureStorageAddress}/${generalSecretPath}/${id}/${path}`;
  
  return fullPath;
};

const getToken = async (gcpCredentials: GcpConnectionData): Promise<Token> => {
  const { secureStorageAddress } = getMondayCodeContext();
  const loginUrl = `${secureStorageAddress}/v1/auth/gcp/login`;
  const body = JSON.stringify({
    role: gcpCredentials.projectId,
    jwt: gcpCredentials.token
  });
  
  const loginResponse = await fetchWrapper<VaultGcpLoginResponse>(loginUrl, { method: 'POST', body });
  const token = loginResponse?.auth?.client_token;
  return token;
};

const getTokenExpiry = async (token: Token) => {
  const { secureStorageAddress } = getMondayCodeContext();
  const lookupUrl = `${secureStorageAddress}/v1/auth/token/lookup-self`;
  const response = await secureStorageFetch<VaultLookupResponse>(lookupUrl, token, { method: 'GET' });
  return response.expire_time;
};

const getConnectionData = async (): Promise<ConnectionData> => {
  const gcpCredentials = await getGcpConnectionData();
  const token = await getToken(gcpCredentials);
  const expireTime = await getTokenExpiry(token);
  
  return { token, expireTime, id: gcpCredentials.projectId };
};

const authenticate = async (connectionData: ConnectionData): Promise<ConnectionData> => {
  validateEnvironment();
  if (!isDefined(connectionData) || !allPropsNotNullOrUndefined(connectionData)) {
    return await getConnectionData();
  }
  
  const { expireTime, token, id } = connectionData;
  const tokenTtlInHours = ((new Date(expireTime)).getTime() - (new Date()).getTime()) / TIME_IN_MILLISECOND.HOUR;
  const ttlPassedThreshold = tokenTtlInHours <= MIN_TOKEN_EXPIRE_TTL_HOURS;
  if (ttlPassedThreshold) {
    return await getConnectionData();
  }
  
  if (!isDefined(id)) {
    logger.debug('[authenticate] projectId is not defined');
    throw new InternalServerError('An issue occurred while accessing secure storage');
  }
  
  return { token, expireTime, id };
};

export class SecureStorage implements ISecureStorageInstance {
  private connectionData!: ConnectionData;
  
  constructor() {
    validateEnvironment();
  }
  
  async delete(key: string) {
    this.connectionData = await authenticate(this.connectionData);
    const fullPath = generateCrudPath(key, this.connectionData.id);
    await secureStorageFetch<VaultBaseResponse>(fullPath, this.connectionData.token, { method: 'DELETE' });
    logger.info(`[SecureStorage] Deleted data for key from secure storage\nkey: ${key}`, { passThrough: true });
    return true;
  }
  
  async get<T>(key: string) {
    this.connectionData = await authenticate(this.connectionData);
    const fullPath = generateCrudPath(key, this.connectionData.id);
    const result = await secureStorageFetch<VaultBaseResponse>(fullPath, this.connectionData.token, { method: 'GET' });
    logger.info(`[SecureStorage] Got data for key from secure storage\nkey: ${key}`, { passThrough: true });
    return result.data as T;
  }
  
  async set<T extends object>(key: string, value: T) {
    this.connectionData = await authenticate(this.connectionData);
    const fullPath = generateCrudPath(key, this.connectionData.id);
    await secureStorageFetch<VaultBaseResponse>(fullPath, this.connectionData.token, {
      method: 'PUT',
      body: { data: value }
    });
    logger.info(`[SecureStorage] Set data for key in secure storage\nkey: ${key}`, { passThrough: true });
    return true;
  }
}
