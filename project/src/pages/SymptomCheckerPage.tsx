import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertTriangle, Info, ArrowRight, Clock, MapPin, Phone, Star } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration?: string;
  frequency?: string;
}

interface Condition {
  id: string;
  name: string;
  probability: number;
  symptoms: string[];
  description: string;
  urgency: 'low' | 'moderate' | 'high' | 'emergency';
  recommendations: string[];
  specialists: string[];
}

interface SymptomCheckerResult {
  conditions: Condition[];
  overallUrgency: 'low' | 'moderate' | 'high' | 'emergency';
  generalRecommendations: string[];
  emergencyAdvice?: string;
}

const SymptomCheckerPage: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomCheckerResult | null>(null);
  const [error, setError] = useState('');
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  // Comprehensive symptom database
  const symptomDatabase = [
    // Cardiovascular
    { id: 'chest-pain', name: 'Chest Pain', category: 'Cardiovascular', severity: 'severe' },
    { id: 'shortness-breath', name: 'Shortness of Breath', category: 'Cardiovascular', severity: 'severe' },
    { id: 'heart-palpitations', name: 'Heart Palpitations', category: 'Cardiovascular', severity: 'moderate' },
    { id: 'dizziness', name: 'Dizziness', category: 'Cardiovascular', severity: 'moderate' },
    { id: 'swollen-feet', name: 'Swollen Feet/Ankles', category: 'Cardiovascular', severity: 'moderate' },
    
    // Respiratory
    { id: 'cough', name: 'Persistent Cough', category: 'Respiratory', severity: 'moderate' },
    { id: 'wheezing', name: 'Wheezing', category: 'Respiratory', severity: 'moderate' },
    { id: 'chest-tightness', name: 'Chest Tightness', category: 'Respiratory', severity: 'severe' },
    { id: 'difficulty-breathing', name: 'Difficulty Breathing', category: 'Respiratory', severity: 'severe' },
    
    // Neurological
    { id: 'headache', name: 'Severe Headache', category: 'Neurological', severity: 'moderate' },
    { id: 'confusion', name: 'Confusion', category: 'Neurological', severity: 'severe' },
    { id: 'numbness', name: 'Numbness/Tingling', category: 'Neurological', severity: 'moderate' },
    { id: 'weakness', name: 'Muscle Weakness', category: 'Neurological', severity: 'moderate' },
    { id: 'seizures', name: 'Seizures', category: 'Neurological', severity: 'severe' },
    
    // Gastrointestinal
    { id: 'abdominal-pain', name: 'Abdominal Pain', category: 'Gastrointestinal', severity: 'moderate' },
    { id: 'nausea', name: 'Nausea/Vomiting', category: 'Gastrointestinal', severity: 'moderate' },
    { id: 'diarrhea', name: 'Diarrhea', category: 'Gastrointestinal', severity: 'mild' },
    { id: 'constipation', name: 'Constipation', category: 'Gastrointestinal', severity: 'mild' },
    { id: 'blood-stool', name: 'Blood in Stool', category: 'Gastrointestinal', severity: 'severe' },
    
    // Musculoskeletal
    { id: 'joint-pain', name: 'Joint Pain', category: 'Musculoskeletal', severity: 'mild' },
    { id: 'back-pain', name: 'Back Pain', category: 'Musculoskeletal', severity: 'moderate' },
    { id: 'muscle-cramps', name: 'Muscle Cramps', category: 'Musculoskeletal', severity: 'mild' },
    
    // General
    { id: 'fever', name: 'Fever', category: 'General', severity: 'moderate' },
    { id: 'fatigue', name: 'Extreme Fatigue', category: 'General', severity: 'moderate' },
    { id: 'weight-loss', name: 'Unexplained Weight Loss', category: 'General', severity: 'moderate' },
    { id: 'weight-gain', name: 'Unexplained Weight Gain', category: 'General', severity: 'moderate' },
    { id: 'night-sweats', name: 'Night Sweats', category: 'General', severity: 'moderate' },
    
    // Skin
    { id: 'rash', name: 'Skin Rash', category: 'Dermatological', severity: 'mild' },
    { id: 'skin-changes', name: 'Skin Changes', category: 'Dermatological', severity: 'moderate' },
    { id: 'moles', name: 'New/Changing Moles', category: 'Dermatological', severity: 'moderate' },
    
    // Vision/Hearing
    { id: 'vision-changes', name: 'Vision Changes', category: 'Ophthalmological', severity: 'moderate' },
    { id: 'hearing-loss', name: 'Hearing Loss', category: 'Otological', severity: 'moderate' },
    
    // Mental Health
    { id: 'anxiety', name: 'Anxiety', category: 'Mental Health', severity: 'moderate' },
    { id: 'depression', name: 'Depression', category: 'Mental Health', severity: 'moderate' },
    { id: 'sleep-problems', name: 'Sleep Problems', category: 'Mental Health', severity: 'mild' },
  ];

  const filteredSymptoms = symptomDatabase.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addSymptom = (symptom: Symptom) => {
    if (!selectedSymptoms.find(s => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSearchTerm('');
  };

  const removeSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResult = generateMockAnalysis();
      setResult(mockResult);

      // Check for emergency conditions
      if (mockResult.overallUrgency === 'emergency') {
        setShowEmergencyAlert(true);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (): SymptomCheckerResult => {
    const symptomNames = selectedSymptoms.map(s => s.name);
    
    // Mock conditions based on selected symptoms
    const conditions: Condition[] = [];
    
    // Heart-related conditions
    if (symptomNames.some(s => ['Chest Pain', 'Shortness of Breath', 'Heart Palpitations'].includes(s))) {
      conditions.push({
        id: 'heart-condition',
        name: 'Possible Heart Condition',
        probability: 75,
        symptoms: symptomNames.filter(s => ['Chest Pain', 'Shortness of Breath', 'Heart Palpitations'].includes(s)),
        description: 'Symptoms may indicate cardiovascular issues requiring medical evaluation.',
        urgency: 'high',
        recommendations: [
          'Seek immediate medical attention if chest pain is severe',
          'Schedule appointment with cardiologist within 1 week',
          'Monitor blood pressure and heart rate',
          'Avoid strenuous activities until evaluated'
        ],
        specialists: ['Cardiologist', 'Internal Medicine']
      });
    }

    // Respiratory conditions
    if (symptomNames.some(s => ['Persistent Cough', 'Wheezing', 'Difficulty Breathing'].includes(s))) {
      conditions.push({
        id: 'respiratory-condition',
        name: 'Respiratory Condition',
        probability: 65,
        symptoms: symptomNames.filter(s => ['Persistent Cough', 'Wheezing', 'Difficulty Breathing'].includes(s)),
        description: 'Respiratory symptoms may indicate asthma, COPD, or other lung conditions.',
        urgency: 'moderate',
        recommendations: [
          'Consult with pulmonologist',
          'Avoid triggers like smoke and allergens',
          'Monitor breathing patterns',
          'Consider pulmonary function tests'
        ],
        specialists: ['Pulmonologist', 'Allergist']
      });
    }

    // Neurological conditions
    if (symptomNames.some(s => ['Severe Headache', 'Confusion', 'Numbness/Tingling'].includes(s))) {
      conditions.push({
        id: 'neurological-condition',
        name: 'Neurological Condition',
        probability: 60,
        symptoms: symptomNames.filter(s => ['Severe Headache', 'Confusion', 'Numbness/Tingling'].includes(s)),
        description: 'Neurological symptoms require prompt evaluation to rule out serious conditions.',
        urgency: 'high',
        recommendations: [
          'Seek immediate medical attention',
          'Consult with neurologist',
          'Avoid activities that could cause injury',
          'Monitor symptoms closely'
        ],
        specialists: ['Neurologist', 'Emergency Medicine']
      });
    }

    // General conditions
    if (symptomNames.some(s => ['Fever', 'Extreme Fatigue', 'Unexplained Weight Loss'].includes(s))) {
      conditions.push({
        id: 'general-condition',
        name: 'General Medical Condition',
        probability: 50,
        symptoms: symptomNames.filter(s => ['Fever', 'Extreme Fatigue', 'Unexplained Weight Loss'].includes(s)),
        description: 'General symptoms may indicate various underlying conditions requiring evaluation.',
        urgency: 'moderate',
        recommendations: [
          'Schedule appointment with primary care physician',
          'Complete blood work',
          'Monitor symptoms and keep a diary',
          'Maintain healthy lifestyle habits'
        ],
        specialists: ['Primary Care Physician', 'Internal Medicine']
      });
    }

    // Determine overall urgency
    const maxUrgency = conditions.reduce((max, condition) => {
      const urgencyLevels = { low: 1, moderate: 2, high: 3, emergency: 4 };
      return Math.max(max, urgencyLevels[condition.urgency]);
    }, 1);

    const overallUrgency = Object.keys({ low: 1, moderate: 2, high: 3, emergency: 4 })
      .find(key => ({ low: 1, moderate: 2, high: 3, emergency: 4 })[key] === maxUrgency) as 'low' | 'moderate' | 'high' | 'emergency';

    return {
      conditions,
      overallUrgency,
      generalRecommendations: [
        'Keep a detailed symptom diary',
        'Take photos of any visible symptoms',
        'Note symptom triggers and patterns',
        'Prepare questions for your doctor'
      ],
      emergencyAdvice: overallUrgency === 'emergency' ? 
        'If symptoms worsen or you experience severe chest pain, difficulty breathing, or loss of consciousness, call emergency services immediately.' : undefined
    };
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'emergency': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'moderate': return <Info className="h-5 w-5 text-yellow-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'emergency': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Symptom Checker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Describe your symptoms to get AI-powered health insights and recommendations
          </p>
        </div>

        {/* Emergency Alert */}
        {showEmergencyAlert && (
          <div className="mb-6">
            <Alert 
              type="error" 
              title="Emergency Alert" 
              message="Based on your symptoms, you should seek immediate medical attention. Call emergency services if symptoms worsen."
              onClose={() => setShowEmergencyAlert(false)}
            />
          </div>
        )}

        {/* Error Alert */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptom Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Select Your Symptoms
            </h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected Symptoms ({selectedSymptoms.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <span
                      key={symptom.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {symptom.name}
                      <button
                        onClick={() => removeSymptom(symptom.id)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Symptom List */}
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredSymptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => addSymptom(symptom as Symptom)}
                    disabled={selectedSymptoms.some(s => s.id === symptom.id)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {symptom.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {symptom.category}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        symptom.severity === 'mild' ? 'bg-green-100 text-green-800' :
                        symptom.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        symptom.severity === 'severe' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {symptom.severity}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze Symptoms
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Results
            </h2>

            {!result ? (
              <div className="text-center py-8">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Select symptoms and click "Analyze Symptoms" to get AI-powered insights
                </p>
              </div>
            ) : (
              <div className="space-y-6" data-testid="diagnosis-results">
                {/* Overall Urgency */}
                <div className={`p-4 rounded-lg ${getUrgencyColor(result.overallUrgency)}`}>
                  <div className="flex items-center">
                    {getUrgencyIcon(result.overallUrgency)}
                    <h3 className="ml-2 font-semibold">
                      Overall Urgency: {result.overallUrgency.toUpperCase()}
                    </h3>
                  </div>
                </div>

                {/* Conditions */}
                {result.conditions.map((condition) => (
                  <div key={condition.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {condition.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {condition.probability}% probability
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(condition.urgency)}`}>
                          {condition.urgency}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {condition.description}
                    </p>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Matching Symptoms:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {condition.symptoms.map((symptom) => (
                          <span key={symptom} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Recommendations:
                      </h4>
                      <ul className="space-y-1">
                        {condition.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                            <ArrowRight className="h-4 w-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Recommended Specialists:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {condition.specialists.map((specialist) => (
                          <span key={specialist} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                            {specialist}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* General Recommendations */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    General Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.generalRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Emergency Advice */}
                {result.emergencyAdvice && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                          Emergency Advice
                        </h4>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          {result.emergencyAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
