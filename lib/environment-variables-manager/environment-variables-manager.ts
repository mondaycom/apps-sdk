import fs from 'fs';
import * as process from 'process';

import { JsonValue } from 'lib/types/general';
import { EnvironmentData, GetOptions, IEnvironmentVariablesManager, Options } from 'types/environment-vriable-manager';
import { isDefined } from 'types/guards';
import { isDevelopmentEnvironment } from 'utils/env';
import { Logger } from 'utils/logger';
import { snakeCase } from 'utils/string-manipulations';

const logger = new Logger('EnvironmentVariablesManager', { mondayInternal: true });

const readEnvironmentData = () => {
  const environmentDataFileName = process?.env?.SECRET_NAME;
  if (!isDefined(environmentDataFileName)) {
    throw new Error('Environment file name is not defined');
  }
  
  const environmentDataFilePath = `/secrets/${environmentDataFileName}`;
  const isEnvironmentFileExists = fs.existsSync(environmentDataFileName);
  if (!isEnvironmentFileExists) {
    throw new Error('Environment file does not exists in path');
  }
  
  const environmentData = fs.readFileSync(environmentDataFilePath, 'utf8');
  return JSON.parse(environmentData) as EnvironmentData;
};

export class EnvironmentVariablesManager implements IEnvironmentVariablesManager {
  private cachedEnvironmentData: EnvironmentData;
  private shouldUpdateProcessEnv: boolean;
  
  constructor(options: Options) {
    this.cachedEnvironmentData = {};
    this.shouldUpdateProcessEnv = !!options.updateProcessEnv;
    this.initEnv(options);
  }
  
  private initEnvIfNeeded(options?: GetOptions) {
    if (options?.invalidateCache || !this.cachedEnvironmentData) {
      this.initEnv();
    }
  }
  
  private initEnv(options: Options = {}) {
    if (isDevelopmentEnvironment()) {
      logger.info('[EnvironmentVariablesManager.initEnv] Running in development environment, skipping init', { mondayInternal: false });
      this.cachedEnvironmentData = process.env as EnvironmentData;
      return;
    }
    
    const { updateProcessEnv } = options;
    this.shouldUpdateProcessEnv = updateProcessEnv ?? this.shouldUpdateProcessEnv;
    this.cachedEnvironmentData = readEnvironmentData();
    
    if (this.shouldUpdateProcessEnv) {
      Object.entries(this.cachedEnvironmentData).forEach(([key, value]) => {
        const snakeCaseKey = snakeCase(key, { upperCase: true });
        process.env[snakeCaseKey] = value as string;
      });
    }
    
    logger.info('[EnvironmentVariablesManager.initEnv] Initialized environment variables data', { mondayInternal: false });
  }
  
  getKeys(options?: GetOptions): Array<string> {
    this.initEnvIfNeeded(options);
    return Object.keys(this.cachedEnvironmentData);
  }
  
  // TODO - DOR - Validate this works for complex types
  get<T extends JsonValue>(key: string, options?: GetOptions): T {
    this.initEnvIfNeeded(options);
    return this.cachedEnvironmentData[key] as T;
  }
}
