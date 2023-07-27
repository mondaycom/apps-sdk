import { isLocalEnvironment } from 'utils/env';

import { Logger } from './logger';
import { LocalLogger } from './logger.local';

const selectedLogger = isLocalEnvironment() ? LocalLogger : Logger;

export {
  selectedLogger as Logger
};
