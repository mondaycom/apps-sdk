"use strict";
exports.__esModule = true;
exports.validateEnvironment = exports.getMondayCodeContext = exports.localServerAddress = exports.isLocalEnvironment = void 0;
var apps_sdk_error_1 = require("../errors/apps-sdk-error.js");
var guards_1 = require("../types/guards.js");
var isLocalEnvironment = function () { return !(0, guards_1.isDefined)(process.env.K_SERVICE); };
exports.isLocalEnvironment = isLocalEnvironment;
var localServerAddress = function () {
    if (!(0, exports.isLocalEnvironment)()) {
        throw new Error('localServerAddress() can be used, this is not a development environment.');
    }
    if (!process.env.MNDY_SERVER_ADDRESS) {
        throw new Error('En environment variable name "MNDY_SERVER_ADDRESS" is required, the value should be int the following format "(protocol)://{server_name}:{port}" e.g.: "http://localhost:8080".');
    }
    return process.env.MNDY_SERVER_ADDRESS;
};
exports.localServerAddress = localServerAddress;
var getMondayCodeContext = function () { return ({
    app: process.env.K_SERVICE,
    secureStorageAddress: process.env.SECURE_STORAGE_ADDRESS
}); };
exports.getMondayCodeContext = getMondayCodeContext;
var validateEnvironment = function () {
    var _a = (0, exports.getMondayCodeContext)(), app = _a.app, secureStorageAddress = _a.secureStorageAddress;
    if ((0, exports.isLocalEnvironment)()) {
        throw new apps_sdk_error_1.ForbiddenError('Secure storage not available on local env');
    }
    if (!(0, guards_1.isDefined)(app)) {
        throw new apps_sdk_error_1.ForbiddenError('Missing environment variables for initialization [app name]');
    }
    if (!(0, guards_1.isDefined)(secureStorageAddress)) {
        throw new apps_sdk_error_1.ForbiddenError('Missing environment variables for initialization [secure storage address]');
    }
};
exports.validateEnvironment = validateEnvironment;
//# sourceMappingURL=env.js.map