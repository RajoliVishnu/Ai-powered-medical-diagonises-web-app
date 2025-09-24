import { JSONFilePreset } from 'lowdb/node';

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
  db = await JSONFilePreset('db.json', defaultData);
  return db;
}

export async function getDatabase() {
  if (!db) {
    await initDatabase();
  }
  return db;
}



