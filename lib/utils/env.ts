import { ForbiddenError } from 'errors/apps-sdk-error';
import { MondayCodeContext } from 'types/env';
import { isDefined } from 'types/guards';

export const isLocalEnvironment = () => !isDefined(process.env.K_SERVICE);

export const getMondayCodeContext = (): MondayCodeContext => ({
  app: process.env.K_SERVICE as string,
  secureStorageAddress: process.env.SECURE_STORAGE_ADDRESS as string
});

export const validateEnvironment = (): void => {
  const { app, secureStorageAddress } = getMondayCodeContext();
  
  if (isLocalEnvironment()) {
    throw new ForbiddenError('Secure storage not available on local env');
  }
  
  if (!isDefined(app)) {
    throw new ForbiddenError('Missing environment variables for initialization [app name]');
  }
  
  if (!isDefined(secureStorageAddress)) {
    throw new ForbiddenError('Missing environment variables for initialization [secure storage address]');
  }
};
