import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Clover as Liver, LucideKey as Kidney, Droplets, ArrowLeft, CheckCircle, AlertCircle, Users, Award, Star, Info, HelpCircle, Activity, Thermometer, Gauge, Zap, Calendar, DollarSign, Clock } from 'lucide-react';

interface DiseaseConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  symptoms: string[];
  riskFactors: string[];
  fields: Array<{
    name: string;
    label: string;
    type: 'number' | 'select' | 'text' | 'radio' | 'checkbox';
    placeholder?: string;
    options?: string[];
    guide?: {
      title: string;
      description: string;
      examples: string[];
      icon: React.ComponentType<{ className?: string }>;
    };
    unit?: string;
    normalRange?: string;
  }>;
}

// Photo thumbnails for each disease (replace URLs with your own assets if desired)
const diseasePhotos: Record<string, string> = {
  heart: 'https://images.pexels.com/photos/4226118/pexels-photo-4226118.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  liver: 'https://images.pexels.com/photos/4225876/pexels-photo-4225876.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  kidney: 'https://images.pexels.com/photos/8460343/pexels-photo-8460343.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  diabetes: 'https://images.pexels.com/photos/6942047/pexels-photo-6942047.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'
};

const diseaseConfigs: Record<string, DiseaseConfig> = {
  heart: {
    name: 'Heart Disease Assessment',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description: 'Comprehensive heart health evaluation including chest pain analysis, blood pressure, cholesterol levels, and heart rate assessment.',
    symptoms: [
      'Chest pain or discomfort',
      'Shortness of breath',
      'Fatigue',
      'Irregular heartbeat',
      'Swelling in legs or ankles'
    ],
    riskFactors: [
      'High blood pressure',
      'High cholesterol',
      'Diabetes',
      'Smoking',
      'Family history of heart disease'
    ],
    fields: [
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'Enter your age in years',
        unit: 'years',
        normalRange: '18-100'
      },
      {
        name: 'sex',
        label: 'Sex',
        type: 'select',
        options: ['Male', 'Female']
      },
      {
        name: 'chestPain',
        label: 'Chest Pain Type',
        type: 'select',
        options: ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic'],
        guide: {
          title: 'Understanding Chest Pain',
          description: 'Chest pain can feel different for everyone. Here\'s how to identify the type:',
          examples: [
            'Typical Angina: Feels like pressure, squeezing, or burning in chest that spreads to arms, neck, jaw',
            'Atypical Angina: Sharp, stabbing pain that may not follow typical patterns',
            'Non-anginal Pain: Pain that doesn\'t feel like typical heart pain',
            'Asymptomatic: No chest pain but other risk factors present'
          ],
          icon: Heart
        }
      },
      {
        name: 'restingBP',
        label: 'Resting Blood Pressure',
        type: 'number',
        placeholder: 'Enter systolic pressure (top number)',
        unit: 'mmHg',
        normalRange: '90-140',
        guide: {
          title: 'How to Measure Blood Pressure',
          description: 'Blood pressure is measured as two numbers (systolic/diastolic)',
          examples: [
            'Systolic (top number): Pressure when heart beats',
            'Diastolic (bottom number): Pressure when heart rests',
            'Normal: Below 120/80 mmHg',
            'Measure after 5 minutes of rest, sitting quietly'
          ],
          icon: Gauge
        }
      },
      {
        name: 'cholesterol',
        label: 'Serum Cholesterol',
        type: 'number',
        placeholder: 'Enter total cholesterol level',
        unit: 'mg/dL',
        normalRange: '125-200',
        guide: {
          title: 'Understanding Cholesterol',
          description: 'Cholesterol is a fatty substance in your blood',
          examples: [
            'Desirable: Less than 200 mg/dL',
            'Borderline: 200-239 mg/dL',
            'High: 240 mg/dL and above',
            'Get tested after 9-12 hours of fasting'
          ],
          icon: Activity
        }
      },
      {
        name: 'fastingBS',
        label: 'Fasting Blood Sugar',
        type: 'select',
        options: ['Below 120 mg/dL (Normal)', '120 mg/dL or above (High)'],
        guide: {
          title: 'Fasting Blood Sugar',
          description: 'Blood sugar level after not eating for 8-12 hours',
          examples: [
            'Normal: Below 100 mg/dL',
            'Prediabetes: 100-125 mg/dL',
            'Diabetes: 126 mg/dL or above',
            'Test after 8-12 hours of fasting'
          ],
          icon: Thermometer
        }
      },
      {
        name: 'maxHR',
        label: 'Maximum Heart Rate',
        type: 'number',
        placeholder: 'Enter maximum heart rate achieved during exercise',
        unit: 'bpm',
        normalRange: '150-220',
        guide: {
          title: 'Maximum Heart Rate',
          description: 'Highest heart rate you can achieve during intense exercise',
          examples: [
            'Estimated: 220 minus your age',
            'Example: Age 50 = 170 bpm maximum',
            'Measured during stress test or intense exercise',
            'Varies by fitness level and age'
          ],
          icon: Zap
        }
      },
      {
        name: 'exerciseAngina',
        label: 'Exercise Induced Angina',
        type: 'select',
        options: ['Yes - Chest pain during exercise', 'No - No chest pain during exercise'],
        guide: {
          title: 'Exercise Induced Angina',
          description: 'Chest pain that occurs during physical activity',
          examples: [
            'Pain during walking, climbing stairs, or exercise',
            'Pain that goes away with rest',
            'May feel like pressure, squeezing, or burning',
            'Can spread to arms, neck, jaw, or back'
          ],
          icon: Activity
        }
      }
    ]
  },
  liver: {
    name: 'Liver Disease Assessment',
    icon: Liver,
    color: 'from-orange-500 to-yellow-500',
    description: 'Liver function evaluation including bilirubin levels, liver enzymes, and protein analysis.',
    symptoms: [
      'Yellowing of skin and eyes (jaundice)',
      'Abdominal pain and swelling',
      'Dark urine',
      'Pale stools',
      'Chronic fatigue'
    ],
    riskFactors: [
      'Excessive alcohol consumption',
      'Viral hepatitis',
      'Obesity',
      'Diabetes',
      'Family history of liver disease'
    ],
    fields: [
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'Enter your age in years',
        unit: 'years'
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: ['Male', 'Female']
      },
      {
        name: 'totalBilirubin',
        label: 'Total Bilirubin',
        type: 'number',
        placeholder: 'Enter total bilirubin level',
        unit: 'mg/dL',
        normalRange: '0.3-1.2',
        guide: {
          title: 'Understanding Bilirubin',
          description: 'Bilirubin is a waste product processed by your liver',
          examples: [
            'Normal: 0.3-1.2 mg/dL',
            'High levels may indicate liver problems',
            'Can cause yellowing of skin and eyes (jaundice)',
            'Measured from blood test'
          ],
          icon: Liver
        }
      },
      {
        name: 'directBilirubin',
        label: 'Direct Bilirubin',
        type: 'number',
        placeholder: 'Enter direct bilirubin level',
        unit: 'mg/dL',
        normalRange: '0.0-0.3'
      },
      {
        name: 'alkalinePhosphatase',
        label: 'Alkaline Phosphatase',
        type: 'number',
        placeholder: 'Enter alkaline phosphatase level',
        unit: 'IU/L',
        normalRange: '44-147'
      },
      {
        name: 'alamineAminotransferase',
        label: 'Alamine Aminotransferase (ALT)',
        type: 'number',
        placeholder: 'Enter ALT level',
        unit: 'IU/L',
        normalRange: '7-55'
      },
      {
        name: 'aspartateAminotransferase',
        label: 'Aspartate Aminotransferase (AST)',
        type: 'number',
        placeholder: 'Enter AST level',
        unit: 'IU/L',
        normalRange: '8-48'
      },
      {
        name: 'totalProteins',
        label: 'Total Proteins',
        type: 'number',
        placeholder: 'Enter total protein level',
        unit: 'g/dL',
        normalRange: '6.0-8.3'
      }
    ]
  },
  kidney: {
    name: 'Kidney Disease Assessment',
    icon: Kidney,
    color: 'from-blue-500 to-cyan-500',
    description: 'Kidney function evaluation including blood pressure, urine analysis, and kidney function tests.',
    symptoms: [
      'Changes in urination patterns',
      'Swelling in legs, ankles, or feet',
      'Fatigue and weakness',
      'Nausea and vomiting',
      'High blood pressure'
    ],
    riskFactors: [
      'Diabetes',
      'High blood pressure',
      'Heart disease',
      'Family history of kidney disease',
      'Age over 60'
    ],
    fields: [
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'Enter your age in years',
        unit: 'years'
      },
      {
        name: 'bloodPressure',
        label: 'Blood Pressure',
        type: 'number',
        placeholder: 'Enter systolic blood pressure',
        unit: 'mmHg',
        normalRange: '90-140'
      },
      {
        name: 'specificGravity',
        label: 'Specific Gravity',
        type: 'number',
        placeholder: 'Enter specific gravity (1.005-1.030)',
        normalRange: '1.005-1.030'
      },
      {
        name: 'albumin',
        label: 'Albumin in Urine',
        type: 'select',
        options: ['0 (Normal)', '1 (Trace)', '2 (Small)', '3 (Moderate)', '4 (Large)', '5 (Very Large)'],
        guide: {
          title: 'Albumin in Urine',
          description: 'Albumin is a protein that shouldn\'t normally be in urine',
          examples: [
            '0: Normal - no albumin detected',
            '1-2: Small amounts, may need monitoring',
            '3-5: Larger amounts, indicates kidney damage',
            'Higher numbers = more protein loss'
          ],
          icon: Kidney
        }
      },
      {
        name: 'sugar',
        label: 'Sugar in Urine',
        type: 'select',
        options: ['0 (Normal)', '1 (Trace)', '2 (Small)', '3 (Moderate)', '4 (Large)', '5 (Very Large)']
      },
      {
        name: 'redBloodCells',
        label: 'Red Blood Cells in Urine',
        type: 'select',
        options: ['Normal', 'Abnormal'],
        guide: {
          title: 'Red Blood Cells in Urine',
          description: 'Red blood cells in urine may indicate kidney problems',
          examples: [
            'Normal: No red blood cells visible',
            'Abnormal: Red blood cells present',
            'May indicate infection, kidney stones, or damage',
            'Can make urine appear pink or red'
          ],
          icon: Kidney
        }
      },
      {
        name: 'pusCell',
        label: 'Pus Cells in Urine',
        type: 'select',
        options: ['Normal', 'Abnormal']
      },
      {
        name: 'bloodUrea',
        label: 'Blood Urea',
        type: 'number',
        placeholder: 'Enter blood urea level',
        unit: 'mg/dL',
        normalRange: '7-20'
      }
    ]
  },
  diabetes: {
    name: 'Diabetes Assessment',
    icon: Droplets,
    color: 'from-green-500 to-emerald-500',
    description: 'Diabetes risk evaluation including glucose levels, insulin resistance, and metabolic factors.',
    symptoms: [
      'Increased thirst and frequent urination',
      'Extreme hunger',
      'Unexplained weight loss',
      'Fatigue and irritability',
      'Blurred vision'
    ],
    riskFactors: [
      'Family history of diabetes',
      'Obesity',
      'Physical inactivity',
      'Age over 45',
      'Gestational diabetes history'
    ],
    fields: [
      {
        name: 'pregnancies',
        label: 'Number of Pregnancies',
        type: 'number',
        placeholder: 'Enter number of pregnancies (0 for men)',
        unit: 'count',
        normalRange: '0-10'
      },
      {
        name: 'glucose',
        label: 'Glucose Level',
        type: 'number',
        placeholder: 'Enter fasting glucose level',
        unit: 'mg/dL',
        normalRange: '70-100',
        guide: {
          title: 'Understanding Glucose Levels',
          description: 'Glucose is the main sugar in your blood',
          examples: [
            'Normal: 70-100 mg/dL (fasting)',
            'Prediabetes: 100-125 mg/dL',
            'Diabetes: 126 mg/dL or above',
            'Test after 8-12 hours of fasting'
          ],
          icon: Droplets
        }
      },
      {
        name: 'bloodPressure',
        label: 'Blood Pressure',
        type: 'number',
        placeholder: 'Enter systolic blood pressure',
        unit: 'mmHg',
        normalRange: '90-140'
      },
      {
        name: 'skinThickness',
        label: 'Skin Thickness',
        type: 'number',
        placeholder: 'Enter skin thickness measurement',
        unit: 'mm',
        normalRange: '10-50'
      },
      {
        name: 'insulin',
        label: 'Insulin Level',
        type: 'number',
        placeholder: 'Enter insulin level',
        unit: 'mu U/ml',
        normalRange: '3-25'
      },
      {
        name: 'bmi',
        label: 'Body Mass Index (BMI)',
        type: 'number',
        placeholder: 'Enter your BMI',
        unit: 'kg/m²',
        normalRange: '18.5-24.9',
        guide: {
          title: 'Calculating BMI',
          description: 'BMI is a measure of body fat based on height and weight',
          examples: [
            'Formula: Weight (kg) ÷ Height (m)²',
            'Underweight: Below 18.5',
            'Normal: 18.5-24.9',
            'Overweight: 25-29.9',
            'Obese: 30 or above'
          ],
          icon: Activity
        }
      },
      {
        name: 'diabetesPedigree',
        label: 'Diabetes Pedigree Function',
        type: 'number',
        placeholder: 'Enter diabetes pedigree function',
        unit: 'ratio',
        normalRange: '0.0-2.5'
      },
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'Enter your age in years',
        unit: 'years'
      }
    ]
  }
};

const ComprehensiveDiagnosisPage: React.FC = () => {
  const { diseaseId } = useParams<{ diseaseId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState<string | null>(null);
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

  const disease = diseaseConfigs[diseaseId as keyof typeof diseaseConfigs];

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate AI prediction with more sophisticated logic
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Enhanced mock prediction result
    const risks = ['Low', 'Moderate', 'High'];
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%
    
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

    // Mock doctor recommendations based on disease type
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
    setIsLoading(false);
  };

  const handleConsultSpecialist = () => {
    navigate(`/doctors?category=${diseaseId}`);
  };

  const IconComponent = disease.icon;
  const photoUrl = diseasePhotos[(diseaseId as string) || 'heart'] || diseasePhotos.heart;

  const renderField = (field: DiseaseConfig['fields'][0], index: number) => {
    const isCompleted = formData[field.name];
    
    return (
      <div key={index} className={`p-6 rounded-lg border-2 transition-all ${
        isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              {field.label}
              {field.unit && <span className="text-sm text-gray-500 ml-2">({field.unit})</span>}
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            {field.normalRange && (
              <p className="text-sm text-blue-600 mb-2">
                Normal range: {field.normalRange}
              </p>
            )}
          </div>
          
          {field.guide && (
            <button
              type="button"
              onClick={() => setShowGuide(showGuide === field.name ? null : field.name)}
              className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Get help understanding this field"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>

        {field.guide && showGuide === field.name && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <field.guide.icon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">{field.guide.title}</h4>
                <p className="text-blue-800 mb-3">{field.guide.description}</p>
                <ul className="space-y-1">
                  {field.guide.examples.map((example: string, idx: number) => (
                    <li key={idx} className="text-sm text-blue-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        )}

        {isCompleted && (
          <div className="flex items-center mt-3 text-green-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">Completed</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Enhanced Header */}
          <div className={`bg-gradient-to-r ${disease.color} px-8 py-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full mr-6">
                  <img src={photoUrl} alt={`${disease.name} photo`} className="h-16 w-16 rounded-full object-cover border-2 border-white/60" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">{disease.name}</h1>
                  <p className="text-white/90 mt-2 text-lg">{disease.description}</p>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="text-sm opacity-75">Powered by</div>
                <div className="font-bold text-lg">MediCare AI</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!result ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Disease Information */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="h-6 w-6 text-blue-600 mr-2" />
                    About {disease.name}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Common Symptoms</h4>
                      <ul className="space-y-1">
                        {disease.symptoms.map((symptom, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Risk Factors</h4>
                      <ul className="space-y-1">
                        {disease.riskFactors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Complete the assessment</span>
                    <span>{Object.keys(formData).length}/{disease.fields.length} fields completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${disease.color} h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${(Object.keys(formData).length / disease.fields.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {disease.fields.map((field, index) => renderField(field, index))}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading || Object.keys(formData).length < disease.fields.length}
                    className={`w-full py-4 px-6 bg-gradient-to-r ${disease.color} text-white rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Analyzing with AI...
                      </div>
                    ) : (
                      'Get AI Diagnosis'
                    )}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Your data is encrypted and secure. Results in 30 seconds.
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Enhanced Results */}
                <div className={`p-8 rounded-xl ${result.risk === 'Low' ? 'bg-green-50 border-2 border-green-200' : result.risk === 'Moderate' ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-red-50 border-2 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      {result.risk === 'Low' ? (
                        <CheckCircle className="h-12 w-12 text-green-600 mr-4" />
                      ) : (
                        <AlertCircle className={`h-12 w-12 ${result.risk === 'Moderate' ? 'text-yellow-600' : 'text-red-600'} mr-4`} />
                      )}
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Risk Level: <span className={result.risk === 'Low' ? 'text-green-600' : result.risk === 'Moderate' ? 'text-yellow-600' : 'text-red-600'}>{result.risk}</span>
                        </h2>
                        <p className="text-gray-600 text-lg">AI Confidence: {result.confidence}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Analyzed by</div>
                      <div className="font-bold text-blue-600">MediCare AI</div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
                    Personalized Recommendations
                  </h3>
                  <ul className="space-y-4">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
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

                {/* Enhanced Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleConsultSpecialist}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold text-center hover:from-blue-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Consult Recommended Specialists
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <img src={photoUrl} alt={`${disease.name} photo`} className="h-5 w-5 mr-2 rounded-full object-cover" />
                    Take Another Assessment
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> This AI assessment is for informational purposes only and should not replace professional medical advice. 
                    Please consult with a qualified healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDiagnosisPage;





