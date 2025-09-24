# AI-Powered Medical Diagnosis Web App

A comprehensive healthcare platform designed to help patients understand and manage their medical conditions with guided, patient-friendly interfaces. This application is specifically designed for remote areas where patients may not have extensive medical knowledge.

## 🌟 Key Features

### 🏥 **Guided Disease Assessment**
- **Patient-Friendly Forms**: Step-by-step guided forms with explanations for medical terms
- **Interactive Help**: Click help icons to understand medical terminology
- **Progress Tracking**: Visual progress indicators for form completion
- **Comprehensive Disease Coverage**:
  - Heart Disease Assessment
  - Liver Disease Assessment  
  - Kidney Disease Assessment
  - Diabetes Assessment

### 📋 **Enhanced Medical Records Management**
- **Guided Record Types**: Clear explanations of different medical record types
- **Search & Filter**: Easy search and filtering capabilities
- **Detailed Information**: Track symptoms, medications, and follow-up instructions
- **Record Categories**:
  - Medical Consultations
  - Prescriptions
  - Laboratory Results
  - Vaccinations
  - Surgical Procedures
  - Imaging Studies
  - Emergency Visits

### 💊 **Smart Prescription Management**
- **Medication Guidance**: Detailed explanations of dosage, frequency, and side effects
- **Drug Interaction Warnings**: Clear warnings about potential interactions
- **Refill Management**: Easy prescription refill requests
- **Category Organization**: Organize medications by type and purpose
- **Safety Features**: Comprehensive warnings and side effect tracking
- **Disease-Based Linking**: Connect prescriptions to specific diagnosed conditions

### 🔗 **Disease-Based Medical Records & Prescriptions**
- **Condition-Specific Organization**: View medical records and prescriptions organized by diagnosed diseases
- **AI Diagnosis Integration**: Automatic linking of AI diagnosis results to medical records
- **Cross-Reference System**: Easily find prescriptions related to specific conditions
- **Comprehensive Disease Information**: Detailed information about each disease including symptoms and lifestyle recommendations
- **Smart Filtering**: Filter records and prescriptions by disease type, status, and search terms

### 🎯 **Patient Education Features**

#### **Understanding Medical Terms**
- **Chest Pain Types**: Clear explanations of different chest pain patterns
- **Blood Pressure**: How to measure and understand readings
- **Cholesterol Levels**: What the numbers mean and normal ranges
- **Blood Sugar**: Understanding glucose levels and diabetes indicators
- **Heart Rate**: Maximum heart rate calculations and exercise guidelines

#### **Interactive Help System**
- **Contextual Help**: Click help icons for field-specific guidance
- **Visual Examples**: Icons and visual aids for better understanding
- **Step-by-Step Instructions**: Detailed explanations for complex medical concepts
- **Normal Range Indicators**: Clear indication of healthy vs. concerning values

### 🔒 **Security & Privacy**
- **Data Encryption**: All patient data is encrypted and secure
- **HIPAA Compliance**: Built with healthcare privacy standards in mind
- **Secure Authentication**: Protected routes and user authentication
- **Privacy Controls**: Patient-controlled data sharing

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ai-powered-medical-diagonises-web-app/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project directory:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 **User Interface Features**

### **Responsive Design**
- Mobile-friendly interface for remote area accessibility
- Tablet and desktop optimized layouts
- Touch-friendly controls for mobile devices

### **Accessibility**
- Screen reader compatible
- Keyboard navigation support
- High contrast mode support
- Clear, readable typography

### **Visual Design**
- Modern, clean interface
- Color-coded risk levels (Green/Yellow/Red)
- Intuitive icons and visual cues
- Progress indicators and completion tracking

## 🏗️ **Technical Architecture**

### **Frontend Technologies**
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful, customizable icons

### **State Management**
- **Zustand**: Lightweight state management
- **React Context**: Authentication and payment context
- **Local Storage**: Persistent user preferences

### **Data Management**
- **LocalStorage**: Client-side data persistence for medical records and prescriptions
- **Disease-Prescription Linking**: Intelligent connection between diagnosed conditions and related medications
- **AI Diagnosis Integration**: Automatic medical record creation from AI assessment results

### **Payment Integration**
- **Stripe**: Secure payment processing
- **Subscription Management**: Recurring billing support
- **Transaction History**: Complete payment tracking

## 📊 **Disease Assessment Features**

### **Heart Disease Assessment**
- **Chest Pain Analysis**: Guided identification of pain types
- **Blood Pressure Monitoring**: Clear measurement instructions
- **Cholesterol Tracking**: Understanding lipid profiles
- **Exercise Capacity**: Maximum heart rate assessment
- **Risk Factor Analysis**: Comprehensive risk evaluation

### **Liver Disease Assessment**
- **Bilirubin Levels**: Understanding liver function markers
- **Enzyme Analysis**: ALT, AST, and alkaline phosphatase tracking
- **Protein Levels**: Total protein monitoring
- **Symptom Tracking**: Jaundice and abdominal pain assessment

### **Kidney Disease Assessment**
- **Blood Urea Monitoring**: Kidney function indicators
- **Urine Analysis**: Protein, sugar, and blood cell tracking
- **Blood Pressure**: Hypertension monitoring
- **Specific Gravity**: Urine concentration analysis

### **Diabetes Assessment**
- **Glucose Monitoring**: Fasting and post-meal tracking
- **BMI Calculation**: Body mass index assessment
- **Insulin Levels**: Insulin resistance evaluation
- **Family History**: Genetic risk factor analysis

## 🔧 **Development Features**

### **Code Quality**
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and better IDE support
- **Prettier**: Consistent code formatting
- **React Hooks**: Modern React patterns

### **Build Tools**
- **Vite**: Fast development and building
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📈 **Future Enhancements**

### **Planned Features**
- **AI Symptom Analysis**: Machine learning-based symptom assessment
- **Telemedicine Integration**: Video consultation capabilities
- **Lab Result Integration**: Direct lab result imports
- **Medication Reminders**: Smart medication scheduling
- **Health Goal Tracking**: Personalized health objectives
- **Family Health History**: Comprehensive family medical tracking

### **Advanced Analytics**
- **Health Trend Analysis**: Long-term health pattern recognition
- **Risk Prediction**: AI-powered risk assessment
- **Treatment Effectiveness**: Outcome tracking and analysis
- **Preventive Recommendations**: Proactive health suggestions

## 🤝 **Contributing**

We welcome contributions to improve the application! Please read our contributing guidelines and submit pull requests for any enhancements.

### **Development Guidelines**
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain accessibility standards
- Write comprehensive tests
- Document new features

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 **Acknowledgments**

- Medical professionals for domain expertise
- Open source community for tools and libraries
- Patients and caregivers for feedback and testing
- Healthcare organizations for guidance and support

---

**Note**: This application is designed for educational and informational purposes. It should not replace professional medical advice. Always consult with qualified healthcare providers for proper diagnosis and treatment.
