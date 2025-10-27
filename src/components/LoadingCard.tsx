import React from 'react';
import { Heart, Activity, Zap } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingCardProps {
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  progress?: number;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ 
  title = "Processing...", 
  subtitle = "Please wait while we analyze your data",
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Animated Icons */}
          <div className="relative mb-6">
            <div className="flex justify-center space-x-2">
              <div className="animate-bounce">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
              <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center mb-4">
            <LoadingSpinner size="lg" color="blue" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>

          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {subtitle}
          </p>

          {/* Progress Bar */}
          {showProgress && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Animated Dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;

