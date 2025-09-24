import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDatabase } from './lib/db.js';
import authRouter from './routes/auth.js';
import appointmentsRouter from './routes/appointments.js';
import paymentsRouter from './routes/payments.js';
import recordsRouter from './routes/records.js';
import prescriptionsRouter from './routes/prescriptions.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'medical-backend', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/prescriptions', prescriptionsRouter);

// Serve static frontend (built files in ../dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback for non-API GET requests (Express 5 safe)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

await initDatabase();

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});



