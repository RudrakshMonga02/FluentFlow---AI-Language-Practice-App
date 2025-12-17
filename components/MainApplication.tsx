import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FeatureType } from '../types';
import SpeakingPractice from './SpeakingPractice';
import ScenarioWritingPractice from './ScenarioWritingPractice';
import SentenceBuilder from './SentenceBuilder';
import MeaningAndContext from './MeaningAndContext';

interface MainApplicationProps {
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
}

const MainApplication: React.FC<MainApplicationProps> = ({ selectedLanguageCode, setSelectedLanguageCode }) => {
  const [activeFeature, setActiveFeature] = useState<FeatureType>(
    FeatureType.SpeakingPractice // Default to Speaking Practice as per design
  );

  const handleSelectFeature = (feature: FeatureType) => {
    setActiveFeature(feature);
  };

  const renderFeatureComponent = () => {
    switch (activeFeature) {
      case FeatureType.SpeakingPractice:
        return <SpeakingPractice selectedLanguageCode={selectedLanguageCode} />;
      case FeatureType.ScenarioWriting:
        return <ScenarioWritingPractice selectedLanguageCode={selectedLanguageCode} />;
      case FeatureType.SentenceBuilder:
        return <SentenceBuilder selectedLanguageCode={selectedLanguageCode} />;
      case FeatureType.MeaningAndContext:
        return <MeaningAndContext selectedLanguageCode={selectedLanguageCode} />;
      default:
        return (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {activeFeature}
            </h2>
            <p className="text-gray-600">
              This feature is under development. Please select "Speaking Practice" or "Scenario Writing" to try the AI-powered language tutor!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        activeFeature={activeFeature}
        onSelectFeature={handleSelectFeature}
        selectedLanguageCode={selectedLanguageCode}
        setSelectedLanguageCode={setSelectedLanguageCode}
      />
      <main className="flex-1 p-8 ml-72 flex justify-center items-start overflow-auto">
        <div className="max-w-3xl w-full">
          {renderFeatureComponent()}
        </div>
      </main>
    </div>
  );
};

export default MainApplication;