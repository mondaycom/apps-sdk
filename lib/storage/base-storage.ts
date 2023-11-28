import {BadRequestError, InternalServerError} from 'errors/apps-sdk-error';
import {RequestOptions} from 'types/fetch';
import {isDefined} from 'types/guards';
import {Options, Token} from 'types/storage';
import {fetchWrapper} from 'utils/fetch-wrapper';
import {Logger} from 'utils/logger';

export abstract class BaseStorage {
    protected logger: Logger;

    protected constructor(protected token?: Token) {
        this.logger = new Logger('Storage', { mondayInternal: true });
    }
    protected async storageFetch<T>(key: string, initToken: Token | undefined, externalOptions: Options, options: RequestOptions) {
        const { method, body } = options;
        const token = this.getToken(initToken, externalOptions);
        const stringifiedBody = JSON.stringify(body);
        const url = this.generateCrudPath(key, externalOptions);
        if (!isDefined(method)) {
            throw new InternalServerError('An error occurred');
        }

        const headers = {
            Authorization: token,
            'Content-Type': 'application/json'
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

    private getToken (token?: Token, options: Options = {}): Token {
        const selectedToken = options.token || token;

        if (!isDefined(selectedToken)) {
            throw new BadRequestError('Missing token');
        }

        return selectedToken;
    }

    private generateCrudPath (key: string, options: Options) {
        if (!isDefined(key)) {
            throw new BadRequestError('Missing key');
        }

        const { shared } = options;
        const storageUrl = this.getStorageUrl();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const fullPath = `${storageUrl}/${key}?shareGlobally=${!!shared}`;
        return fullPath;
    }
}
