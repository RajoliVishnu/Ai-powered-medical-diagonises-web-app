import React, { useState } from 'react';
import { Pill, Plus, Edit, Trash2, Calendar, User, AlertTriangle, CheckCircle } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: Date;
  refills: number;
  status: 'active' | 'completed' | 'discontinued';
  sideEffects?: string[];
  interactions?: string[];
}

interface PrescriptionManagerProps {
  prescriptions: Medication[];
  onAddPrescription: (prescription: Omit<Medication, 'id'>) => void;
  onEditPrescription: (id: string, prescription: Partial<Medication>) => void;
  onDeletePrescription: (id: string) => void;
  onRefillPrescription: (id: string) => void;
}

const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({
  prescriptions,
  onAddPrescription,
  onEditPrescription,
  onDeletePrescription,
  onRefillPrescription,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Medication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'discontinued':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
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

  const filteredPrescriptions = filterStatus === 'all' 
    ? prescriptions 
    : prescriptions.filter(prescription => prescription.status === filterStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newPrescription: Omit<Medication, 'id'> = {
      name: formData.get('name') as string,
      dosage: formData.get('dosage') as string,
      frequency: formData.get('frequency') as string,
      duration: formData.get('duration') as string,
      instructions: formData.get('instructions') as string,
      prescribedBy: formData.get('prescribedBy') as string,
      prescribedDate: new Date(formData.get('prescribedDate') as string),
      refills: parseInt(formData.get('refills') as string),
      status: formData.get('status') as Medication['status'],
      sideEffects: formData.get('sideEffects')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
      interactions: formData.get('interactions')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [],
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Prescription Manager</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Prescription
        </button>
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
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Medication Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                defaultValue={editingPrescription?.name || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                Dosage
              </label>
              <input
                id="dosage"
                type="text"
                name="dosage"
                defaultValue={editingPrescription?.dosage || ''}
                placeholder="e.g., 500mg"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <input
                id="frequency"
                type="text"
                name="frequency"
                defaultValue={editingPrescription?.frequency || ''}
                placeholder="e.g., Twice daily"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                id="duration"
                type="text"
                name="duration"
                defaultValue={editingPrescription?.duration || ''}
                placeholder="e.g., 7 days"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                defaultValue={editingPrescription?.instructions || ''}
                placeholder="Special instructions for taking the medication"
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="prescribedBy" className="block text-sm font-medium text-gray-700 mb-1">
                Prescribed By
              </label>
              <input
                id="prescribedBy"
                type="text"
                name="prescribedBy"
                defaultValue={editingPrescription?.prescribedBy || ''}
                placeholder="Doctor's name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="prescribedDate" className="block text-sm font-medium text-gray-700 mb-1">
                Prescribed Date
              </label>
              <input
                id="prescribedDate"
                type="date"
                name="prescribedDate"
                defaultValue={editingPrescription?.prescribedDate.toISOString().split('T')[0] || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="refills" className="block text-sm font-medium text-gray-700 mb-1">
                Refills Remaining
              </label>
              <input
                id="refills"
                type="number"
                name="refills"
                defaultValue={editingPrescription?.refills || 0}
                min="0"
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
                defaultValue={editingPrescription?.status || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="sideEffects" className="block text-sm font-medium text-gray-700 mb-1">
                Side Effects (comma-separated)
              </label>
              <input
                id="sideEffects"
                type="text"
                name="sideEffects"
                defaultValue={editingPrescription?.sideEffects?.join(', ') || ''}
                placeholder="e.g., nausea, headache, dizziness"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="interactions" className="block text-sm font-medium text-gray-700 mb-1">
                Drug Interactions (comma-separated)
              </label>
              <input
                id="interactions"
                type="text"
                name="interactions"
                defaultValue={editingPrescription?.interactions?.join(', ') || ''}
                placeholder="e.g., warfarin, aspirin"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                        {prescription.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
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
                        Dr. {prescription.prescribedBy}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-2">
                      <strong>Instructions:</strong> {prescription.instructions}
                    </p>
                    
                    <p className="text-gray-700 mb-2">
                      <strong>Duration:</strong> {prescription.duration} | <strong>Refills:</strong> {prescription.refills}
                    </p>
                    
                    {prescription.sideEffects && prescription.sideEffects.length > 0 && (
                      <p className="text-sm text-orange-600 mb-1">
                        <strong>Side Effects:</strong> {prescription.sideEffects.join(', ')}
                      </p>
                    )}
                    
                    {prescription.interactions && prescription.interactions.length > 0 && (
                      <p className="text-sm text-red-600">
                        <strong>Interactions:</strong> {prescription.interactions.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {prescription.status === 'active' && prescription.refills > 0 && (
                    <button
                      onClick={() => handleRefill(prescription.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      title="Request Refill"
                    >
                      <Pill className="w-4 h-4" />
                    </button>
                  )}
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

export default PrescriptionManager; 