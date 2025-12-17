import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import MainApplication from './components/MainApplication';
import { DEFAULT_LANGUAGE_CODE } from './constants';

const App: React.FC = () => {
  const [showMainApp, setShowMainApp] = useState(false);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>(DEFAULT_LANGUAGE_CODE);

  const handleEnterApp = () => {
    setShowMainApp(true);
  };

  return (
    <div className="min-h-screen">
      {showMainApp ? (
        <MainApplication
          selectedLanguageCode={selectedLanguageCode}
          setSelectedLanguageCode={setSelectedLanguageCode}
        />
      ) : (
        <LandingPage onEnterApp={handleEnterApp} />
      )}
    </div>
  );
};

export default App;