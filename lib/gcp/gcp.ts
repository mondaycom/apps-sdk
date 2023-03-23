import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

import { GCP_SCOPES, GcpConnectionData, SignJwtResponse } from 'types/gcp';
import { validateEnvironment } from 'utils/env';

const generateJwtSigningUrl = (serviceAccountEmail: string) => `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:signJwt`;

export const getGcpConnectionData = async (): Promise<GcpConnectionData> => {
  validateEnvironment();
  
  const auth = new GoogleAuth();
  auth.defaultScopes = [GCP_SCOPES.CLOUD_PLATFORM];
  const projectId = await auth.getProjectId();
  const serviceAccountEmail = (await auth.getCredentials()).client_email as string;
  const accessToken = await auth.getAccessToken() as string;
  
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
  const signedToken = responseJson.signedJwt;
  
  return { token: signedToken, projectId, serviceAccountEmail };
};
