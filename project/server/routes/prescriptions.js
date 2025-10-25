import { Router } from 'express';
import { nanoid } from 'nanoid';
import { requireAuth, getCurrentUser } from '../middleware/auth.js';
import { getDatabase } from '../lib/db.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const items = db.data.prescriptions.filter(p => p.userId === user.id);
  res.json({ items });
});

router.post('/', async (req, res) => {
  const user = await getCurrentUser(req);
  const { medication, dosage, instructions, startDate, endDate } = req.body || {};
  if (!medication) return res.status(400).json({ error: 'Missing medication' });
  const db = await getDatabase();
  const item = {
    id: nanoid(),
    userId: user.id,
    medication,
    dosage: dosage || '',
    instructions: instructions || '',
    startDate: startDate || new Date().toISOString(),
    endDate: endDate || null
  };
  db.data.prescriptions.push(item);
  await db.write();
  res.status(201).json({ item });
});

router.put('/:id', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const idx = db.data.prescriptions.findIndex(p => p.id === req.params.id && p.userId === user.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const current = db.data.prescriptions[idx];
  const updated = { ...current, ...req.body, id: current.id, userId: current.userId };
  db.data.prescriptions[idx] = updated;
  await db.write();
  res.json({ item: updated });
});

router.delete('/:id', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const before = db.data.prescriptions.length;
  db.data.prescriptions = db.data.prescriptions.filter(p => !(p.id === req.params.id && p.userId === user.id));
  if (db.data.prescriptions.length === before) return res.status(404).json({ error: 'Not found' });
  await db.write();
  res.status(204).end();
});

export default router;



