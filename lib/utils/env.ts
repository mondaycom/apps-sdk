import { MondayCodeContext } from 'types/env';
import { isDefined } from 'types/guards';

export const isLocalEnvironment = () => !isDefined(process.env.K_SERVICE);

export const getMondayCodeContext = (): MondayCodeContext => ({
  app: process.env.K_SERVICE as string,
  secureStorageAddress: process.env.SECURE_STORAGE_ADDRESS as string
});
