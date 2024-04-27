"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.LocalLogger = void 0;
var pino_1 = __importDefault(require("pino"));
var LocalLogger = /** @class */ (function () {
    /**
     * @param tag - Will be added to every logged message
     */
    function LocalLogger(tag) {
        this.tag = tag;
        this.logger = (0, pino_1["default"])({
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
exports.LocalLogger = LocalLogger;
//# sourceMappingURL=logger.local.js.map