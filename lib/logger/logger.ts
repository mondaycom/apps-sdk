import { ErrorLogOptions, ILogger } from 'types/logger';
import { Logger as InternalLogger } from 'utils/logger';

export class Logger implements ILogger {
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
  
  error(message: string, options?: ErrorLogOptions) {
    this.internalLogger.error(message, options);
  }
  
  warn(message: string) {
    this.internalLogger.warn(message);
  }
  
  info(message: string) {
    this.internalLogger.info(message);
  }
}
