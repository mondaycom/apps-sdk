import { JsonValue } from 'types/general';

export type Options = {
  updateProcessEnv?: boolean
}

export type GetOptions = {
  invalidate?: boolean
}

export type EnvironmentData = Record<string, JsonValue>

export type IEnvironmentVariablesManager = {
  getKeys(_options?: GetOptions): Array<string>;
  
  get(_key: string, _options?: GetOptions): JsonValue;
}
