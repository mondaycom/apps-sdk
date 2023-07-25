import { BadRequestError } from 'errors/apps-sdk-error';
import { JsonValue } from 'types/general';
import { isDefined } from 'types/guards';
import { ISecureStorageInstance } from 'types/secure-storage';
import { ILocalStorageInstance } from 'types/secure-storage.local';
import { decrypt, encrypt } from 'utils/cipher';
import { initDb } from 'utils/local-db';
import { isObject } from 'utils/validations';

const validateKey = (key: string) => {
  if (!isDefined(key)) {
    throw new BadRequestError('key must be initialized');
  }
};

export class LocalSecureStorage implements ISecureStorageInstance {
  private db: ILocalStorageInstance;
  
  constructor() {
    this.db = initDb('local-secure-storage.db');
  }
  
  async delete(key: string) {
    validateKey(key);
    await this.db.delete(key);
    return true;
  }
  
  async get<T>(key: string) {
    validateKey(key);
    const encryptedValue = await this.db.get<string>(key);
    if (!isDefined(encryptedValue)) {
      return null;
    }
    
    const stringifiedValue = decrypt(encryptedValue);
    return JSON.parse(stringifiedValue) as T;
  }
  
  async set<T extends JsonValue>(key: string, value: T) {
    const valueAsObject = isObject(value) ? value : { value };
    
    validateKey(key);
    const stringifiedValue = JSON.stringify(valueAsObject);
    const encryptedValue = encrypt(stringifiedValue);
    await this.db.set(key, encryptedValue);
    return true;
  }
}
