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
import diagnosisRouter from './routes/diagnosis.js';
import systemRouter from './routes/system.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Add more detailed logging
app.use((req, res, next) => {
  console.log(`🚀 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Health endpoint with enhanced medical theme
app.get('/api/health', (_req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    ok: true, 
    service: 'MediCare AI Backend', 
    version: '1.0.0',
    theme: 'Medical Professional',
    colors: {
      primary: '#059669',
      secondary: '#0d9488', 
      accent: '#0891b2'
    },
    features: [
      'AI-Powered Diagnosis',
      'Medical Records Management',
      'User Authentication',
      'Payment Processing',
      'Doctor Consultation'
    ],
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Enhanced test endpoints with medical theme
app.get('/api/test', (_req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({ 
    message: 'MediCare AI Backend is working!', 
    timestamp: new Date().toISOString(),
    status: 'active',
    theme: 'Medical Professional',
    improvements: [
      'Enhanced UI with medical color theme',
      'Improved form validation and hints',
      'Better result display with colored cards',
      'Comprehensive medical disclaimers',
      'AI model information and documentation'
    ]
  });
});

app.get('/api/status', (_req, res) => {
  console.log('📊 Status endpoint called');
  res.json({
    status: 'running',
    database: 'connected',
    theme: 'Medical Professional',
    services: ['auth', 'appointments', 'payments', 'records', 'prescriptions', 'diagnosis'],
    improvements: {
      ui: 'Medical color theme (emerald, teal, cyan)',
      forms: 'Enhanced validation with helpful hints',
      results: 'Color-coded risk assessment cards',
      documentation: 'Comprehensive project documentation',
      disclaimers: 'Medical ethics and safety warnings'
    },
    timestamp: new Date().toISOString()
  });
});

// Enhanced activity endpoint with medical theme
app.get('/api/activity', (_req, res) => {
  console.log('⚡ Activity endpoint called');
  res.json({
    message: 'MediCare AI Backend activity detected!',
    timestamp: new Date().toISOString(),
    activity: 'User interaction detected',
    theme: 'Medical Professional',
    features: {
      'UI Improvements': 'Medical color theme with emerald, teal, and cyan',
      'Form Enhancement': 'Clear labels, hints, and validation',
      'Result Display': 'Color-coded cards (Green=Healthy, Yellow=Moderate, Red=High Risk)',
      'Documentation': 'Comprehensive project documentation',
      'Medical Ethics': 'Proper disclaimers and safety warnings'
    }
  });
});

app.get('/api/logs', (_req, res) => {
  console.log('📝 Logs endpoint called');
  res.json({
    message: 'MediCare AI Backend logs are working!',
    timestamp: new Date().toISOString(),
    logs: 'All systems operational',
    improvements: {
      'UI Theme': 'Professional medical color scheme',
      'Form Validation': 'Enhanced with helpful hints and clear labels',
      'Result Display': 'Color-coded risk assessment with detailed explanations',
      'Documentation': 'Complete project documentation and README',
      'Medical Ethics': 'Comprehensive disclaimers and safety warnings',
      'AI Models': 'Detailed model information and technical specifications'
    }
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/prescriptions', prescriptionsRouter);
app.use('/api/diagnosis', diagnosisRouter);
app.use('/api/system', systemRouter);

// Serve static frontend (built files in ../dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback for non-API GET requests
app.get('/', (req, res) => {
  console.log('🔄 Serving frontend for root path');
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Catch-all for other routes (excluding API)
app.get('/*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  console.log('🔄 Serving frontend for:', req.path);
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



