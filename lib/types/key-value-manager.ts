import { JsonValue } from 'types/general';

export type Options = {
  updateProcessEnv?: boolean
}

export type GetOptions = {
  invalidate?: boolean
}

export type KeyValueData = Record<string, JsonValue>

export type IKeyValueManager = {
  getKeys(_options?: GetOptions): Array<string>;

  get(_key: string, _options?: GetOptions): JsonValue | undefined;
}
