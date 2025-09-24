import jwt from 'jsonwebtoken';
import { getDatabase } from '../lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function getCurrentUser(req) {
  if (!req.user?.id) return null;
  const db = await getDatabase();
  return db.data.users.find(u => u.id === req.user.id) || null;
}

export function signToken(userId) {
  return jwt.sign({}, JWT_SECRET, { subject: userId, expiresIn: '7d' });
}



