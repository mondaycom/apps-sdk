import { isLocalEnvironment } from 'utils/env';

import { SecureStorage } from './secure-storage';
import { LocalSecureStorage } from './secure-storage.local';

const selectedSecureStorage = isLocalEnvironment() ? LocalSecureStorage : SecureStorage;

export {
  selectedSecureStorage as SecureStorage
};
