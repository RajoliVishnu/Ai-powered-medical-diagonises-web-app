import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Heart, Activity, Pill, Camera, Download, Search, Plus, Eye, Lock, Unlock, AlertTriangle, Shield } from 'lucide-react';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

interface EHRRecord {
  id: string;
  type: 'consultation' | 'prescription' | 'lab_result' | 'imaging' | 'vital_signs' | 'allergy' | 'immunization' | 'procedure';
  title: string;
  description: string;
  date: string;
  doctor: string;
  status: 'active' | 'archived' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  attachments: string[];
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
}

interface Allergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  onsetDate: string;
}

interface Immunization {
  vaccine: string;
  date: string;
  nextDue?: string;
  provider: string;
  lotNumber?: string;
}

const EHRSystem: React.FC = () => {
  const [records, setRecords] = useState<EHRRecord[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EHRRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'vitals' | 'allergies' | 'immunizations'>('records');

  useEffect(() => {
    loadEHRData();
  }, []);

  const loadEHRData = async () => {
    try {
      setIsLoading(true);
      
      // Mock EHR data
      const mockRecords: EHRRecord[] = [
        {
          id: '1',
          type: 'consultation',
          title: 'Cardiology Consultation',
          description: 'Follow-up consultation for chest pain. Patient reports improvement with medication.',
          date: '2024-01-15T10:00:00Z',
          doctor: 'Dr. Sarah Johnson',
          status: 'active',
          priority: 'medium',
          tags: ['cardiology', 'chest pain', 'follow-up'],
          attachments: ['ecg_report.pdf', 'chest_xray.jpg'],
          isShared: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'lab_result',
          title: 'Complete Blood Count',
          description: 'Routine CBC shows normal values. Hemoglobin: 14.2 g/dL, WBC: 7.5 K/μL',
          date: '2024-01-14T08:00:00Z',
          doctor: 'Dr. Michael Chen',
          status: 'active',
          priority: 'low',
          tags: ['lab', 'cbc', 'routine'],
          attachments: ['cbc_report.pdf'],
          isShared: false,
          createdAt: '2024-01-14T09:00:00Z',
          updatedAt: '2024-01-14T09:00:00Z'
        },
        {
          id: '3',
          type: 'prescription',
          title: 'Metformin Prescription',
          description: 'Metformin 500mg twice daily for diabetes management. Refill in 30 days.',
          date: '2024-01-13T14:00:00Z',
          doctor: 'Dr. Emily Rodriguez',
          status: 'active',
          priority: 'medium',
          tags: ['diabetes', 'metformin', 'prescription'],
          attachments: ['prescription.pdf'],
          isShared: true,
          createdAt: '2024-01-13T14:30:00Z',
          updatedAt: '2024-01-13T14:30:00Z'
        },
        {
          id: '4',
          type: 'imaging',
          title: 'Chest X-Ray',
          description: 'Chest X-ray shows clear lung fields. No acute abnormalities detected.',
          date: '2024-01-12T11:00:00Z',
          doctor: 'Dr. James Wilson',
          status: 'active',
          priority: 'low',
          tags: ['imaging', 'chest', 'x-ray'],
          attachments: ['chest_xray.jpg', 'radiology_report.pdf'],
          isShared: true,
          createdAt: '2024-01-12T12:00:00Z',
          updatedAt: '2024-01-12T12:00:00Z'
        }
      ];

      const mockVitalSigns: VitalSigns = {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        weight: 70,
        height: 175,
        bmi: 22.9
      };

      const mockAllergies: Allergy[] = [
        {
          allergen: 'Penicillin',
          severity: 'severe',
          reaction: 'Hives, difficulty breathing',
          onsetDate: '2020-03-15'
        },
        {
          allergen: 'Shellfish',
          severity: 'moderate',
          reaction: 'Nausea, vomiting',
          onsetDate: '2019-08-22'
        }
      ];

      const mockImmunizations: Immunization[] = [
        {
          vaccine: 'COVID-19 (Pfizer)',
          date: '2023-12-15',
          nextDue: '2024-12-15',
          provider: 'City Health Center',
          lotNumber: 'PF123456'
        },
        {
          vaccine: 'Influenza',
          date: '2023-10-20',
          nextDue: '2024-10-20',
          provider: 'Family Medical Clinic'
        }
      ];

      setRecords(mockRecords);
      setVitalSigns(mockVitalSigns);
      setAllergies(mockAllergies);
      setImmunizations(mockImmunizations);
    } catch (error) {
      console.error('Error loading EHR data:', error);
      setError('Failed to load health records');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <User className="h-5 w-5" />;
      case 'prescription': return <Pill className="h-5 w-5" />;
      case 'lab_result': return <Activity className="h-5 w-5" />;
      case 'imaging': return <Camera className="h-5 w-5" />;
      case 'vital_signs': return <Heart className="h-5 w-5" />;
      case 'allergy': return <AlertTriangle className="h-5 w-5" />;
      case 'immunization': return <Shield className="h-5 w-5" />;
      case 'procedure': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportRecords = () => {
    const data = {
      records,
      vitalSigns,
      allergies,
      immunizations,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ehr-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareRecord = (recordId: string) => {
    setRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, isShared: !record.isShared }
        : record
    ));
    setSuccess('Record sharing status updated');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Electronic Health Records (EHR)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive digital health record management system
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

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-600">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'records', label: 'Health Records', icon: FileText },
                { id: 'vitals', label: 'Vital Signs', icon: Heart },
                { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
                { id: 'immunizations', label: 'Immunizations', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Health Records Tab */}
            {activeTab === 'records' && (
              <div>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Types</option>
                      <option value="consultation">Consultations</option>
                      <option value="prescription">Prescriptions</option>
                      <option value="lab_result">Lab Results</option>
                      <option value="imaging">Imaging</option>
                      <option value="vital_signs">Vital Signs</option>
                      <option value="allergy">Allergies</option>
                      <option value="immunization">Immunizations</option>
                      <option value="procedure">Procedures</option>
                    </select>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </button>
                    <button
                      onClick={exportRecords}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                  <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add New Record
                      </h3>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        ×
                      </button>
                    </div>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      
                      const newRecord: EHRRecord = {
                        id: Date.now().toString(),
                        type: formData.get('type') as EHRRecord['type'],
                        title: formData.get('title') as string,
                        description: formData.get('description') as string,
                        date: new Date(formData.get('date') as string).toISOString(),
                        doctor: formData.get('doctor') as string,
                        status: formData.get('status') as EHRRecord['status'],
                        priority: formData.get('priority') as EHRRecord['priority'],
                        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag),
                        attachments: [],
                        isShared: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      };
                      
                      setRecords(prev => [...prev, newRecord]);
                      setShowAddForm(false);
                      setSuccess('Record added successfully');
                      setTimeout(() => setSuccess(''), 3000);
                    }} className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Date
                        </label>
                        <input
                          id="date"
                          type="date"
                          name="date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Type</option>
                          <option value="consultation">Consultation</option>
                          <option value="prescription">Prescription</option>
                          <option value="lab_result">Lab Result</option>
                          <option value="imaging">Imaging</option>
                          <option value="vital_signs">Vital Signs</option>
                          <option value="allergy">Allergy</option>
                          <option value="immunization">Immunization</option>
                          <option value="procedure">Procedure</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          name="title"
                          placeholder="e.g., Annual Physical Exam, Blood Test Results"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Detailed description of the medical record..."
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Doctor/Healthcare Provider
                        </label>
                        <input
                          id="doctor"
                          type="text"
                          name="doctor"
                          placeholder="Doctor's name or clinic name"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          id="tags"
                          type="text"
                          name="tags"
                          placeholder="e.g., cardiology, follow-up, routine"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div className="md:col-span-2 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Add Record
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Records List */}
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-blue-600 dark:text-blue-400">
                            {getTypeIcon(record.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {record.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {record.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(record.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {record.doctor}
                              </div>
                              {record.attachments.length > 0 && (
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-1" />
                                  {record.attachments.length} attachment(s)
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {record.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(record.priority)}`}>
                            {record.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => shareRecord(record.id)}
                              className={`p-1 ${record.isShared ? 'text-green-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            >
                              {record.isShared ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vital Signs Tab */}
            {activeTab === 'vitals' && vitalSigns && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Blood Pressure</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{vitalSigns.bloodPressure}</p>
                      </div>
                      <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Heart Rate</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{vitalSigns.heartRate} bpm</p>
                      </div>
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Temperature</p>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{vitalSigns.temperature}°F</p>
                      </div>
                      <Activity className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">BMI</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{vitalSigns.bmi}</p>
                      </div>
                      <Activity className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Allergies Tab */}
            {activeTab === 'allergies' && (
              <div>
                <div className="space-y-4">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                            {allergy.allergen}
                          </h3>
                          <p className="text-red-700 dark:text-red-300">{allergy.reaction}</p>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Onset: {new Date(allergy.onsetDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          allergy.severity === 'severe' ? 'bg-red-200 text-red-800' :
                          allergy.severity === 'moderate' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {allergy.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immunizations Tab */}
            {activeTab === 'immunizations' && (
              <div>
                <div className="space-y-4">
                  {immunizations.map((immunization, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {immunization.vaccine}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Provider: {immunization.provider}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Date: {new Date(immunization.date).toLocaleDateString()}
                            {immunization.nextDue && (
                              <span className="ml-4">
                                Next Due: {new Date(immunization.nextDue).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                          {immunization.lotNumber && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Lot Number: {immunization.lotNumber}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {immunization.nextDue ? 'Up to Date' : 'Complete'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EHRSystem;
