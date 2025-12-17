import React, { useState } from 'react';
import Button from './Button';
import FeedbackCard from './FeedbackCard';
import { getMeaningAndContext } from '../services/geminiService';
import { GetMeaningAndContextResponse, FeedbackCardProps } from '../types';

interface MeaningAndContextProps {
  selectedLanguageCode: string;
}

const MeaningAndContext: React.FC<MeaningAndContextProps> = ({ selectedLanguageCode }) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [contextData, setContextData] = useState<GetMeaningAndContextResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetContext = async () => {
    if (!inputQuery.trim()) {
      setError('Please enter a word or phrase.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setContextData(null);
    try {
      const response = await getMeaningAndContext(inputQuery, selectedLanguageCode);
      setContextData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get meaning and context.');
    } finally {
      setIsLoading(false);
    }
  };

  const feedbackCards: FeedbackCardProps[] = [
    {
      title: `Meaning of "${inputQuery}"`,
      content: contextData?.definition || (isLoading ? 'Getting definition...' : 'Enter a word for its meaning.'),
      accentColor: 'border-indigo-600 text-indigo-800',
      isLoading: isLoading && !contextData?.definition,
    },
    {
      title: 'Example Sentences',
      content: contextData?.examples || (isLoading ? 'Getting examples...' : 'Examples will appear here.'),
      accentColor: 'border-green-500 text-green-700',
      isLoading: isLoading && !contextData?.examples,
    },
    {
      title: 'Context & Nuances',
      content: contextData?.context || (isLoading ? 'Getting context...' : 'Contextual explanation will appear here.'),
      accentColor: 'border-yellow-500 text-yellow-700',
      isLoading: isLoading && !contextData?.context,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-up" style={{ animationDuration: '0.35s' }}>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Meaning & Context Cards</h2>

      <p className="text-lg text-gray-700 mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-gray-200">
        Enter a word or phrase to get its definition, example sentences, and contextual information in {selectedLanguageCode}.
      </p>

      <div className="mb-6">
        <label htmlFor="query-input" className="sr-only">
          Enter a word or phrase
        </label>
        <input
          id="query-input"
          type="text"
          className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 text-lg"
          placeholder={`Enter a word or phrase in ${selectedLanguageCode}...`}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGetContext()}
          aria-label="Word or phrase input for meaning and context"
        />
      </div>

      <div className="flex justify-center mb-8">
        <Button
          variant="primary"
          onClick={handleGetContext}
          className="px-8 py-4 text-xl"
          isLoading={isLoading}
          disabled={!inputQuery.trim()}
          aria-label="Get Meaning and Context"
        >
          Get Context
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert" aria-atomic="true">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {feedbackCards.map((card, index) => (
          <FeedbackCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default MeaningAndContext;