import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white/5 border-b border-white/10 p-6 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Learning Progress</h3>
        <span className="text-sm text-gray-300 font-medium">
          {currentStep} of {totalSteps} completed
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;