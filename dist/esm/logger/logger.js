import { Logger as InternalLogger } from '../utils/logger.js';
var Logger = /** @class */ (function () {
    /**
     * @param tag - Will be added to every logged message
     */
    function Logger(tag) {
        this.tag = tag;
        this.internalLogger = new InternalLogger(tag, { mondayInternal: false });
    }
    Logger.prototype.debug = function (message) {
        this.internalLogger.debug(message);
    };
    Logger.prototype.error = function (message, options) {
        this.internalLogger.error(message, options);
    };
    Logger.prototype.warn = function (message) {
        this.internalLogger.warn(message);
    };
    Logger.prototype.info = function (message) {
        this.internalLogger.info(message);
    };
    return Logger;
}());
export { Logger };
//# sourceMappingURL=logger.js.map