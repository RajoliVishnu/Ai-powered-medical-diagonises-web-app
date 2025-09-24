import { Router } from 'express';
import { nanoid } from 'nanoid';
import { requireAuth, getCurrentUser } from '../middleware/auth.js';
import { getDatabase } from '../lib/db.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const items = db.data.records.filter(r => r.userId === user.id);
  res.json({ items });
});

router.post('/', async (req, res) => {
  const user = await getCurrentUser(req);
  const { title, description, date } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Missing title' });
  const db = await getDatabase();
  const item = { id: nanoid(), userId: user.id, title, description: description || '', date: date || new Date().toISOString() };
  db.data.records.push(item);
  await db.write();
  res.status(201).json({ item });
});

router.put('/:id', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const idx = db.data.records.findIndex(r => r.id === req.params.id && r.userId === user.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const current = db.data.records[idx];
  const updated = { ...current, ...req.body, id: current.id, userId: current.userId };
  db.data.records[idx] = updated;
  await db.write();
  res.json({ item: updated });
});

router.delete('/:id', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const before = db.data.records.length;
  db.data.records = db.data.records.filter(r => !(r.id === req.params.id && r.userId === user.id));
  if (db.data.records.length === before) return res.status(404).json({ error: 'Not found' });
  await db.write();
  res.status(204).end();
});

export default router;



