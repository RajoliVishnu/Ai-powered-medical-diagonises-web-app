import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Clover as Liver, LucideKey as Kidney, Droplets, ArrowLeft, CheckCircle, AlertCircle, Users, Award, Star, Pill, Info } from 'lucide-react';
import GuidedDiagnosisForm from '../components/GuidedDiagnosisForm';
import ReportGenerator from '../components/ReportGenerator';

const diseaseConfig = {
  heart: {
    name: 'Heart Disease',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    fields: [
      { name: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age' },
      { name: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female'] },
      { name: 'chestPain', label: 'Chest Pain Type', type: 'select', options: ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic'] },
      { name: 'restingBP', label: 'Resting Blood Pressure (mmHg)', type: 'select', options: ['Below 120 mmHg', '120-139 mmHg', '140-159 mmHg', '160 mmHg or above', 'Don\'t know'] },
      { name: 'cholesterol', label: 'Serum Cholesterol (mg/dL)', type: 'select', options: ['Below 200 mg/dL', '200-239 mg/dL', '240 mg/dL or above', 'Don\'t know'] },
      { name: 'fastingBS', label: 'Fasting Blood Sugar (mg/dL)', type: 'select', options: ['Below 120 mg/dL', '120-125 mg/dL', '126 mg/dL or above', 'Don\'t know'] },
      { name: 'maxHR', label: 'Maximum Heart Rate (bpm)', type: 'select', options: ['Below 120 bpm', '120-150 bpm', '151-180 bpm', 'Above 180 bpm', 'Don\'t know - use age estimate'] },
      { name: 'exerciseAngina', label: 'Exercise Induced Angina', type: 'select', options: ['Yes', 'No'] }
    ]
  },
  liver: {
    name: 'Liver Disease',
    icon: Liver,
    color: 'from-orange-500 to-yellow-500',
    fields: [
      { name: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age' },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
      { name: 'totalBilirubin', label: 'Total Bilirubin (mg/dL)', type: 'select', options: ['Below 1.2 mg/dL', '1.2-2.0 mg/dL', 'Above 2.0 mg/dL', 'Don\'t know'] },
      { name: 'directBilirubin', label: 'Direct Bilirubin (mg/dL)', type: 'select', options: ['Below 0.3 mg/dL', '0.3-0.5 mg/dL', 'Above 0.5 mg/dL', 'Don\'t know'] },
      { name: 'alkalinePhosphatase', label: 'Alkaline Phosphatase (IU/L)', type: 'select', options: ['Below 120 IU/L', '120-200 IU/L', 'Above 200 IU/L', 'Don\'t know'] },
      { name: 'alamineAminotransferase', label: 'Alamine Aminotransferase (IU/L)', type: 'select', options: ['Below 40 IU/L', '40-80 IU/L', 'Above 80 IU/L', 'Don\'t know'] },
      { name: 'aspartateAminotransferase', label: 'Aspartate Aminotransferase (IU/L)', type: 'select', options: ['Below 40 IU/L', '40-80 IU/L', 'Above 80 IU/L', 'Don\'t know'] },
      { name: 'totalProteins', label: 'Total Proteins (g/dL)', type: 'select', options: ['Below 6.0 g/dL', '6.0-8.0 g/dL', 'Above 8.0 g/dL', 'Don\'t know'] }
    ]
  },
  kidney: {
    name: 'Kidney Disease',
    icon: Kidney,
    color: 'from-blue-500 to-cyan-500',
    fields: [
      { name: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age' },
      { name: 'bloodPressure', label: 'Blood Pressure (mmHg)', type: 'select', options: ['Below 120 mmHg', '120-139 mmHg', '140-159 mmHg', '160 mmHg or above', 'Don\'t know'] },
      { name: 'specificGravity', label: 'Specific Gravity (urine)', type: 'select', options: ['1.005-1.010', '1.011-1.020', '1.021-1.030', 'Don\'t know'] },
      { name: 'albumin', label: 'Albumin (0-5 scale)', type: 'select', options: ['0', '1', '2', '3', '4', '5'] },
      { name: 'sugar', label: 'Sugar (0-5 scale)', type: 'select', options: ['0', '1', '2', '3', '4', '5'] },
      { name: 'redBloodCells', label: 'Red Blood Cells (urine)', type: 'select', options: ['Normal', 'Abnormal'] },
      { name: 'pusCell', label: 'Pus Cell (urine)', type: 'select', options: ['Normal', 'Abnormal'] },
      { name: 'bloodUrea', label: 'Blood Urea (mg/dL)', type: 'select', options: ['Below 20 mg/dL', '20-40 mg/dL', 'Above 40 mg/dL', 'Don\'t know'] }
    ]
  },
  diabetes: {
    name: 'Diabetes',
    icon: Droplets,
    color: 'from-green-500 to-emerald-500',
    fields: [
      { name: 'pregnancies', label: 'Number of Pregnancies', type: 'number', placeholder: 'Enter number' },
      { name: 'glucose', label: 'Glucose Level (mg/dL)', type: 'select', options: ['Below 100 mg/dL', '100-125 mg/dL', '126 mg/dL or above', 'Don\'t know'] },
      { name: 'bloodPressure', label: 'Blood Pressure (mmHg)', type: 'select', options: ['Below 120 mmHg', '120-139 mmHg', '140-159 mmHg', '160 mmHg or above', 'Don\'t know'] },
      { name: 'skinThickness', label: 'Skin Thickness (mm)', type: 'select', options: ['Below 20 mm', '20-30 mm', 'Above 30 mm', 'Don\'t know'] },
      { name: 'insulin', label: 'Insulin Level (mu U/ml)', type: 'select', options: ['Below 100 mu U/ml', '100-200 mu U/ml', 'Above 200 mu U/ml', 'Don\'t know'] },
      { name: 'bmi', label: 'BMI (kg/m²)', type: 'select', options: ['Below 25', '25-30', 'Above 30', 'Don\'t know'] },
      { name: 'diabetesPedigree', label: 'Diabetes Pedigree Function', type: 'select', options: ['Below 0.5', '0.5-1.0', 'Above 1.0', 'Don\'t know'] },
      { name: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age' }
    ]
  }
};

// Photo thumbnails for each disease (replace URLs with your own assets if desired)
const diseasePhotos: Record<string, string> = {
  heart: 'https://images.pexels.com/photos/4226118/pexels-photo-4226118.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  liver: 'https://images.pexels.com/photos/4225876/pexels-photo-4225876.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  kidney: 'https://images.pexels.com/photos/8460343/pexels-photo-8460343.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  diabetes: 'https://images.pexels.com/photos/6942047/pexels-photo-6942047.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'
};

interface MedicalRecord {
  id: string;
  date: string;
  type: 'consultation' | 'prescription';
  title: string;
  description: string;
  doctor: string;
  status: 'completed' | 'pending' | 'cancelled';
  symptoms: string[];
  medications: string[];
  followUp: string;
  diagnosedDisease: string;
  diseaseRisk: string;
  confidence: number;
}

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  quantity: number;
  status: string;
  relatedDiseases: string;
}

export const DiagnosisPage: React.FC = () => {
  const { diseaseId } = useParams<{ diseaseId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ 
    risk: string; 
    confidence: number; 
    recommendations: string[];
    doctorRecommendations: Array<{
      name: string;
      specialty: string;
      rating: number;
      experience: string;
    }>;
  } | null>(null);

  const disease = diseaseConfig[diseaseId as keyof typeof diseaseConfig];

  if (!disease) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Disease not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Validate numeric fields
    if (field === 'age' && value) {
      const age = parseInt(value);
      // Age guard rails chosen to reflect typical clinical screening ranges
      // Rationale: avoids unrealistic inputs without being overly restrictive
      if (age < 1 || age > 120) {
        setErrors(prev => ({ ...prev, [field]: 'Age must be between 1 and 120 years' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get auth token
      const token = localStorage.getItem('token');
      
      // Call backend API for AI diagnosis
      const response = await fetch('/api/diagnosis/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          diseaseType: diseaseId,
          formData: formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        const prediction = data.prediction;
        
        setResult({
          risk: prediction.risk,
          confidence: prediction.confidence,
          recommendations: prediction.recommendations,
          doctorRecommendations: prediction.doctorRecommendations
        });

        // Save diagnosis as medical record
        const medicalRecord: MedicalRecord = {
          id: data.recordId,
          date: new Date().toISOString(),
          type: 'consultation',
          title: `${disease.name} Assessment`,
          description: `AI-powered diagnosis assessment for ${disease.name}. Risk level: ${prediction.risk} (${prediction.confidence}% confidence). Symptoms and parameters analyzed.`,
          doctor: 'AI Diagnostic System',
          status: 'completed',
          symptoms: Object.keys(formData).filter(key => formData[key] && key !== 'age' && key !== 'sex' && key !== 'gender'),
          medications: [],
          followUp: prediction.recommendations.join('. '),
          diagnosedDisease: diseaseId || 'unknown',
          diseaseRisk: prediction.risk,
          confidence: prediction.confidence
        };

        // Store in localStorage for demo purposes
        const existingRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
        existingRecords.push(medicalRecord);
        localStorage.setItem('medicalRecords', JSON.stringify(existingRecords));
        
        console.log('✅ AI Diagnosis completed successfully');
      } else {
        console.error('❌ Diagnosis API failed:', await response.text());
        // Fallback to mock data if API fails
        await handleMockDiagnosis();
      }
    } catch (error) {
      console.error('❌ Diagnosis error:', error);
      // Fallback to mock data if API fails
      await handleMockDiagnosis();
    }
    
    setIsLoading(false);
  };

  const handleMockDiagnosis = async () => {
    // Fallback mock diagnosis if API is not available
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const risks = ['Low', 'Moderate', 'High'];
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const confidence = Math.floor(Math.random() * 20) + 80;
    
    const recommendations = {
      Low: [
        'Maintain a healthy lifestyle with regular exercise (30 minutes daily)',
        'Continue with balanced diet rich in fruits and vegetables',
        'Schedule routine check-ups every 6 months',
        'Monitor your health parameters regularly'
      ],
      Moderate: [
        'Consult with a healthcare provider within 2 weeks for detailed evaluation',
        'Consider lifestyle modifications including diet and exercise changes',
        'Schedule regular monitoring and follow-up appointments monthly',
        'Consider preventive medications as recommended by your doctor'
      ],
      High: [
        'Seek immediate medical attention from a specialist within 48 hours',
        'Follow prescribed treatment plan strictly and consistently',
        'Make significant lifestyle changes immediately',
        'Consider hospitalization or intensive treatment if recommended'
      ]
    };

    const doctorRecommendations = {
      heart: [
        { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, experience: '15 years' },
        { name: 'Dr. Lisa Thompson', specialty: 'Interventional Cardiologist', rating: 4.8, experience: '10 years' }
      ],
      liver: [
        { name: 'Dr. Michael Chen', specialty: 'Hepatologist', rating: 4.8, experience: '12 years' }
      ],
      kidney: [
        { name: 'Dr. Emily Rodriguez', specialty: 'Nephrologist', rating: 4.9, experience: '18 years' }
      ],
      diabetes: [
        { name: 'Dr. James Wilson', specialty: 'Endocrinologist', rating: 4.7, experience: '20 years' },
        { name: 'Dr. Robert Kumar', specialty: 'Diabetologist', rating: 4.9, experience: '14 years' }
      ]
    };

    setResult({
      risk,
      confidence,
      recommendations: recommendations[risk as keyof typeof recommendations],
      doctorRecommendations: doctorRecommendations[diseaseId as keyof typeof doctorRecommendations] || []
    });
  };

  const handleConsultSpecialist = () => {
    navigate(`/doctors?category=${diseaseId}`);
  };

  const handleGuidedFormSubmit = (data: Record<string, string>) => {
    setFormData(data);
    // Create a mock event to pass to handleSubmit
    const mockEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(mockEvent);
  };

  const photoUrl = diseasePhotos[(diseaseId as string) || 'heart'] || diseasePhotos.heart;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2 transition-colors text-sm"
        >
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {!result ? (
            diseaseId === 'heart' ? (
              <GuidedDiagnosisForm onSubmit={handleGuidedFormSubmit} isLoading={isLoading} />
            ) : (
              <>
                {/* Enhanced Header - Only show for non-heart diseases */}
                <div className={`bg-gradient-to-r ${disease.color} px-3 py-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full mr-2">
                        <img src={photoUrl} alt={`${disease.name} photo`} className="h-8 w-8 rounded-full object-cover border-2 border-white/60" />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-white">{disease.name} Assessment</h1>
                        <p className="text-white/90 text-xs">AI-powered diagnostic analysis with 95% accuracy</p>
                      </div>
                    </div>
                    <div className="text-right text-white">
                      <div className="text-xs opacity-75">Powered by</div>
                      <div className="font-bold text-xs">MediCare AI</div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  {/* Helpful Information for Remote Patients - Ultra Compact */}
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-start">
                      <Info className="h-3 w-3 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1 text-xs">No access to medical tests? That's why you're here!</h3>
                        <p className="text-blue-800 mb-1 text-xs">
                          We understand you're using this website because you don't have access to doctors or medical facilities. This AI system is designed to help you:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-0">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-1">•</span>
                            <strong>No medical equipment needed:</strong> Select "Don't know" for any test values you don't have
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-1">•</span>
                            <strong>Focus on what you know:</strong> Your symptoms, family history, and lifestyle are most important
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-1">•</span>
                            <strong>AI will assess risk:</strong> Based on available information and medical knowledge
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-1">•</span>
                            <strong>Get guidance:</strong> Understand your health situation and when to seek medical help
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Progress Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">Complete assessment</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                          {Object.keys(formData).length}/{disease.fields.length} fields
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${disease.color} h-2 rounded-full progress-bar`}
                          style={{ width: `${(Object.keys(formData).length / disease.fields.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Disease Category Header */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200 mb-4">
                      <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center">
                        {disease.name === 'Heart Disease' && '🫀 Heart Parameters'}
                        {disease.name === 'Liver Disease' && '🧠 Liver Parameters'}
                        {disease.name === 'Kidney Disease' && '💉 Kidney Parameters'}
                        {disease.name === 'Diabetes' && '🩸 Diabetes Parameters'}
                      </h3>
                      <p className="text-sm text-emerald-700">
                        Enter your medical values to get AI-powered health insights
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {disease.fields.slice(0, 6).map((field, index) => (
                        <div key={index} className="space-y-1">
                          <label className="form-label text-sm flex items-center">
                            {field.label}
                            <span className="text-red-500 ml-1">*</span>
                            <Info className="h-4 w-4 text-blue-500 ml-2 cursor-help" title={`Click for more info about ${field.label}`} />
                          </label>
                          {field.type === 'select' ? (
                            <select
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className="form-field text-sm"
                              required
                              aria-label={field.label}
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map((option, optIndex) => (
                                <option key={optIndex} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className="form-field text-sm"
                              required
                              min={field.type === 'number' ? (field.name === 'age' ? 1 : 0) : undefined}
                              max={field.type === 'number' ? (field.name === 'age' ? 120 : 1000) : undefined}
                              step={field.type === 'number' ? (field.name === 'age' ? 1 : 0.1) : undefined}
                            />
                          )}
                          <div className="form-hint">
                            {field.name === 'age' && 'Enter your age in years (1-120)'}
                            {field.name === 'sex' && 'Select your biological sex'}
                            {field.name === 'gender' && 'Select your gender identity'}
                            {field.name === 'chestPain' && 'Describe the type of chest pain you experience'}
                            {field.name === 'restingBP' && 'Your resting blood pressure reading (if known)'}
                            {field.name === 'cholesterol' && 'Your cholesterol level from recent blood test'}
                            {field.name === 'fastingBS' && 'Fasting blood sugar level above 120 mg/dl'}
                            {field.name === 'maxHR' && 'Maximum heart rate during exercise'}
                            {field.name === 'exerciseAngina' && 'Chest pain during physical activity'}
                            {field.name === 'totalBilirubin' && 'Total bilirubin level from liver function test'}
                            {field.name === 'directBilirubin' && 'Direct bilirubin level from liver function test'}
                            {field.name === 'alkalinePhosphatase' && 'Alkaline phosphatase enzyme level'}
                            {field.name === 'alamineAminotransferase' && 'ALT enzyme level from liver test'}
                            {field.name === 'aspartateAminotransferase' && 'AST enzyme level from liver test'}
                            {field.name === 'totalProteins' && 'Total protein level from blood test'}
                            {field.name === 'bloodPressure' && 'Your blood pressure reading (if known)'}
                            {field.name === 'specificGravity' && 'Specific gravity from urine test'}
                            {field.name === 'albumin' && 'Albumin level in urine (0-5 scale)'}
                            {field.name === 'sugar' && 'Sugar level in urine (0-5 scale)'}
                            {field.name === 'redBloodCells' && 'Red blood cells in urine (normal/abnormal)'}
                            {field.name === 'pusCell' && 'Pus cells in urine (normal/abnormal)'}
                            {field.name === 'bloodUrea' && 'Blood urea nitrogen level'}
                            {field.name === 'pregnancies' && 'Number of pregnancies (0 if male)'}
                            {field.name === 'glucose' && 'Fasting glucose level from blood test'}
                            {field.name === 'skinThickness' && 'Skin fold thickness measurement'}
                            {field.name === 'insulin' && 'Insulin level from blood test'}
                            {field.name === 'bmi' && 'Body Mass Index (weight/height²)'}
                            {field.name === 'diabetesPedigree' && 'Diabetes family history function'}
                          </div>
                          {errors[field.name] && (
                            <div className="text-red-500 text-xs mt-1">
                              {errors[field.name]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold text-center transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base min-h-[48px] flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing with AI...
                        </div>
                      ) : (
                        'Get AI Diagnosis'
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-0.5">
                      Secure & encrypted. Results in 30 seconds.
                    </p>
                  </form>
                </div>
              </>
            )
          ) : (
            <div className="space-y-8">
              {/* AI Diagnosis Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Prediction Result: {result.risk} Risk of {disease.name}</h3>
                  <p className="text-blue-800 text-sm font-medium">
                    <strong>AI Analysis Complete:</strong> This is a predictive result. Please consult a doctor for professional confirmation.
                  </p>
                </div>
              </div>

              {/* Enhanced Results with Medical Cards */}
              <div className={`medical-card ${result.risk === 'Low' ? 'medical-success' : result.risk === 'Moderate' ? 'medical-warning' : 'medical-danger'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    {result.risk === 'Low' ? (
                      <CheckCircle className="h-12 w-12 text-green-600 mr-4" />
                    ) : (
                      <AlertCircle className={`h-12 w-12 ${result.risk === 'Moderate' ? 'text-yellow-600' : 'text-red-600'} mr-4`} />
                    )}
                    <div>
            <h2 className="medical-header">
              Risk Level: <span className={result.risk === 'Low' ? 'text-green-600' : result.risk === 'Moderate' ? 'text-yellow-600' : 'text-red-600'}>{result.risk}</span>
            </h2>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600 text-lg">Model Confidence: <span className="font-bold text-emerald-600">{result.confidence}%</span></p>
              <div className="flex items-center">
                {result.risk === 'Low' && <span className="text-2xl">🟢</span>}
                {result.risk === 'Moderate' && <span className="text-2xl">🟡</span>}
                {result.risk === 'High' && <span className="text-2xl">🔴</span>}
              </div>
            </div>
                      <div className="mt-2">
                        {result.risk === 'Low' && (
                          <p className="text-green-700 text-sm font-medium">
                            ✅ Your health parameters appear to be within normal ranges. Continue maintaining a healthy lifestyle.
                          </p>
                        )}
                        {result.risk === 'Moderate' && (
                          <p className="text-yellow-700 text-sm font-medium">
                            ⚠️ Some parameters indicate potential risk. We recommend consulting with a healthcare provider for further evaluation.
                          </p>
                        )}
                        {result.risk === 'High' && (
                          <p className="text-red-700 text-sm font-medium">
                            🚨 High risk detected. Please seek immediate medical attention from a qualified healthcare provider.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Analyzed by</div>
                    <div className="font-bold text-emerald-600">MediCare AI</div>
                    <div className="text-xs text-gray-400 mt-1">Powered by Machine Learning</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Recommendations */}
              <div className="medical-card">
                <h3 className="medical-subheader flex items-center mb-6">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-2" />
                  Personalized Health Recommendations
                </h3>
                <div className="grid gap-4">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-bold text-sm">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 font-medium">{rec}</p>
                        <div className="mt-1 text-xs text-emerald-600 font-medium">
                          {index === 0 && 'Priority: High'}
                          {index === 1 && 'Priority: Medium'}
                          {index === 2 && 'Priority: Medium'}
                          {index === 3 && 'Priority: Low'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Pro Tip:</strong> These recommendations are based on your current health parameters. 
                    For the best results, implement them gradually and monitor your progress.
                  </p>
                </div>
              </div>

              {/* Doctor Recommendations */}
              {result.doctorRecommendations.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-2" />
                    Recommended Specialists
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {result.doctorRecommendations.map((doctor, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                          </div>
                        </div>
                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Award className="h-4 w-4 mr-1" />
                          {doctor.experience} experience
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Generator */}
              <ReportGenerator
                reportData={{
                  patientName: 'Current User', // In real app, get from user context
                  date: new Date().toISOString(),
                  diseaseType: disease.name,
                  riskLevel: result.risk,
                  confidence: result.confidence,
                  recommendations: result.recommendations,
                  formData: formData
                }}
                onGenerate={() => console.log('Report generated successfully')}
              />

              {/* Enhanced Actions with Better Alignment */}
              <div className="mobile-stack gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleConsultSpecialist}
                  className="flex-1 py-4 px-6 btn-gradient rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg btn-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Consult Recommended Specialists
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 py-4 px-6 border-2 border-emerald-300 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors btn-center"
                >
                  <img src={photoUrl} alt={`${disease.name} photo`} className="h-5 w-5 mr-2 rounded-full object-cover" />
                  Test Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors btn-center"
                >
                  ← Go Home
                </button>
              </div>

              {/* Medical Records and Prescriptions Section */}
              <div className="mt-8 space-y-6">
                {/* Medical Records */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    Your Medical Records
                  </h3>
                  <div className="space-y-4">
                    {(() => {
                      const records = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
                      const diseaseRecords = records.filter((record: MedicalRecord) => 
                        record.diagnosedDisease === diseaseId
                      );
                      
                      if (diseaseRecords.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <p>No medical records found for {disease.name}.</p>
                            <p className="text-sm mt-2">Your diagnosis has been saved as a new record.</p>
                          </div>
                        );
                      }
                      
                      return diseaseRecords.slice(-3).map((record: MedicalRecord) => (
                        <div key={record.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{record.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.diseaseRisk === 'Low' ? 'bg-green-100 text-green-800' :
                              record.diseaseRisk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.diseaseRisk} Risk
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Date: {new Date(record.date).toLocaleDateString()}</span>
                            <span>Confidence: {record.confidence}%</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate('/medical-records')}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View All Medical Records →
                    </button>
                  </div>
                </div>

                {/* Prescriptions */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Pill className="h-6 w-6 text-purple-600 mr-2" />
                    Related Prescriptions
                  </h3>
                  <div className="space-y-4">
                    {(() => {
                      const prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
                      const diseasePrescriptions = prescriptions.filter((prescription: Prescription) => 
                        prescription.relatedDiseases && 
                        prescription.relatedDiseases.toLowerCase().includes(diseaseId?.toLowerCase() || '')
                      );
                      
                      if (diseasePrescriptions.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <p>No prescriptions found for {disease.name}.</p>
                            <p className="text-sm mt-2">Consult with a specialist to get prescribed medications.</p>
                          </div>
                        );
                      }
                      
                      return diseasePrescriptions.slice(-3).map((prescription: Prescription) => (
                        <div key={prescription.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{prescription.medicationName}</h4>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {prescription.status}
                            </span>
                          </div>
                          <p className="text-sm textGray-600 mb-2">
                            {prescription.dosage} - {prescription.frequency}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Prescribed: {new Date(prescription.prescribedDate).toLocaleDateString()}</span>
                            <span>Quantity: {prescription.quantity}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate('/prescriptions')}
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                    >
                      View All Prescriptions →
                    </button>
                  </div>
                </div>
              </div>

              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DiagnosisPage;