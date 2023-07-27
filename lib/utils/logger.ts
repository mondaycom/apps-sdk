import { LocalLogger } from 'lib/logger/logger.local';
import { isDefined } from 'types/guards';
import { LogMethods, Options } from 'types/logger';
import { isLocalEnvironment } from 'utils/env';

const defaultOptions: Options = {
  mondayInternal: true
};

export class Logger {
  private readonly options: Options;
  private readonly localLogger?: LocalLogger;
  
  /**
   * @param tag - Will be added to every logged message
   * @param {Options} options
   */
  constructor(private tag: string, options: Options = {}) {
    this.options = { ...defaultOptions, ...options };
    if (isLocalEnvironment()) {
      this.localLogger = new LocalLogger(tag);
    }
  }
  
  private logMessage(severity: LogMethods, message: string, options?: Options) {
    const logOptions = { ...this.options, ...options };
    if (this.localLogger && logOptions.mondayInternal === true) {
      return;
    }
    
    if (isDefined(this.localLogger)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.localLogger[severity?.toLowerCase()]?.(message, { ...logOptions?.error && { error: logOptions.error } });
    } else {
      console.log(JSON.stringify({
        severity,
        tag: this.tag,
        message,
        ...logOptions,
        ...logOptions.error && { stack: logOptions.error?.stack }
      }));
    }
  }
  
  debug(message: string, options?: Options) {
    this.logMessage(LogMethods.DEBUG, message, options);
  }
  
  error(message: string, options?: Options) {
    this.logMessage(LogMethods.ERROR, message, options);
  }
  
  warn(message: string, options?: Options) {
    this.logMessage(LogMethods.WARNING, message, options);
  }
  
  info(message: string, options?: Options) {
    this.logMessage(LogMethods.INFO, message, options);
  }
}
