import React, { useState, useEffect, useCallback } from 'react';
import Button from './Button';
import FeedbackCard from './FeedbackCard';
import { generateSpeakingScenario, generateWritingFeedback } from '../services/geminiService'; // Re-using scenario generation
import {
  FeatureType,
  GenerateScenarioResponse,
  GenerateWritingFeedbackResponse,
  FeedbackCardProps,
} from '../types';

interface ScenarioWritingPracticeProps {
  selectedLanguageCode: string;
}

const ScenarioWritingPractice: React.FC<ScenarioWritingPracticeProps> = ({
  selectedLanguageCode,
}) => {
  const [scenario, setScenario] = useState<string>('');
  const [writtenText, setWrittenText] = useState<string>('');
  const [feedback, setFeedback] = useState<GenerateWritingFeedbackResponse | null>(
    null
  );
  const [isLoadingScenario, setIsLoadingScenario] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScenario = useCallback(async () => {
    setIsLoadingScenario(true);
    setError(null);
    setFeedback(null);
    setWrittenText('');
    try {
      // Re-use speaking scenario generation for writing practice
      const response: GenerateScenarioResponse = await generateSpeakingScenario(
        selectedLanguageCode
      );
      setScenario(response.scenario);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenario.');
    } finally {
      setIsLoadingScenario(false);
    }
  }, [selectedLanguageCode]);

  useEffect(() => {
    fetchScenario();
  }, [fetchScenario]);

  const handleGetFeedback = async () => {
    if (!writtenText.trim()) {
      setError('Please write something before getting feedback.');
      return;
    }
    setIsLoadingFeedback(true);
    setError(null);
    setFeedback(null);
    try {
      const response: GenerateWritingFeedbackResponse =
        await generateWritingFeedback(writtenText, selectedLanguageCode);
      setFeedback(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to get writing feedback.'
      );
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const feedbackCards: FeedbackCardProps[] = [
    {
      title: 'Your Writing',
      content: writtenText || 'Start writing your response to the scenario above.',
      accentColor: 'border-indigo-600 text-indigo-800',
    },
    {
      title: 'Grammar & Spelling',
      content:
        feedback?.grammarAndSpelling ||
        (isLoadingFeedback ? 'Analyzing grammar and spelling...' : 'Feedback will appear here.'),
      accentColor: 'border-green-500 text-green-700',
      isLoading: isLoadingFeedback && !feedback?.grammarAndSpelling,
    },
    {
      title: 'Vocabulary & Flow',
      content:
        feedback?.vocabularyAndFlow ||
        (isLoadingFeedback ? 'Analyzing vocabulary and flow...' : 'Feedback will appear here.'),
      accentColor: 'border-orange-500 text-orange-700',
      isLoading: isLoadingFeedback && !feedback?.vocabularyAndFlow,
    },
    {
      title: 'Improved Writing Example',
      content:
        feedback?.improvedWriting ||
        (isLoadingFeedback ? 'Generating improved example...' : 'An improved version of your text.'),
      accentColor: 'border-blue-500 text-blue-700',
      isLoading: isLoadingFeedback && !feedback?.improvedWriting,
    },
  ];

  return (
    <div
      className="bg-white rounded-2xl shadow-xl p-8 animate-fade-up"
      style={{ animationDuration: '0.35s' }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        AI Scenario Writing Practice
      </h2>

      {isLoadingScenario ? (
        <div className="flex justify-center items-center h-24">
          <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="ml-4 text-gray-600">Loading a new scenario...</p>
        </div>
      ) : (
        <>
          <p className="text-lg text-gray-700 mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200" aria-live="polite">
            <span className="font-semibold text-blue-800">Scenario:</span> {scenario || 'Failed to load scenario.'}
          </p>
          <div className="mb-6">
            <label htmlFor="writing-input" className="sr-only">
              Your Written Response
            </label>
            <textarea
              id="writing-input"
              className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 text-lg resize-y min-h-[150px]"
              placeholder={`Write your response to the scenario in ${selectedLanguageCode} here...`}
              value={writtenText}
              onChange={(e) => setWrittenText(e.target.value)}
              aria-label="Your written response to the scenario"
            ></textarea>
          </div>
          <div className="flex justify-center mb-8">
            <Button
              variant="primary"
              onClick={handleGetFeedback}
              className="px-8 py-4 text-xl"
              isLoading={isLoadingFeedback}
              disabled={isLoadingScenario || !writtenText.trim()}
              aria-label="Get Writing Feedback"
            >
              Get Feedback
            </Button>
          </div>
        </>
      )}

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
      <div className="flex justify-center mt-8">
        <Button
          onClick={fetchScenario}
          variant="secondary"
          disabled={isLoadingScenario || isLoadingFeedback}
        >
          Practice Another Scenario
        </Button>
      </div>
    </div>
  );
};

export default ScenarioWritingPractice;