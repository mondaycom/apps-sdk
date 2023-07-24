import { existsSync, readFileSync } from 'fs';

import { EnvironmentVariablesManager } from 'lib/environment-variables-manager/environment-variables-manager';

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;

jest.mock('fs');

describe('EnvironmentVariablesManager', () => {
  const mockKey = 'mockKey';
  const mockObjectKey = 'mockObjectKey';
  const mockValue = 'mockValue';
  const mockObjectValue = { [mockKey]: mockValue };
  const mockStoredData = {
    [mockKey]: mockValue,
    [mockObjectKey]: mockObjectValue,
  };
  let environmentVariablesManager: EnvironmentVariablesManager;

  beforeEach(() => {
    process.env.SECRET_NAME = 'secret';
    environmentVariablesManager = new EnvironmentVariablesManager({});
  });

  afterEach(() => {
    process.env.SECRET_NAME = undefined;
  });

  describe('getKeys', () => {
    it('should return all keys', () => {
      mockExistsSync.mockReturnValueOnce(true);
      mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));

      const keys = environmentVariablesManager.getKeys();

      expect(keys).toEqual([mockKey, mockObjectKey]);
    });

    it('should return empty array if file does not exist', () => {
      mockExistsSync.mockReturnValueOnce(false);

      const keys = environmentVariablesManager.getKeys();

      expect(keys).toEqual([]);
    });
  });

  describe('get', () => {
    it('should return value for key', () => {
      mockExistsSync.mockReturnValueOnce(true);
      mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));

      const value = environmentVariablesManager.get(mockKey);

      expect(value).toEqual(mockValue);
    });

    it('should return value for object key', () => {
      mockExistsSync.mockReturnValueOnce(true);
      mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));

      const value = environmentVariablesManager.get(mockObjectKey);

      expect(value).toEqual(mockObjectValue);
    });

    it('should return undefined if key does not exist', () => {
      mockExistsSync.mockReturnValueOnce(true);
      mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));

      const value = environmentVariablesManager.get('badKey');

      expect(value).toEqual(undefined);
    });

    it('should return undefined if file does not exist', () => {
      mockExistsSync.mockReturnValueOnce(false);

      const value = environmentVariablesManager.get(mockKey);

      expect(value).toEqual(null);
    });

    it('should return undefined if file is not valid json', () => {
      mockExistsSync.mockReturnValueOnce(true);
      mockReadFileSync.mockReturnValueOnce('bad json');

      const value = environmentVariablesManager.get(mockKey);

      expect(value).toEqual(null);
    });
  });

  describe('Set env in process.env', () => {
    const mockKeyInProcessEnv = 'MOCK_KEY';

    beforeEach(() => {
      mockExistsSync.mockReturnValueOnce(true);
      mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockStoredData));
      delete process.env[mockKeyInProcessEnv];
    });

    it('should set env in process.env', () => {
      new EnvironmentVariablesManager({ updateProcessEnv: true });
      expect(process.env[mockKeyInProcessEnv]).toEqual(mockValue);
    });

    it('should not set env in process.env if updateProcessEnv is false', () => {
      new EnvironmentVariablesManager({ updateProcessEnv: false });
      expect(process.env[mockKeyInProcessEnv]).toEqual(undefined);
    });
  });
});
