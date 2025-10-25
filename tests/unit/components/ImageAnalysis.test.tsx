import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImageAnalysisPage } from '../../src/pages/ImageAnalysisPage';

// Mock TensorFlow.js
jest.mock('@tensorflow/tfjs', () => ({
  loadLayersModel: jest.fn(),
  browser: {
    fromPixels: jest.fn(),
  },
}));

// Mock file upload
const createMockFile = (name: string, type: string) => {
  const file = new File(['test'], name, { type });
  return file;
};

describe('ImageAnalysis Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render image analysis page', () => {
    render(<ImageAnalysisPage />);
    
    expect(screen.getByText(/AI-Powered Image Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Medical Image/i)).toBeInTheDocument();
  });

  test('should handle image upload', async () => {
    render(<ImageAnalysisPage />);
    
    const file = createMockFile('xray.jpg', 'image/jpeg');
    const input = screen.getByLabelText(/Upload Medical Image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/Processing image.../i)).toBeInTheDocument();
    });
  });

  test('should reject invalid file types', async () => {
    render(<ImageAnalysisPage />);
    
    const file = createMockFile('document.pdf', 'application/pdf');
    const input = screen.getByLabelText(/Upload Medical Image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/Please upload a valid image file/i)).toBeInTheDocument();
    });
  });

  test('should display analysis results', async () => {
    // Mock successful analysis
    const mockAnalysis = {
      condition: 'Normal',
      confidence: 85,
      recommendations: ['Continue regular checkups']
    };

    render(<ImageAnalysisPage />);
    
    const file = createMockFile('xray.jpg', 'image/jpeg');
    const input = screen.getByLabelText(/Upload Medical Image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
      expect(screen.getByText(/Normal/i)).toBeInTheDocument();
    });
  });
});
