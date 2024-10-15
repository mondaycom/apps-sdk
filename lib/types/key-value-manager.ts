import { JsonValue } from 'types/general';

export type Options = {
  updateProcessEnv?: boolean
}

export type GetOptions = {
  invalidate?: boolean
}

export type KeyValueData = Record<string, JsonValue>

export type IKeyValueManager = {
  getKeys(options?: GetOptions): Array<string>;

  get(key: string, options?: GetOptions): JsonValue | undefined;
}
