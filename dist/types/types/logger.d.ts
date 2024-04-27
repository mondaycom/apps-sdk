export type Options = {
    /** determines if the log should get streamed to a monday-code developer */
    mondayInternal?: boolean;
    error?: Error;
};
export declare enum LogMethods {
    INFO = "INFO",
    ERROR = "ERROR",
    DEBUG = "DEBUG",
    WARNING = "WARNING"
}
