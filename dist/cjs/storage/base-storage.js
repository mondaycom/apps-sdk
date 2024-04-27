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
exports.__esModule = true;
exports.BaseStorage = void 0;
var apps_sdk_error_1 = require("../errors/apps-sdk-error.js");
var guards_1 = require("../types/guards.js");
var fetch_wrapper_1 = require("../utils/fetch-wrapper.js");
var logger_1 = require("../utils/logger.js");
var BaseStorage = /** @class */ (function () {
    function BaseStorage(token) {
        this.token = token;
        this.logger = new logger_1.Logger('Storage', { mondayInternal: true });
    }
    BaseStorage.prototype.storageFetchV2 = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var method, body, stringifiedBody, headers, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = options.method, body = options.body;
                        stringifiedBody = JSON.stringify(body);
                        if (!(0, guards_1.isDefined)(method)) {
                            throw new apps_sdk_error_1.InternalServerError('An error occurred');
                        }
                        headers = {
                            Authorization: this.token,
                            'Content-Type': 'application/json',
                            'User-Agent': 'monday-apps-sdk'
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, fetch_wrapper_1.fetchWrapper)(url, __assign({ method: method, headers: headers }, (body && { body: stringifiedBody })))];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error('[storageFetch] Unexpected error occurred while communicating with storage', { error: error_1 });
                        throw new apps_sdk_error_1.InternalServerError('An issue occurred while accessing storage');
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    BaseStorage.prototype.storageFetch = function (key, options, externalOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var method, body, stringifiedBody, url, headers, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = options.method, body = options.body;
                        stringifiedBody = JSON.stringify(body);
                        url = this.generateCrudPath(key, externalOptions);
                        if (!(0, guards_1.isDefined)(method)) {
                            throw new apps_sdk_error_1.InternalServerError('An error occurred');
                        }
                        headers = {
                            Authorization: this.token,
                            'Content-Type': 'application/json',
                            'User-Agent': 'monday-apps-sdk'
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, fetch_wrapper_1.fetchWrapper)(url, __assign({ method: method, headers: headers }, (body && { body: stringifiedBody })))];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.logger.error('[storageFetch] Unexpected error occurred while communicating with storage', { error: error_2 });
                        throw new apps_sdk_error_1.InternalServerError('An issue occurred while accessing storage');
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    BaseStorage.prototype.getStorageUrl = function () {
        var url = process.env.STORAGE_URL || 'https://apps-storage.monday.com/app_storage_api/v2';
        return url;
    };
    BaseStorage.prototype.getStorageUrlV2 = function () {
        var url = process.env.STORAGE_URL || 'https://apps-storage.monday.com/api/v2';
        return url;
    };
    BaseStorage.prototype.generateCrudPath = function (key, options) {
        var _a;
        if (!(0, guards_1.isDefined)(key)) {
            throw new apps_sdk_error_1.BadRequestError('Missing key');
        }
        var shareGlobally = (_a = options === null || options === void 0 ? void 0 : options.shared) !== null && _a !== void 0 ? _a : false;
        var storageUrl = this.getStorageUrl();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        var fullPath = "".concat(storageUrl, "/").concat(key, "?shareGlobally=").concat(shareGlobally);
        return fullPath;
    };
    BaseStorage.prototype.counterUrl = function () {
        var storageUrl = this.getStorageUrlV2();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        var fullPath = "".concat(storageUrl, "/operations");
        return fullPath;
    };
    return BaseStorage;
}());
exports.BaseStorage = BaseStorage;
//# sourceMappingURL=base-storage.js.map