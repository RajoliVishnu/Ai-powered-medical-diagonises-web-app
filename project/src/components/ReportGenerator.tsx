import React, { useState } from 'react';
import { Download, FileText, Calendar, User, Heart } from 'lucide-react';

interface ReportData {
  patientName: string;
  date: string;
  diseaseType: string;
  riskLevel: string;
  confidence: number;
  recommendations: string[];
  formData: Record<string, string>;
}

interface ReportGeneratorProps {
  reportData: ReportData;
  onGenerate: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ reportData, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Call backend API to generate PDF
      // 2. Use libraries like jsPDF or Puppeteer
      // 3. Include patient data, results, and recommendations
      
      const reportContent = {
        title: `${reportData.diseaseType} Assessment Report`,
        patient: reportData.patientName,
        date: reportData.date,
        riskLevel: reportData.riskLevel,
        confidence: reportData.confidence,
        recommendations: reportData.recommendations,
        parameters: reportData.formData
      };
      
      console.log('PDF Report Generated:', reportContent);
      
      // Simulate download
      const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportData.diseaseType}_Assessment_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onGenerate();
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 text-emerald-600 mr-2" />
          Generate Medical Report
        </h3>
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>Patient: {reportData.patientName}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Date: {new Date(reportData.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Heart className="h-4 w-4 mr-2" />
          <span>Assessment: {reportData.diseaseType}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
          <span>Risk: {reportData.riskLevel} ({reportData.confidence}% confidence)</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Report will include:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Patient information and assessment date</li>
          <li>• Complete parameter analysis</li>
          <li>• AI risk assessment with confidence score</li>
          <li>• Personalized health recommendations</li>
          <li>• Medical disclaimer and next steps</li>
          <li>• Professional formatting for healthcare providers</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportGenerator;
