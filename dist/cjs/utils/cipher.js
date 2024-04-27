"use strict";
exports.__esModule = true;
exports.decrypt = exports.encrypt = exports.generateBase64Secret = void 0;
var node_crypto_1 = require("node:crypto");
var MOCK_INIT_VECTOR = Buffer.from('0123456789abcdef', 'utf-8');
var MOCK_SECRET = 'They don’t know that we know they know we know';
var MOCK_SECURE_STRING = (0, node_crypto_1.createHash)('sha256').update(String(MOCK_SECRET)).digest('base64');
var MOCK_SECURE_STRING_BASE_64 = Buffer.from(MOCK_SECURE_STRING, 'base64');
var generateBase64Secret = function (secret) {
    var secretHash = (0, node_crypto_1.createHash)('sha256').update(String(secret)).digest('base64');
    var base64Secret = Buffer.from(secretHash, 'base64');
    return base64Secret;
};
exports.generateBase64Secret = generateBase64Secret;
var encrypt = function (text, base64Secret, initVector) {
    if (base64Secret === void 0) { base64Secret = MOCK_SECURE_STRING_BASE_64; }
    if (initVector === void 0) { initVector = MOCK_INIT_VECTOR; }
    var cipher = (0, node_crypto_1.createCipheriv)('aes-256-cbc', base64Secret, initVector);
    var ciphered = cipher.update(text, 'utf8', 'hex');
    ciphered += cipher.final('hex');
    return ciphered;
};
exports.encrypt = encrypt;
var decrypt = function (text, base64Secret, initVector) {
    if (base64Secret === void 0) { base64Secret = MOCK_SECURE_STRING_BASE_64; }
    if (initVector === void 0) { initVector = MOCK_INIT_VECTOR; }
    var decipher = (0, node_crypto_1.createDecipheriv)('aes-256-cbc', base64Secret, initVector);
    var deciphered = decipher.update(text, 'hex', 'utf8');
    deciphered += decipher.final('utf8');
    return deciphered;
};
exports.decrypt = decrypt;
//# sourceMappingURL=cipher.js.map