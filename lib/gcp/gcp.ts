import { Compute, GoogleAuth } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import { InternalServerError } from 'errors/apps-sdk-error';
import { GCP_SCOPES, GcpConnectionData, SignJwtResponse } from 'types/gcp';
import { isDefined } from 'types/guards';
import { Token } from 'types/secure-storage';
import { getMondayCodeContext, validateEnvironment } from 'utils/env';
import { Logger } from 'utils/logger';

const logger = new Logger('SecureStorage', { mondayInternal: true });
const googleAuthClient = new GoogleAuth({ authClient: new Compute() });
googleAuthClient.defaultScopes = [GCP_SCOPES.CLOUD_PLATFORM];

const generateJwtSigningUrl = (serviceAccountEmail: string) => `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:signJwt`;

const generateGcpIdentityToken = async (): Promise<Token> => {
  const { secureStorageAddress } = getMondayCodeContext();
  const idTokenClient = await googleAuthClient.getIdTokenClient(secureStorageAddress);
  const identityToken = await idTokenClient.idTokenProvider.fetchIdToken(secureStorageAddress);
  return identityToken;
};

export const getGcpIdentityToken = async (identityToken?: Token): Promise<Token> => {
  if (!isDefined(identityToken)) {
    return await generateGcpIdentityToken();
  }
  
  const tokenClaims = jwt.decode(identityToken);
  if (typeof tokenClaims === 'string' || !isDefined(tokenClaims)) {
    throw new InternalServerError('An error occurred');
  }
  
  const tokenExpiration = tokenClaims.exp as number;
  const now = new Date();
  const nowInMilliseconds = now.getTime() / 1000;
  if (tokenExpiration < nowInMilliseconds) {
    return await generateGcpIdentityToken();
  }
  
  return identityToken;
};

const validateGcpResponse = (response: SignJwtResponse): void => {
  if (response.error) {
    logger.error(JSON.stringify(response.error));
    throw new InternalServerError('some thing went wrong when when communicating with secure storage');
  }
};

export const getGcpConnectionData = async (): Promise<GcpConnectionData> => {
  validateEnvironment();  
  const projectId = await googleAuthClient.getProjectId();
  const serviceAccountEmail = (await googleAuthClient.getCredentials()).client_email as string;
  const accessToken = await googleAuthClient.getAccessToken() as string;
  const issueTimeInSeconds = Math.floor(Date.now() / 1000);
  // vault will only accept tokens that are good for less than 900 seconds.
  const expirationInSeconds = issueTimeInSeconds + 899;
  const payload = JSON.stringify({
    sub: serviceAccountEmail,
    aud: `vault/${projectId}`,
    iat: issueTimeInSeconds,
    exp: expirationInSeconds
  });
  
  const jwtSigningUrl = generateJwtSigningUrl(serviceAccountEmail);
  const response = await fetch(jwtSigningUrl, {
      method: 'POST',
      body: JSON.stringify({ payload }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const responseJson = await response.json() as SignJwtResponse;
  validateGcpResponse(responseJson);
  const signedToken = responseJson.signedJwt;
  return { token: signedToken, projectId, serviceAccountEmail };
};
