export type RequestOptions = {
  body?: BodyInit | object
} & Omit<RequestInit, 'body'>
