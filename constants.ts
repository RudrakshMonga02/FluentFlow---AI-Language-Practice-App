import React from 'react';
import { FeatureType, LanguageOption } from './types';

export const APP_NAME = 'FluentFlow AI';
export const VALUE_PROPOSITION = 'Master any language with AI-powered practice.';
export const SUPPORTING_TEXT =
  'Practice speaking, writing, and understanding in real-life scenarios with instant, intelligent feedback. Designed for clarity, confidence, and beginner-friendliness.';

// Updated model names as per coding guidelines
export const GEMINI_MODEL_TRANSCRIPTION = 'gemini-2.5-flash';
export const GEMINI_MODEL_SCENARIO_GENERATION = 'gemini-2.5-flash';
export const GEMINI_MODEL_FEEDBACK = 'gemini-3-pro-preview'; // More complex tasks
export const GEMINI_MODEL_WRITING = 'gemini-3-pro-preview'; // More complex tasks
export const GEMINI_MODEL_SENTENCE_BUILDER = 'gemini-2.5-flash'; // Basic text tasks
export const GEMINI_MODEL_MEANING_CONTEXT = 'gemini-2.5-flash'; // Basic text tasks

export const MAX_RECORDING_DURATION_SECONDS = 20;

export const APP_LANGUAGES: LanguageOption[] = [
  { name: 'English (US)', code: 'en-US' },
  { name: 'Spanish (Spain)', code: 'es-ES' },
  { name: 'French (France)', code: 'fr-FR' },
  { name: 'German (Germany)', code: 'de-DE' },
  // Add more languages as needed, ensure their STT support
];
export const DEFAULT_LANGUAGE_CODE = 'en-US'; // Default to English

// Fix: Define SVG icons using React.createElement to be valid in a .ts file.
const ScenarioWritingIcon: React.FC<{ className?: string }> = (props) =>
  React.createElement(
    'svg',
    {
      ...props,
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      strokeWidth: 1.5,
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
    })
  );

const SentenceBuilderIcon: React.FC<{ className?: string }> = (props) =>
  React.createElement(
    'svg',
    {
      ...props,
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      strokeWidth: 1.5,
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M12 4.5v15m7.5-7.5h-15',
    })
  );

const SpeakingPracticeIcon: React.FC<{ className?: string }> = (props) =>
  React.createElement(
    'svg',
    {
      ...props,
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      strokeWidth: 1.5,
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M12 18.75a6 6 0 006-6v-1.5m-6 1.5a6 6 0 01-6-6V6.75m6 12v3.75m6-3.75a3 3 0 01-3 3m-3 0a3 3 0 00-3 3m-3-3a3 3 0 01-3-3m-3-3h15.75m-12.75 0A7.5 7.5 0 0118 10.5V6a7.5 7.5 0 00-15 0v4.5m1.5 0h.75m-.75 0H3M16.5 6H21',
    })
  );

const MeaningAndContextIcon: React.FC<{ className?: string }> = (props) =>
  React.createElement(
    'svg',
    {
      ...props,
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      strokeWidth: 1.5,
      stroke: 'currentColor',
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712L12 16.125l-2.121-2.121c-1.172-1.025-1.172-2.687 0-3.712z',
    }),
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M2.25 15.75l1.5-1.5a2.25 2.25 0 013 0 .75.75 0 00.953.052 11.232 11.232 0 006.416-2.108 8.743 8.743 0 004.243-5.786 2.25 2.25 0 01-4.243 0 9.753 9.753 0 00-4.832 1.336 11.232 11.232 0 01-6.416 2.108 2.25 2.25 0 01-3 0zm-.113-9.214A2.25 2.25 0 015.25 4.5h1.5a2.25 2.25 0 012.113 1.339L12 10.5l-1.124 1.124a2.25 2.25 0 01-3.182-3.182l.001-.002z',
    })
  );

export const FEATURES = [
  {
    name: FeatureType.ScenarioWriting,
    icon: React.createElement(ScenarioWritingIcon, { className: 'w-5 h-5' }),
  },
  {
    name: FeatureType.SentenceBuilder,
    icon: React.createElement(SentenceBuilderIcon, { className: 'w-5 h-5' }),
  },
  {
    name: FeatureType.SpeakingPractice,
    icon: React.createElement(SpeakingPracticeIcon, { className: 'w-5 h-5' }),
  },
  {
    name: FeatureType.MeaningAndContext,
    icon: React.createElement(MeaningAndContextIcon, { className: 'w-5 h-5' }),
  },
];