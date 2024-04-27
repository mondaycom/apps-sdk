import fs from 'fs';
import * as process from 'process';
import { isDefined } from '../types/guards.js';
import { isLocalEnvironment } from '../utils/env.js';
import { Logger } from '../utils/logger.js';
import { snakeCase } from '../utils/string-manipulations.js';
var logger = new Logger('EnvironmentVariablesManager', { mondayInternal: true });
var readEnvironmentData = function () {
    var _a;
    var environmentDataFileName = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.SECRET_NAME;
    if (!isDefined(environmentDataFileName)) {
        logger.error('[EnvironmentVariablesManager] Environment file name is not defined');
        return;
    }
    var environmentDataFilePath = "/secrets/".concat(environmentDataFileName);
    var isEnvironmentFileExists = fs.existsSync(environmentDataFilePath);
    if (!isEnvironmentFileExists) {
        logger.error('[EnvironmentVariablesManager] Environment file does not exist in path');
        return;
    }
    var environmentData = fs.readFileSync(environmentDataFilePath, 'utf8');
    try {
        return JSON.parse(environmentData);
    }
    catch (error) {
        logger.error('[EnvironmentVariablesManager] Corrupted Environment file. File is not in JSON format');
        return;
    }
};
var EnvironmentVariablesManager = /** @class */ (function () {
    function EnvironmentVariablesManager(options) {
        this.shouldUpdateProcessEnv = !!(options === null || options === void 0 ? void 0 : options.updateProcessEnv);
        this.initEnv(options);
        if (isLocalEnvironment()) {
            logger.info('[EnvironmentVariablesManager] Running in development environment, Using process.env', { mondayInternal: false });
        }
    }
    EnvironmentVariablesManager.prototype.initEnvIfNeeded = function (options) {
        var _a;
        var shouldInvalidate = (_a = options === null || options === void 0 ? void 0 : options.invalidate) !== null && _a !== void 0 ? _a : true;
        if (shouldInvalidate || !this.cachedEnvironmentData) {
            this.initEnv();
        }
    };
    EnvironmentVariablesManager.prototype.initEnv = function (options) {
        if (options === void 0) { options = {}; }
        if (isLocalEnvironment()) {
            this.cachedEnvironmentData = process.env;
            return;
        }
        var updateProcessEnv = options.updateProcessEnv;
        this.shouldUpdateProcessEnv = updateProcessEnv !== null && updateProcessEnv !== void 0 ? updateProcessEnv : this.shouldUpdateProcessEnv;
        this.cachedEnvironmentData = readEnvironmentData();
        if (!isDefined(this.cachedEnvironmentData)) {
            return;
        }
        if (this.shouldUpdateProcessEnv) {
            Object.entries(this.cachedEnvironmentData).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var snakeCaseKey = snakeCase(key, { upperCase: true });
                process.env[snakeCaseKey] = value;
            });
        }
        logger.info('[EnvironmentVariablesManager] Initialized environment variables data', { mondayInternal: true });
    };
    EnvironmentVariablesManager.prototype.getKeys = function (options) {
        this.initEnvIfNeeded(options);
        if (!isDefined(this.cachedEnvironmentData)) {
            logger.error('[EnvironmentVariablesManager.getKeys] There is an issue with loading keys', { mondayInternal: false });
            return [];
        }
        return Object.keys(this.cachedEnvironmentData);
    };
    EnvironmentVariablesManager.prototype.get = function (key, options) {
        this.initEnvIfNeeded(options);
        if (!isDefined(this.cachedEnvironmentData)) {
            logger.error('[EnvironmentVariablesManager.get] There is an issue with loading data for key', { mondayInternal: false });
            return null;
        }
        return this.cachedEnvironmentData[key] || process.env[key];
    };
    return EnvironmentVariablesManager;
}());
export { EnvironmentVariablesManager };
//# sourceMappingURL=environment-variables-manager.js.map