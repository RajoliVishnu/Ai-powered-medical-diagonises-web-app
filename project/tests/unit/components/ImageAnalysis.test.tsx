import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageAnalysisPage from '../../../src/pages/ImageAnalysisPage';

// Mock TensorFlow.js
jest.mock('@tensorflow/tfjs', () => ({
  loadLayersModel: jest.fn(),
  browser: {
    fromPixels: jest.fn(() => ({
      resizeBilinear: jest.fn(() => ({
        toFloat: jest.fn(() => ({
          expandDims: jest.fn(() => ({
            dispose: jest.fn(),
          })),
        })),
      })),
      dispose: jest.fn(),
    })),
  },
}));

describe('ImageAnalysis Component', () => {
  test('renders image analysis page', () => {
    render(<ImageAnalysisPage />);
    
    expect(screen.getByText(/Medical Image Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop medical images here/i)).toBeInTheDocument();
  });

  test('handles image upload', () => {
    render(<ImageAnalysisPage />);
    
    const fileInput = screen.getByRole('presentation');
    expect(fileInput).toBeInTheDocument();
  });
});