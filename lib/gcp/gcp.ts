import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

import { GcpConnectionData, SignJwtResponse } from 'types/gcp';
import { validateEnvironment } from 'utils/env';

export const getGcpConnectionData = async (): Promise<GcpConnectionData> => {
  validateEnvironment();
  
  const auth = new GoogleAuth();
  auth.defaultScopes = ['https://www.googleapis.com/auth/cloud-platform'];
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
  
  const response = await fetch(`https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:signJwt`, {
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
