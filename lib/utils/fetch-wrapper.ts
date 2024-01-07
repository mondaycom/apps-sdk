import { StatusCodes } from 'http-status-codes';
import fetch from 'node-fetch';

import { ForbiddenError } from 'errors/apps-sdk-error';

import type { RequestInit, Response } from 'node-fetch';

const handleFetchErrors = (response: Response): void => {
  if (response.status == StatusCodes.FORBIDDEN) {
    throw new ForbiddenError('Forbidden action');
  }
};

export async function fetchWrapper<TResponse>(
  url: string,
  config: RequestInit = {}
): Promise<TResponse | undefined> {
  const response = await fetch(url, config);
  handleFetchErrors(response);
  if ([StatusCodes.NO_CONTENT, StatusCodes.NOT_FOUND].includes(response.status)) {
    return;
  }
  
  return await response.json() as Promise<TResponse>;
}
