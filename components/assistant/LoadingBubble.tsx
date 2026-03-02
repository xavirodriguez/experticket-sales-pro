
import React from 'react';

const LoadingBubble: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  </div>
);

export default LoadingBubble;
