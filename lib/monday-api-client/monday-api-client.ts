import {BadRequestError, InternalServerError} from 'errors/apps-sdk-error';
import {Token} from 'types/general';
import {isDefined} from 'types/guards';
import {
    APIData,
    APIFetchResponse,
    APIOptions,
    APIResponse,
    APIVersion,
    IMondayApiClient
} from 'types/monday-api-client';
import {fetchWrapper} from 'utils/fetch-wrapper';
import { Logger } from 'utils/logger';
const logger = new Logger('MondayApiClient', { mondayInternal: true });
const API_URL = 'https://api.monday.com/v2/';
export class MondayApiClient implements IMondayApiClient {
    private token?: Token;

    private apiVersion?: APIVersion;

    constructor(token?: Token) {
        this.token = token;
    }

    setToken(token: Token) {
        this.token = token;
    }

    setApiVersion(version: APIVersion){
        this.apiVersion = version
    }

    async api(query: string, options: APIOptions = {}) {
        if (!this.token) {
            logger.warn('[mondayApiClientFetch] Error Token is missing');
            throw new BadRequestError('Token is missing');
        }

        const params: APIData = { query, variables: options.variables };
        const apiVersion = options.apiVersion || this.apiVersion;

        const fetchObj = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': this.token }),
                ...(apiVersion && { 'API-Version': apiVersion })
            },
            method: 'POST',
            body: params ? JSON.stringify(params || {}) : undefined
        };

        let result: APIFetchResponse | undefined;
        try {
            result = await fetchWrapper<APIResponse>(API_URL, fetchObj);
        } catch (error: unknown) {
            logger.error('[mondayApiClientFetch] Unexpected error occurred while communicating with secure storage', { error: error as Error });
            throw new InternalServerError('An issue occurred while accessing secure storage');
        }


        if (!isDefined(result)) {
            throw new InternalServerError('some thing went wrong when communicating with mondayApiClientFetch');
        }

        if (isDefined(result.errors)) {
            const errorMessage = result.errors.map(e=>e?.message).join(', ');
            logger.error(`[mondayApiClientFetch] Errors occurred while communicating with secure storage.\nErrors: ${errorMessage}`);
            throw new BadRequestError(errorMessage);
        }

        if (!isDefined(result.data)) {
            throw new InternalServerError('some thing went wrong when communicating with mondayApiClientFetch data filed returned empty');
        }

        const { data, account_id } = result;
        return { data, account_id }
    }
}
