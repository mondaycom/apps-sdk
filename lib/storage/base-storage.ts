import {BadRequestError, InternalServerError} from 'errors/apps-sdk-error';
import {RequestOptions} from 'types/fetch';
import {isDefined} from 'types/guards';
import {Options, Token} from 'types/storage';
import {fetchWrapper} from 'utils/fetch-wrapper';
import {Logger} from 'utils/logger';

export abstract class BaseStorage {
    protected logger: Logger;

    constructor(private readonly token: Token) {
        this.logger = new Logger('Storage', { mondayInternal: true });
    }
    protected async storageFetch<T>(key: string, options: RequestOptions, externalOptions?: Options) {
        const { method, body } = options;
        const stringifiedBody = JSON.stringify(body);
        const url = this.generateCrudPath(key, externalOptions);
        if (!isDefined(method)) {
            throw new InternalServerError('An error occurred');
        }

        const headers = {
            Authorization: this.token,
            'Content-Type': 'application/json',
            'User-Agent': 'monday-apps-sdk'
        };

        let response: T | undefined;
        try {
            response = await fetchWrapper<T>(url, {
                method,
                headers,
                ...(body && { body: stringifiedBody })
            });
        } catch (error: unknown) {
            this.logger.error('[storageFetch] Unexpected error occurred while communicating with storage', { error: error as Error });
            throw new InternalServerError('An issue occurred while accessing storage');
        }

        return response as T;
    }

    private getStorageUrl () {
        const url = process.env.STORAGE_URL || 'https://apps-storage.monday.com/app_storage_api/v2';
        return url;
    }

    private generateCrudPath (key: string, options?: Options) {
        if (!isDefined(key)) {
            throw new BadRequestError('Missing key');
        }

        const shareGlobally = options?.shared ?? false;
        const storageUrl = this.getStorageUrl();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const fullPath = `${storageUrl}/${key}?shareGlobally=${shareGlobally}`;
        return fullPath;
    }
}
