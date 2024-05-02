import { existsSync, readFileSync } from 'fs';

import { isLocalEnvironment } from 'utils/env';

import { SecretsManager } from '../../lib';

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
const mockIsLocalEnvironment = isLocalEnvironment as jest.MockedFunction<typeof isLocalEnvironment>;

jest.mock('fs');
jest.mock('utils/env');

describe('SecretsManager', () => {
  const mockKey = 'mockKey';
  const mockObjectKey = 'mockObjectKey';
  const mockValue = 'mockValue';
  const mockObjectValue = { [mockKey]: mockValue };
  const mockStoredData = {
    [mockKey]: mockValue,
    [mockObjectKey]: mockObjectValue,
  };
  let secretsManager: SecretsManager;

  describe('monday-code environment', () => {
    beforeEach(() => {
      mockIsLocalEnvironment.mockReturnValue(false);
      process.env.SECRET_NAME = 'secret';
      secretsManager = new SecretsManager();
    });

    afterEach(() => {
      process.env.SECRET_NAME = undefined;
    });

    describe('getKeys', () => {
      it('should return all keys', () => {
        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));

        const keys = secretsManager.getKeys();

        expect(keys).toEqual([mockKey, mockObjectKey]);
      });

      it('should return empty array if file does not exist', () => {
        mockExistsSync.mockReturnValueOnce(false);

        const keys = secretsManager.getKeys();

        expect(keys).toEqual([]);
      });
    });

    describe('get', () => {
      it('should return value for key', () => {
        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));

        const value = secretsManager.get(mockKey);

        expect(value).toEqual(mockValue);
      });

      it('should return value for object key', () => {
        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));

        const value = secretsManager.get(mockObjectKey);

        expect(value).toEqual(mockObjectValue);
      });

      it('should return undefined if key does not exist', () => {
        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));

        const value = secretsManager.get('badKey');

        expect(value).toEqual(undefined);
      });

      it('should return undefined if file does not exist', () => {
        mockExistsSync.mockReturnValueOnce(false);

        const value = secretsManager.get(mockKey);

        expect(value).toEqual(null);
      });

      it('should return undefined if file is not valid json', () => {
        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce('bad json');

        const value = secretsManager.get(mockKey);

        expect(value).toEqual(null);
      });

      it('should invalidate cached version by default', () => {
        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));
        const firstResponse = secretsManager.get(mockKey);

        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce(JSON.stringify({ [mockKey]: 'new value' }));
        const secondResponse = secretsManager.get(mockKey);

        expect(firstResponse).not.toEqual(secondResponse);
      });

      it('should not invalidate cached version if invalidateCache is false', () => {
        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));
        const firstResponse = secretsManager.get(mockKey);

        mockExistsSync.mockReturnValueOnce(true);
        mockReadFileSync.mockReturnValueOnce(JSON.stringify({ [mockKey]: 'new value' }));
        const secondResponse = secretsManager.get(mockKey, { invalidate: false });

        expect(firstResponse).toEqual(secondResponse);
      });
    });
  });

  describe('local environment', () => {
    beforeEach(() => {
      mockIsLocalEnvironment.mockReturnValue(true);
      process.env.SECRET_NAME = 'secret';
      secretsManager = new SecretsManager();
    });

    afterEach(() => {
      process.env.SECRET_NAME = undefined;
    });

    describe('getKeys', () => {
      it('should return keys from process.env', () => {
        const keys = secretsManager.getKeys();
        expect(keys.length).toEqual(Object.keys(process.env).length);
      });

      it('should return empty array if process.env is empty', () => {
        process.env = {};
        const keys = secretsManager.getKeys();
        expect(keys).toEqual([]);
      });
    });

    describe('get', () => {
      it('should return value for key', () => {
        process.env['TEST'] = 'test';
        const value = secretsManager.get('TEST');
        expect(value).toEqual('test');
      });

      it('should return undefined if key does not exist', () => {
        const value = secretsManager.get('badKey');
        expect(value).toEqual(undefined);
      });
    });
  });
});
