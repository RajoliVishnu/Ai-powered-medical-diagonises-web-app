import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, FileText, Calendar, User, Heart } from 'lucide-react';

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
  diagnosedDisease?: string;
  diseaseRisk?: string;
  confidence?: number;
}

interface PDFExportProps {
  records: MedicalRecord[];
  patientName?: string;
  patientEmail?: string;
}

const PDFExport: React.FC<PDFExportProps> = ({ 
  records, 
  patientName = 'Patient', 
  patientEmail = 'patient@example.com' 
}) => {
  const generatePDF = async () => {
    try {
      // Create a temporary container for the PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '800px';
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Generate HTML content
      pdfContainer.innerHTML = generatePDFContent(records, patientName, patientEmail);
      
      document.body.appendChild(pdfContainer);
      
      // Convert to canvas
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary container
      document.body.removeChild(pdfContainer);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      const fileName = `medical-history-${patientName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const generatePDFContent = (records: MedicalRecord[], patientName: string, patientEmail: string) => {
    const currentDate = new Date().toLocaleDateString();
    
    return `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px;">
          <h1 style="color: #059669; margin: 0; font-size: 28px;">MediCare AI</h1>
          <h2 style="color: #666; margin: 10px 0; font-size: 20px;">Medical History Report</h2>
          <p style="color: #888; margin: 5px 0; font-size: 14px;">Generated on ${currentDate}</p>
        </div>

        <!-- Patient Information -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #059669; margin: 0 0 15px 0; font-size: 18px;">Patient Information</h3>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${patientName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${patientEmail}</p>
            </div>
            <div>
              <p style="margin: 5px 0;"><strong>Report Date:</strong> ${currentDate}</p>
              <p style="margin: 5px 0;"><strong>Total Records:</strong> ${records.length}</p>
            </div>
          </div>
        </div>

        <!-- Medical Records -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #059669; margin: 0 0 20px 0; font-size: 18px;">Medical Records</h3>
          ${records.length === 0 ? 
            '<p style="color: #666; font-style: italic;">No medical records found.</p>' :
            records.map(record => `
              <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px; background-color: #fafafa;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                  <h4 style="color: #333; margin: 0; font-size: 16px;">${record.title}</h4>
                  <span style="background-color: ${getStatusColor(record.status)}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                    ${record.status.toUpperCase()}
                  </span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
                  <p style="margin: 5px 0; color: #666;"><strong>Doctor:</strong> ${record.doctor}</p>
                  ${record.diagnosedDisease ? `<p style="margin: 5px 0; color: #666;"><strong>Disease:</strong> ${record.diagnosedDisease}</p>` : ''}
                  ${record.diseaseRisk ? `<p style="margin: 5px 0; color: #666;"><strong>Risk Level:</strong> ${record.diseaseRisk}</p>` : ''}
                  ${record.confidence ? `<p style="margin: 5px 0; color: #666;"><strong>Confidence:</strong> ${record.confidence}%</p>` : ''}
                </div>
                
                <div style="margin-bottom: 15px;">
                  <p style="margin: 5px 0; color: #333;"><strong>Description:</strong></p>
                  <p style="margin: 5px 0; color: #666; line-height: 1.5;">${record.description}</p>
                </div>
                
                ${record.symptoms.length > 0 ? `
                  <div style="margin-bottom: 15px;">
                    <p style="margin: 5px 0; color: #333;"><strong>Symptoms:</strong></p>
                    <ul style="margin: 5px 0; padding-left: 20px; color: #666;">
                      ${record.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                
                ${record.medications.length > 0 ? `
                  <div style="margin-bottom: 15px;">
                    <p style="margin: 5px 0; color: #333;"><strong>Medications:</strong></p>
                    <ul style="margin: 5px 0; padding-left: 20px; color: #666;">
                      ${record.medications.map(medication => `<li>${medication}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                
                ${record.followUp ? `
                  <div style="margin-bottom: 15px;">
                    <p style="margin: 5px 0; color: #333;"><strong>Follow-up:</strong></p>
                    <p style="margin: 5px 0; color: #666; line-height: 1.5;">${record.followUp}</p>
                  </div>
                ` : ''}
              </div>
            `).join('')
          }
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
          <p style="margin: 5px 0;">This report was generated by MediCare AI</p>
          <p style="margin: 5px 0;">For medical emergencies, please contact your local emergency services</p>
          <p style="margin: 5px 0;">© 2024 MediCare AI. All rights reserved.</p>
        </div>
      </div>
    `;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'pending': return '#d97706';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={generatePDF}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
      >
        <Download className="h-4 w-4" />
        <span>Export PDF</span>
      </button>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <FileText className="h-4 w-4" />
          <span>{records.length} records</span>
        </div>
      </div>
    </div>
  );
};

export default PDFExport;

