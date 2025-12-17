import React from 'react';
import { FeatureType, FeatureConfig, LanguageOption } from '../types';
import { APP_NAME, FEATURES, APP_LANGUAGES } from '../constants';

interface SidebarProps {
  activeFeature: FeatureType;
  onSelectFeature: (feature: FeatureType) => void;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFeature, onSelectFeature, selectedLanguageCode, setSelectedLanguageCode }) => {
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguageCode(event.target.value);
  };

  return (
    <aside className="w-72 bg-gray-900 text-blue-100 p-6 fixed h-screen overflow-y-auto shadow-lg animate-slide-in-left">
      <div className="flex items-center mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-indigo-400 mr-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 006-6v-1.5m-6 1.5a6 6 0 01-6-6V6.75m6 12v3.75m6-3.75a3 3 0 01-3 3m-3 0a3 3 0 00-3 3m-3-3a3 3 0 01-3-3m-3-3h15.75m-12.75 0A7.5 7.5 0 0118 10.5V6a7.5 7.5 0 00-15 0v4.5m1.5 0h.75m-.75 0H3M16.5 6H21"
          />
        </svg>
        <h2 className="text-2xl font-bold text-white">{APP_NAME}</h2>
      </div>

      <div className="mb-8">
        <label htmlFor="language-select" className="block text-blue-200 text-sm font-medium mb-2">
          Learning Language:
        </label>
        <div className="relative">
          <select
            id="language-select"
            value={selectedLanguageCode}
            onChange={handleLanguageChange}
            className="block w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-gray-600 focus:border-indigo-500 appearance-none transition-colors duration-200"
            aria-label="Select learning language"
          >
            {APP_LANGUAGES.map((lang: LanguageOption) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>


      <nav>
        <ul className="space-y-3">
          {FEATURES.map((feature: FeatureConfig) => (
            <li key={feature.name}>
              <button
                onClick={() => onSelectFeature(feature.name)}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors duration-200 ease-out
                  ${
                    activeFeature === feature.name
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-blue-200 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                {React.cloneElement(feature.icon, { className: 'w-5 h-5 mr-3' })}
                <span className="text-lg">{feature.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;