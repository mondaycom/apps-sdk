import { createCipheriv, createDecipheriv, createHash } from 'node:crypto';

const MOCK_INIT_VECTOR = Buffer.from('0123456789abcdef', 'utf-8');
const MOCK_SECURE_STRING = createHash('sha256').update(String('They don’t know that we know they know we know')).digest('base64');
const MOCK_SECURE_STRING_BASE_64 = Buffer.from(MOCK_SECURE_STRING, 'base64');

export const generateBase64Secret = (secret: string) => {
  const secretHash = createHash('sha256').update(String(secret)).digest('base64');
  const base64Secret = Buffer.from(secretHash, 'base64');
  
  return base64Secret;
};

export const encrypt = (text: string, base64Secret = MOCK_SECURE_STRING_BASE_64, initVector = MOCK_INIT_VECTOR) => {
  const cipher = createCipheriv('aes-256-cbc', base64Secret, initVector);
  let ciphered = cipher.update(text, 'utf8', 'hex');
  ciphered += cipher.final('hex');
  return ciphered;
};

export const decrypt = (text: string, base64Secret = MOCK_SECURE_STRING_BASE_64, initVector = MOCK_INIT_VECTOR) => {
  const decipher = createDecipheriv('aes-256-cbc', base64Secret, initVector);
  let deciphered = decipher.update(text, 'hex', 'utf8');
  deciphered += decipher.final('utf8');
  return deciphered;
};
