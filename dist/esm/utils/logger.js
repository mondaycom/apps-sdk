var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { LocalLogger } from '../logger/logger.local.js';
import { isDefined } from '../types/guards.js';
import { LogMethods } from '../types/logger.js';
import { isLocalEnvironment } from './env.js';
var defaultOptions = {
    mondayInternal: true
};
var Logger = /** @class */ (function () {
    /**
     * @param tag - Will be added to every logged message
     * @param {Options} options
     */
    function Logger(tag, options) {
        if (options === void 0) { options = {}; }
        this.tag = tag;
        this.options = __assign(__assign({}, defaultOptions), options);
        if (isLocalEnvironment()) {
            this.localLogger = new LocalLogger(tag);
        }
    }
    Logger.prototype.logMessage = function (severity, message, options) {
        var _a, _b, _c;
        var logOptions = __assign(__assign({}, this.options), options);
        if (this.localLogger && logOptions.mondayInternal === true) {
            return;
        }
        if (isDefined(this.localLogger)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (_b = (_a = this.localLogger)[severity === null || severity === void 0 ? void 0 : severity.toLowerCase()]) === null || _b === void 0 ? void 0 : _b.call(_a, message, __assign({}, (logOptions === null || logOptions === void 0 ? void 0 : logOptions.error) && { error: logOptions.error }));
        }
        else {
            console.log(JSON.stringify(__assign(__assign({ severity: severity, tag: this.tag, message: message }, logOptions), logOptions.error && { stack: (_c = logOptions.error) === null || _c === void 0 ? void 0 : _c.stack })));
        }
    };
    Logger.prototype.debug = function (message, options) {
        this.logMessage(LogMethods.DEBUG, message, options);
    };
    Logger.prototype.error = function (message, options) {
        this.logMessage(LogMethods.ERROR, message, options);
    };
    Logger.prototype.warn = function (message, options) {
        this.logMessage(LogMethods.WARNING, message, options);
    };
    Logger.prototype.info = function (message, options) {
        this.logMessage(LogMethods.INFO, message, options);
    };
    return Logger;
}());
export { Logger };
//# sourceMappingURL=logger.js.map