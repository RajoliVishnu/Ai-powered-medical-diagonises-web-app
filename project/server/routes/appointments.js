import { Router } from 'express';
import { nanoid } from 'nanoid';
import { requireAuth, getCurrentUser } from '../middleware/auth.js';
import { getDatabase } from '../lib/db.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const items = db.data.appointments.filter(a => a.userId === user.id);
  res.json({ items });
});

router.post('/', async (req, res) => {
  const user = await getCurrentUser(req);
  const { doctorName, scheduledAt, reason, status } = req.body || {};
  if (!doctorName || !scheduledAt) return res.status(400).json({ error: 'Missing fields' });
  const db = await getDatabase();
  const item = {
    id: nanoid(),
    userId: user.id,
    doctorName,
    scheduledAt,
    reason: reason || '',
    status: status || 'scheduled',
    createdAt: new Date().toISOString()
  };
  db.data.appointments.push(item);
  await db.write();
  res.status(201).json({ item });
});

router.get('/:id', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const item = db.data.appointments.find(a => a.id === req.params.id && a.userId === user.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ item });
});

router.put('/:id', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const idx = db.data.appointments.findIndex(a => a.id === req.params.id && a.userId === user.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const current = db.data.appointments[idx];
  const updated = { ...current, ...req.body, id: current.id, userId: current.userId };
  db.data.appointments[idx] = updated;
  await db.write();
  res.json({ item: updated });
});

router.delete('/:id', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const before = db.data.appointments.length;
  db.data.appointments = db.data.appointments.filter(a => !(a.id === req.params.id && a.userId === user.id));
  if (db.data.appointments.length === before) return res.status(404).json({ error: 'Not found' });
  await db.write();
  res.status(204).end();
});

export default router;



