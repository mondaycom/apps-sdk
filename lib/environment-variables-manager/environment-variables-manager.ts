import fs from 'fs';
import * as process from 'process';

import { JsonValue } from 'lib/types/general';
import {
  EnvironmentData,
  GetOptions,
  IEnvironmentVariablesManager,
  Options
} from 'types/environment-variables-manager';
import { isDefined } from 'types/guards';
import { isLocalEnvironment } from 'utils/env';
import { Logger } from 'utils/logger';
import { snakeCase } from 'utils/string-manipulations';

const logger = new Logger('EnvironmentVariablesManager', { mondayInternal: true });

const readEnvironmentData = () => {
  const environmentDataFileName = process?.env?.SECRET_NAME;
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
    return JSON.parse(environmentData) as EnvironmentData;
  } catch (error) {
    logger.error('[EnvironmentVariablesManager] Corrupted Environment file. File is not in JSON format');
    return;
  }
};

export class EnvironmentVariablesManager implements IEnvironmentVariablesManager {
  private cachedEnvironmentData?: EnvironmentData;
  private shouldUpdateProcessEnv: boolean;
  
  constructor(options?: Options) {
    this.shouldUpdateProcessEnv = !!options?.updateProcessEnv;
    this.initEnv(options);
  }
  
  private initEnvIfNeeded(options?: GetOptions) {
    const shouldInvalidate = options?.invalidate ?? true;
    if (shouldInvalidate || !this.cachedEnvironmentData) {
      this.initEnv();
    }
  }
  
  private initEnv(options: Options = {}) {
    if (isLocalEnvironment()) {
      logger.info('[EnvironmentVariablesManager] Running in development environment, skipping init', { mondayInternal: false });
      this.cachedEnvironmentData = process.env as EnvironmentData;
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
    
    logger.info('[EnvironmentVariablesManager] Initialized environment variables data', { mondayInternal: false });
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
