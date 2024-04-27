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
exports.getGcpConnectionData = exports.getGcpIdentityToken = void 0;
var google_auth_library_1 = require("google-auth-library");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var apps_sdk_error_1 = require("../errors/apps-sdk-error.js");
var gcp_1 = require("../types/gcp.js");
var guards_1 = require("../types/guards.js");
var env_1 = require("../utils/env.js");
var logger_1 = require("../utils/logger.js");
var logger = new logger_1.Logger('SecureStorage', { mondayInternal: true });
var generateJwtSigningUrl = function (serviceAccountEmail) { return "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/".concat(serviceAccountEmail, ":signJwt"); };
var generateGcpIdentityToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var secureStorageAddress, googleAuthClient, idTokenClient, identityToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                secureStorageAddress = (0, env_1.getMondayCodeContext)().secureStorageAddress;
                googleAuthClient = new google_auth_library_1.GoogleAuth();
                return [4 /*yield*/, googleAuthClient.getIdTokenClient(secureStorageAddress)];
            case 1:
                idTokenClient = _a.sent();
                return [4 /*yield*/, idTokenClient.idTokenProvider.fetchIdToken(secureStorageAddress)];
            case 2:
                identityToken = _a.sent();
                return [2 /*return*/, identityToken];
        }
    });
}); };
var getGcpIdentityToken = function (identityToken) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenClaims, tokenExpiration, now, nowInMilliseconds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!(0, guards_1.isDefined)(identityToken)) return [3 /*break*/, 2];
                return [4 /*yield*/, generateGcpIdentityToken()];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                tokenClaims = jsonwebtoken_1["default"].decode(identityToken);
                if (typeof tokenClaims === 'string' || !(0, guards_1.isDefined)(tokenClaims)) {
                    throw new apps_sdk_error_1.InternalServerError('An error occurred');
                }
                tokenExpiration = tokenClaims.exp;
                now = new Date();
                nowInMilliseconds = now.getTime() / 1000;
                if (!(tokenExpiration < nowInMilliseconds)) return [3 /*break*/, 4];
                return [4 /*yield*/, generateGcpIdentityToken()];
            case 3: return [2 /*return*/, _a.sent()];
            case 4: return [2 /*return*/, identityToken];
        }
    });
}); };
exports.getGcpIdentityToken = getGcpIdentityToken;
var validateGcpResponse = function (response) {
    if (response.error) {
        logger.error(JSON.stringify(response.error));
        throw new apps_sdk_error_1.InternalServerError('some thing went wrong when when communicating with secure storage');
    }
};
var getGcpConnectionData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var auth, projectId, serviceAccountEmail, accessToken, issueTimeInSeconds, expirationInSeconds, payload, jwtSigningUrl, response, responseJson, signedToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, env_1.validateEnvironment)();
                auth = new google_auth_library_1.GoogleAuth();
                auth.defaultScopes = [gcp_1.GCP_SCOPES.CLOUD_PLATFORM];
                return [4 /*yield*/, auth.getProjectId()];
            case 1:
                projectId = _a.sent();
                return [4 /*yield*/, auth.getCredentials()];
            case 2:
                serviceAccountEmail = (_a.sent()).client_email;
                return [4 /*yield*/, auth.getAccessToken()];
            case 3:
                accessToken = _a.sent();
                issueTimeInSeconds = Math.floor(Date.now() / 1000);
                expirationInSeconds = issueTimeInSeconds + 899;
                payload = JSON.stringify({
                    sub: serviceAccountEmail,
                    aud: "vault/".concat(projectId),
                    iat: issueTimeInSeconds,
                    exp: expirationInSeconds
                });
                jwtSigningUrl = generateJwtSigningUrl(serviceAccountEmail);
                return [4 /*yield*/, (0, node_fetch_1["default"])(jwtSigningUrl, {
                        method: 'POST',
                        body: JSON.stringify({ payload: payload }),
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                            'Content-Type': 'application/json'
                        }
                    })];
            case 4:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 5:
                responseJson = _a.sent();
                validateGcpResponse(responseJson);
                signedToken = responseJson.signedJwt;
                return [2 /*return*/, { token: signedToken, projectId: projectId, serviceAccountEmail: serviceAccountEmail }];
        }
    });
}); };
exports.getGcpConnectionData = getGcpConnectionData;
//# sourceMappingURL=gcp.js.map