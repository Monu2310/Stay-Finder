import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex-center" style={{ minHeight: '50vh' }}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
