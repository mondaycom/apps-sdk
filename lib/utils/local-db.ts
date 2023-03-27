import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import appRoot from 'app-root-path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import { Logger } from 'utils/logger';

const DEFAULT_DB_NAME = 'storage';

const logger = new Logger('LocalDb', { passThrough: true });

const getDbPath = (dbName: string) => join(appRoot.toString(), `${dbName}.json`);

export const deleteDb = (dbName = DEFAULT_DB_NAME): void => {
  const file = getDbPath(dbName);
  if (existsSync(file)) {
    unlinkSync(file);
  }
};

export const initDb = async (dbName = DEFAULT_DB_NAME) => {
  const file = getDbPath(dbName);
  logger.info(`Initializing local db in ${file}`);
  
  const adapter = new JSONFile(file);
  const db = new Low(adapter);
  
  await db.read();
  db.data ||= {};
  await db.write();
  logger.info('initialized local db');
  
  return db;
};
