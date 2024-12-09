import { BaseStorage } from 'lib/storage/base-storage';
import { JsonValue } from 'types/general';
import { isDefined } from 'types/guards';
import {
  CounterOptions,
  CounterResponse,
  ErrorResponse,
  GetResponse,
  GetServerResponse,
  IStorageInstance,
  Options,
  Period, SearchOptions, SearchResponse, SearchServerResponse,
  SetResponse,
} from 'types/storage';


export class Storage extends BaseStorage implements IStorageInstance {

  async incrementCounter(period: Period, options?: CounterOptions) {
    const result = await this.storageFetchV2<CounterResponse>(this.counterUrl(), {
      method: 'PUT',
      body: { ...(options || {}), period },
    });
    const { error, message, newCounterValue } = result || {};
    if (result?.error) {
      return { error: error, success: false };
    } else {
      return { message, newCounterValue, success: true };
    }
  }

  async delete(key: string, options?: Options) {
    const result = await this.storageFetch<ErrorResponse>(key, { method: 'DELETE' }, options);
    if (result?.error) {
      return { error: result.error, success: false };
    } else {
      return { success: true };
    }
  }

  async search<T extends JsonValue>(key: string, options: SearchOptions = {}): Promise<SearchResponse<T>> {
    const url = this.searchUrl(key, options);
    const params = { method: 'GET' };
    const result = await this.storageFetchV2<SearchServerResponse<T>>(url, params);
    if (!isDefined(result)) {
      return { success: false, records: null };
    }

    return { success: true, records: result.records };
  }

  async get<T extends JsonValue>(key: string, options: Options = {}): Promise<GetResponse<T>> {
    const result = await this.storageFetch<GetServerResponse<T>>(key, { method: 'GET' }, options);
    if (!isDefined(result)) {
      return { success: false, value: null };
    }

    const { version, value } = result;

    return { success: true, value, version };
  }

  async set(key: string, value, options: Options = {}) {
    const { previousVersion } = options;

    const result = await this.storageFetch<SetResponse>(key, {
      method: 'POST',
      body: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value,
        ...previousVersion && { previous_version: previousVersion },
      },
    }, options);

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
