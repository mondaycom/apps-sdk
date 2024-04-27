import { RequestInit } from 'node-fetch';
export declare function fetchWrapper<TResponse>(url: string, config?: RequestInit): Promise<TResponse | undefined>;
