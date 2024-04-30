import { BadRequestError } from 'errors/apps-sdk-error';
import { MONDAY_CODE_RESERVED_PRIMITIVES_KEY } from 'lib/secure-storage/secure-storage.consts';
import { JsonValue } from 'types/general';
import { isDefined } from 'types/guards';
import { ISecureStorageInstance } from 'types/secure-storage';
import { ILocalStorageInstance } from 'types/secure-storage.local';
import { decrypt, encrypt } from 'utils/cipher';
import { LocalDb, LocalMemoryDb, initDb } from 'utils/local-db';
import { isObject } from 'utils/validations';

const validateKey = (key: string) => {
  if (!isDefined(key)) {
    throw new BadRequestError('key must be initialized');
  }
};

let localDB : null | LocalMemoryDb | LocalDb = null;

export class LocalSecureStorage implements ISecureStorageInstance {
  private db: ILocalStorageInstance;

  constructor() {
    if (!localDB) {
      localDB = initDb('local-secure-storage.db');
    }
    this.db = localDB;
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
    const valueAsObject = JSON.parse(stringifiedValue) as T;
    if (valueAsObject?.[MONDAY_CODE_RESERVED_PRIMITIVES_KEY] !== undefined) {
      return valueAsObject[MONDAY_CODE_RESERVED_PRIMITIVES_KEY] as T;
    }

    return valueAsObject;
  }

  async set<T extends JsonValue>(key: string, value: T) {
    const valueAsObject = isObject(value) ? value : { [MONDAY_CODE_RESERVED_PRIMITIVES_KEY]: value };

    validateKey(key);
    const stringifiedValue = JSON.stringify(valueAsObject);
    const encryptedValue = encrypt(stringifiedValue);
    await this.db.set(key, encryptedValue);
    return true;
  }
}
