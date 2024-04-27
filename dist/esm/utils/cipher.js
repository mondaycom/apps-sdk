import { createCipheriv, createDecipheriv, createHash } from 'node:crypto';
var MOCK_INIT_VECTOR = Buffer.from('0123456789abcdef', 'utf-8');
var MOCK_SECRET = 'They don’t know that we know they know we know';
var MOCK_SECURE_STRING = createHash('sha256').update(String(MOCK_SECRET)).digest('base64');
var MOCK_SECURE_STRING_BASE_64 = Buffer.from(MOCK_SECURE_STRING, 'base64');
export var generateBase64Secret = function (secret) {
    var secretHash = createHash('sha256').update(String(secret)).digest('base64');
    var base64Secret = Buffer.from(secretHash, 'base64');
    return base64Secret;
};
export var encrypt = function (text, base64Secret, initVector) {
    if (base64Secret === void 0) { base64Secret = MOCK_SECURE_STRING_BASE_64; }
    if (initVector === void 0) { initVector = MOCK_INIT_VECTOR; }
    var cipher = createCipheriv('aes-256-cbc', base64Secret, initVector);
    var ciphered = cipher.update(text, 'utf8', 'hex');
    ciphered += cipher.final('hex');
    return ciphered;
};
export var decrypt = function (text, base64Secret, initVector) {
    if (base64Secret === void 0) { base64Secret = MOCK_SECURE_STRING_BASE_64; }
    if (initVector === void 0) { initVector = MOCK_INIT_VECTOR; }
    var decipher = createDecipheriv('aes-256-cbc', base64Secret, initVector);
    var deciphered = decipher.update(text, 'hex', 'utf8');
    deciphered += decipher.final('utf8');
    return deciphered;
};
//# sourceMappingURL=cipher.js.map