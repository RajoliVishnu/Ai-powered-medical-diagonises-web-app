import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, FileText, Calendar, User, Activity, Eye } from 'lucide-react';
import PDFExport from './PDFExport';

interface MedicalRecord {
  id: string;
  date: Date;
  type: string;
  title: string;
  description: string;
  doctor: string;
  status: string;
  symptoms: string[];
  medications: string[];
  followUp: string;
  diagnosedDisease?: string;
  diseaseRisk?: string;
  confidence?: number;
}

interface RecordTypeGuide {
  title: string;
  description: string;
  examples: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const recordTypeGuides: Record<string, RecordTypeGuide> = {
  consultation: {
    title: 'Medical Consultation',
    description: 'Records from doctor visits and consultations',
    examples: [
      'Regular check-ups and physical exams',
      'Specialist consultations (cardiologist, neurologist, etc.)',
      'Follow-up appointments',
      'Telemedicine consultations'
    ],
    icon: Activity
  },
  prescription: {
    title: 'Prescriptions',
    description: 'Medications prescribed by healthcare providers',
    examples: [
      'Current medications you are taking',
      'Medications prescribed during visits',
      'Dosage changes and adjustments',
      'Medication refills'
    ],
    icon: FileText
  },
  lab_result: {
    title: 'Laboratory Results',
    description: 'Blood tests, urine tests, and other lab work',
    examples: [
      'Blood chemistry panels',
      'Complete blood count (CBC)',
      'Cholesterol and lipid tests',
      'Diabetes screening tests',
      'Thyroid function tests'
    ],
    icon: FileText
  },
  vaccination: {
    title: 'Vaccinations',
    description: 'Immunization records and vaccine history',
    examples: [
      'COVID-19 vaccinations',
      'Flu shots',
      'Childhood vaccinations',
      'Travel vaccines',
      'Booster shots'
    ],
    icon: FileText
  },
  surgery: {
    title: 'Surgical Procedures',
    description: 'Records of surgical operations and procedures',
    examples: [
      'Major surgeries',
      'Minor procedures',
      'Dental surgeries',
      'Emergency surgeries',
      'Post-operative care'
    ],
    icon: FileText
  },
  imaging: {
    title: 'Imaging Studies',
    description: 'X-rays, MRIs, CT scans, and other imaging',
    examples: [
      'Chest X-rays',
      'MRI scans',
      'CT scans',
      'Ultrasounds',
      'Echocardiograms'
    ],
    icon: FileText
  },
  emergency: {
    title: 'Emergency Visits',
    description: 'Emergency room visits and urgent care',
    examples: [
      'Emergency room visits',
      'Urgent care visits',
      'Ambulance calls',
      'Emergency procedures',
      'Trauma care'
    ],
    icon: FileText
  }
};

interface EnhancedMedicalRecordsProps {
  records: MedicalRecord[];
  onAddRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  onEditRecord: (id: string, record: Partial<MedicalRecord>) => void;
  onDeleteRecord: (id: string) => void;
}

const EnhancedMedicalRecords: React.FC<EnhancedMedicalRecordsProps> = ({
  records,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuide, setShowGuide] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    const guide = recordTypeGuides[type];
    if (guide) {
      const IconComponent = guide.icon;
      return <IconComponent className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newRecord: Omit<MedicalRecord, 'id'> = {
      date: new Date(formData.get('date') as string),
      type: formData.get('type') as MedicalRecord['type'],
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      doctor: formData.get('doctor') as string,
      status: formData.get('status') as MedicalRecord['status'],
      symptoms: [],
      medications: [],
      followUp: '',
    };

    if (editingRecord) {
      onEditRecord(editingRecord.id, newRecord);
      setEditingRecord(null);
    } else {
      onAddRecord(newRecord);
    }
    
    setShowAddForm(false);
  };

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      onDeleteRecord(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Records</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your complete medical history</p>
        </div>
        <div className="flex items-center space-x-3">
          <PDFExport 
            records={records.map(record => ({
              ...record,
              date: record.date.toISOString()
            }))}
            patientName="Current User"
            patientEmail="user@example.com"
          />
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Record
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search records by title, description, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Records
        </button>
        {Object.keys(recordTypeGuides).map((type) => {
          const guide = recordTypeGuides[type];
          const IconComponent = guide.icon;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-1" />
              {guide.title}
            </button>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingRecord ? 'Edit Record' : 'Add New Record'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingRecord(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                defaultValue={editingRecord?.date.toISOString().split('T')[0] || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                defaultValue={editingRecord?.type || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select record type"
              >
                <option value="">Select Type</option>
                {Object.keys(recordTypeGuides).map((type) => (
                  <option key={type} value={type}>
                    {recordTypeGuides[type].title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                defaultValue={editingRecord?.title || ''}
                placeholder="e.g., Annual Physical Exam, Blood Test Results"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={editingRecord?.description || ''}
                placeholder="Detailed description of the medical record..."
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                Doctor/Healthcare Provider
              </label>
              <input
                id="doctor"
                type="text"
                name="doctor"
                defaultValue={editingRecord?.doctor || ''}
                placeholder="Doctor's name or clinic name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={editingRecord?.status || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select record status"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms (comma-separated)
              </label>
              <input
                id="symptoms"
                type="text"
                name="symptoms"
                defaultValue={editingRecord?.symptoms?.join(', ') || ''}
                placeholder="e.g., chest pain, shortness of breath, fatigue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                Medications (comma-separated)
              </label>
              <input
                id="medications"
                type="text"
                name="medications"
                defaultValue={editingRecord?.medications?.join(', ') || ''}
                placeholder="e.g., aspirin, metformin, lisinopril"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="followUp" className="block text-sm font-medium text-gray-700 mb-1">
                Follow-up Instructions
              </label>
              <textarea
                id="followUp"
                name="followUp"
                defaultValue={editingRecord?.followUp || ''}
                placeholder="Any follow-up instructions or recommendations..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRecord(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingRecord ? 'Update Record' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No medical records found.</p>
            {searchTerm && <p className="text-sm mt-2">Try adjusting your search terms.</p>}
          </div>
        ) : (
          filteredRecords.map((record) => {
            const guide = recordTypeGuides[record.type];
            return (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getTypeIcon(record.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                        {guide && (
                          <button
                            onClick={() => setShowGuide(showGuide === record.type ? null : record.type)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title={`Learn about ${guide.title}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      {guide && showGuide === record.type && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start">
                            <guide.icon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-900 text-sm mb-1">{guide.title}</h4>
                              <p className="text-blue-800 text-sm mb-2">{guide.description}</p>
                              <ul className="text-xs text-blue-700 space-y-1">
                                {guide.examples.slice(0, 2).map((example, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-blue-500 mr-1">•</span>
                                    {example}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {record.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Dr. {record.doctor}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {guide?.title || record.type}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{record.description}</p>
                      
                      {record.symptoms && record.symptoms.length > 0 && (
                        <p className="text-sm text-orange-600 mb-1">
                          <strong>Symptoms:</strong> {record.symptoms.join(', ')}
                        </p>
                      )}
                      
                      {record.medications && record.medications.length > 0 && (
                        <p className="text-sm text-green-600 mb-1">
                          <strong>Medications:</strong> {record.medications.join(', ')}
                        </p>
                      )}
                      
                      {record.followUp && (
                        <p className="text-sm text-blue-600">
                          <strong>Follow-up:</strong> {record.followUp}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Record"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EnhancedMedicalRecords;
