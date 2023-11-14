import { isLocalEnvironment } from 'utils/env';
import { QueueProd } from './queue';
import { QueueDev } from './queue.dev';

const Queue = isLocalEnvironment() ? QueueDev : QueueProd;

export {
  Queue
};
