import { BadRequestError, InternalServerError , TooManyRequestsError } from 'errors/apps-sdk-error';
import { getGcpConnectionData, getGcpIdentityToken } from 'lib/gcp/gcp';
import { MONDAY_CODE_RESERVED_PRIMITIVES_KEY } from 'lib/secure-storage/secure-storage.consts';
import { RequestOptions } from 'types/fetch';
import { GcpConnectionData } from 'types/gcp';
import { JsonValue } from 'types/general';
import { isDefined } from 'types/guards';
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
import { isObject } from 'utils/validations';

const logger = new Logger('SecureStorage', { mondayInternal: true });
const MIN_TOKEN_EXPIRE_TTL_HOURS = 0.05;

const secureStorageFetch = async <T>(path: string, connectionData: ConnectionData, options: RequestOptions): Promise<T | undefined> => {
  const { method = 'GET', body } = options;
  
  if (!isDefined(path)) {
    throw new BadRequestError('`path` must be provided');
  }
  
  const { token, identityToken } = connectionData;
  
  const fetchObj = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'X-Vault-Token': token }),
      ...(identityToken && { 'Authorization': `Bearer ${identityToken}` })
    },
    method,
    body: body ? JSON.stringify(body) : undefined
  };
  
  let result: VaultBaseResponse | undefined;
  try {
    result = await fetchWrapper<VaultBaseResponse>(path, fetchObj);
  } catch (error: unknown) {
    logger.error('entered catch', { error: error as Error });
    if (error instanceof TooManyRequestsError) {
      logger.warn('[secureStorageFetch] Rate limit exceeded while communicating with secure storage', { error: error as Error });
      throw error;
    }
    logger.error('[secureStorageFetch] Unexpected error occurred while communicating with secure storage', { error: error as Error });
    throw new InternalServerError('An issue occurred while accessing secure storage');
  }
  
  if (!isDefined(result)) {
    return;
  }
  
  if (isDefined(result.errors)) {
    logger.warn(`[secureStorageFetch] Errors occurred while communicating with secure storage.\nErrors: ${result.errors.join()}`);
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
    logger.error('[generateCrudPath] projectId is not defined');
    throw new InternalServerError('An issue occurred while accessing secure storage');
  }
  
  const generalSecretPath = 'v1/kv/data';
  const fullPath = `${secureStorageAddress}/${generalSecretPath}/${id}/${path}`;
  
  return fullPath;
};

const getToken = async (gcpCredentials: GcpConnectionData, connectionData: ConnectionData): Promise<Token> => {
  const { secureStorageAddress } = getMondayCodeContext();
  const loginUrl = `${secureStorageAddress}/v1/auth/gcp/login`;
  const body = JSON.stringify({
    role: gcpCredentials.projectId,
    jwt: gcpCredentials.token
  });
  
  const loginResponse = await fetchWrapper<VaultGcpLoginResponse>(loginUrl, {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${connectionData.identityToken}` }
  });
  
  if (!isDefined(loginResponse)) {
    logger.error('[getToken] invalid gcp login response');
    throw new InternalServerError('An error occurred while authenticating');
  }
  
  const token = loginResponse?.auth?.client_token;
  return token;
};

const getTokenExpiry = async (connectionData: ConnectionData) => {
  const { secureStorageAddress } = getMondayCodeContext();
  const lookupUrl = `${secureStorageAddress}/v1/auth/token/lookup-self`;
  const response = await secureStorageFetch<VaultLookupResponse>(lookupUrl, connectionData, { method: 'GET' });
  if (!isDefined(response)) {
    throw new InternalServerError('An error occurred while authenticating');
  }
  
  return response.expire_time;
};

const getConnectionData = async (connectionData: ConnectionData): Promise<ConnectionData> => {
  const gcpCredentials = await getGcpConnectionData();
  connectionData.token = await getToken(gcpCredentials, connectionData);
  const expireTime = await getTokenExpiry(connectionData);
  
  const { token, identityToken } = connectionData;
  
  return { token, expireTime, id: gcpCredentials.projectId, identityToken };
};

const authenticate = async (connectionData: ConnectionData): Promise<ConnectionData> => {
  validateEnvironment();
  if (!isDefined(connectionData)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connectionData = {};
  }
  
  connectionData.identityToken = await getGcpIdentityToken(connectionData?.identityToken);
  
  if (!isDefined(connectionData.token)) {
    return await getConnectionData(connectionData);
  }
  
  const { expireTime, token, id, identityToken } = connectionData;
  const tokenTtlInHours = ((new Date(expireTime)).getTime() - (new Date()).getTime()) / TIME_IN_MILLISECOND.HOUR;
  const ttlPassedThreshold = tokenTtlInHours <= MIN_TOKEN_EXPIRE_TTL_HOURS;
  if (ttlPassedThreshold) {
    logger.info(`[authenticate] TTL PASSED ${JSON.stringify({ tokenTtlInHours, expireTime })}`);
    return await getConnectionData(connectionData);
  }
  
  if (!isDefined(id)) {
    logger.error('[authenticate] projectId is not defined');
    throw new InternalServerError('An issue occurred while accessing secure storage');
  }
  
  return { token, expireTime, id, identityToken };
};

let connectionData: ConnectionData;

export class SecureStorage implements ISecureStorageInstance {
  
  constructor() {
    validateEnvironment();
  }
  
  async delete(key: string) {
    connectionData = await authenticate(connectionData);
    const fullPath = generateCrudPath(key, connectionData.id);
    await secureStorageFetch<VaultBaseResponse>(fullPath, connectionData, { method: 'DELETE' });
    return true;
  }
  
  async get<T>(key: string) {
    connectionData = await authenticate(connectionData);
    const fullPath = generateCrudPath(key, connectionData.id);
    const result = await secureStorageFetch<VaultBaseResponse>(fullPath, connectionData, { method: 'GET' });
    if (!isDefined(result) || !isDefined(result?.data)) {
      return null;
    }
    
    if (result.data?.[MONDAY_CODE_RESERVED_PRIMITIVES_KEY]) {
      return result.data[MONDAY_CODE_RESERVED_PRIMITIVES_KEY] as T;
    }
    
    return result.data as T;
  }
  
  async set<T extends JsonValue>(key: string, value: T) {
    connectionData = await authenticate(connectionData);
    const fullPath = generateCrudPath(key, connectionData.id);
    const formalizedValue = isObject(value) ? value : { [MONDAY_CODE_RESERVED_PRIMITIVES_KEY]: value };
    await secureStorageFetch<VaultBaseResponse>(fullPath, connectionData, {
      method: 'PUT',
      body: { data: formalizedValue }
    });
    return true;
  }
}
