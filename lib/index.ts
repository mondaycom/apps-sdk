import * as dotenv from 'dotenv';

// eslint-disable-next-line import/order
import { isDevelopmentEnvironment } from 'utils/env';

if (isDevelopmentEnvironment()) {
  dotenv.config({ override: true });
}

import { SecureStorage } from 'lib/secure-storage';
import { Storage } from 'lib/storage';

export {
  SecureStorage,
  Storage
};
