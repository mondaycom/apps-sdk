"use strict";
exports.__esModule = true;
exports.Logger = void 0;
var logger_1 = require("../utils/logger.js");
var Logger = /** @class */ (function () {
    /**
     * @param tag - Will be added to every logged message
     */
    function Logger(tag) {
        this.tag = tag;
        this.internalLogger = new logger_1.Logger(tag, { mondayInternal: false });
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
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map