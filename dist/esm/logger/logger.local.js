import pino from 'pino';
var LocalLogger = /** @class */ (function () {
    /**
     * @param tag - Will be added to every logged message
     */
    function LocalLogger(tag) {
        this.tag = tag;
        this.logger = pino({
            name: tag,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            }
        });
    }
    LocalLogger.prototype.debug = function (message) {
        this.logger.debug(message);
    };
    LocalLogger.prototype.error = function (message, options) {
        this.logger.error(message, options);
    };
    LocalLogger.prototype.warn = function (message) {
        this.logger.warn(message);
    };
    LocalLogger.prototype.info = function (message) {
        this.logger.info(message);
    };
    return LocalLogger;
}());
export { LocalLogger };
//# sourceMappingURL=logger.local.js.map