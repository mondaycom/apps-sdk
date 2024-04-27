import { isLocalEnvironment } from '../utils/env.js';
import { SecureStorage } from './secure-storage.js';
import { LocalSecureStorage } from './secure-storage.local.js';
var selectedSecureStorage = isLocalEnvironment() ? LocalSecureStorage : SecureStorage;
export { selectedSecureStorage as SecureStorage };
//# sourceMappingURL=index.js.map