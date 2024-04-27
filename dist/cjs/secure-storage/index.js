"use strict";
exports.__esModule = true;
exports.SecureStorage = void 0;
var env_1 = require("../utils/env.js");
var secure_storage_1 = require("./secure-storage.js");
var secure_storage_local_1 = require("./secure-storage.local.js");
var selectedSecureStorage = (0, env_1.isLocalEnvironment)() ? secure_storage_local_1.LocalSecureStorage : secure_storage_1.SecureStorage;
exports.SecureStorage = selectedSecureStorage;
//# sourceMappingURL=index.js.map