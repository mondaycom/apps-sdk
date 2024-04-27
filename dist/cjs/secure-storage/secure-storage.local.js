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
exports.__esModule = true;
exports.LocalSecureStorage = void 0;
var apps_sdk_error_1 = require("../errors/apps-sdk-error.js");
var secure_storage_consts_1 = require("../secure-storage/secure-storage.consts.js");
var guards_1 = require("../types/guards.js");
var cipher_1 = require("../utils/cipher.js");
var local_db_1 = require("../utils/local-db.js");
var validations_1 = require("../utils/validations.js");
var validateKey = function (key) {
    if (!(0, guards_1.isDefined)(key)) {
        throw new apps_sdk_error_1.BadRequestError('key must be initialized');
    }
};
var LocalSecureStorage = /** @class */ (function () {
    function LocalSecureStorage() {
        this.db = (0, local_db_1.initDb)('local-secure-storage.db');
    }
    LocalSecureStorage.prototype["delete"] = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateKey(key);
                        return [4 /*yield*/, this.db["delete"](key)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    LocalSecureStorage.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedValue, stringifiedValue, valueAsObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateKey(key);
                        return [4 /*yield*/, this.db.get(key)];
                    case 1:
                        encryptedValue = _a.sent();
                        if (!(0, guards_1.isDefined)(encryptedValue)) {
                            return [2 /*return*/, null];
                        }
                        stringifiedValue = (0, cipher_1.decrypt)(encryptedValue);
                        valueAsObject = JSON.parse(stringifiedValue);
                        if ((valueAsObject === null || valueAsObject === void 0 ? void 0 : valueAsObject[secure_storage_consts_1.MONDAY_CODE_RESERVED_PRIMITIVES_KEY]) !== undefined) {
                            return [2 /*return*/, valueAsObject[secure_storage_consts_1.MONDAY_CODE_RESERVED_PRIMITIVES_KEY]];
                        }
                        return [2 /*return*/, valueAsObject];
                }
            });
        });
    };
    LocalSecureStorage.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var valueAsObject, stringifiedValue, encryptedValue;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        valueAsObject = (0, validations_1.isObject)(value) ? value : (_a = {}, _a[secure_storage_consts_1.MONDAY_CODE_RESERVED_PRIMITIVES_KEY] = value, _a);
                        validateKey(key);
                        stringifiedValue = JSON.stringify(valueAsObject);
                        encryptedValue = (0, cipher_1.encrypt)(stringifiedValue);
                        return [4 /*yield*/, this.db.set(key, encryptedValue)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return LocalSecureStorage;
}());
exports.LocalSecureStorage = LocalSecureStorage;
//# sourceMappingURL=secure-storage.local.js.map