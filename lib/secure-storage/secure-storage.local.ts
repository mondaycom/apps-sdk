/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */

import { BadRequestError, NotFoundError } from 'errors/apps-sdk-error';
import { isDefined } from 'types/guards';
import { ISecureStorageInstance } from 'types/secure-storage';
import { decrypt, encrypt } from 'utils/cipher';
import { initDb } from 'utils/local-db';

const validateKey = (key: string) => {
  if (!isDefined(key)) {
    throw new BadRequestError('key must be initialized');
  }
};

export class LocalSecureStorage implements ISecureStorageInstance {
  private db;
  
  private async init() {
    if (!isDefined(this.db)) {
      this.db = await initDb('local-secure-storage.db');
    }
  }
  
  async delete(key: string) {
    validateKey(key);
    await this.init();
    delete this.db.data[key];
    await this.db.write();
    return true;
  }
  
  async get<T>(key: string) {
    validateKey(key);
    await this.init();
    const encryptedValue = this.db.data[key] as string;
    if (!isDefined(encryptedValue)) {
      throw new NotFoundError(`No data found for ${key}`);
    }
    
    console.log(encryptedValue);
    const stringifiedValue = decrypt(encryptedValue);
    return JSON.parse(stringifiedValue) as T;
  }
  
  async set<T extends object>(key: string, value: T) {
    if (!isDefined(value) || typeof value !== 'object') {
      throw new BadRequestError('Value must be an object');
    }
    
    validateKey(key);
    await this.init();
    const stringifiedValue = JSON.stringify(value);
    const encryptedValue = encrypt(stringifiedValue);
    this.db.data[key] = encryptedValue;
    this.db.write();
    return true;
  }
}
