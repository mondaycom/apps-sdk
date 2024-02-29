/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LocalSecureStorage } from 'lib/secure-storage/secure-storage.local';
import * as encryptionService from 'utils/cipher';

import { MONDAY_CODE_RESERVED_PRIMITIVES_KEY } from '../../lib/secure-storage/secure-storage.consts';

const MOCK_KEY = 'mock';
const MOCK_VALUE = { mock: 'mock' };
const MOCK_ENCRYPTED_VALUE = encryptionService.encrypt(JSON.stringify(MOCK_VALUE));
const MOCK_STORED_DATA = { [`${MOCK_KEY}`]: MOCK_ENCRYPTED_VALUE };

const mockGet = jest.fn();
const mockSet = jest.fn();
const mockDelete = jest.fn();

jest.mock('../../lib/utils/local-db', () => ({
  initDb() {
    return {
      get: mockGet,
      set: mockSet,
      delete: mockDelete,
    };
  },
}));

describe('LocalSecureStorage', () => {
  let localSecureStorage: LocalSecureStorage;

  beforeEach(() => {
    localSecureStorage = new LocalSecureStorage();
  });

  describe('set', () => {
    it('should not fail for undefined value', async () => {
      const encryptSpy = jest.spyOn(encryptionService, 'encrypt');
      // @ts-ignore
      await localSecureStorage.set(MOCK_KEY, undefined);

      expect(encryptSpy).toBeCalledWith(JSON.stringify({ value: undefined }));
    });

    it(`should store a value which is not an object as an object with the key '${MONDAY_CODE_RESERVED_PRIMITIVES_KEY}'`, async () => {
      const encryptSpy = jest.spyOn(encryptionService, 'encrypt');
      const value = 'not an object';

      await localSecureStorage.set(MOCK_KEY, value);

      expect(encryptSpy).toBeCalledWith(JSON.stringify({ [MONDAY_CODE_RESERVED_PRIMITIVES_KEY]: value }));
    });

    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.set(undefined, MOCK_VALUE)).rejects.toThrow();
    });

    it('should set data when all is valid', async () => {
      await localSecureStorage.set(MOCK_KEY, MOCK_VALUE);
      expect(mockSet).toBeCalled();
    });
  });

  describe('get', () => {
    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.get(undefined)).rejects.toThrow();
    });

    it('should return null for key without value', async () => {
      const badKey = 'badKey';
      const response = await localSecureStorage.get(badKey);
      expect(response).toEqual(null);
    });

    it('should succeed for key with value', async () => {
      mockGet.mockImplementation(() => MOCK_STORED_DATA[MOCK_KEY]);
      const result = await localSecureStorage.get(MOCK_KEY);
      expect(result).toEqual(MOCK_VALUE);
    });

    it('should return the value as is if it is not an object', async () => {
      const value = 'not an object';
      mockGet.mockImplementation(() =>
        encryptionService.encrypt(JSON.stringify({ [MONDAY_CODE_RESERVED_PRIMITIVES_KEY]: value })),
      );
      const result = await localSecureStorage.get(MOCK_KEY);
      expect(result).toEqual(value);
    });
  });

  describe('delete', () => {
    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.delete(undefined)).rejects.toThrow();
    });

    it('should delete for valid key', async () => {
      const mockKeyToDelete = 'deleteMe';
      await localSecureStorage.delete(mockKeyToDelete);
      expect(mockDelete).toBeCalledWith(mockKeyToDelete);
    });

    it('should not fail for multiple deletions of the same key', async () => {
      const mockKeyToDelete = 'deleteMe';
      await localSecureStorage.delete(mockKeyToDelete);
      await expect(localSecureStorage.delete(mockKeyToDelete)).resolves.toBeTruthy();
    });
  });
});
