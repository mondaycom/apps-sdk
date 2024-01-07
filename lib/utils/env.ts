import { ForbiddenError } from 'errors/apps-sdk-error';
import { isDefined } from 'types/guards';

import type { MondayCodeContext } from 'types/env';

export const isLocalEnvironment = () => !isDefined(process.env.K_SERVICE);

export const localServerAddress = () => {
  if (!isLocalEnvironment()) {
    throw new Error('localServerAddress() can be used, this is not a development environment.')
  }
  if (!process.env.MNDY_SERVER_ADDRESS) {
    throw new Error('En environment variable name "MNDY_SERVER_ADDRESS" is required, the value should be int the following format "(protocol)://{server_name}:{port}" e.g.: "http://localhost:8080".')
  }
  return process.env.MNDY_SERVER_ADDRESS;
}

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
