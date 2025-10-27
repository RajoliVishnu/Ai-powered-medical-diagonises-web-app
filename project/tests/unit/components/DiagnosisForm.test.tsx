import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiagnosisForm from '../../../src/components/EnhancedDiagnosisForm';

describe('DiagnosisForm Component', () => {
  test('renders diagnosis form correctly', () => {
    render(<DiagnosisForm />);
    
    expect(screen.getByText(/Medical Diagnosis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
  });

  test('handles form submission', () => {
    render(<DiagnosisForm />);
    
    const submitButton = screen.getByRole('button', { name: /Submit Diagnosis/i });
    expect(submitButton).toBeInTheDocument();
  });
});