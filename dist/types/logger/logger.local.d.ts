type Options = {
    error?: Error;
};
export declare class LocalLogger {
    private tag;
    private logger;
    /**
     * @param tag - Will be added to every logged message
     */
    constructor(tag: string);
    debug(message: string): void;
    error(message: string, options?: Options): void;
    warn(message: string): void;
    info(message: string): void;
}
export {};
