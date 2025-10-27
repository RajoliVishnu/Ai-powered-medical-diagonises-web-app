import React, { useState, useEffect } from 'react';
import { Activity, Users, TrendingUp, Clock, Zap, Database } from 'lucide-react';

interface MockPatient {
  id: string;
  name: string;
  age: number;
  disease: string;
  risk: 'Low' | 'Moderate' | 'High';
  timestamp: Date;
  processingTime: number;
}

const RealTimeSimulator: React.FC = () => {
  const [patients, setPatients] = useState<MockPatient[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    totalProcessed: 0,
    averageProcessingTime: 0,
    currentQueue: 0
  });

  const diseases = ['Heart Disease', 'Liver Disease', 'Kidney Disease', 'Diabetes'];
  const risks = ['Low', 'Moderate', 'High'] as const;
  const names = ['John', 'Sarah', 'Mike', 'Lisa', 'David', 'Emma', 'Alex', 'Maria'];

  const generateMockPatient = (): MockPatient => {
    const processingTime = Math.random() * 2000 + 500; // 0.5-2.5 seconds
    return {
      id: Date.now().toString(),
      name: names[Math.floor(Math.random() * names.length)],
      age: Math.floor(Math.random() * 60) + 20,
      disease: diseases[Math.floor(Math.random() * diseases.length)],
      risk: risks[Math.floor(Math.random() * risks.length)],
      timestamp: new Date(),
      processingTime
    };
  };

  const processPatient = async (patient: MockPatient) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, patient.processingTime));
    
    setPatients(prev => [patient, ...prev.slice(0, 9)]); // Keep last 10
    setStats(prev => ({
      totalProcessed: prev.totalProcessed + 1,
      averageProcessingTime: (prev.averageProcessingTime + patient.processingTime) / 2,
      currentQueue: Math.max(0, prev.currentQueue - 1)
    }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        const newPatient = generateMockPatient();
        setStats(prev => ({ ...prev, currentQueue: prev.currentQueue + 1 }));
        processPatient(newPatient);
      }, Math.random() * 3000 + 2000); // 2-5 seconds between patients
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Zap className="h-6 w-6 text-emerald-600 mr-2" />
          Real-Time AI Processing Simulation
        </h2>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isRunning
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isRunning ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-emerald-600 mr-3" />
            <div>
              <p className="text-sm text-emerald-600 font-medium">Total Processed</p>
              <p className="text-2xl font-bold text-emerald-800">{stats.totalProcessed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Avg Processing</p>
              <p className="text-2xl font-bold text-blue-800">{stats.averageProcessingTime.toFixed(0)}ms</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-orange-600 font-medium">Queue Length</p>
              <p className="text-2xl font-bold text-orange-800">{stats.currentQueue}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Status</p>
              <p className="text-lg font-bold text-purple-800">
                {isRunning ? '🟢 Active' : '🔴 Stopped'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Patient Processing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Diagnoses</h3>
        {patients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No patients processed yet. Start the simulation to see real-time AI processing!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {patients.map((patient) => (
              <div key={patient.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-slide-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}, {patient.age}</p>
                      <p className="text-sm text-gray-600">{patient.disease}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(patient.risk)}`}>
                      {patient.risk} Risk
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {patient.timestamp.toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      Processed in {patient.processingTime.toFixed(0)}ms
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          ⚠️ <strong>Simulation Notice:</strong> This is a real-time simulation using mock data for demonstration purposes. 
          In a real system, this would process actual patient data with proper privacy protection.
        </p>
      </div>
    </div>
  );
};

export default RealTimeSimulator;

