import { Logger as InternalLogger } from 'utils/logger';

type Options = {
  error?: Error
}

export class Logger {
  private internalLogger: InternalLogger;
  
  /**
   * @param tag - Will be added to every logged message
   */
  constructor(private tag: string) {
    this.internalLogger = new InternalLogger(tag, { mondayInternal: false });
  }
  
  debug(message: string) {
    this.internalLogger.debug(message);
  }
  
  error(message: string, options?: Options) {
    this.internalLogger.error(message, options);
  }
  
  warn(message: string) {
    this.internalLogger.warn(message);
  }
  
  info(message: string) {
    this.internalLogger.info(message);
  }
}
