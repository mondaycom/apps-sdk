import fs from 'fs';
import * as process from 'process';

import { JsonValue } from 'lib/types/general';
import {
  GetOptions,
  IKeyValueManager,
  KeyValueData,
} from 'types/environment-variables-manager';
import { isDefined } from 'types/guards';
import { isLocalEnvironment } from 'utils/env';
import { Logger } from 'utils/logger';

const logger = new Logger('SecretsManager', { mondayInternal: true });

// TODO: write tests, just like env-var-manager has
// TODO: add readme for how to use this
// TODO: bump version (consider open PRs that also bump version)

// TODO: 2 solutions for uploading package:
//  1. push a commit with [beta] and add beta to the package.json version - install it from the app
//  2. copy the folder locally to the app and point relatively from the dependencies there

const readSecretsData = () => {
  const secretsDataFileName = process?.env?.SECRET_NAME; // TODO this should change for either secrets, or env-vars
  if (!isDefined(secretsDataFileName)) {
    logger.error('[SecretsManager] Secrets file name is not defined');
    return;
  }

  const secretsDataFilePath = `/secrets/${secretsDataFileName}`; // TODO: this stays the same for secrets and envs, the /secrets as the parent folder?
  const isSecretsFileExists = fs.existsSync(secretsDataFilePath);
  if (!isSecretsFileExists) {
    logger.error('[SecretsManager] Secrets file does not exist in path');
    return;
  }

  const secretsData = fs.readFileSync(secretsDataFilePath, 'utf8');
  try {
    return JSON.parse(secretsData) as KeyValueData;
  } catch (error) {
    logger.error('[SecretsManager] Corrupted Secrets file. File is not in JSON format');
    return;
  }
};

export class SecretsManager implements IKeyValueManager {
  private cachedSecretsData?: KeyValueData;

  constructor() {
    this.initSecrets();
    if (isLocalEnvironment()) {
      logger.info('[SecretsManager] Running in development environment, Using process.env', { mondayInternal: false });
    }
  }

  private initSecretsIfNeeded(options?: GetOptions) {
    const shouldInvalidate = options?.invalidate ?? true;
    if (shouldInvalidate || !this.cachedSecretsData) {
      this.initSecrets();
    }
  }

  private initSecrets() {
    if (isLocalEnvironment()) {
      this.cachedSecretsData = process.env as KeyValueData;
      return;
    }

    this.cachedSecretsData = readSecretsData();
    logger.info('[SecretsManager] Initialized secrets data', { mondayInternal: true });
  }

  getKeys(options?: GetOptions): Array<string> {
    this.initSecretsIfNeeded(options);
    if (!isDefined(this.cachedSecretsData)) {
      logger.error('[SecretsManager.getKeys] There is an issue with loading keys', { mondayInternal: false });
      return [];
    }

    return Object.keys(this.cachedSecretsData);
  }

  get(key: string, options?: GetOptions): JsonValue {
    this.initSecretsIfNeeded(options);
    if (!isDefined(this.cachedSecretsData)) {
      logger.error('[SecretsManager.get] There is an issue with loading data for key', { mondayInternal: false });
      return null;
    }

    return this.cachedSecretsData[key] || process.env[key] as JsonValue;
  }
}
