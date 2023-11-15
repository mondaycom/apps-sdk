import { BadRequestError, InternalServerError } from 'errors/apps-sdk-error';
import { RequestOptions } from 'types/fetch';
import { isDefined } from 'types/guards';
import { IStorageInstance, Options, SetResponse, Token } from 'types/storage';
import { fetchWrapper } from 'utils/fetch-wrapper';
import { Logger } from 'utils/logger';

const logger = new Logger('Storage', { mondayInternal: true });

const getStorageUrl = () => {
  const url = process.env.STORAGE_URL || 'https://apps-storage.monday.com/app_storage_api/v2';
  return url;
};

const getToken = (token?: Token, options: Options = {}): Token => {
  const selectedToken = options.token || token;

  if (!isDefined(selectedToken)) {
    throw new BadRequestError('Missing token');
  }

  return selectedToken;
};

const generateCrudPath = (key: string, options: Options) => {
  if (!isDefined(key)) {
    throw new BadRequestError('Missing key');
  }

  const { shared } = options;
  const storageUrl = getStorageUrl();
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const fullPath = `${storageUrl}/${key}?shareGlobally=${!!shared}`;
  return fullPath;
};

const storageFetch = async <T>(key: string, initToken: Token | undefined, externalOptions: Options, options: RequestOptions) => {
  const { method, body } = options;
  const token = getToken(initToken, externalOptions);
  const stringifiedBody = JSON.stringify(body);
  const url = generateCrudPath(key, externalOptions);
  if (!isDefined(method)) {
    throw new InternalServerError('An error occurred');
  }

  const headers = {
    Authorization: token,
    'Content-Type': 'application/json'
  };

  let response: T | undefined;
  try {
    response = await fetchWrapper<T>(url, {
      method,
      headers,
      ...(body && { body: stringifiedBody })
    });
  } catch (error: unknown) {
    logger.debug('[storageFetch] Unexpected error occurred while communicating with storage', { error: error as Error });
    throw new InternalServerError('An issue occurred while accessing storage');
  }

  return response as T;
};

export class Storage implements IStorageInstance {
  constructor(private token?: Token) {
  }

  async delete(key: string, options: Options = {}) {
    await storageFetch(key, this.token, options, { method: 'DELETE' });
    logger.info(`[Storage.delete] Deleted data for key from storage\nkey: ${key}`, { mondayInternal: false });
    return true;
  }

  async get<T>(key: string, options: Options = {}) {
    const result = await storageFetch<T>(key, this.token, options, { method: 'GET' });
    logger.info(`[Storage.get] Got data for key from storage\nkey: ${key}`, { mondayInternal: false });
    if (!isDefined(result)) {
      return null;
    }

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

    logger.info(`[Storage.set] Set data for key in storage\nkey: ${key}`, { mondayInternal: false });
    const { version, error } = result;
    if (version) {
      return { version, success: true };
    } else {
      if (error) {
        return { error, success: false };
      } else {
        return { error: 'unknown error occurred', success: false };
      }
    }
  }
}
