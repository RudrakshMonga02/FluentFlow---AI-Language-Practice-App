import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from './Button';
import { getSpeakingFeedback, generateSpeakingScenario, transcribeAudio } from '../services/geminiService';
import { MAX_RECORDING_DURATION_SECONDS } from '../constants';
import { FeatureType, Feedback, GenerateScenarioResponse, GenerateFeedbackResponse, FeedbackCardProps } from '../types';
import FeedbackCard from './FeedbackCard';

// Icon components for UI elements
const MicrophoneIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-6 h-6 ${className}`}
  >
    <path
      d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z"
    />
    <path
      d="M10.75 16.5a6 6 0 006 6h1.5a.75.75 0 000-1.5H17a4.5 4.5 0 01-4.5-4.5V4.5H10.75v8.25a3.75 3.75 0 11-7.5 0V4.5H5.25v8.25a6 6 0 006 6z"
    />
  </svg>
);

const StopIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-6 h-6 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M6.75 5.25a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-9a.75.75 0 01-.75-.75V5.25z"
      clipRule="evenodd"
    />
  </svg>
);

interface SpeakingPracticeProps {
  selectedLanguageCode: string;
}

const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({ selectedLanguageCode }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [scenario, setScenario] = useState<string>('');
  const [isLoadingScenario, setIsLoadingScenario] = useState(true);
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null); // Use 'number' for setTimeout return type

  const fetchScenario = useCallback(async () => {
    setIsLoadingScenario(true);
    setError(null);
    setFeedback(null); // Clear previous feedback
    setTranscribedText(''); // Clear previous transcription
    setAudioBlob(null); // Clear previous audio
    try {
      const response: GenerateScenarioResponse = await generateSpeakingScenario(selectedLanguageCode);
      setScenario(response.scenario);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenario.');
    } finally {
      setIsLoadingScenario(false);
    }
  }, [selectedLanguageCode]); // Rerun if language changes

  useEffect(() => {
    fetchScenario();
  }, [fetchScenario]);

  const startRecording = async () => {
    setError(null);
    setFeedback(null);
    setTranscribedText('');
    setAudioBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const newAudioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(newAudioBlob);
        setIsRecording(false);
        if (timerRef.current) {
          window.clearTimeout(timerRef.current); // Explicitly use window.clearTimeout
          timerRef.current = null;
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = window.setTimeout(() => { // Explicitly use window.setTimeout
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, MAX_RECORDING_DURATION_SECONDS * 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied or not available. Please allow microphone permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const processAudio = useCallback(async (blob: Blob) => {
    setIsLoadingTranscription(true);
    setError(null);
    try {
      const text = await transcribeAudio(blob, selectedLanguageCode); // Pass language code
      setTranscribedText(text);
      setIsLoadingTranscription(false);
      // Automatically get feedback after transcription
      if (text.trim()) { // Check for non-empty transcription
        setIsLoadingFeedback(true);
        try {
          const feedbackResponse: GenerateFeedbackResponse = await getSpeakingFeedback(text, selectedLanguageCode); // Pass language code
          setFeedback({
            whatYouSaid: text,
            pronunciationAndClarity: feedbackResponse.pronunciationAndClarity,
            grammarAndWordChoice: feedbackResponse.grammarAndWordChoice,
            improvedSpokenExample: feedbackResponse.improvedSpokenExample,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to get feedback.');
        } finally {
          setIsLoadingFeedback(false);
        }
      } else {
        setError('No speech detected. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transcribe audio.');
    } finally {
      setIsLoadingTranscription(false);
    }
  }, [selectedLanguageCode]); // Rerun if language changes

  useEffect(() => {
    if (audioBlob) {
      processAudio(audioBlob);
    }
  }, [audioBlob, processAudio]);

  const feedbackCards: FeedbackCardProps[] = [
    {
      title: "What You Said (Transcription)",
      content: transcribedText || (isLoadingTranscription ? 'Transcribing your speech...' : 'No speech recorded yet.'),
      accentColor: 'border-indigo-600 text-indigo-800',
      isLoading: isLoadingTranscription,
    },
    {
      title: "Pronunciation & Clarity",
      content: feedback?.pronunciationAndClarity || (isLoadingFeedback ? 'Analyzing pronunciation...' : 'Speak to get feedback!'),
      accentColor: 'border-green-500 text-green-700',
      isLoading: isLoadingFeedback && !feedback?.pronunciationAndClarity,
    },
    {
      title: "Grammar & Word Choice",
      content: feedback?.grammarAndWordChoice || (isLoadingFeedback ? 'Checking grammar and word choice...' : 'Speak to get feedback!'),
      accentColor: 'border-orange-500 text-orange-700',
      isLoading: isLoadingFeedback && !feedback?.grammarAndWordChoice,
    },
    {
      title: "Improved Spoken Example",
      content: feedback?.improvedSpokenExample || (isLoadingFeedback ? 'Generating an improved example...' : 'Speak to get feedback!'),
      accentColor: 'border-blue-500 text-blue-700',
      isLoading: isLoadingFeedback && !feedback?.improvedSpokenExample,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-up" style={{ animationDuration: '0.35s' }}>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">AI Speaking Practice</h2>

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
          <div className="flex justify-center mb-8">
            {isRecording ? (
              <Button
                variant="danger"
                onClick={stopRecording}
                className="px-8 py-4 text-xl animate-pulse-soft"
                disabled={isLoadingTranscription || isLoadingFeedback}
                aria-label="Stop Recording"
              >
                <StopIcon className="mr-3" /> Recording...
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={startRecording}
                className="px-8 py-4 text-xl"
                disabled={isLoadingTranscription || isLoadingFeedback || isLoadingScenario}
                aria-label="Start Recording"
              >
                <MicrophoneIcon className="mr-3" /> Start Recording
              </Button>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert" aria-atomic="true">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          {error.includes("microphone") && (
             <p className="text-sm mt-2">Please ensure your browser has permission to access your microphone.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {feedbackCards.map((card, index) => (
          <FeedbackCard key={index} {...card} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button onClick={fetchScenario} variant="secondary" disabled={isRecording || isLoadingTranscription || isLoadingFeedback || isLoadingScenario}>
          Practice Another Scenario
        </Button>
      </div>
    </div>
  );
};

export default SpeakingPractice;