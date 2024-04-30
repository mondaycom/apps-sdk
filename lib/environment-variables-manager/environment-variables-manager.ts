import fs from 'fs';
import * as process from 'process';

import { JsonValue } from 'types/general';
import { isDefined } from 'types/guards';
import { GetOptions, IKeyValueManager, KeyValueData, Options } from 'types/key-value-manager';
import { isLocalEnvironment } from 'utils/env';
import { Logger } from 'utils/logger';
import { snakeCase } from 'utils/string-manipulations';

const logger = new Logger('EnvironmentVariablesManager', { mondayInternal: true });

const readEnvironmentData = () => {
  const environmentDataFileName = process?.env?.SECRET_NAME; // "monday_secret" // fixme: remove comment
  if (!isDefined(environmentDataFileName)) {
    logger.error('[EnvironmentVariablesManager] Environment file name is not defined');
    return;
  }

  const environmentDataFilePath = `/secrets/${environmentDataFileName}`;
  const isEnvironmentFileExists = fs.existsSync(environmentDataFilePath);
  if (!isEnvironmentFileExists) {
    logger.error('[EnvironmentVariablesManager] Environment file does not exist in path');
    return;
  }

  const environmentData = fs.readFileSync(environmentDataFilePath, 'utf8');
  try {
    return JSON.parse(environmentData) as KeyValueData;
  } catch (error) {
    logger.error('[EnvironmentVariablesManager] Corrupted Environment file. File is not in JSON format');
    return;
  }
};

export class EnvironmentVariablesManager implements IKeyValueManager {
  private cachedEnvironmentData?: KeyValueData;
  private shouldUpdateProcessEnv: boolean;

  constructor(options?: Options) {
    this.shouldUpdateProcessEnv = !!options?.updateProcessEnv;
    this.initEnv(options);
    if (isLocalEnvironment()) {
      logger.info('[EnvironmentVariablesManager] Running in development environment, Using process.env', { mondayInternal: false });
    }
  }

  private initEnvIfNeeded(options?: GetOptions) {
    const shouldInvalidate = options?.invalidate ?? true;
    if (shouldInvalidate || !this.cachedEnvironmentData) {
      this.initEnv();
    }
  }

  private initEnv(options: Options = {}) {
    if (isLocalEnvironment()) {
      this.cachedEnvironmentData = process.env as KeyValueData;
      return;
    }

    const { updateProcessEnv } = options;
    this.shouldUpdateProcessEnv = updateProcessEnv ?? this.shouldUpdateProcessEnv;
    this.cachedEnvironmentData = readEnvironmentData();
    if (!isDefined(this.cachedEnvironmentData)) {
      return;
    }

    if (this.shouldUpdateProcessEnv) {
      Object.entries(this.cachedEnvironmentData).forEach(([key, value]) => {
        const snakeCaseKey = snakeCase(key, { upperCase: true });
        process.env[snakeCaseKey] = value as string;
      });
    }

    logger.info('[EnvironmentVariablesManager] Initialized environment variables data', { mondayInternal: true });
  }

  getKeys(options?: GetOptions): Array<string> {
    this.initEnvIfNeeded(options);
    if (!isDefined(this.cachedEnvironmentData)) {
      logger.error('[EnvironmentVariablesManager.getKeys] There is an issue with loading keys', { mondayInternal: false });
      return [];
    }

    return Object.keys(this.cachedEnvironmentData);
  }

  get(key: string, options?: GetOptions): JsonValue {
    this.initEnvIfNeeded(options);
    if (!isDefined(this.cachedEnvironmentData)) {
      logger.error('[EnvironmentVariablesManager.get] There is an issue with loading data for key', { mondayInternal: false });
      return null;
    }

    return this.cachedEnvironmentData[key] || process.env[key] as JsonValue;
  }
}
