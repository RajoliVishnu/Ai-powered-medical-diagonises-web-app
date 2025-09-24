import { Router } from 'express';
import { nanoid } from 'nanoid';
import { requireAuth, getCurrentUser } from '../middleware/auth.js';
import { getDatabase } from '../lib/db.js';
import Stripe from 'stripe';

const router = Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

router.use(requireAuth);

router.post('/create-intent', async (req, res) => {
  const user = await getCurrentUser(req);
  const { amount, currency } = req.body || {};
  if (typeof amount !== 'number' || !currency) return res.status(400).json({ error: 'Invalid input' });

  const db = await getDatabase();

  // Stripe-backed implementation (with graceful fallback to mock)
  try {
    if (stripe) {
      const pi = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true }
      });

      const intent = {
        id: pi.id,
        userId: user.id,
        amount,
        currency,
        status: pi.status,
        createdAt: new Date().toISOString()
      };
      db.data.payments.push(intent);
      await db.write();
      return res.status(201).json({ paymentIntent: intent });
    }
  } catch (err) {
    console.error('Stripe create-intent error:', err);
    return res.status(502).json({ error: 'Payment service unavailable' });
  }

  // Mock fallback
  const intent = {
    id: `pi_${nanoid(10)}`,
    userId: user.id,
    amount,
    currency,
    status: 'requires_payment_method',
    createdAt: new Date().toISOString()
  };
  db.data.payments.push(intent);
  await db.write();
  res.status(201).json({ paymentIntent: intent });
});

router.post('/confirm', async (req, res) => {
  const user = await getCurrentUser(req);
  const { paymentIntentId, paymentMethodId } = req.body || {};
  if (!paymentIntentId || !paymentMethodId) return res.status(400).json({ error: 'Missing fields' });

  const db = await getDatabase();
  const intent = db.data.payments.find(p => p.id === paymentIntentId && p.userId === user.id);
  if (!intent) return res.status(404).json({ error: 'Payment intent not found' });

  try {
    if (stripe) {
      const confirmed = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });

      intent.status = confirmed.status;
      intent.confirmedAt = new Date().toISOString();
      intent.paymentMethodId = paymentMethodId;
      intent.transactionId = typeof confirmed.latest_charge === 'string' ? confirmed.latest_charge : confirmed.latest_charge?.id || `txn_${nanoid(10)}`;
      await db.write();

      if (confirmed.status !== 'succeeded') {
        return res.status(402).json({ status: confirmed.status });
      }

      return res.json({
        status: 'succeeded',
        transactionId: intent.transactionId,
        amount: intent.amount,
        currency: intent.currency
      });
    }
  } catch (err) {
    console.error('Stripe confirm error:', err);
    return res.status(402).json({ error: 'Payment confirmation failed' });
  }

  // Mock fallback
  intent.status = 'succeeded';
  intent.confirmedAt = new Date().toISOString();
  intent.transactionId = `txn_${nanoid(10)}`;
  intent.paymentMethodId = paymentMethodId;
  await db.write();
  res.json({
    status: 'succeeded',
    transactionId: intent.transactionId,
    amount: intent.amount,
    currency: intent.currency
  });
});

// Basic history endpoint
router.get('/history', async (req, res) => {
  const user = await getCurrentUser(req);
  const db = await getDatabase();
  const items = db.data.payments.filter(p => p.userId === user.id).sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  res.json({ items });
});

export default router;



