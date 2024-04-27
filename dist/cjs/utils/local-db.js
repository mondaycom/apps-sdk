"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.initDb = exports.LocalDb = exports.LocalMemoryDb = exports.deleteDb = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var app_root_path_1 = __importDefault(require("app-root-path"));
var apps_sdk_error_1 = require("../errors/apps-sdk-error.js");
var guards_1 = require("../types/guards.js");
var logger_1 = require("./logger.js");
var DEFAULT_DB_NAME = 'storage';
var logger = new logger_1.Logger('LocalDb', { mondayInternal: false });
var getDbPath = function (dbName) { return (0, node_path_1.join)(app_root_path_1["default"].toString(), "".concat(dbName, ".json")); };
var hasDiskWriteAccess = function () {
    var rootDir = app_root_path_1["default"].toString();
    try {
        (0, node_fs_1.accessSync)(rootDir, node_fs_1.constants.W_OK);
        return true;
    }
    catch (_err) {
        return false;
    }
};
var deleteDb = function (dbName) {
    if (dbName === void 0) { dbName = DEFAULT_DB_NAME; }
    if (hasDiskWriteAccess()) {
        var file = getDbPath(dbName);
        if ((0, node_fs_1.existsSync)(file)) {
            (0, node_fs_1.unlinkSync)(file);
        }
    }
};
exports.deleteDb = deleteDb;
var inMemoryData = {};
var LocalMemoryDb = /** @class */ (function () {
    function LocalMemoryDb() {
    }
    LocalMemoryDb.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                inMemoryData[key] = value;
                return [2 /*return*/, Promise.resolve(true)];
            });
        });
    };
    LocalMemoryDb.prototype["delete"] = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                delete inMemoryData[key];
                return [2 /*return*/, Promise.resolve(true)];
            });
        });
    };
    LocalMemoryDb.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (key in inMemoryData) {
                    return [2 /*return*/, Promise.resolve(inMemoryData[key])];
                }
                return [2 /*return*/, null];
            });
        });
    };
    return LocalMemoryDb;
}());
exports.LocalMemoryDb = LocalMemoryDb;
var LocalDb = /** @class */ (function () {
    function LocalDb(dbFileName) {
        if (dbFileName === void 0) { dbFileName = DEFAULT_DB_NAME; }
        if (!hasDiskWriteAccess()) {
            throw new apps_sdk_error_1.InternalServerError('Missing write permissions');
        }
        this.dbFilePath = getDbPath(dbFileName);
        if (!(0, node_fs_1.existsSync)(this.dbFilePath)) {
            this.memoryData = {};
            (0, node_fs_1.writeFileSync)(this.dbFilePath, JSON.stringify(this.memoryData), { encoding: 'utf8', flag: 'wx' });
            return;
        }
        var stringifiedDbData = (0, node_fs_1.readFileSync)(this.dbFilePath, 'utf-8');
        if ((0, guards_1.isDefined)(stringifiedDbData)) {
            this.memoryData = JSON.parse(stringifiedDbData);
            return;
        }
        this.memoryData = {};
    }
    LocalDb.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.memoryData[key] = value;
                (0, node_fs_1.writeFileSync)(this.dbFilePath, JSON.stringify(this.memoryData));
                return [2 /*return*/, Promise.resolve(true)];
            });
        });
    };
    LocalDb.prototype["delete"] = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                delete this.memoryData[key];
                (0, node_fs_1.writeFileSync)(this.dbFilePath, JSON.stringify(this.memoryData));
                return [2 /*return*/, Promise.resolve(true)];
            });
        });
    };
    LocalDb.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var data, parsedData;
            return __generator(this, function (_a) {
                if (key in this.memoryData) {
                    return [2 /*return*/, Promise.resolve(this.memoryData[key])];
                }
                data = (0, node_fs_1.readFileSync)(this.dbFilePath, 'utf-8');
                parsedData = JSON.parse(data);
                this.memoryData = parsedData;
                if (key in this.memoryData) {
                    return [2 /*return*/, Promise.resolve(this.memoryData[key])];
                }
                return [2 /*return*/, null];
            });
        });
    };
    return LocalDb;
}());
exports.LocalDb = LocalDb;
var initDb = function (dbName) {
    if (dbName === void 0) { dbName = DEFAULT_DB_NAME; }
    if (hasDiskWriteAccess()) {
        logger.info('Initializing local db');
        return new LocalDb(dbName);
    }
    logger.warn('No disk access, initializing in memory db (not data persistence)');
    return new LocalMemoryDb();
};
exports.initDb = initDb;
//# sourceMappingURL=local-db.js.map