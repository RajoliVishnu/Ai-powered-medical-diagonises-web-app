import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { getDatabase } from '../lib/db.js';
import { requireAuth, signToken, getCurrentUser } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const db = await getDatabase();
  const existing = db.data.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const id = nanoid();
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id, name, email, passwordHash, createdAt: new Date().toISOString() };
  db.data.users.push(user);
  await db.write();
  const token = signToken(id);
  const { passwordHash: _, ...safeUser } = user;
  res.status(201).json({ token, user: safeUser });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const db = await getDatabase();
  const user = db.data.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user.id);
  const { passwordHash: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await getCurrentUser(req);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

export default router;



