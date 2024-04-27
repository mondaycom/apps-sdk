import { ForbiddenError } from '../errors/apps-sdk-error.js';
import { isDefined } from '../types/guards.js';
export var isLocalEnvironment = function () { return !isDefined(process.env.K_SERVICE); };
export var localServerAddress = function () {
    if (!isLocalEnvironment()) {
        throw new Error('localServerAddress() can be used, this is not a development environment.');
    }
    if (!process.env.MNDY_SERVER_ADDRESS) {
        throw new Error('En environment variable name "MNDY_SERVER_ADDRESS" is required, the value should be int the following format "(protocol)://{server_name}:{port}" e.g.: "http://localhost:8080".');
    }
    return process.env.MNDY_SERVER_ADDRESS;
};
export var getMondayCodeContext = function () { return ({
    app: process.env.K_SERVICE,
    secureStorageAddress: process.env.SECURE_STORAGE_ADDRESS
}); };
export var validateEnvironment = function () {
    var _a = getMondayCodeContext(), app = _a.app, secureStorageAddress = _a.secureStorageAddress;
    if (isLocalEnvironment()) {
        throw new ForbiddenError('Secure storage not available on local env');
    }
    if (!isDefined(app)) {
        throw new ForbiddenError('Missing environment variables for initialization [app name]');
    }
    if (!isDefined(secureStorageAddress)) {
        throw new ForbiddenError('Missing environment variables for initialization [secure storage address]');
    }
};
//# sourceMappingURL=env.js.map