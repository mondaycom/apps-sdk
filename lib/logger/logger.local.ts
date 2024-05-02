import pino from 'pino';

type Options = {
  error?: Error
}

export class LocalLogger {
  private logger: pino.Logger;
  
  /**
   * @param tag - Will be added to every logged message
   */
  constructor(private tag: string) {
    this.logger = pino({
      name: tag,
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        }
      }
    });
  }
  
  debug(message: string) {
    this.logger.debug(message);
  }
  
  error(message: string, options?: Options) {
    if (options?.error) {
      this.logger.error(options.error, message);
    } else {
      this.logger.error(message);
    }
  }
  
  warn(message: string) {
    this.logger.warn(message);
  }
  
  info(message: string) {
    this.logger.info(message);
  }
}
