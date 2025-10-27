import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

describe('Medical Diagnosis Flow Integration', () => {
  test('renders home page correctly', () => {
    render(<App />);
    
    expect(screen.getByText(/AI-Powered Medical Diagnosis/i)).toBeInTheDocument();
  });

  test('navigation works correctly', () => {
    render(<App />);
    
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});