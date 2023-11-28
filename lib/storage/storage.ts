import {BaseStorage} from 'lib/storage/base-storage';
import { isDefined } from 'types/guards';
import { ErrorResponse, IStorageInstance, Options, SetResponse } from 'types/storage';

export class Storage extends BaseStorage implements IStorageInstance {

  async delete(key: string, options: Options = {}) {
    const result = await this.storageFetch<ErrorResponse>(key, this.token, options, {method: 'DELETE'});
    if (result?.error) {
      return { error: result.error, success: false };
    } else {
      return { success: true };
    }
  }

  async get<T>(key: string, options: Options = {}) {
    const result = await this.storageFetch<T>(key, this.token, options, { method: 'GET' });
    if (!isDefined(result)) {
      return { success: false, value: null };
    }

    return { success: true, ...result };
  }

  async set(key: string, value, options: Options = {}) {
    const { previousVersion } = options;

    const result = await this.storageFetch<SetResponse>(key, this.token, options, {
      method: 'POST',
      body: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value,
        ...previousVersion && { previous_version: previousVersion }
      }
    });

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
