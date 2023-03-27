import { StatusCodes } from 'http-status-codes';
import fetch, { RequestInit, Response } from 'node-fetch';

import { ForbiddenError, NotFoundError } from 'errors/apps-sdk-error';

const handleFetchErrors = (response: Response): void => {
  if (response.status == StatusCodes.NOT_FOUND) {
    throw new NotFoundError('Resource not found');
  } else if (response.status == StatusCodes.FORBIDDEN) {
    throw new ForbiddenError('Forbidden action');
  }
};

export async function fetchWrapper<TResponse>(
  url: string,
  config: RequestInit = {}
): Promise<TResponse | undefined> {
  const response = await fetch(url, config);
  handleFetchErrors(response);
  if (response.status === StatusCodes.NO_CONTENT) {
    return;
  }
  
  return await response.json() as Promise<TResponse>;
}
