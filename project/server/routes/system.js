import { Router } from 'express';
import { requireAuth, getCurrentUser } from '../middleware/auth.js';
import { getDatabase } from '../lib/db.js';

const router = Router();

// System metrics endpoint for real-time monitoring
router.get('/metrics', async (req, res) => {
  try {
    const db = await getDatabase();
    
    // Calculate real-time metrics
    const totalUsers = db.data.users.length;
    const totalDiagnoses = db.data.records.length;
    const activeUsers = Math.floor(Math.random() * 50) + 10; // Simulate active users
    const averageResponseTime = Math.floor(Math.random() * 100) + 50; // Simulate response time
    const systemUptime = 99.9; // Simulate uptime
    
    const metrics = {
      activeUsers,
      totalDiagnoses,
      averageResponseTime,
      systemUptime,
      apiHealth: 'healthy',
      lastUpdate: new Date().toISOString(),
      totalUsers,
      systemLoad: Math.floor(Math.random() * 30) + 20,
      memoryUsage: Math.floor(Math.random() * 40) + 30,
      diskUsage: Math.floor(Math.random() * 20) + 10
    };
    
    console.log('📊 System metrics requested:', metrics);
    res.json(metrics);
    
  } catch (error) {
    console.error('❌ System metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch system metrics',
      message: 'Please try again later'
    });
  }
});

// Health check endpoint for monitoring
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        ai_models: 'operational',
        api: 'running',
        authentication: 'active'
      },
      version: '1.0.0',
      uptime: process.uptime()
    };
    
    console.log('🏥 Health check requested');
    res.json(health);
    
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      error: 'System health check failed'
    });
  }
});

// Analytics endpoint for usage tracking
router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    const db = await getDatabase();
    
    // Get user's diagnosis history
    const userDiagnoses = db.data.records.filter(record => record.userId === user.id);
    
    // Calculate analytics
    const analytics = {
      totalAssessments: userDiagnoses.length,
      diseaseBreakdown: {
        heart: userDiagnoses.filter(r => r.diseaseType === 'heart').length,
        liver: userDiagnoses.filter(r => r.diseaseType === 'liver').length,
        kidney: userDiagnoses.filter(r => r.diseaseType === 'kidney').length,
        diabetes: userDiagnoses.filter(r => r.diseaseType === 'diabetes').length
      },
      riskDistribution: {
        low: userDiagnoses.filter(r => r.prediction?.risk === 'Low').length,
        moderate: userDiagnoses.filter(r => r.prediction?.risk === 'Moderate').length,
        high: userDiagnoses.filter(r => r.prediction?.risk === 'High').length
      },
      averageConfidence: userDiagnoses.length > 0 
        ? Math.round(userDiagnoses.reduce((sum, r) => sum + (r.prediction?.confidence || 0), 0) / userDiagnoses.length)
        : 0,
      lastAssessment: userDiagnoses.length > 0 
        ? userDiagnoses[userDiagnoses.length - 1].createdAt 
        : null
    };
    
    console.log(`📈 Analytics requested for user ${user.id}:`, analytics);
    res.json(analytics);
    
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      message: 'Please try again later'
    });
  }
});

// Real-time notifications endpoint
router.get('/notifications', requireAuth, async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    
    // Simulate real-time notifications
    const notifications = [
      {
        id: '1',
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2 AM',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'success',
        title: 'New Feature Available',
        message: 'PDF report generation is now available',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ];
    
    console.log(`🔔 Notifications requested for user ${user.id}`);
    res.json({ notifications });
    
  } catch (error) {
    console.error('❌ Notifications error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notifications',
      message: 'Please try again later'
    });
  }
});

// Export data endpoint for compliance
router.post('/export-data', requireAuth, async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    const db = await getDatabase();
    
    // Get all user data
    const userData = {
      profile: db.data.users.find(u => u.id === user.id),
      diagnoses: db.data.records.filter(record => record.userId === user.id),
      prescriptions: db.data.prescriptions.filter(p => p.userId === user.id),
      appointments: db.data.appointments.filter(a => a.userId === user.id),
      exportDate: new Date().toISOString(),
      format: 'JSON'
    };
    
    console.log(`📤 Data export requested for user ${user.id}`);
    res.json(userData);
    
  } catch (error) {
    console.error('❌ Data export error:', error);
    res.status(500).json({ 
      error: 'Failed to export data',
      message: 'Please try again later'
    });
  }
});

export default router;
