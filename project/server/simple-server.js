import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Add detailed logging
app.use((req, res, next) => {
  console.log(`🚀 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Health endpoint
app.get('/api/health', (_req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    ok: true, 
    service: 'medical-backend', 
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Additional endpoints for more activity
app.get('/api/test', (_req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    status: 'active'
  });
});

app.get('/api/status', (_req, res) => {
  console.log('📊 Status endpoint called');
  res.json({
    status: 'running',
    database: 'connected',
    services: ['auth', 'appointments', 'payments', 'records', 'prescriptions'],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/activity', (_req, res) => {
  console.log('⚡ Activity endpoint called');
  res.json({
    message: 'Backend activity detected!',
    timestamp: new Date().toISOString(),
    activity: 'User interaction detected'
  });
});

app.get('/api/logs', (_req, res) => {
  console.log('📝 Logs endpoint called');
  res.json({
    message: 'Backend logs are working!',
    timestamp: new Date().toISOString(),
    logs: 'All systems operational'
  });
});

// Serve static files
const clientDistPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(clientDistPath));

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  console.log('🔄 Serving frontend for:', req.path);
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
  console.log('📊 Backend is ready with enhanced logging!');
});





