import React from 'react';
import HeroCard from './HeroCard';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <HeroCard onEnterApp={onEnterApp} />
    </div>
  );
};

export default LandingPage;