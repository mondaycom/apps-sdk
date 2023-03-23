import fetch, { RequestInit, Response } from 'node-fetch';

import { ForbiddenError, NotFoundError } from 'errors/apps-sdk-error';

const handleFetchErrors = (response: Response): void => {
  if (response.status == 404) {
    throw new NotFoundError('Resource not found');
  } else if (response.status == 403) {
    throw new ForbiddenError('Forbidden action');
  }
};

export async function fetchWrapper<TResponse>(
  url: string,
  config: RequestInit = {}
): Promise<TResponse> {
  const response = await fetch(url, config);
  handleFetchErrors(response);
  return await response.json() as Promise<TResponse>;
}
