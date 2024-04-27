import { RequestOptions } from '../types/fetch';
import { Options, Token } from '../types/storage';
import { Logger } from '../utils/logger';
export declare abstract class BaseStorage {
    private readonly token;
    protected logger: Logger;
    constructor(token: Token);
    protected storageFetchV2<T>(url: string, options: RequestOptions): Promise<T>;
    protected storageFetch<T>(key: string, options: RequestOptions, externalOptions?: Options): Promise<T>;
    private getStorageUrl;
    private getStorageUrlV2;
    private generateCrudPath;
    counterUrl(): string;
}
