import { accessSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';

import * as localDb from 'utils/local-db';

const DB_NAME = 'mock';

jest.mock('node:fs');

describe('local-db', () => {
  describe('initDb', () => {
    describe('no disk access', () => {
      it('should use LocalMemoryDb', () => {
        (accessSync as jest.Mock).mockImplementation(() => {
          throw new Error('error');
        });

        const db = localDb.initDb(DB_NAME);
        expect(db).toBeInstanceOf(localDb.LocalMemoryDb);
      });
    });

    describe('with disk access', () => {
      it('should use LocalDb', () => {
        (accessSync as jest.Mock).mockImplementation(() => true);

        const db = localDb.initDb(DB_NAME);
        expect(db).toBeInstanceOf(localDb.LocalDb);
      });
    });
  });

  describe('deleteDb', () => {
    describe('with disk access', () => {
      beforeEach(() => {
        (accessSync as jest.Mock).mockImplementation(() => true);
      });

      it('should do nothing if file does not exist', () => {
        (existsSync as jest.Mock).mockImplementation(() => false);

        localDb.deleteDb(DB_NAME);
        expect(unlinkSync).not.toBeCalled();
      });

      it('should delete file if exists', () => {
        (existsSync as jest.Mock).mockImplementation(() => true);

        localDb.deleteDb(DB_NAME);
        expect(unlinkSync).toBeCalledTimes(1);
      });
    });

    describe('without disk access', () => {
      beforeEach(() => {
        (accessSync as jest.Mock).mockImplementation(() => {
          throw new Error('error');
        });
      });

      it('should do nothing', () => {
        localDb.deleteDb(DB_NAME);
        expect(existsSync).not.toBeCalled();
        expect(unlinkSync).not.toBeCalled();
      });
    });
  });

  describe('LocalMemoryDb', () => {
    const MOCK_KEY = 'mock';
    let localMemoryDb: localDb.LocalMemoryDb;

    beforeEach(() => {
      localMemoryDb = new localDb.LocalMemoryDb();
    });

    describe('set', () => {
      it('should work', async () => {
        await expect(localMemoryDb.set(MOCK_KEY, { a: 1 })).resolves.toBeTruthy();
      });
    });

    describe('delete', () => {
      it('should not fail for multiple deletes of the same key', async () => {
        await localMemoryDb.delete(MOCK_KEY);
        await expect(localMemoryDb.delete(MOCK_KEY)).resolves.toBeTruthy();
      });
    });

    describe('get', () => {
      it('should return null for a key without value', async () => {
        const response = await localMemoryDb.get(MOCK_KEY);
        expect(response).toEqual(null);
      });

      it('should work of a key with value', async () => {
        const mockValue = 1337;

        await localMemoryDb.set(MOCK_KEY, mockValue);
        const storedValue = await localMemoryDb.get(MOCK_KEY);
        expect(storedValue).toEqual(mockValue);
      });
    });
  });

  describe('LocalDb', () => {
    const MOCK_KEY = 'mock';
    const MOCK_VALUE = { mock: '1337' };
    const MOCK_STORED_DATA = JSON.stringify({ [MOCK_KEY]: MOCK_VALUE });
    const MOCK_EMPTY_STORED_DATA = JSON.stringify({});

    beforeEach(() => {
      (accessSync as jest.Mock).mockImplementation(() => true);
      (existsSync as jest.Mock).mockImplementation(() => true);
      (writeFileSync as jest.Mock).mockImplementation(() => true);
      (readFileSync as jest.Mock).mockImplementation(() => MOCK_STORED_DATA);
    });

    describe('constructor', () => {
      it('should throw an error if missing write permissions', () => {
        (accessSync as jest.Mock).mockImplementation(() => {
          throw new Error('error');
        });

        expect(() => new localDb.LocalDb()).toThrow();
      });

      it('should write a new file if file does not exist', () => {
        (existsSync as jest.Mock).mockImplementation(() => false);

        new localDb.LocalDb();

        expect(writeFileSync).toBeCalledTimes(1);
        expect(readFileSync).not.toBeCalled();
      });

      it('should read data from file if it exists ', () => {
        new localDb.LocalDb();

        expect(writeFileSync).not.toBeCalled();
        expect(readFileSync).toBeCalledTimes(1);
      });
    });

    describe('crud operations', () => {
      let localDbInstance: localDb.LocalDb;

      beforeEach(() => {
        localDbInstance = new localDb.LocalDb();
      });

      describe('set', () => {
        it('should set the data in the file', async () => {
          await localDbInstance.set(MOCK_KEY, MOCK_VALUE);

          expect(writeFileSync).toBeCalledWith(expect.any(String), MOCK_STORED_DATA);
        });
      });

      describe('delete', () => {
        it('should delete the data from file', async () => {
          await localDbInstance.delete(MOCK_KEY);

          expect(writeFileSync).toBeCalledWith(expect.any(String), MOCK_EMPTY_STORED_DATA);
        });

        it('should not fail for multiple deletions of the same key', async () => {
          await localDbInstance.delete(MOCK_KEY);
          await localDbInstance.delete(MOCK_KEY);

          expect(writeFileSync).toBeCalledWith(expect.any(String), MOCK_EMPTY_STORED_DATA);
        });
      });

      describe('get', () => {
        it('should not read data from file if it exists in memory', async () => {
          await localDbInstance.get(MOCK_KEY);
          expect(readFileSync).toBeCalledTimes(1);
        });

        it('should get data from file if it does not exist in memory', async () => {
          const mockKeyNotInMemory = 'a';
          const mockStoredValueNotInMemory = JSON.stringify({ [mockKeyNotInMemory]: 1 });
          (readFileSync as jest.Mock).mockImplementation(() => mockStoredValueNotInMemory);

          await localDbInstance.get(mockKeyNotInMemory);
          expect(readFileSync).toBeCalledTimes(2);
        });

        it('should return null if data does not exist for key', async () => {
          const response = await localDbInstance.get('doesNotExist');
          expect(response).toEqual(null);
        });
      });
    });
  });
});
