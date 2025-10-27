import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Send, CheckCircle, AlertCircle, Clock, Settings, Bell, BellOff } from 'lucide-react';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

interface SMSNotification {
  id: string;
  type: 'appointment' | 'reminder' | 'prescription' | 'test_result' | 'emergency' | 'general';
  message: string;
  phoneNumber: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  template: string;
  variables: string[];
}

const SMSNotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSendForm, setShowSendForm] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    appointmentReminders: true,
    prescriptionReminders: true,
    testResults: true,
    emergencyAlerts: true,
    generalUpdates: false,
    smsEnabled: true
  });

  const [newNotification, setNewNotification] = useState({
    type: 'general' as SMSNotification['type'],
    message: '',
    phoneNumber: '',
    scheduledAt: ''
  });

  useEffect(() => {
    loadNotifications();
    loadTemplates();
    loadSettings();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      // Mock data for demo
      const mockNotifications: SMSNotification[] = [
        {
          id: '1',
          type: 'appointment',
          message: 'Reminder: You have an appointment with Dr. Smith tomorrow at 10:00 AM.',
          phoneNumber: '+91 98765 43210',
          status: 'delivered',
          sentAt: '2024-01-15T09:00:00Z',
          createdAt: '2024-01-15T08:30:00Z'
        },
        {
          id: '2',
          type: 'prescription',
          message: 'Your prescription for Metformin is ready for pickup at City Pharmacy.',
          phoneNumber: '+91 98765 43210',
          status: 'sent',
          sentAt: '2024-01-15T14:30:00Z',
          createdAt: '2024-01-15T14:00:00Z'
        },
        {
          id: '3',
          type: 'test_result',
          message: 'Your blood test results are available. Please check your medical records.',
          phoneNumber: '+91 98765 43210',
          status: 'pending',
          scheduledAt: '2024-01-16T10:00:00Z',
          createdAt: '2024-01-15T16:00:00Z'
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Appointment Reminder',
        type: 'appointment',
        template: 'Reminder: You have an appointment with {{doctor}} on {{date}} at {{time}}.',
        variables: ['doctor', 'date', 'time']
      },
      {
        id: '2',
        name: 'Prescription Ready',
        type: 'prescription',
        template: 'Your prescription for {{medication}} is ready for pickup at {{pharmacy}}.',
        variables: ['medication', 'pharmacy']
      },
      {
        id: '3',
        name: 'Test Results',
        type: 'test_result',
        template: 'Your {{testType}} results are available. Please check your medical records.',
        variables: ['testType']
      },
      {
        id: '4',
        name: 'Emergency Alert',
        type: 'emergency',
        template: 'URGENT: {{message}} Please contact emergency services if needed.',
        variables: ['message']
      }
    ];
    setTemplates(mockTemplates);
  };

  const loadSettings = async () => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('smsNotificationSettings');
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = async () => {
    try {
      localStorage.setItem('smsNotificationSettings', JSON.stringify(notificationSettings));
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save settings');
    }
  };

  const sendSMS = async () => {
    if (!newNotification.message || !newNotification.phoneNumber) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 2000));

      const notification: SMSNotification = {
        id: Date.now().toString(),
        type: newNotification.type,
        message: newNotification.message,
        phoneNumber: newNotification.phoneNumber,
        status: 'sent',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        scheduledAt: newNotification.scheduledAt || undefined
      };

      setNotifications(prev => [notification, ...prev]);
      setNewNotification({
        type: 'general',
        message: '',
        phoneNumber: '',
        scheduledAt: ''
      });
      setShowSendForm(false);
      setSuccess('SMS sent successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error sending SMS:', error);
      setError('Failed to send SMS. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const useTemplate = (template: NotificationTemplate) => {
    setNewNotification(prev => ({
      ...prev,
      type: template.type as SMSNotification['type'],
      message: template.template
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'text-blue-600 bg-blue-100';
      case 'prescription': return 'text-green-600 bg-green-100';
      case 'test_result': return 'text-purple-600 bg-purple-100';
      case 'emergency': return 'text-red-600 bg-red-100';
      case 'reminder': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            SMS Notification System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage SMS notifications for appointments, prescriptions, and health updates
          </p>
        </div>

        {/* Success/Error Alerts */}
        {success && (
          <div className="mb-6">
            <Alert 
              type="success" 
              title="Success" 
              message={success}
              onClose={() => setSuccess('')}
            />
          </div>
        )}

        {error && (
          <div className="mb-6">
            <Alert 
              type="error" 
              title="Error" 
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Settings
              </h2>
              <button
                onClick={saveSettings}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {notificationSettings.smsEnabled ? (
                    <Bell className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <BellOff className="h-5 w-5 text-gray-400 mr-2" />
                  )}
                  <span className="text-gray-900 dark:text-white">SMS Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsEnabled}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      smsEnabled: e.target.checked
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Appointment Reminders</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.appointmentReminders}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        appointmentReminders: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Prescription Reminders</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.prescriptionReminders}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        prescriptionReminders: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Test Results</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.testResults}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        testResults: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Emergency Alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emergencyAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        emergencyAlerts: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Send SMS Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Send SMS
              </h2>
              <button
                onClick={() => setShowSendForm(!showSendForm)}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4 mr-1" />
                {showSendForm ? 'Cancel' : 'New SMS'}
              </button>
            </div>

            {showSendForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev,
                      type: e.target.value as SMSNotification['type']
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="general">General</option>
                    <option value="appointment">Appointment</option>
                    <option value="prescription">Prescription</option>
                    <option value="test_result">Test Result</option>
                    <option value="emergency">Emergency</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newNotification.phoneNumber}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev,
                      phoneNumber: e.target.value
                    }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev,
                      message: e.target.value
                    }))}
                    rows={4}
                    placeholder="Enter your message..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Schedule (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newNotification.scheduledAt}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev,
                      scheduledAt: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button
                  onClick={sendSMS}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send SMS
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Templates */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Quick Templates
              </h3>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => useTemplate(template)}
                    className="w-full text-left p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {template.template}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notification History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Notification History
            </h2>

            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center">
                      {getStatusIcon(notification.status)}
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                        {notification.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {notification.phoneNumber}
                    </div>
                    <div>
                      {notification.sentAt ? 
                        new Date(notification.sentAt).toLocaleString() :
                        notification.scheduledAt ?
                        `Scheduled: ${new Date(notification.scheduledAt).toLocaleString()}` :
                        'Pending'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSNotificationSystem;
