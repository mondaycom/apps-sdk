"use strict";
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
exports.__esModule = true;
exports.Logger = void 0;
var logger_local_1 = require("../logger/logger.local.js");
var guards_1 = require("../types/guards.js");
var logger_1 = require("../types/logger.js");
var env_1 = require("./env.js");
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
        if ((0, env_1.isLocalEnvironment)()) {
            this.localLogger = new logger_local_1.LocalLogger(tag);
        }
    }
    Logger.prototype.logMessage = function (severity, message, options) {
        var _a, _b, _c;
        var logOptions = __assign(__assign({}, this.options), options);
        if (this.localLogger && logOptions.mondayInternal === true) {
            return;
        }
        if ((0, guards_1.isDefined)(this.localLogger)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (_b = (_a = this.localLogger)[severity === null || severity === void 0 ? void 0 : severity.toLowerCase()]) === null || _b === void 0 ? void 0 : _b.call(_a, message, __assign({}, (logOptions === null || logOptions === void 0 ? void 0 : logOptions.error) && { error: logOptions.error }));
        }
        else {
            console.log(JSON.stringify(__assign(__assign({ severity: severity, tag: this.tag, message: message }, logOptions), logOptions.error && { stack: (_c = logOptions.error) === null || _c === void 0 ? void 0 : _c.stack })));
        }
    };
    Logger.prototype.debug = function (message, options) {
        this.logMessage(logger_1.LogMethods.DEBUG, message, options);
    };
    Logger.prototype.error = function (message, options) {
        this.logMessage(logger_1.LogMethods.ERROR, message, options);
    };
    Logger.prototype.warn = function (message, options) {
        this.logMessage(logger_1.LogMethods.WARNING, message, options);
    };
    Logger.prototype.info = function (message, options) {
        this.logMessage(logger_1.LogMethods.INFO, message, options);
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map