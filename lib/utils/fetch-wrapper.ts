import { StatusCodes } from 'http-status-codes';
import fetch, { RequestInit, Response } from 'node-fetch';

import { ForbiddenError, TooManyRequestsError } from 'errors/apps-sdk-error';

const handleFetchErrors = (response: Response): void => {
  if (response.status == StatusCodes.FORBIDDEN) {
    throw new ForbiddenError('Forbidden action');
  }
  if (response.status == StatusCodes.TOO_MANY_REQUESTS) {
    throw new TooManyRequestsError('request limit exceeded');
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
