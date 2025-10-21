// React import not needed with the new JSX transform
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { DiagnosisPage } from './pages/DiagnosisPage';
import ComprehensiveDiagnosisPage from './pages/ComprehensiveDiagnosisPage';
import DoctorsPage from './pages/DoctorsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SubscriptionPage from './pages/SubscriptionPage';
import EnhancedAppointmentScheduler from './components/EnhancedAppointmentScheduler';
// import MedicalRecords from './components/MedicalRecords';
// import PrescriptionManager from './components/PrescriptionManager';
import EnhancedMedicalRecords from './components/EnhancedMedicalRecords';
import EnhancedPrescriptionManager from './components/EnhancedPrescriptionManager';
import DiseasePrescriptionsPage from './pages/DiseasePrescriptionsPage';
import { Toaster } from 'react-hot-toast';
import TransactionHistory from './components/TransactionHistory';
import StatusPage from './pages/StatusPage';
import Footer from './components/Footer';
import SystemDashboard from './pages/SystemDashboard';
import NotificationCenter from './components/NotificationCenter';

// Define proper interfaces for the data
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

interface Prescription {
  id: string;
  prescribedDate: Date;
  medicationName: string;
  dosage: string;
  frequency: string;
  quantity: number;
  status: string;
  relatedDiseases?: string;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/system-dashboard" element={<SystemDashboard />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diseases"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diagnosis/:diseaseId"
                element={
                  <ProtectedRoute>
                    <DiagnosisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comprehensive-diagnosis"
                element={
                  <ProtectedRoute>
                    <ComprehensiveDiagnosisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comprehensive-diagnosis/:diseaseId"
                element={
                  <ProtectedRoute>
                    <ComprehensiveDiagnosisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute>
                    <DoctorsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <EnhancedAppointmentScheduler />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <Elements stripe={stripePromise}>
                      <SubscriptionPage />
                    </Elements>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medical-records"
                element={
                  <ProtectedRoute>
                    <EnhancedMedicalRecords
                      records={JSON.parse(localStorage.getItem('medicalRecords') || '[]').map((record: MedicalRecord) => ({
                        ...record,
                        date: new Date(record.date)
                      }))}
                      onAddRecord={(record) => {
                        const existingRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
                        const newRecord = { ...record, id: Date.now().toString() };
                        existingRecords.push(newRecord);
                        localStorage.setItem('medicalRecords', JSON.stringify(existingRecords));
                        window.location.reload();
                      }}
                      onEditRecord={(id, record) => {
                        const existingRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
                        const updatedRecords = existingRecords.map((r: MedicalRecord) => 
                          r.id === id ? { ...record, id } : r
                        );
                        localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
                        window.location.reload();
                      }}
                      onDeleteRecord={(id) => {
                        const existingRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
                        const filteredRecords = existingRecords.filter((r: MedicalRecord) => r.id !== id);
                        localStorage.setItem('medicalRecords', JSON.stringify(filteredRecords));
                        window.location.reload();
                      }}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prescriptions"
                element={
                  <ProtectedRoute>
                    <EnhancedPrescriptionManager
                      prescriptions={JSON.parse(localStorage.getItem('prescriptions') || '[]').map((prescription: Prescription) => ({
                        ...prescription,
                        prescribedDate: new Date(prescription.prescribedDate)
                      }))}
                      onAddPrescription={(prescription) => {
                        const existingPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
                        const newPrescription = { ...prescription, id: Date.now().toString() };
                        existingPrescriptions.push(newPrescription);
                        localStorage.setItem('prescriptions', JSON.stringify(existingPrescriptions));
                        window.location.reload();
                      }}
                      onEditPrescription={(id, prescription) => {
                        const existingPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
                        const updatedPrescriptions = existingPrescriptions.map((p: Prescription) => 
                          p.id === id ? { ...prescription, id } : p
                        );
                        localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
                        window.location.reload();
                      }}
                      onDeletePrescription={(id) => {
                        const existingPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
                        const filteredPrescriptions = existingPrescriptions.filter((p: Prescription) => p.id !== id);
                        localStorage.setItem('prescriptions', JSON.stringify(filteredPrescriptions));
                        window.location.reload();
                      }}
                      onRefillPrescription={(id) => {
                        console.log('Refill prescription:', id);
                        // You could implement refill logic here
                      }}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/disease-prescriptions"
                element={
                  <ProtectedRoute>
                    <DiseasePrescriptionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction-history"
                element={
                  <ProtectedRoute>
                    <TransactionHistory 
                      transactions={[
                        {
                          id: '1',
                          date: new Date(),
                          type: 'subscription',
                          amount: 29.99,
                          currency: 'USD',
                          status: 'completed',
                          description: 'Premium Plan Subscription',
                          transactionId: 'TXN-12345678',
                          paymentMethod: 'Credit Card'
                        },
                        {
                          id: '2',
                          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                          type: 'subscription',
                          amount: 29.99,
                          currency: 'USD',
                          status: 'completed',
                          description: 'Premium Plan Subscription',
                          transactionId: 'TXN-87654321',
                          paymentMethod: 'Credit Card'
                        }
                      ]}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <AboutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <ContactPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <ContactPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;