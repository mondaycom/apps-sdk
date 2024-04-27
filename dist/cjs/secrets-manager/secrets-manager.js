"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SecretsManager = void 0;
var fs_1 = __importDefault(require("fs"));
var process = __importStar(require("process"));
var guards_1 = require("../types/guards.js");
var env_1 = require("../utils/env.js");
var logger_1 = require("../utils/logger.js");
var logger = new logger_1.Logger('SecretsManager', { mondayInternal: true });
// TODO: write tests, just like env-var-manager has
// TODO: add readme for how to use this
// TODO: bump version
var readSecretsData = function () {
    var _a;
    var secretsDataFileName = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.SECRET_NAME; // TODO this should change for either secrets, or env-vars
    if (!(0, guards_1.isDefined)(secretsDataFileName)) {
        logger.error('[SecretsManager] Secrets file name is not defined');
        return;
    }
    var secretsDataFilePath = "/secrets/".concat(secretsDataFileName); // TODO: this stays the same for secrets and envs, the /secrets as the parent folder?
    var isSecretsFileExists = fs_1["default"].existsSync(secretsDataFilePath);
    if (!isSecretsFileExists) {
        logger.error('[SecretsManager] Secrets file does not exist in path');
        return;
    }
    var secretsData = fs_1["default"].readFileSync(secretsDataFilePath, 'utf8');
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
        if ((0, env_1.isLocalEnvironment)()) {
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
        if ((0, env_1.isLocalEnvironment)()) {
            this.cachedSecretsData = process.env;
            return;
        }
        this.cachedSecretsData = readSecretsData();
        logger.info('[SecretsManager] Initialized secrets data', { mondayInternal: true });
    };
    SecretsManager.prototype.getKeys = function (options) {
        this.initSecretsIfNeeded(options);
        if (!(0, guards_1.isDefined)(this.cachedSecretsData)) {
            logger.error('[SecretsManager.getKeys] There is an issue with loading keys', { mondayInternal: false });
            return [];
        }
        return Object.keys(this.cachedSecretsData);
    };
    SecretsManager.prototype.get = function (key, options) {
        this.initSecretsIfNeeded(options);
        if (!(0, guards_1.isDefined)(this.cachedSecretsData)) {
            logger.error('[SecretsManager.get] There is an issue with loading data for key', { mondayInternal: false });
            return null;
        }
        return this.cachedSecretsData[key] || process.env[key];
    };
    return SecretsManager;
}());
exports.SecretsManager = SecretsManager;
//# sourceMappingURL=secrets-manager.js.map