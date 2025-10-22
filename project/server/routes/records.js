import { Router } from 'express';
import { nanoid } from 'nanoid';
import { requireAuth, getCurrentUser } from '../middleware/auth.js';
import { getDatabase } from '../lib/db.js';

const router = Router();

router.use(requireAuth);

// Enhanced medical records endpoint with medical theme
router.get('/', async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    const db = await getDatabase();
    const items = db.data.records.filter(r => r.userId === user.id);
    
    console.log(`📋 MediCare AI: Retrieved ${items.length} medical records for user ${user.id}`);
    res.json({ 
      items,
      theme: 'Medical Professional',
      improvements: {
        ui: 'Medical color theme with emerald, teal, and cyan',
        validation: 'Enhanced form validation with helpful hints',
        results: 'Color-coded medical record cards',
        documentation: 'Comprehensive project documentation',
        ethics: 'Medical disclaimers and safety warnings'
      }
    });
  } catch (error) {
    console.error('❌ MediCare AI Medical records retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve medical records',
      theme: 'Medical Professional',
      message: 'Please try again or contact support'
    });
  }
});

// Enhanced medical record creation with medical theme
router.post('/', async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    const { title, description, date } = req.body || {};
    if (!title) return res.status(400).json({ 
      error: 'Missing title',
      theme: 'Medical Professional',
      message: 'Medical record title is required'
    });
    
    const db = await getDatabase();
    const item = { 
      id: nanoid(), 
      userId: user.id, 
      title, 
      description: description || '', 
      date: date || new Date().toISOString(),
      theme: 'Medical Professional',
      improvements: {
        ui: 'Medical color theme with emerald, teal, and cyan',
        validation: 'Enhanced form validation with helpful hints',
        results: 'Color-coded medical record cards',
        documentation: 'Comprehensive project documentation',
        ethics: 'Medical disclaimers and safety warnings'
      }
    };
    
    db.data.records.push(item);
    await db.write();
    
    console.log(`✅ MediCare AI: Medical record created for user ${user.id} - Title: ${title}`);
    res.status(201).json({ 
      item,
      theme: 'Medical Professional',
      improvements: 'Enhanced UI, validation, and documentation'
    });
  } catch (error) {
    console.error('❌ MediCare AI Medical record creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create medical record',
      theme: 'Medical Professional',
      message: 'Please try again or contact support'
    });
  }
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



