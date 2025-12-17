import React from 'react';
import { FeedbackCardProps } from '../types';

const FeedbackCard: React.FC<FeedbackCardProps> = ({ title, content, accentColor, isLoading }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-gray-500 text-sm">Loading...</span>
        </div>
      );
    }

    if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    if (typeof content === 'string') {
      return <p className="text-gray-700 leading-relaxed text-base">{content}</p>;
    }

    return content; // If it's a React.JSX.Element
  };

  return (
    <div
      className={`bg-white rounded-lg border-l-4 ${accentColor} shadow-sm p-5 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-200 ease-out animate-fade-in`}
    >
      <h3 className="font-semibold text-lg mb-3 text-gray-800">{title}</h3>
      {renderContent()}
    </div>
  );
};

export default FeedbackCard;