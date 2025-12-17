import React from 'react';
import Button from './Button';
import { APP_NAME, SUPPORTING_TEXT, VALUE_PROPOSITION } from '../constants';

interface HeroCardProps {
  onEnterApp: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ onEnterApp }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto text-center animate-fade-up"
      style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}
    >
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        {APP_NAME}
      </h1>
      <p className="text-xl text-indigo-600 font-semibold mb-6">
        {VALUE_PROPOSITION}
      </p>
      <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        {SUPPORTING_TEXT}
      </p>
      <Button onClick={onEnterApp} className="py-4 px-10 text-lg">
        Enter App
      </Button>
    </div>
  );
};

export default HeroCard;