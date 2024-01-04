
export type APIOptions = {
    /**
     * Access token for the API
     * If not set, will use the credentials of the current user (client only)
     */
    token?: string;

    /**
     * An object containing GraphQL query variables
     */
    variables?: object;

    /**
     * A string specifying which version of the API should be used
     * If not set, will use the current API version
     */
    apiVersion?: string;
}

export type APIData = {
    query: string;
    variables?: object;
}

export type APIVersion = string;

export type APIResponse = {
    data?: {
        data: object
    },
    account_id: number
}

export type APIFetchResponse = {
    errors?: Array<{ message: string }>,
} & APIResponse;

export type IMondayApiClient = {

    /**
     * Used for querying the monday.com GraphQL API seamlessly on behalf of the connected user, or using a provided API token.
     * For more information about the GraphQL API and all queries and mutations possible, read the [API Documentation](https://monday.com/developers/v2)
     * @param query A [GraphQL](https://graphql.org/) query, can be either a query (retrieval operation) or a mutation (creation/update/deletion operation).
     * Placeholders may be used, which will be substituted by the variables object passed within the options.
     * @param options
     */
    api: (query: string, options: APIOptions) => Promise<APIResponse>,
    /**
     * Instead of passing the API token to the `api()` method on each request, you can set the API token once using:
     * @param token Access token for the API
     */
    setToken(token: string): void;

    /**
     * Allows to set the API version for future requests.
     * @param version A string specifying which version of the API should be used
     */
    setApiVersion(version: string): void;
}
