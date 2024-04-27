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
exports.EnvironmentVariablesManager = void 0;
var fs_1 = __importDefault(require("fs"));
var process = __importStar(require("process"));
var guards_1 = require("../types/guards.js");
var env_1 = require("../utils/env.js");
var logger_1 = require("../utils/logger.js");
var string_manipulations_1 = require("../utils/string-manipulations.js");
var logger = new logger_1.Logger('EnvironmentVariablesManager', { mondayInternal: true });
var readEnvironmentData = function () {
    var _a;
    var environmentDataFileName = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.SECRET_NAME;
    if (!(0, guards_1.isDefined)(environmentDataFileName)) {
        logger.error('[EnvironmentVariablesManager] Environment file name is not defined');
        return;
    }
    var environmentDataFilePath = "/secrets/".concat(environmentDataFileName);
    var isEnvironmentFileExists = fs_1["default"].existsSync(environmentDataFilePath);
    if (!isEnvironmentFileExists) {
        logger.error('[EnvironmentVariablesManager] Environment file does not exist in path');
        return;
    }
    var environmentData = fs_1["default"].readFileSync(environmentDataFilePath, 'utf8');
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
        if ((0, env_1.isLocalEnvironment)()) {
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
        if ((0, env_1.isLocalEnvironment)()) {
            this.cachedEnvironmentData = process.env;
            return;
        }
        var updateProcessEnv = options.updateProcessEnv;
        this.shouldUpdateProcessEnv = updateProcessEnv !== null && updateProcessEnv !== void 0 ? updateProcessEnv : this.shouldUpdateProcessEnv;
        this.cachedEnvironmentData = readEnvironmentData();
        if (!(0, guards_1.isDefined)(this.cachedEnvironmentData)) {
            return;
        }
        if (this.shouldUpdateProcessEnv) {
            Object.entries(this.cachedEnvironmentData).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var snakeCaseKey = (0, string_manipulations_1.snakeCase)(key, { upperCase: true });
                process.env[snakeCaseKey] = value;
            });
        }
        logger.info('[EnvironmentVariablesManager] Initialized environment variables data', { mondayInternal: true });
    };
    EnvironmentVariablesManager.prototype.getKeys = function (options) {
        this.initEnvIfNeeded(options);
        if (!(0, guards_1.isDefined)(this.cachedEnvironmentData)) {
            logger.error('[EnvironmentVariablesManager.getKeys] There is an issue with loading keys', { mondayInternal: false });
            return [];
        }
        return Object.keys(this.cachedEnvironmentData);
    };
    EnvironmentVariablesManager.prototype.get = function (key, options) {
        this.initEnvIfNeeded(options);
        if (!(0, guards_1.isDefined)(this.cachedEnvironmentData)) {
            logger.error('[EnvironmentVariablesManager.get] There is an issue with loading data for key', { mondayInternal: false });
            return null;
        }
        return this.cachedEnvironmentData[key] || process.env[key];
    };
    return EnvironmentVariablesManager;
}());
exports.EnvironmentVariablesManager = EnvironmentVariablesManager;
//# sourceMappingURL=environment-variables-manager.js.map