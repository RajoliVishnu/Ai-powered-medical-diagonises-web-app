import React, { useState } from 'react';
import { Download, FileText, Calendar, User, Heart } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const captureFormScreenshot = async () => {
    try {
      // Try multiple selectors to find the results container
      const selectors = [
        '[data-testid="diagnosis-results"]',
        '.diagnosis-results',
        '.results-container',
        '.medical-card',
        '.space-y-8',
        '.space-y-6'
      ];
      
      let resultsContainer = null;
      
      // Try each selector until we find a valid container
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        console.log(`Checking selector: ${selector}, found:`, element);
        if (element && (element as HTMLElement).offsetHeight > 0 && (element as HTMLElement).offsetWidth > 0) {
          resultsContainer = element;
          console.log(`Found results container with selector: ${selector}`, element);
          break;
        }
      }
      
      if (resultsContainer) {
        console.log('Capturing screenshot of results container...');
        
        // Wait for any animations or transitions to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const canvas = await html2canvas(resultsContainer as HTMLElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          width: resultsContainer.scrollWidth,
          height: resultsContainer.scrollHeight,
          windowWidth: resultsContainer.scrollWidth,
          windowHeight: resultsContainer.scrollHeight
        });
        
        console.log('Screenshot captured successfully');
        return canvas.toDataURL('image/png');
      } else {
        console.log('No results container found for screenshot capture');
        return null;
      }
    } catch (error) {
      console.error('Failed to capture form screenshot:', error);
      return null;
    }
  };

  const captureAlternativeScreenshot = async () => {
    try {
      // Try to capture the main content area or results section
      const mainContent = document.querySelector('main, .main-content, .container, .max-w-4xl');
      if (mainContent) {
        console.log('Capturing alternative screenshot from main content...');
        
        const canvas = await html2canvas(mainContent as HTMLElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0
        });
        
        return canvas.toDataURL('image/png');
      }
      return null;
    } catch (error) {
      console.error('Failed to capture alternative screenshot:', error);
      return null;
    }
  };

  const testScreenshotCapture = async () => {
    console.log('Testing screenshot capture...');
    const screenshot = await captureFormScreenshot();
    if (screenshot) {
      console.log('Screenshot captured successfully!');
      // Create a test image to verify the screenshot
      const testImg = document.createElement('img');
      testImg.src = screenshot;
      testImg.style.position = 'fixed';
      testImg.style.top = '10px';
      testImg.style.right = '10px';
      testImg.style.width = '300px';
      testImg.style.border = '2px solid red';
      testImg.style.zIndex = '9999';
      document.body.appendChild(testImg);
      
      // Remove after 5 seconds
      setTimeout(() => {
        document.body.removeChild(testImg);
      }, 5000);
    } else {
      console.log('Screenshot capture failed');
      alert('Screenshot capture failed. Check console for details.');
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Create a comprehensive report container
      const reportContainer = document.createElement('div');
      reportContainer.style.position = 'absolute';
      reportContainer.style.left = '-9999px';
      reportContainer.style.top = '0';
      reportContainer.style.width = '800px';
      reportContainer.style.backgroundColor = 'white';
      reportContainer.style.padding = '40px';
      reportContainer.style.fontFamily = 'Arial, sans-serif';
      reportContainer.style.color = '#333';
      
      // Try to capture form screenshot first
      const formScreenshot = await captureFormScreenshot();
      
      // If no screenshot captured, try alternative method
      let alternativeScreenshot = null;
      if (!formScreenshot) {
        console.log('Trying alternative screenshot capture method...');
        alternativeScreenshot = await captureAlternativeScreenshot();
      }
      
      // Generate comprehensive HTML content
      reportContainer.innerHTML = generateComprehensiveReportHTML(reportData, formScreenshot || alternativeScreenshot);
      
      document.body.appendChild(reportContainer);
      
      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture screenshot with improved settings
      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: reportContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: reportContainer.scrollHeight
      });
      
      // Remove temporary container
      document.body.removeChild(reportContainer);
      
      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if content is longer
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      const fileName = `${reportData.diseaseType.replace(/\s+/g, '-').toLowerCase()}-assessment-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      onGenerate();
    } catch (error) {
      console.error('Failed to generate PDF report:', error);
      alert(`Failed to generate PDF report: ${error.message}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateComprehensiveReportHTML = (data: ReportData, formScreenshot?: string | null) => {
    const currentDate = new Date().toLocaleDateString();
    
    return `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #059669; padding-bottom: 20px;">
          <h1 style="color: #059669; margin: 0; font-size: 32px; font-weight: bold;">MediCare AI</h1>
          <h2 style="color: #666; margin: 10px 0; font-size: 24px;">Medical Assessment Report</h2>
          <p style="color: #888; margin: 5px 0; font-size: 16px;">Generated on ${currentDate}</p>
        </div>

        <!-- Patient Information -->
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 30px; border-left: 5px solid #059669;">
          <h3 style="color: #059669; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">Patient Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Name:</strong> ${data.patientName}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Assessment Type:</strong> ${data.diseaseType}</p>
            </div>
            <div>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Report Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Assessment ID:</strong> ${Date.now().toString().slice(-6)}</p>
            </div>
          </div>
        </div>

        <!-- Assessment Results -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #059669; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">Assessment Results</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 18px;">Risk Level</h4>
              <p style="color: #856404; margin: 0; font-size: 24px; font-weight: bold;">${data.riskLevel.toUpperCase()}</p>
            </div>
            <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8;">
              <h4 style="color: #0c5460; margin: 0 0 10px 0; font-size: 18px;">Confidence Score</h4>
              <p style="color: #0c5460; margin: 0; font-size: 24px; font-weight: bold;">${data.confidence}%</p>
            </div>
          </div>
        </div>

        <!-- Form Screenshot (if available) -->
        ${formScreenshot ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #059669; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">Assessment Results Screenshot</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <img src="${formScreenshot}" alt="Assessment Results" style="max-width: 100%; height: auto; border: 1px solid #dee2e6; border-radius: 4px;" />
            </div>
          </div>
        ` : ''}

        <!-- Form Data -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #059669; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">Assessment Parameters</h3>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #e9ecef;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: bold;">Parameter</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: bold;">Value</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(data.formData).map(([key, value]) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: 500;">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${value}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recommendations -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #059669; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">Recommendations</h3>
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
            <ul style="margin: 0; padding-left: 20px;">
              ${data.recommendations.map(rec => `
                <li style="margin: 8px 0; font-size: 16px; color: #155724;">${rec}</li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Important Notes -->
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 30px;">
          <h4 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">Important Medical Disclaimer</h4>
          <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
            This assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. 
            Always consult with qualified healthcare providers for medical concerns. For medical emergencies, contact emergency services immediately.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e9ecef; color: #6c757d; font-size: 14px;">
          <p style="margin: 5px 0;">This report was generated by MediCare AI Medical Diagnosis Platform</p>
          <p style="margin: 5px 0;">© 2024 MediCare AI. All rights reserved.</p>
          <p style="margin: 5px 0;">Report ID: ${Date.now().toString()}</p>
        </div>
      </div>
    `;
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
              Generate PDF Report
            </>
          )}
        </button>
        
        {/* Test Screenshot Button - for debugging */}
        <button
          onClick={testScreenshotCapture}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 ml-2"
        >
          Test Screenshot
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
        <h4 className="font-medium text-gray-900 mb-2">Comprehensive PDF Report includes:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Complete patient information and assessment details</li>
          <li>• All form parameters with entered values</li>
          <li>• AI risk assessment with confidence score</li>
          <li>• Personalized health recommendations</li>
          <li>• Professional medical formatting</li>
          <li>• Medical disclaimer and safety information</li>
          <li>• High-quality PDF with complete screenshot capture</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportGenerator;
