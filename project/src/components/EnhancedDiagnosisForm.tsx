import React, { useState } from 'react';

interface DiagnosisFormProps {
  onSubmit?: (data: any) => void;
}

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ onSubmit }) => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ symptoms, age, gender });
    }
  };

  return (
    <div className="diagnosis-form">
      <h2>Medical Diagnosis Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="symptoms">Symptoms:</label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms..."
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit">Submit Diagnosis</button>
      </form>
    </div>
  );
};

export default DiagnosisForm;