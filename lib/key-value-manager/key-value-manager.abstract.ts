import fs from 'fs';
import * as process from 'process';

import { JsonValue } from 'types/general';
import { isDefined } from 'types/guards';
import { GetOptions, KeyValueData } from 'types/key-value-manager';
import { Logger } from 'utils/logger';

export abstract class KeyValueManager {
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
  }

  protected readData(): KeyValueData | undefined {
    const isDataFileExists = fs.existsSync(this.dataFilePath);
    if (!isDataFileExists) {
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
    // if (isLocalEnvironment()) { // FIXME: revert
    //   this.cachedData = process.env as KeyValueData;
    //   return;
    // }

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




