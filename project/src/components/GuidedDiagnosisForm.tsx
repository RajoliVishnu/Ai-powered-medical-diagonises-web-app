import React, { useState } from 'react';
import { Heart, Info, HelpCircle, CheckCircle } from 'lucide-react';

interface FieldGuide {
  title: string;
  description: string;
  examples: string[];
}

const fieldGuides: Record<string, FieldGuide> = {
  chestPain: {
    title: 'Understanding Chest Pain Types',
    description: 'Chest pain can feel different for everyone. Here\'s how to identify the type:',
    examples: [
      'Typical Angina: Feels like pressure, squeezing, or burning in chest that spreads to arms, neck, jaw',
      'Atypical Angina: Sharp, stabbing pain that may not follow typical patterns',
      'Non-anginal Pain: Pain that doesn\'t feel like typical heart pain',
      'Asymptomatic: No chest pain but other risk factors present'
    ]
  },
  restingBP: {
    title: 'How to Get Blood Pressure Measurements',
    description: 'Blood pressure is measured as two numbers (systolic/diastolic). Here are ways to get it measured:',
    examples: [
      'Visit a local pharmacy - many offer free BP checks',
      'Community health centers often provide free screenings',
      'Ask your local doctor or nurse for a reading',
      'Some grocery stores have BP machines',
      'If you can\'t get measured, select "Don\'t know" and we\'ll assess other factors'
    ]
  },
  cholesterol: {
    title: 'How to Get Cholesterol Tested',
    description: 'Cholesterol is a fatty substance in your blood that requires a blood test',
    examples: [
      'Visit a local clinic or hospital for a blood test',
      'Community health fairs often offer free cholesterol screening',
      'Ask your doctor for a lipid panel test',
      'Some pharmacies offer cholesterol testing',
      'If you can\'t get tested, select "Don\'t know" and we\'ll focus on other risk factors'
    ]
  },
  fastingBS: {
    title: 'How to Get Blood Sugar Tested',
    description: 'Blood sugar level after not eating for 8-12 hours',
    examples: [
      'Visit a local clinic for a fasting glucose test',
      'Community health centers often offer diabetes screening',
      'Some pharmacies have glucose testing services',
      'Ask your doctor for a blood sugar test',
      'If you can\'t get tested, select "Don\'t know" and we\'ll assess other symptoms'
    ]
  },
  maxHR: {
    title: 'Estimating Maximum Heart Rate',
    description: 'You can estimate your maximum heart rate without special equipment',
    examples: [
      'Simple formula: 220 minus your age (e.g., age 50 = 170 bpm)',
      'If you exercise regularly, you might know your max heart rate',
      'If you don\'t know, we can estimate based on your age and activity level',
      'This is just an estimate - actual max HR varies by fitness level'
    ]
  },
  exerciseAngina: {
    title: 'Exercise Induced Angina',
    description: 'Chest pain that occurs during physical activity',
    examples: [
      'Pain during walking, climbing stairs, or exercise',
      'Pain that goes away with rest',
      'May feel like pressure, squeezing, or burning',
      'Can spread to arms, neck, jaw, or back'
    ]
  }
};

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
}

const fields: Field[] = [
    { name: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age in years' },
    { name: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female'] },
    { name: 'chestPain', label: 'Chest Pain Type', type: 'select', options: ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic'] },
    { name: 'restingBP', label: 'Resting Blood Pressure', type: 'select', options: ['Below 120 mmHg', '120-139 mmHg', '140-159 mmHg', '160 mmHg or above', 'Don\'t know'] },
    { name: 'cholesterol', label: 'Serum Cholesterol', type: 'select', options: ['Below 200 mg/dL', '200-239 mg/dL', '240 mg/dL or above', 'Don\'t know'] },
    { name: 'fastingBS', label: 'Fasting Blood Sugar > 120 mg/dl', type: 'select', options: ['Yes', 'No', 'Don\'t know'] },
    { name: 'maxHR', label: 'Maximum Heart Rate', type: 'select', options: ['Below 120 bpm', '120-150 bpm', '151-180 bpm', 'Above 180 bpm', 'Don\'t know - use age estimate'] },
    { name: 'exerciseAngina', label: 'Exercise Induced Angina', type: 'select', options: ['Yes', 'No'] }
  ];

interface GuidedDiagnosisFormProps {
  onSubmit: (data: Record<string, string>) => void;
  isLoading: boolean;
}

const GuidedDiagnosisForm: React.FC<GuidedDiagnosisFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showGuide, setShowGuide] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all required fields are filled
    const requiredFields = ['age', 'sex', 'chestPain', 'restingBP', 'cholesterol', 'fastingBS', 'maxHR', 'exerciseAngina'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    onSubmit(formData);
  };

  const renderField = (field: Field, index: number) => {
    const isCompleted = formData[field.name];
    const guide = fieldGuides[field.name];
    
    return (
      <div key={index} className={`p-1 rounded border transition-all ${
        isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-900 mb-0.5">
              {field.label}
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          
          {guide && (
            <button
              type="button"
              onClick={() => setShowGuide(showGuide === field.name ? null : field.name)}
              className="ml-1 p-0.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Get help understanding this field"
            >
              <HelpCircle className="h-2 w-2" />
            </button>
          )}
        </div>

        {guide && showGuide === field.name && (
          <div className="mb-2 p-2 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1 text-xs">{guide.title}</h4>
                <p className="text-blue-800 mb-2 text-xs">{guide.description}</p>
                <ul className="space-y-0.5">
                  {guide.examples.slice(0, 2).map((example, idx) => (
                    <li key={idx} className="text-xs text-blue-700 flex items-start">
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
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-xs"
            required
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
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs"
            required
          />
        )}

        {isCompleted && (
          <div className="flex items-center mt-0.5 text-green-600">
            <CheckCircle className="h-2 w-2 mr-0.5" />
            <span className="text-xs">Done</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 px-3 py-2 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full mr-2">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Heart Disease Assessment</h1>
              <p className="text-white/90 text-xs">Guided assessment with explanations for each medical term</p>
            </div>
          </div>
          <div className="text-right text-white">
            <div className="text-xs opacity-75">Powered by</div>
            <div className="font-bold text-xs">MediCare AI</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-2 rounded-b-lg shadow-md">
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

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-0.5">
              <span>Complete assessment</span>
              <span>{Object.keys(formData).length}/{fields.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-red-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(Object.keys(formData).length / fields.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {fields.slice(0, 6).map((field, index) => renderField(field, index))}
          </div>

          <div className="pt-2 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || Object.keys(formData).length < 6}
              className="w-full py-1.5 px-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded font-semibold hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-sm text-xs"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Analyzing...
                </div>
              ) : (
                'Get AI Diagnosis'
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-0.5">
              Secure & encrypted. Results in 30 seconds.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuidedDiagnosisForm;
