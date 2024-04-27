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
import { BadRequestError, InternalServerError } from '../errors/apps-sdk-error.js';
import { getGcpConnectionData, getGcpIdentityToken } from '../gcp/gcp.js';
import { MONDAY_CODE_RESERVED_PRIMITIVES_KEY } from '../secure-storage/secure-storage.consts.js';
import { isDefined } from '../types/guards.js';
import { getMondayCodeContext, validateEnvironment } from '../utils/env.js';
import { fetchWrapper } from '../utils/fetch-wrapper.js';
import { Logger } from '../utils/logger.js';
import { TIME_IN_MILLISECOND } from '../utils/time-enum.js';
import { isObject } from '../utils/validations.js';
var logger = new Logger('SecureStorage', { mondayInternal: true });
var MIN_TOKEN_EXPIRE_TTL_HOURS = 0.05;
var secureStorageFetch = function (path, connectionData, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, method, body, token, identityToken, fetchObj, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = options.method, method = _a === void 0 ? 'GET' : _a, body = options.body;
                if (!isDefined(path)) {
                    throw new BadRequestError('`path` must be provided');
                }
                token = connectionData.token, identityToken = connectionData.identityToken;
                fetchObj = {
                    headers: __assign(__assign({ 'Content-Type': 'application/json' }, (token && { 'X-Vault-Token': token })), (identityToken && { 'Authorization': "Bearer ".concat(identityToken) })),
                    method: method,
                    body: body ? JSON.stringify(body) : undefined
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetchWrapper(path, fetchObj)];
            case 2:
                result = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                logger.error('[secureStorageFetch] Unexpected error occurred while communicating with secure storage', { error: error_1 });
                throw new InternalServerError('An issue occurred while accessing secure storage');
            case 4:
                if (!isDefined(result)) {
                    return [2 /*return*/];
                }
                if (isDefined(result.errors)) {
                    logger.warn("[secureStorageFetch] Errors occurred while communicating with secure storage.\nErrors: ".concat(result.errors.join()));
                    throw new BadRequestError('Provided input is invalid');
                }
                if (!isDefined(result.data)) {
                    throw new InternalServerError('some thing went wrong when when communicating with secure storage');
                }
                return [2 /*return*/, result.data];
        }
    });
}); };
var generateCrudPath = function (path, id) {
    var secureStorageAddress = getMondayCodeContext().secureStorageAddress;
    if (!isDefined(path)) {
        throw new BadRequestError('Missing secret key');
    }
    if (!isDefined(id)) {
        logger.error('[generateCrudPath] projectId is not defined');
        throw new InternalServerError('An issue occurred while accessing secure storage');
    }
    var generalSecretPath = 'v1/kv/data';
    var fullPath = "".concat(secureStorageAddress, "/").concat(generalSecretPath, "/").concat(id, "/").concat(path);
    return fullPath;
};
var getToken = function (gcpCredentials, connectionData) { return __awaiter(void 0, void 0, void 0, function () {
    var secureStorageAddress, loginUrl, body, loginResponse, token;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                secureStorageAddress = getMondayCodeContext().secureStorageAddress;
                loginUrl = "".concat(secureStorageAddress, "/v1/auth/gcp/login");
                body = JSON.stringify({
                    role: gcpCredentials.projectId,
                    jwt: gcpCredentials.token
                });
                return [4 /*yield*/, fetchWrapper(loginUrl, {
                        method: 'POST',
                        body: body,
                        headers: { Authorization: "Bearer ".concat(connectionData.identityToken) }
                    })];
            case 1:
                loginResponse = _b.sent();
                if (!isDefined(loginResponse)) {
                    logger.error('[getToken] invalid gcp login response');
                    throw new InternalServerError('An error occurred while authenticating');
                }
                token = (_a = loginResponse === null || loginResponse === void 0 ? void 0 : loginResponse.auth) === null || _a === void 0 ? void 0 : _a.client_token;
                return [2 /*return*/, token];
        }
    });
}); };
var getTokenExpiry = function (connectionData) { return __awaiter(void 0, void 0, void 0, function () {
    var secureStorageAddress, lookupUrl, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                secureStorageAddress = getMondayCodeContext().secureStorageAddress;
                lookupUrl = "".concat(secureStorageAddress, "/v1/auth/token/lookup-self");
                return [4 /*yield*/, secureStorageFetch(lookupUrl, connectionData, { method: 'GET' })];
            case 1:
                response = _a.sent();
                if (!isDefined(response)) {
                    throw new InternalServerError('An error occurred while authenticating');
                }
                return [2 /*return*/, response.expire_time];
        }
    });
}); };
var getConnectionData = function (connectionData) { return __awaiter(void 0, void 0, void 0, function () {
    var gcpCredentials, _a, expireTime, token, identityToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getGcpConnectionData()];
            case 1:
                gcpCredentials = _b.sent();
                _a = connectionData;
                return [4 /*yield*/, getToken(gcpCredentials, connectionData)];
            case 2:
                _a.token = _b.sent();
                return [4 /*yield*/, getTokenExpiry(connectionData)];
            case 3:
                expireTime = _b.sent();
                token = connectionData.token, identityToken = connectionData.identityToken;
                return [2 /*return*/, { token: token, expireTime: expireTime, id: gcpCredentials.projectId, identityToken: identityToken }];
        }
    });
}); };
var authenticate = function (connectionData) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, expireTime, token, id, identityToken, tokenTtlInHours, ttlPassedThreshold;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                validateEnvironment();
                if (!isDefined(connectionData)) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    connectionData = {};
                }
                _a = connectionData;
                return [4 /*yield*/, getGcpIdentityToken(connectionData === null || connectionData === void 0 ? void 0 : connectionData.identityToken)];
            case 1:
                _a.identityToken = _b.sent();
                if (!!isDefined(connectionData.token)) return [3 /*break*/, 3];
                return [4 /*yield*/, getConnectionData(connectionData)];
            case 2: return [2 /*return*/, _b.sent()];
            case 3:
                expireTime = connectionData.expireTime, token = connectionData.token, id = connectionData.id, identityToken = connectionData.identityToken;
                tokenTtlInHours = ((new Date(expireTime)).getTime() - (new Date()).getTime()) / TIME_IN_MILLISECOND.HOUR;
                ttlPassedThreshold = tokenTtlInHours <= MIN_TOKEN_EXPIRE_TTL_HOURS;
                if (!ttlPassedThreshold) return [3 /*break*/, 5];
                logger.info("[authenticate] TTL PASSED ".concat(JSON.stringify({ tokenTtlInHours: tokenTtlInHours, expireTime: expireTime })));
                return [4 /*yield*/, getConnectionData(connectionData)];
            case 4: return [2 /*return*/, _b.sent()];
            case 5:
                if (!isDefined(id)) {
                    logger.error('[authenticate] projectId is not defined');
                    throw new InternalServerError('An issue occurred while accessing secure storage');
                }
                return [2 /*return*/, { token: token, expireTime: expireTime, id: id, identityToken: identityToken }];
        }
    });
}); };
var connectionData;
var SecureStorage = /** @class */ (function () {
    function SecureStorage() {
        validateEnvironment();
    }
    SecureStorage.prototype["delete"] = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authenticate(connectionData)];
                    case 1:
                        connectionData = _a.sent();
                        fullPath = generateCrudPath(key, connectionData.id);
                        return [4 /*yield*/, secureStorageFetch(fullPath, connectionData, { method: 'DELETE' })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    SecureStorage.prototype.get = function (key) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, authenticate(connectionData)];
                    case 1:
                        connectionData = _b.sent();
                        fullPath = generateCrudPath(key, connectionData.id);
                        return [4 /*yield*/, secureStorageFetch(fullPath, connectionData, { method: 'GET' })];
                    case 2:
                        result = _b.sent();
                        if (!isDefined(result) || !isDefined(result === null || result === void 0 ? void 0 : result.data)) {
                            return [2 /*return*/, null];
                        }
                        if ((_a = result.data) === null || _a === void 0 ? void 0 : _a[MONDAY_CODE_RESERVED_PRIMITIVES_KEY]) {
                            return [2 /*return*/, result.data[MONDAY_CODE_RESERVED_PRIMITIVES_KEY]];
                        }
                        return [2 /*return*/, result.data];
                }
            });
        });
    };
    SecureStorage.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, formalizedValue;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, authenticate(connectionData)];
                    case 1:
                        connectionData = _b.sent();
                        fullPath = generateCrudPath(key, connectionData.id);
                        formalizedValue = isObject(value) ? value : (_a = {}, _a[MONDAY_CODE_RESERVED_PRIMITIVES_KEY] = value, _a);
                        return [4 /*yield*/, secureStorageFetch(fullPath, connectionData, {
                                method: 'PUT',
                                body: { data: formalizedValue }
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return SecureStorage;
}());
export { SecureStorage };
//# sourceMappingURL=secure-storage.js.map