import { JSONFilePreset } from 'lowdb/node';
import path from 'path';

const defaultData = {
  users: [],
  appointments: [],
  records: [],
  prescriptions: [],
  payments: []
};

export let db = null;

export async function initDatabase() {
  if (db) return db;
  const dataDir = process.env.DATA_DIR || '.';
  const dbFilePath = path.resolve(dataDir, 'db.json');
  db = await JSONFilePreset(dbFilePath, defaultData);
  return db;
}

export async function getDatabase() {
  if (!db) {
    await initDatabase();
  }
  return db;
}



