import fs from 'fs';
import * as process from 'process';

import { JsonValue } from 'types/general';
import { isDefined } from 'types/guards';
import { GetOptions, IKeyValueManager, KeyValueData, Options } from 'types/key-value-manager';
import { isLocalEnvironment } from 'utils/env';
import { Logger } from 'utils/logger';
import { snakeCase } from 'utils/string-manipulations';

abstract class KeyValueManager implements IKeyValueManager {
  protected cachedData?: KeyValueData;
  protected readonly logger: Logger;
  protected readonly tag: string;
  private readonly dataFilePath: string;

  protected constructor(loggerTag: string, dataFileName: string, dataFileFolder: string) {
    this.logger = new Logger(loggerTag, { mondayInternal: true });
    this.tag = loggerTag;

    if (!isDefined(dataFileName)) {
      this.logger.error(`[${this.tag}] Data file name is not defined`);
      this.dataFilePath = '';
      return;
    }
    this.dataFilePath = `${dataFileFolder}/${dataFileName}`;

    this.initData();
  }

  protected readData(): KeyValueData | undefined {
    const isSecretsFileExists = fs.existsSync(this.dataFilePath);
    if (!isSecretsFileExists) {
      this.logger.error(`[${this.tag}] Data file does not exist in path`);
      return;
    }

    const data = fs.readFileSync(this.dataFilePath, 'utf8');
    try {
      return JSON.parse(data) as KeyValueData;
    } catch (error) {
      this.logger.error(`[${this.tag}] Corrupted data file. File is not in JSON format`);
      return;
    }
  }

  protected initDataIfNeeded(options?: GetOptions): void {
    const shouldInvalidate = options?.invalidate ?? true;
    if (shouldInvalidate || !this.cachedData) {
      this.initData();
    }
  }

  protected initData(): void {
    if (isLocalEnvironment()) {
      this.cachedData = process.env as KeyValueData;
      return;
    }

    this.cachedData = this.readData();
    if (!isDefined(this.cachedData)) {
      return;
    }

    this.logger.info(`[${this.tag}] Initialized data successfully`, { mondayInternal: true });
  }

  getKeys(options?: GetOptions): Array<string> {
    this.initDataIfNeeded(options);
    if (!isDefined(this.cachedData)) {
      this.logger.error(`[${this.tag}.getKeys] There is an issue with loading keys`, { mondayInternal: false });
      return [];
    }

    return Object.keys(this.cachedData);
  }

  get(key: string, options?: GetOptions): JsonValue {
    this.initDataIfNeeded(options);
    if (!isDefined(this.cachedData)) {
      this.logger.error(`[${this.tag}.get] There is an issue with loading data for key`, { mondayInternal: false });
      return null;
    }

    return this.cachedData[key] || process.env[key] as JsonValue;
  }
}

export class EnvironmentVariablesManager extends KeyValueManager {
  private readonly shouldUpdateProcessEnv: boolean;

  constructor(options?: Options) {
    const dataFileName = process.env.SECRET_NAME!;
    super('EnvironmentVariablesManager', dataFileName, 'secrets');
    this.shouldUpdateProcessEnv = Boolean(options?.updateProcessEnv);
  }

  protected initData() {
    // TODO: Maor: make sure this concrete implementation is being executed on CTOR, with and without spreading to process.env
    super.initData();

    if (this.shouldUpdateProcessEnv) {
      Object.entries(this.cachedData!).forEach(([key, value]) => {
        const snakeCaseKey = snakeCase(key, { upperCase: true });
        process.env[snakeCaseKey] = value as string;
      });
    }

    this.logger.info(`[${this.tag}] Successfully updated process.env with data from file`, { mondayInternal: true });
  }
}

export class SecretsManager extends KeyValueManager {
  constructor() {
    const dataFileName = process.env.SECRET_NAME!; // TODO this should change for secrets (both file and folder name)
    super('SecretsManager', dataFileName, 'secrets');
  }

}
