import { ImplementationError } from 'errors/apps-sdk-error';
import { ISecureStorageInstance } from 'types/secure-storage';

// TODO - DOR - Implement
export class LocalSecureStorage implements ISecureStorageInstance {
  async delete(_key: string) {
    throw new ImplementationError('Not implemented yet')
    return Promise.resolve(true)
  }
  
  async get<T>(_key: string) {
    throw new ImplementationError('Not implemented yet')
    return Promise.resolve({} as T)
  }
  
  async set<T extends object>(_key: string, _value: T) {
    throw new ImplementationError('Not implemented yet')
    return Promise.resolve(true)
  }
}
