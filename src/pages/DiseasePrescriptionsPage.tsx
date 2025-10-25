import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Pill } from 'lucide-react';
import DiseasePrescriptionConnector from '../components/DiseasePrescriptionConnector';

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

const DiseasePrescriptionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Load data from localStorage
  const medicalRecords: MedicalRecord[] = JSON.parse(localStorage.getItem('medicalRecords') || '[]').map((record: MedicalRecord) => ({
    ...record,
    date: new Date(record.date)
  }));

  const prescriptions: Medication[] = JSON.parse(localStorage.getItem('prescriptions') || '[]').map((prescription: Medication) => ({
    ...prescription,
    prescribedDate: new Date(prescription.prescribedDate)
  }));

  const diseaseId = searchParams.get('disease');

  const getDiseaseName = (diseaseId: string | null) => {
    const diseaseNames: Record<string, string> = {
      heart: 'Heart Disease',
      liver: 'Liver Disease',
      kidney: 'Kidney Disease',
      diabetes: 'Diabetes'
    };
    return diseaseNames[diseaseId || ''] || 'All Conditions';
  };

  const handleViewRecord = (record: MedicalRecord) => {
    console.log('Viewing record:', record);
  };

  const handleViewPrescription = (prescription: Medication) => {
    console.log('Viewing prescription:', prescription);
  };

  const addSampleData = () => {
    // Sample medical records
    const sampleRecords = [
      {
        id: '1',
        date: new Date('2024-01-15'),
        type: 'consultation' as const,
        title: 'Heart Disease Assessment',
        description: 'AI-powered diagnosis assessment for Heart Disease. Risk level: High (95% confidence).',
        doctor: 'AI Diagnostic System',
        status: 'completed' as const,
        symptoms: ['chest pain', 'shortness of breath'],
        medications: [],
        followUp: 'Seek immediate medical attention from a specialist within 48 hours.',
        diagnosedDisease: 'heart',
        diseaseRisk: 'High',
        confidence: 95
      },
      {
        id: '2',
        date: new Date('2024-01-20'),
        type: 'consultation' as const,
        title: 'Diabetes Assessment',
        description: 'AI-powered diagnosis assessment for Diabetes. Risk level: Moderate (87% confidence).',
        doctor: 'AI Diagnostic System',
        status: 'completed' as const,
        symptoms: ['increased thirst', 'frequent urination'],
        medications: [],
        followUp: 'Consult with a healthcare provider within 2 weeks for detailed evaluation.',
        diagnosedDisease: 'diabetes',
        diseaseRisk: 'Moderate',
        confidence: 87
      }
    ];

    // Sample prescriptions
    const samplePrescriptions = [
      {
        id: '1',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with food to prevent stomach upset',
        prescribedBy: 'Dr. Sarah Johnson',
        prescribedDate: new Date('2024-01-16'),
        refills: 3,
        status: 'active' as const,
        purpose: 'Blood thinning and heart disease prevention',
        category: 'Heart Disease',
        sideEffects: ['stomach upset', 'bruising'],
        interactions: ['warfarin', 'ibuprofen'],
        warnings: ['Do not take with alcohol', 'Take with food'],
        relatedDiseases: ['heart']
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take with meals to reduce side effects',
        prescribedBy: 'Dr. James Wilson',
        prescribedDate: new Date('2024-01-21'),
        refills: 2,
        status: 'active' as const,
        purpose: 'Blood sugar control',
        category: 'Diabetes',
        sideEffects: ['nausea', 'diarrhea'],
        interactions: ['alcohol'],
        warnings: ['Monitor blood sugar regularly', 'Avoid alcohol'],
        relatedDiseases: ['diabetes']
      }
    ];

    localStorage.setItem('medicalRecords', JSON.stringify(sampleRecords));
    localStorage.setItem('prescriptions', JSON.stringify(samplePrescriptions));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <Pill className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Disease-Based Medical Records & Prescriptions
              </h1>
              <p className="text-gray-600 mt-1">
                View your medical records and prescriptions organized by diagnosed conditions
              </p>
              {diseaseId && (
                <p className="text-blue-600 font-medium mt-1">
                  Currently viewing: {getDiseaseName(diseaseId)}
                </p>
              )}
            </div>
          </div>
        </div>

        <DiseasePrescriptionConnector
          medicalRecords={medicalRecords}
          prescriptions={prescriptions}
          onViewRecord={handleViewRecord}
          onViewPrescription={handleViewPrescription}
        />

        {/* Sample Data Button */}
        {medicalRecords.length === 0 && prescriptions.length === 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No Data Available</h3>
            <p className="text-blue-700 mb-4">
              To see how disease-based prescriptions work, you can add some sample data.
            </p>
            <button
              onClick={addSampleData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Sample Data
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Medical Records</p>
                <p className="text-2xl font-bold text-gray-900">{medicalRecords.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">AI Diagnoses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {medicalRecords.filter(r => r.doctor === 'AI Diagnostic System').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How This Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Medical Records</h4>
              <p className="text-gray-600 text-sm">
                Your medical records are automatically organized by diagnosed conditions. 
                When you complete an AI diagnosis assessment, it's saved as a medical record 
                with the disease information attached.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Prescriptions</h4>
              <p className="text-gray-600 text-sm">
                Prescriptions are linked to diseases through their categories and related 
                diseases fields. This helps you understand which medications are typically 
                prescribed for your specific conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseasePrescriptionsPage;
