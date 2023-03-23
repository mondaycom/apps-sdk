export type Options = {
  /** determines if the log should get streamed to a monday-code developer */
  passThrough?: boolean
}

export enum LogMethods {
  INFO = 'info',
  ERROR = 'error',
  DEBUG = 'debug',
  WARNING = 'warn'
}

console.warn();
