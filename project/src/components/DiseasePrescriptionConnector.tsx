import React, { useState } from 'react';
import { Search, Heart, Clover as Liver, LucideKey as Kidney, Droplets, FileText, Pill, AlertTriangle, Calendar, User, ArrowRight } from 'lucide-react';

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

interface DiseaseInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  symptoms: string[];
  recommendedMedications: string[];
  lifestyleChanges: string[];
}

const diseaseInfo: Record<string, DiseaseInfo> = {
  heart: {
    id: 'heart',
    name: 'Heart Disease',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description: 'Cardiovascular conditions affecting the heart and blood vessels',
    symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue', 'Irregular heartbeat', 'Swelling in legs'],
    recommendedMedications: ['Aspirin', 'Beta-blockers', 'ACE inhibitors', 'Statins', 'Nitroglycerin'],
    lifestyleChanges: [
      'Maintain a heart-healthy diet low in saturated fats',
      'Exercise regularly (30 minutes daily)',
      'Quit smoking and avoid secondhand smoke',
      'Manage stress through relaxation techniques',
      'Monitor blood pressure regularly'
    ]
  },
  liver: {
    id: 'liver',
    name: 'Liver Disease',
    icon: Liver,
    color: 'from-orange-500 to-yellow-500',
    description: 'Conditions affecting liver function and health',
    symptoms: ['Jaundice', 'Abdominal pain', 'Fatigue', 'Nausea', 'Loss of appetite'],
    recommendedMedications: ['Ursodiol', 'Lactulose', 'Rifaximin', 'Vitamin K', 'Diuretics'],
    lifestyleChanges: [
      'Avoid alcohol completely',
      'Follow a low-sodium diet',
      'Get adequate protein from plant sources',
      'Avoid raw shellfish and undercooked foods',
      'Get regular medical check-ups'
    ]
  },
  kidney: {
    id: 'kidney',
    name: 'Kidney Disease',
    icon: Kidney,
    color: 'from-blue-500 to-cyan-500',
    description: 'Conditions affecting kidney function and filtration',
    symptoms: ['Swelling in legs and ankles', 'Fatigue', 'Changes in urination', 'High blood pressure', 'Nausea'],
    recommendedMedications: ['ACE inhibitors', 'ARBs', 'Diuretics', 'Phosphate binders', 'Erythropoietin'],
    lifestyleChanges: [
      'Limit salt intake to control blood pressure',
      'Monitor protein intake based on kidney function',
      'Stay hydrated but avoid excessive fluid intake',
      'Control blood sugar if diabetic',
      'Avoid NSAIDs and certain pain medications'
    ]
  },
  diabetes: {
    id: 'diabetes',
    name: 'Diabetes',
    icon: Droplets,
    color: 'from-green-500 to-emerald-500',
    description: 'Metabolic disorder affecting blood sugar regulation',
    symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision', 'Slow-healing wounds'],
    recommendedMedications: ['Metformin', 'Insulin', 'Sulfonylureas', 'DPP-4 inhibitors', 'GLP-1 receptor agonists'],
    lifestyleChanges: [
      'Monitor blood glucose levels regularly',
      'Follow a balanced diet with controlled carbohydrates',
      'Exercise regularly to improve insulin sensitivity',
      'Maintain a healthy weight',
      'Check feet daily for any wounds or infections'
    ]
  }
};

interface DiseasePrescriptionConnectorProps {
  medicalRecords: MedicalRecord[];
  prescriptions: Medication[];
  onViewPrescription: (prescription: Medication) => void;
  onViewRecord: (record: MedicalRecord) => void;
}

const DiseasePrescriptionConnector: React.FC<DiseasePrescriptionConnectorProps> = ({
  medicalRecords,
  prescriptions,
  onViewPrescription,
  onViewRecord,
}) => {
  const [selectedDisease, setSelectedDisease] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'records' | 'prescriptions'>('all');

  // Filter records and prescriptions based on selected disease
  const filteredRecords = medicalRecords.filter(record => {
    const matchesDisease = selectedDisease === 'all' || record.diagnosedDisease === selectedDisease;
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDisease && matchesSearch;
  });

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesDisease = selectedDisease === 'all' || 
                          prescription.relatedDiseases?.includes(selectedDisease) ||
                          prescription.medicationName.toLowerCase().includes(selectedDisease);
    const matchesSearch = prescription.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.dosage.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDisease && matchesSearch;
  });

  const getDiseaseIcon = (diseaseId: string) => {
    const disease = diseaseInfo[diseaseId];
    if (disease) {
      const IconComponent = disease.icon;
      return <IconComponent className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Disease-Based Medical Records & Prescriptions</h2>
        <p className="text-gray-600">View your medical records and prescriptions organized by diagnosed conditions</p>
      </div>

      {/* Disease Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Disease/Condition</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setSelectedDisease('all')}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedDisease === 'all'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">All Conditions</span>
          </button>
          
          {Object.entries(diseaseInfo).map(([diseaseId, disease]) => {
            const IconComponent = disease.icon;
            const recordCount = medicalRecords.filter(r => r.diagnosedDisease === diseaseId).length;
            const prescriptionCount = prescriptions.filter(p => 
              p.relatedDiseases?.includes(diseaseId) || 
              p.medicationName.toLowerCase().includes(diseaseId)
            ).length;
            
            return (
              <button
                key={diseaseId}
                onClick={() => setSelectedDisease(diseaseId)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedDisease === diseaseId
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">{disease.name}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {recordCount} records, {prescriptionCount} prescriptions
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search records and prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('records')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'records'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Medical Records
          </button>
          <button
            onClick={() => setFilterType('prescriptions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'prescriptions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Prescriptions
          </button>
        </div>
      </div>

      {/* Disease Information */}
      {selectedDisease !== 'all' && diseaseInfo[selectedDisease] && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                About {diseaseInfo[selectedDisease].name}
              </h4>
              <p className="text-blue-800 mb-3">{diseaseInfo[selectedDisease].description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Common Symptoms:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {diseaseInfo[selectedDisease].symptoms.map((symptom, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-blue-500 mr-2">•</span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Lifestyle Recommendations:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {diseaseInfo[selectedDisease].lifestyleChanges.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-blue-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Records */}
      {(filterType === 'all' || filterType === 'records') && filteredRecords.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Medical Records
            <span className="ml-2 text-sm text-gray-500">({filteredRecords.length})</span>
          </h3>
          
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onViewRecord(record)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{record.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.status === 'active' ? 'bg-green-100 text-green-800' :
                        record.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                      {record.diagnosedDisease && (
                        <div className="flex items-center space-x-1">
                          {getDiseaseIcon(record.diagnosedDisease)}
                          <span className="text-sm text-gray-600">{diseaseInfo[record.diagnosedDisease]?.name || record.diagnosedDisease}</span>
                        </div>
                      )}
                    </div>
                    
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
                        {record.type.replace('_', ' ').charAt(0).toUpperCase() + record.type.slice(1).replace('_', ' ')}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{record.description}</p>
                    
                    {record.diseaseRisk && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium">Risk Level:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(record.diseaseRisk)}`}>
                          {record.diseaseRisk}
                        </span>
                        {record.confidence && (
                          <span className="text-sm text-gray-500">
                            ({record.confidence}% confidence)
                          </span>
                        )}
                      </div>
                    )}
                    
                    {record.symptoms && record.symptoms.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <strong>Symptoms:</strong> {record.symptoms.join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescriptions */}
      {(filterType === 'all' || filterType === 'prescriptions') && filteredPrescriptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Pill className="w-5 h-5 mr-2" />
            Related Prescriptions
            <span className="ml-2 text-sm text-gray-500">({filteredPrescriptions.length})</span>
          </h3>
          
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onViewPrescription(prescription)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{prescription.medicationName}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                        prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                      {prescription.relatedDiseases && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {prescription.relatedDiseases}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Prescribed: {prescription.prescribedDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Quantity: {prescription.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Dosage:</strong> {prescription.dosage} - {prescription.frequency}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredRecords.length === 0 && filteredPrescriptions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No records or prescriptions found</h3>
          <p className="text-sm">
            {selectedDisease === 'all' 
              ? 'No medical records or prescriptions available.'
              : `No records or prescriptions found for ${diseaseInfo[selectedDisease]?.name || selectedDisease}.`}
          </p>
          {searchTerm && (
            <p className="text-sm mt-2">Try adjusting your search terms.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseasePrescriptionConnector;





