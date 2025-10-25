import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Pill, Calendar, User, Activity, RefreshCw, Eye, HelpCircle } from 'lucide-react';

interface Medication {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribedDate: Date;
  quantity: number;
  status: string;
  relatedDiseases?: string;
}

interface MedicationGuide {
  title: string;
  description: string;
  examples: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const medicationGuides: Record<string, MedicationGuide> = {
  dosage: {
    title: 'Understanding Dosage',
    description: 'Dosage tells you how much medication to take',
    examples: [
      '500mg = 500 milligrams of the medication',
      '10mg = 10 milligrams of the medication',
      '1 tablet = one pill or tablet',
      '2 capsules = two capsules',
      '5ml = 5 milliliters (liquid medication)'
    ],
    icon: Pill
  },
  frequency: {
    title: 'Medication Frequency',
    description: 'How often you should take your medication',
    examples: [
      'Once daily = Take once every 24 hours',
      'Twice daily = Take every 12 hours (morning and evening)',
      'Three times daily = Take every 8 hours',
      'As needed = Take only when you have symptoms',
      'Before meals = Take 30 minutes before eating'
    ],
    icon: Activity
  },
  sideEffects: {
    title: 'Common Side Effects',
    description: 'Unwanted effects that may occur while taking medication',
    examples: [
      'Nausea or upset stomach',
      'Drowsiness or dizziness',
      'Headache',
      'Dry mouth',
      'Rash or skin irritation'
    ],
    icon: Eye
  },
  interactions: {
    title: 'Drug Interactions',
    description: 'Other medications or substances that may affect your medication',
    examples: [
      'Alcohol may increase drowsiness',
      'Some foods may affect absorption',
      'Other medications may interact',
      'Herbal supplements may interfere',
      'Always check with your doctor'
    ],
    icon: RefreshCw
  }
};

interface EnhancedPrescriptionManagerProps {
  prescriptions: Medication[];
  onAddPrescription: (prescription: Omit<Medication, 'id'>) => void;
  onEditPrescription: (id: string, prescription: Partial<Medication>) => void;
  onDeletePrescription: (id: string) => void;
  onRefillPrescription: (id: string) => void;
}

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

const EnhancedPrescriptionManager: React.FC<EnhancedPrescriptionManagerProps> = ({
  prescriptions,
  onAddPrescription,
  onEditPrescription,
  onDeletePrescription,
  onRefillPrescription,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Medication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuide, setShowGuide] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Pill className="w-5 h-5 text-green-600" />;
      case 'completed':
        return <Pill className="w-5 h-5 text-blue-600" />;
      case 'discontinued':
        return <Pill className="w-5 h-5 text-red-600" />;
      default:
        return <Pill className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFieldValue = (fieldName: string, editingPrescription: Medication | null): string => {
    if (!editingPrescription) return '';
    
    const value = editingPrescription[fieldName as keyof Medication];
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return String(value || '');
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    const matchesSearch = prescription.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.relatedDiseases?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newPrescription: Omit<Medication, 'id'> = {
      medicationName: formData.get('medicationName') as string,
      dosage: formData.get('dosage') as string,
      frequency: formData.get('frequency') as string,
      prescribedDate: new Date(formData.get('prescribedDate') as string),
      quantity: parseInt(formData.get('quantity') as string),
      status: formData.get('status') as string,
      relatedDiseases: formData.get('relatedDiseases') as string,
    };

    if (editingPrescription) {
      onEditPrescription(editingPrescription.id, newPrescription);
      setEditingPrescription(null);
    } else {
      onAddPrescription(newPrescription);
    }
    
    setShowAddForm(false);
  };

  const handleEdit = (prescription: Medication) => {
    setEditingPrescription(prescription);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      onDeletePrescription(id);
    }
  };

  const handleRefill = (id: string) => {
    if (window.confirm('Request a refill for this prescription?')) {
      onRefillPrescription(id);
    }
  };

  const renderField = (field: Field, index: number) => {
    const guide = medicationGuides[field.name];
    
    return (
      <div key={index} className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {guide && (
            <button
              type="button"
              onClick={() => setShowGuide(showGuide === field.name ? null : field.name)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title={`Learn about ${guide.title}`}
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          )}
        </div>

        {guide && showGuide === field.name && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <guide.icon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 text-sm mb-1">{guide.title}</h4>
                <p className="text-blue-800 text-sm mb-2">{guide.description}</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  {guide.examples.map((example, idx) => (
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

        {field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            defaultValue={getFieldValue(field.name, editingPrescription)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={field.label}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: string, optIndex: number) => (
              <option key={optIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.name}
            type={field.type}
            name={field.name}
            defaultValue={getFieldValue(field.name, editingPrescription)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescription Manager</h2>
          <p className="text-gray-600 mt-1">Track and manage your medications with detailed guidance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Prescription
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search prescriptions by name, doctor, or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Prescriptions
        </button>
        {['active', 'completed', 'discontinued'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingPrescription ? 'Edit Prescription' : 'Add New Prescription'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingPrescription(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            {renderField({ name: 'medicationName', label: 'Medication Name', type: 'text', placeholder: 'e.g., Aspirin, Metformin', required: true }, 0)}
            {renderField({ name: 'dosage', label: 'Dosage', type: 'text', placeholder: 'e.g., 500mg, 1 tablet', required: true }, 1)}
            {renderField({ name: 'frequency', label: 'Frequency', type: 'text', placeholder: 'e.g., Twice daily, Once daily', required: true }, 2)}
            {renderField({ name: 'prescribedDate', label: 'Prescribed Date', type: 'date', required: true }, 3)}
            {renderField({ name: 'quantity', label: 'Quantity', type: 'number', required: true }, 4)}
            {renderField({ name: 'status', label: 'Status', type: 'select', options: ['active', 'completed', 'discontinued'], required: true }, 5)}
            
            <div className="md:col-span-2">
              {renderField({ name: 'relatedDiseases', label: 'Related Diseases (comma-separated)', type: 'text', placeholder: 'e.g., heart, diabetes, kidney' }, 6)}
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPrescription(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingPrescription ? 'Update Prescription' : 'Add Prescription'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Pill className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No prescriptions found.</p>
            {searchTerm && <p className="text-sm mt-2">Try adjusting your search terms.</p>}
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getStatusIcon(prescription.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {prescription.medicationName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                      {prescription.relatedDiseases && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {prescription.relatedDiseases}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Pill className="w-4 h-4 mr-2" />
                        {prescription.dosage} - {prescription.frequency}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {prescription.prescribedDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {prescription.relatedDiseases || 'N/A'}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-2">
                      <strong>Quantity:</strong> {prescription.quantity}
                    </p>
                    
                    {prescription.relatedDiseases && (
                      <p className="text-sm text-orange-600 mb-1">
                        <strong>Related Diseases:</strong> {prescription.relatedDiseases}
                      </p>
                    )}
                    
                    {prescription.status === 'active' && prescription.quantity > 0 && (
                      <button
                        onClick={() => handleRefill(prescription.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Request Refill"
                      >
                        <Pill className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(prescription)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit Prescription"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Prescription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedPrescriptionManager;
