// Fix: Add React import to resolve JSX namespace errors.
import * as React from 'react';

export enum FeatureType {
  ScenarioWriting = 'Scenario Writing',
  SentenceBuilder = 'Sentence Builder',
  SpeakingPractice = 'Speaking Practice',
  MeaningAndContext = 'Meaning & Context',
}

export interface Feedback {
  whatYouSaid: string;
  pronunciationAndClarity: string;
  grammarAndWordChoice: string;
  improvedSpokenExample: string;
}

export interface FeedbackCardProps {
  title: string;
  content: string | string[] | React.JSX.Element; // Allow string arrays for content
  accentColor: string;
  isLoading?: boolean;
}

export interface FeatureConfig {
  name: FeatureType;
  icon: React.JSX.Element; // Tailwind Icons or custom SVG
}

export interface LanguageOption {
  name: string;
  code: string; // e.g., 'en-US', 'es-ES'
}

export interface GenerateScenarioResponse {
  scenario: string;
}

export interface GenerateFeedbackResponse {
  pronunciationAndClarity: string;
  grammarAndWordChoice: string;
  improvedSpokenExample: string;
}

export interface GenerateWritingFeedbackResponse {
  grammarAndSpelling: string;
  vocabularyAndFlow: string;
  improvedWriting: string;
}

export interface BuildSentenceResponse {
  sentences: string[];
  explanation: string;
}

export interface GetMeaningAndContextResponse {
  definition: string;
  examples: string[];
  context: string;
}