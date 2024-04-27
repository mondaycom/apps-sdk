import { Options } from '../types/logger';
export declare class Logger {
    private tag;
    private readonly options;
    private readonly localLogger?;
    /**
     * @param tag - Will be added to every logged message
     * @param {Options} options
     */
    constructor(tag: string, options?: Options);
    private logMessage;
    debug(message: string, options?: Options): void;
    error(message: string, options?: Options): void;
    warn(message: string, options?: Options): void;
    info(message: string, options?: Options): void;
}
