import fs from 'fs';
import * as process from 'process';
import { isDefined } from '../types/guards.js';
import { isLocalEnvironment } from '../utils/env.js';
import { Logger } from '../utils/logger.js';
var logger = new Logger('SecretsManager', { mondayInternal: true });
// TODO: write tests, just like env-var-manager has
// TODO: add readme for how to use this
// TODO: bump version
var readSecretsData = function () {
    var _a;
    var secretsDataFileName = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.SECRET_NAME; // TODO this should change for either secrets, or env-vars
    if (!isDefined(secretsDataFileName)) {
        logger.error('[SecretsManager] Secrets file name is not defined');
        return;
    }
    var secretsDataFilePath = "/secrets/".concat(secretsDataFileName); // TODO: this stays the same for secrets and envs, the /secrets as the parent folder?
    var isSecretsFileExists = fs.existsSync(secretsDataFilePath);
    if (!isSecretsFileExists) {
        logger.error('[SecretsManager] Secrets file does not exist in path');
        return;
    }
    var secretsData = fs.readFileSync(secretsDataFilePath, 'utf8');
    try {
        return JSON.parse(secretsData);
    }
    catch (error) {
        logger.error('[SecretsManager] Corrupted Secrets file. File is not in JSON format');
        return;
    }
};
var SecretsManager = /** @class */ (function () {
    function SecretsManager() {
        this.initSecrets();
        if (isLocalEnvironment()) {
            logger.info('[SecretsManager] Running in development environment, Using process.env', { mondayInternal: false });
        }
    }
    SecretsManager.prototype.initSecretsIfNeeded = function (options) {
        var _a;
        var shouldInvalidate = (_a = options === null || options === void 0 ? void 0 : options.invalidate) !== null && _a !== void 0 ? _a : true;
        if (shouldInvalidate || !this.cachedSecretsData) {
            this.initSecrets();
        }
    };
    SecretsManager.prototype.initSecrets = function () {
        if (isLocalEnvironment()) {
            this.cachedSecretsData = process.env;
            return;
        }
        this.cachedSecretsData = readSecretsData();
        logger.info('[SecretsManager] Initialized secrets data', { mondayInternal: true });
    };
    SecretsManager.prototype.getKeys = function (options) {
        this.initSecretsIfNeeded(options);
        if (!isDefined(this.cachedSecretsData)) {
            logger.error('[SecretsManager.getKeys] There is an issue with loading keys', { mondayInternal: false });
            return [];
        }
        return Object.keys(this.cachedSecretsData);
    };
    SecretsManager.prototype.get = function (key, options) {
        this.initSecretsIfNeeded(options);
        if (!isDefined(this.cachedSecretsData)) {
            logger.error('[SecretsManager.get] There is an issue with loading data for key', { mondayInternal: false });
            return null;
        }
        return this.cachedSecretsData[key] || process.env[key];
    };
    return SecretsManager;
}());
export { SecretsManager };
//# sourceMappingURL=secrets-manager.js.map