/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  accessSync,
  existsSync,
  constants as fsConstants,
  readFileSync,
  unlinkSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

import appRoot from 'app-root-path';

import { InternalServerError, NotFoundError } from 'errors/apps-sdk-error';
import { isDefined } from 'types/guards';
import { ILocalStorageInstance } from 'types/secure-storage.local';
import { Logger } from 'utils/logger';

const DEFAULT_DB_NAME = 'storage';

const logger = new Logger('LocalDb', { passThrough: true });

const getDbPath = (dbName: string) => join(appRoot.toString(), `${dbName}.json`);

const hasDiskWriteAccess = () => {
  const rootDir = appRoot.toString();
  try {
    accessSync(rootDir, fsConstants.W_OK);
    return true;
  } catch (_err) {
    return false;
  }
};

export const deleteDb = (dbName = DEFAULT_DB_NAME): void => {
  if (hasDiskWriteAccess()) {
    const file = getDbPath(dbName);
    if (existsSync(file)) {
      unlinkSync(file);
    }
  }
};

const inMemoryData: Record<string, any> = {};

export class LocalMemoryDb implements ILocalStorageInstance {
  async set<T>(key: string, value: T): Promise<boolean> {
    inMemoryData[key] = value;
    return Promise.resolve(true);
  }
  
  async delete(key: string): Promise<boolean> {
    delete inMemoryData[key];
    return Promise.resolve(true);
  }
  
  async get<T>(key: string): Promise<T> {
    if (key in inMemoryData) {
      return Promise.resolve(inMemoryData[key] as T);
    }
    
    throw new NotFoundError(`Data not found for '${key}'`);
  }
}

export class LocalDb implements ILocalStorageInstance {
  private readonly dbFilePath: string;
  private memoryData: Record<string, any>;
  
  constructor(dbFileName: string = DEFAULT_DB_NAME) {
    if (!hasDiskWriteAccess()) {
      throw new InternalServerError('Missing write permissions');
    }
    
    this.dbFilePath = getDbPath(dbFileName);
    if (!existsSync(this.dbFilePath)) {
      this.memoryData = {};
      writeFileSync(this.dbFilePath, JSON.stringify(this.memoryData), { encoding: 'utf8', flag: 'wx' });
      return;
    }
    
    const stringifiedDbData = readFileSync(this.dbFilePath, 'utf-8');
    if (isDefined(stringifiedDbData)) {
      this.memoryData = JSON.parse(stringifiedDbData);
      return;
    }
    
    this.memoryData = {};
  }
  
  async set<T>(key: string, value: T): Promise<boolean> {
    this.memoryData[key] = value;
    
    writeFileSync(this.dbFilePath, JSON.stringify(this.memoryData));
    return Promise.resolve(true);
  }
  
  async delete(key: string): Promise<boolean> {
    delete this.memoryData[key];
    
    writeFileSync(this.dbFilePath, JSON.stringify(this.memoryData));
    return Promise.resolve(true);
  }
  
  async get<T>(key: string): Promise<T> {
    if (key in this.memoryData) {
      return Promise.resolve(this.memoryData[key] as T);
    }
    
    const data = readFileSync(this.dbFilePath, 'utf-8');
    const parsedData: Record<string, any> = JSON.parse(data);
    this.memoryData = parsedData;
    if (key in this.memoryData) {
      return Promise.resolve(this.memoryData[key] as T);
    }
    
    throw new NotFoundError(`Data not found for '${key}'`);
  }
}

export const initDb = (dbName = DEFAULT_DB_NAME) => {
  if (hasDiskWriteAccess()) {
    logger.info('Initializing local db');
    return new LocalDb(dbName);
  }
  
  logger.warn('No disk access, initializing in memory db (not data persistence)');
  return new LocalMemoryDb();
};
