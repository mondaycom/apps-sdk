import { Token } from 'types/secure-storage';

export type SignJwtResponse = {
  signedJwt: Token
}

export type GcpConnectionData = {
  token: Token,
  projectId: string,
  serviceAccountEmail: string
}
