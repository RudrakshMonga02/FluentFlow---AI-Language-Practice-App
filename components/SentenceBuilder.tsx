import React, { useState } from 'react';
import Button from './Button';
import FeedbackCard from './FeedbackCard';
import { buildSentences } from '../services/geminiService';
import { BuildSentenceResponse, FeedbackCardProps } from '../types';

interface SentenceBuilderProps {
  selectedLanguageCode: string;
}

const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ selectedLanguageCode }) => {
  const [inputWord, setInputWord] = useState<string>('');
  const [sentencesData, setSentencesData] = useState<BuildSentenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuildSentences = async () => {
    if (!inputWord.trim()) {
      setError('Please enter a word or phrase.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSentencesData(null);
    try {
      const response = await buildSentences(inputWord, selectedLanguageCode);
      setSentencesData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to build sentences.');
    } finally {
      setIsLoading(false);
    }
  };

  const feedbackCards: FeedbackCardProps[] = [
    {
      title: `Sentences for "${inputWord}"`,
      content: sentencesData?.sentences || (isLoading ? 'Generating sentences...' : 'Enter a word to build sentences.'),
      accentColor: 'border-indigo-600 text-indigo-800',
      isLoading: isLoading && !sentencesData?.sentences,
    },
    {
      title: 'Usage Explanation',
      content: sentencesData?.explanation || (isLoading ? 'Explaining usage...' : 'Explanation will appear here.'),
      accentColor: 'border-purple-500 text-purple-700',
      isLoading: isLoading && !sentencesData?.explanation,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-up" style={{ animationDuration: '0.35s' }}>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Smart Sentence Builder</h2>

      <p className="text-lg text-gray-700 mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-gray-200">
        Enter a word or phrase, and I'll generate example sentences and explain its common usage in {selectedLanguageCode}.
      </p>

      <div className="mb-6">
        <label htmlFor="word-input" className="sr-only">
          Enter a word or phrase
        </label>
        <input
          id="word-input"
          type="text"
          className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 text-lg"
          placeholder={`Enter a word or phrase in ${selectedLanguageCode}...`}
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleBuildSentences()}
          aria-label="Word or phrase input for sentence building"
        />
      </div>

      <div className="flex justify-center mb-8">
        <Button
          variant="primary"
          onClick={handleBuildSentences}
          className="px-8 py-4 text-xl"
          isLoading={isLoading}
          disabled={!inputWord.trim()}
          aria-label="Build Sentences"
        >
          Build Sentences
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

export default SentenceBuilder;