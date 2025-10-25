import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiagnosisForm from '../../../src/components/EnhancedDiagnosisForm';

// Mock the API calls
jest.mock('../../../src/api/diagnosis', () => ({
  submitDiagnosis: jest.fn(),
}));

describe('DiagnosisForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render diagnosis form correctly', () => {
    render(<DiagnosisForm />);
    
    expect(screen.getByText(/Medical Diagnosis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
  });

  test('should handle form submission', async () => {
    const mockSubmitDiagnosis = require('../../../src/api/diagnosis').submitDiagnosis;
    mockSubmitDiagnosis.mockResolvedValue({
      prediction: { risk: 'medium', confidence: 75 },
      recordId: 'test-id'
    });

    render(<DiagnosisForm />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '45' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });
    
    // Submit form
    fireEvent.click(screen.getByText(/Submit Diagnosis/i));
    
    await waitFor(() => {
      expect(mockSubmitDiagnosis).toHaveBeenCalledWith({
        age: '45',
        gender: 'male'
      });
    });
  });

  test('should display loading state during submission', async () => {
    const mockSubmitDiagnosis = require('../../../src/api/diagnosis').submitDiagnosis;
    mockSubmitDiagnosis.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<DiagnosisForm />);
    
    fireEvent.click(screen.getByText(/Submit Diagnosis/i));
    
    expect(screen.getByText(/Processing.../i)).toBeInTheDocument();
  });

  test('should handle form validation errors', () => {
    render(<DiagnosisForm />);
    
    // Submit empty form
    fireEvent.click(screen.getByText(/Submit Diagnosis/i));
    
    expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
  });
});
