import { Token } from './secure-storage';
export type SignJwtResponse = {
    signedJwt: Token;
    error?: {
        code: number;
        message: string;
        status: string;
    };
};
export type GcpConnectionData = {
    token: Token;
    projectId: string;
    serviceAccountEmail: string;
};
export declare enum GCP_SCOPES {
    CLOUD_PLATFORM = "https://www.googleapis.com/auth/cloud-platform"
}
