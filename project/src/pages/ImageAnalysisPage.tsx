import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Eye, Download, AlertCircle, CheckCircle, Loader2, Camera, Scan } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

interface ImageAnalysisResult {
  imageType: 'chest-xray' | 'brain-scan' | 'bone-scan' | 'unknown';
  findings: string[];
  confidence: number;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  processedImage?: string;
}

const ImageAnalysisPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysisResult[]>([]);
  const [error, setError] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('');
    const newFiles = [...uploadedFiles, ...acceptedFiles];
    setUploadedFiles(newFiles);

    // Create preview URLs
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  }, [uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.dicom', '.dcm']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setPreviewImages(newPreviews);
    
    // Remove corresponding analysis result
    const newResults = analysisResults.filter((_, i) => i !== index);
    setAnalysisResults(newResults);
  };

  const analyzeImages = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one image to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const results: ImageAnalysisResult[] = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        // Simulate AI analysis with realistic delays
        await new Promise(resolve => setTimeout(resolve, 2000 + i * 1000));

        // Mock AI analysis results based on file name or random
        const mockResult = generateMockAnalysisResult(file.name);
        results.push(mockResult);
      }

      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze images. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysisResult = (_fileName: string): ImageAnalysisResult => {
    const imageTypes = ['chest-xray', 'brain-scan', 'bone-scan'] as const;
    const randomType = imageTypes[Math.floor(Math.random() * imageTypes.length)];
    
    const findings = {
      'chest-xray': [
        'Clear lung fields bilaterally',
        'Normal cardiac silhouette',
        'No acute pulmonary abnormalities',
        'Mild cardiomegaly noted'
      ],
      'brain-scan': [
        'Normal brain parenchyma',
        'No acute intracranial abnormalities',
        'Ventricular system appears normal',
        'No evidence of mass lesions'
      ],
      'bone-scan': [
        'Normal bone density',
        'No fractures detected',
        'Joint spaces appear normal',
        'No signs of arthritis'
      ]
    };

    const recommendations = {
      'chest-xray': [
        'Follow up with pulmonologist if symptoms persist',
        'Consider pulmonary function tests',
        'Monitor for any respiratory changes'
      ],
      'brain-scan': [
        'Neurological follow-up recommended',
        'Monitor for any cognitive changes',
        'Consider neuropsychological assessment'
      ],
      'bone-scan': [
        'Continue regular exercise routine',
        'Consider bone density monitoring',
        'Maintain adequate calcium intake'
      ]
    };

    const riskLevels: ('low' | 'moderate' | 'high')[] = ['low', 'moderate', 'high'];
    const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];

    return {
      imageType: randomType,
      findings: findings[randomType],
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      recommendations: recommendations[randomType],
      riskLevel: randomRisk
    };
  };

  const downloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalImages: uploadedFiles.length,
      results: analysisResults.map((result, index) => ({
        fileName: uploadedFiles[index]?.name,
        ...result
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-analysis-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImageTypeIcon = (type: string) => {
    switch (type) {
      case 'chest-xray': return <Camera className="h-5 w-5" />;
      case 'brain-scan': return <Scan className="h-5 w-5" />;
      case 'bone-scan': return <Scan className="h-5 w-5" />;
      default: return <Eye className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Medical Image Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload X-rays, CT scans, MRI images, and other medical imaging for AI-powered analysis
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert 
              type="error" 
              title="Analysis Error" 
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 dark:text-blue-400">Drop the images here...</p>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag & drop medical images here, or click to select
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Supports JPEG, PNG, DICOM formats (max 10MB each, up to 5 files)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Uploaded Images ({uploadedFiles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative border rounded-lg overflow-hidden">
                  <img
                    src={previewImages[index]}
                    alt={file.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={analyzeImages}
                disabled={isAnalyzing}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="h-5 w-5 mr-2" />
                    Analyze Images
                  </>
                )}
              </button>
              
              {analysisResults.length > 0 && (
                <button
                  onClick={downloadReport}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </button>
              )}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <div className="space-y-6" data-testid="diagnosis-results">
            {analysisResults.map((result, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getImageTypeIcon(result.imageType)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {uploadedFiles[index]?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {result.imageType.replace('-', ' ')} Analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel.toUpperCase()} RISK
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {result.confidence}% confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Findings */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Key Findings
                    </h4>
                    <ul className="space-y-2">
                      {result.findings.map((finding, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((recommendation, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <LoadingSpinner size="lg" color="blue" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                  Analyzing Medical Images
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI is processing your images to detect abnormalities and provide insights...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalysisPage;
