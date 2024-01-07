import type { RequestInit } from 'node-fetch';

export type RequestOptions = {
  body?: object
} & Omit<RequestInit, 'body'>
