import { LocalSecureStorage } from '../../lib/secure-storage/secure-storage.local';
import { encrypt } from '../../lib/utils/cipher';

const MOCK_KEY = 'mock';
const MOCK_VALUE = { mock: 'mock' };
const MOCK_ENCRYPTED_VALUE = encrypt(JSON.stringify(MOCK_VALUE));
const MOCK_STORED_DATA = { [`${MOCK_KEY}`]: MOCK_ENCRYPTED_VALUE };

let mockRead = jest.fn();
let mockWrite = jest.fn();
jest.mock('../../lib/utils/local-db', () => ({
  initDb() {
    return {
      read: mockRead,
      data: MOCK_STORED_DATA,
      write: mockWrite,
    };
  },
}));

describe('LocalSecureStorage', () => {
  let localSecureStorage: LocalSecureStorage;

  beforeEach(() => {
    localSecureStorage = new LocalSecureStorage();
  });

  describe('set', () => {
    it('should fail for undefined value', async () => {
      // @ts-ignore
      await expect(localSecureStorage.set(MOCK_KEY, undefined)).rejects.toThrow();
    });

    it('should fail for value which is not an object', async () => {
      // @ts-ignore
      await expect(localSecureStorage.set(MOCK_KEY, 'not an object')).rejects.toThrow();
    });

    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.set(undefined, MOCK_VALUE)).rejects.toThrow();
    });

    it('should set data when all is valid', async () => {
      await localSecureStorage.set(MOCK_KEY, MOCK_VALUE);
      expect(mockWrite).toBeCalled();
    });
  });

  describe('get', () => {
    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.get(undefined)).rejects.toThrow();
    });

    it('should fail for key without value', async () => {
      const badKey = 'badKey';
      // @ts-ignore
      await expect(localSecureStorage.get(badKey)).rejects.toThrow();
    });

    it('should succeed for key with value', async () => {
      // @ts-ignore
      const result = await localSecureStorage.get(MOCK_KEY);
      expect(result).toEqual(MOCK_VALUE);
    });
  });

  describe('delete', () => {
    it('should fail for undefined key', async () => {
      // @ts-ignore
      await expect(localSecureStorage.delete(undefined)).rejects.toThrow();
    });

    it('should not fail for multiple deletions of the same key', async () => {
      const mockKeyToDelete = 'deleteMe';
      MOCK_STORED_DATA[mockKeyToDelete] = MOCK_ENCRYPTED_VALUE;
      await localSecureStorage.delete(mockKeyToDelete);
      await localSecureStorage.delete(mockKeyToDelete);
      expect(MOCK_STORED_DATA[mockKeyToDelete]).toBeUndefined();
    });
  });
});
