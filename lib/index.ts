import { EnvironmentVariablesManager } from 'lib/environment-variables-manager';
import { Logger } from 'lib/logger';
import { SecureStorage } from 'lib/secure-storage';
import { Storage } from 'lib/storage';
import { handlePackageVersionUpdate } from 'lib/utils/package-version-utils';

handlePackageVersionUpdate().then(_response => null).catch(_error => null);

export {
  SecureStorage,
  Storage,
  EnvironmentVariablesManager,
  Logger
};
