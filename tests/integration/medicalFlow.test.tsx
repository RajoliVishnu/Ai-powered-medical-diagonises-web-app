import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../../src/App';

// Mock API responses
const mockApiResponses = {
  '/api/auth/login': {
    token: 'mock-jwt-token',
    user: { id: 'user1', email: 'test@example.com' }
  },
  '/api/diagnosis/predict': {
    prediction: { risk: 'medium', confidence: 75 },
    recordId: 'record1'
  },
  '/api/records': {
    items: [
      { id: 'record1', type: 'diagnosis', data: { condition: 'Hypertension' } }
    ]
  }
};

// Mock fetch
global.fetch = jest.fn((url: string) =>
  Promise.resolve({
    json: () => Promise.resolve(mockApiResponses[url] || {}),
    ok: true,
    status: 200
  })
) as jest.Mock;

describe('Complete Medical Diagnosis Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should complete full user journey', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 1. User login
    fireEvent.click(screen.getByText(/Login/i));
    fireEvent.change(screen.getByLabelText(/Email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });

    // 2. Navigate to diagnosis
    fireEvent.click(screen.getByText(/Medical Diagnosis/i));

    // 3. Fill diagnosis form
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '45' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/Chest Pain/i), { target: { value: 'severe' } });

    // 4. Submit diagnosis
    fireEvent.click(screen.getByText(/Submit Diagnosis/i));

    await waitFor(() => {
      expect(screen.getByText(/Diagnosis Complete/i)).toBeInTheDocument();
    });

    // 5. View medical records
    fireEvent.click(screen.getByText(/Medical Records/i));

    await waitFor(() => {
      expect(screen.getByText(/Hypertension/i)).toBeInTheDocument();
    });
  });

  test('should handle API errors gracefully', async () => {
    // Mock API error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: 'Server error' }),
        ok: false,
        status: 500
      })
    ) as jest.Mock;

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Try to login with error
    fireEvent.click(screen.getByText(/Login/i));
    fireEvent.change(screen.getByLabelText(/Email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });
});
