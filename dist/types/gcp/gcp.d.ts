import { GcpConnectionData } from '../types/gcp';
import { Token } from '../types/secure-storage';
export declare const getGcpIdentityToken: (identityToken?: Token) => Promise<Token>;
export declare const getGcpConnectionData: () => Promise<GcpConnectionData>;
