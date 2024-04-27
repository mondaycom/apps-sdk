"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Storage = void 0;
var base_storage_1 = require("../storage/base-storage.js");
var guards_1 = require("../types/guards.js");
var Storage = /** @class */ (function (_super) {
    __extends(Storage, _super);
    function Storage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Storage.prototype.incrementCounter = function (period, options) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, error, message, newCounterValue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.storageFetchV2(this.counterUrl(), { method: 'PUT', body: __assign(__assign({}, (options || {})), { period: period }) })];
                    case 1:
                        result = _b.sent();
                        _a = result || {}, error = _a.error, message = _a.message, newCounterValue = _a.newCounterValue;
                        if (result === null || result === void 0 ? void 0 : result.error) {
                            return [2 /*return*/, { error: error, success: false }];
                        }
                        else {
                            return [2 /*return*/, { message: message, newCounterValue: newCounterValue, success: true }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype["delete"] = function (key, options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storageFetch(key, { method: 'DELETE' }, options)];
                    case 1:
                        result = _a.sent();
                        if (result === null || result === void 0 ? void 0 : result.error) {
                            return [2 /*return*/, { error: result.error, success: false }];
                        }
                        else {
                            return [2 /*return*/, { success: true }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype.get = function (key, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var result, version, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storageFetch(key, { method: 'GET' }, options)];
                    case 1:
                        result = _a.sent();
                        if (!(0, guards_1.isDefined)(result)) {
                            return [2 /*return*/, { success: false, value: null }];
                        }
                        version = result.version, value = result.value;
                        return [2 /*return*/, { success: true, value: value, version: version }];
                }
            });
        });
    };
    Storage.prototype.set = function (key, value, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var previousVersion, result, version, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previousVersion = options.previousVersion;
                        return [4 /*yield*/, this.storageFetch(key, {
                                method: 'POST',
                                body: __assign({ 
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    value: value }, previousVersion && { previous_version: previousVersion })
                            }, options)];
                    case 1:
                        result = _a.sent();
                        version = result.version, error = result.error;
                        if (version) {
                            return [2 /*return*/, { version: version, success: true }];
                        }
                        else {
                            if (error) {
                                return [2 /*return*/, { error: error, success: false }];
                            }
                            else {
                                return [2 /*return*/, { error: 'unknown error occurred', success: false }];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Storage;
}(base_storage_1.BaseStorage));
exports.Storage = Storage;
//# sourceMappingURL=storage.js.map