import { isLocalEnvironment } from '../utils/env.js';
import { QueueProd } from './queue.js';
import { QueueDev } from './queue.dev.js';
var Queue = isLocalEnvironment() ? QueueDev : QueueProd;
export { Queue };
//# sourceMappingURL=index.js.map