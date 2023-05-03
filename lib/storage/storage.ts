import { BadRequestError, InternalServerError } from 'errors/apps-sdk-error';
import { RequestOptions } from 'types/fetch';
import { isDefined } from 'types/guards';
import { IStorageInstance, Options, SetResponse, Token } from 'types/storage';
import { fetchWrapper } from 'utils/fetch-wrapper';
import { Logger } from 'utils/logger';

const logger = new Logger('Storage', { passThrough: false });
const LOGGER_TAG = 'Storage';
const STORAGE_URL = 'https://apps-storage.monday.com/app_storage_api/v2';

const getToken = (token?: Token, options: Options = {}): Token => {
  const selectedToken = options.token || token;
  
  if (!isDefined(selectedToken)) {
    throw new BadRequestError('Missing token');
  }
  
  return selectedToken;
};

const generateCrudPath = (key: string) => {
  if (!isDefined(key)) {
    throw new BadRequestError('Missing key');
  }
  
  const fullPath = `${STORAGE_URL}/${key}`;
  return fullPath;
};

const storageFetch = async <T>(key: string, initToken: Token | undefined, externalOptions: Options, options: RequestOptions) => {
  const { method, body } = options;
  const token = getToken(initToken, externalOptions);
  const stringifiedBody = JSON.stringify(body);
  const url = generateCrudPath(key);
  if (!isDefined(method)) {
    throw new InternalServerError('An error occurred');
  }
  
  const headers = {
    Authorization: token,
    'Content-Type': 'application/json'
  };
  
  const response = await fetchWrapper<T>(url, {
    method,
    headers,
    ...(body && { body: stringifiedBody })
  });
  
  return response as T;
};

export class Storage implements IStorageInstance {
  constructor(private token?: Token) {
  }
  
  async delete(key: string, options: Options = {}) {
    await storageFetch(key, this.token, options, { method: 'DELETE' });
    logger.info(`[${LOGGER_TAG}] Deleted data for key from storage\nkey: ${key}`, { passThrough: true });
    return true;
  }
  
  async get<T>(key: string, options: Options = {}) {
    const result = await storageFetch<T>(key, this.token, options, { method: 'GET' });
    logger.info(`[${LOGGER_TAG}] Got data for key from storage\nkey: ${key}`, { passThrough: true });
    return result;
  }
  
  async set(key: string, value, options: Options = {}) {
    const { previousVersion } = options;
    
    const result = await storageFetch<SetResponse>(key, this.token, options, {
      method: 'POST',
      body: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value,
        ...previousVersion && { previous_version: previousVersion }
      }
    });
    
    logger.info(`[${LOGGER_TAG}] Set data for key in storage\nkey: ${key}`, { passThrough: true });
    const { version } = result;
    return { version };
  }
}
