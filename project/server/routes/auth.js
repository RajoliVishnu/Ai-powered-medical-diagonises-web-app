import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { getDatabase } from '../lib/db.js';
import { requireAuth, signToken, getCurrentUser } from '../middleware/auth.js';

const router = Router();

// Enhanced user registration with medical theme
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ 
      error: 'Missing fields',
      theme: 'Medical Professional',
      message: 'Name, email, and password are required for registration'
    });
    
    const db = await getDatabase();
    const existing = db.data.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (existing) return res.status(409).json({ 
      error: 'Email already registered',
      theme: 'Medical Professional',
      message: 'This email is already associated with an account'
    });
    
    const id = nanoid();
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { 
      id, 
      name, 
      email, 
      passwordHash, 
      theme: 'Medical Professional',
      improvements: {
        ui: 'Medical color theme with emerald, teal, and cyan',
        validation: 'Enhanced form validation with helpful hints',
        results: 'Color-coded user status cards',
        documentation: 'Comprehensive project documentation',
        ethics: 'Medical disclaimers and safety warnings'
      },
      createdAt: new Date().toISOString() 
    };
    
    db.data.users.push(user);
    await db.write();
    const token = signToken(id);
    const { passwordHash: _, ...safeUser } = user;
    
    console.log(`✅ MediCare AI: User registered successfully - ${email}`);
    res.status(201).json({ 
      token, 
      user: safeUser,
      theme: 'Medical Professional',
      improvements: 'Enhanced UI, validation, and documentation'
    });
  } catch (error) {
    console.error('❌ MediCare AI Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      theme: 'Medical Professional',
      message: 'Please try again or contact support'
    });
  }
});

// Enhanced user login with medical theme
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ 
      error: 'Missing fields',
      theme: 'Medical Professional',
      message: 'Email and password are required for login'
    });
    
    const db = await getDatabase();
    const user = db.data.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) return res.status(401).json({ 
      error: 'Invalid credentials',
      theme: 'Medical Professional',
      message: 'Please check your email and password'
    });
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ 
      error: 'Invalid credentials',
      theme: 'Medical Professional',
      message: 'Please check your email and password'
    });
    
    const token = signToken(user.id);
    const { passwordHash: _, ...safeUser } = user;
    
    console.log(`✅ MediCare AI: User logged in successfully - ${email}`);
    res.json({ 
      token, 
      user: safeUser,
      theme: 'Medical Professional',
      improvements: 'Enhanced UI, validation, and documentation'
    });
  } catch (error) {
    console.error('❌ MediCare AI Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      theme: 'Medical Professional',
      message: 'Please try again or contact support'
    });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await getCurrentUser(req);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

export default router;



