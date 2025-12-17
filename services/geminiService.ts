import { GoogleGenAI, Type } from '@google/genai';
import {
  GenerateFeedbackResponse,
  GenerateScenarioResponse,
  GenerateWritingFeedbackResponse,
  BuildSentenceResponse,
  GetMeaningAndContextResponse,
} from '../types';
import {
  GEMINI_MODEL_FEEDBACK,
  GEMINI_MODEL_SCENARIO_GENERATION,
  GEMINI_MODEL_TRANSCRIPTION,
  GEMINI_MODEL_WRITING,
  GEMINI_MODEL_SENTENCE_BUILDER,
  GEMINI_MODEL_MEANING_CONTEXT,
} from '../constants';

// Helper to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the "data:audio/webm;base64," prefix
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Generic JSON parsing helper
function parseJsonResponse<T>(rawJsonStr: string, functionName: string): T {
  console.log(`Raw AI response for ${functionName}:`, rawJsonStr);
  if (!rawJsonStr) {
    throw new Error(`No response received from AI for ${functionName}.`);
  }

  // Robust JSON extraction by finding the first '{' and last '}'
  const firstBraceIndex = rawJsonStr.indexOf('{');
  const lastBraceIndex = rawJsonStr.lastIndexOf('}');

  let cleanedJsonStr = '';
  if (firstBraceIndex === -1 || lastBraceIndex === -1 || firstBraceIndex >= lastBraceIndex) {
    throw new Error(`AI returned text that does not contain a valid JSON object for ${functionName}. Raw response (full): "${rawJsonStr}"`);
  }
  cleanedJsonStr = rawJsonStr.substring(firstBraceIndex, lastBraceIndex + 1);

  if (!cleanedJsonStr) {
    throw new Error(`AI returned text that is not a valid JSON object or could not be extracted for ${functionName}. Raw response (full): "${rawJsonStr}"`);
  }

  try {
    return JSON.parse(cleanedJsonStr) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      const problematicSnippet = (error.message.match(/position \d+\s*\(('[^']+'|\"[^\"]+\")?\)/) || [])[1] || cleanedJsonStr.substring(0, 50);
      throw new Error(`Failed to parse AI response as JSON for ${functionName}. Error: ${error.message}. Problematic snippet: "${problematicSnippet}". Raw AI output (full): "${rawJsonStr}". Extracted string (full): "${cleanedJsonStr}"`);
    }
    throw error;
  }
}

export const transcribeAudio = async (audioBlob: Blob, languageCode: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TRANSCRIPTION,
      contents: {
        parts: [
          { text: `Transcribe the following audio in ${languageCode}. Do not add any conversational filler. Only return the transcribed text.` },
          {
            inlineData: {
              data: await blobToBase64(audioBlob),
              mimeType: audioBlob.type,
            },
          },
        ],
      },
      config: {
        maxOutputTokens: 256,
      },
    });

    return response.text?.trim() || '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

export const generateSpeakingScenario = async (targetLanguage: string): Promise<GenerateScenarioResponse> => {
  let rawJsonStr = '';
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_SCENARIO_GENERATION,
      contents: `Generate a concise, beginner-level speaking practice scenario (1-2 sentences) describing a common daily situation for a language learner practicing ${targetLanguage}. Do not include any conversational filler or introductory text; return only the JSON object.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: {
              type: Type.STRING,
              description: `A short, beginner-friendly speaking scenario in ${targetLanguage}.`,
            },
          },
          propertyOrdering: ['scenario'],
        },
        maxOutputTokens: 256,
        temperature: 0.5,
        // stopSequences: ["Here is the JSON requested:", "```json", "```", "Here is the JSON:", "Here's the JSON:"], // Removed
      },
    });

    rawJsonStr = response.text?.trim();
    return parseJsonResponse<GenerateScenarioResponse>(rawJsonStr, 'generateSpeakingScenario');
  } catch (error) {
    console.error('Error generating speaking scenario:', error);
    throw new Error(`Failed to generate scenario. Please try again. Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const getSpeakingFeedback = async (
  transcribedText: string,
  targetLanguage: string,
): Promise<GenerateFeedbackResponse> => {
  let rawJsonStr = '';
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `You are a friendly, encouraging, and highly effective language tutor for learners of ${targetLanguage}. Your goal is to provide constructive feedback on spoken ${targetLanguage}, focusing on clarity, pronunciation, grammar, and natural word choice for beginner learners. Keep feedback clear and simple. Always provide an improved spoken example.`;

    const prompt = `The user spoke the following sentence in ${targetLanguage}: "${transcribedText}".

Please provide feedback on:
1.  **Pronunciation & Clarity:** How clear was the speech? Any common pronunciation points for a beginner?
2.  **Grammar & Word Choice:** Any grammatical errors or suggestions for more natural phrasing?
3.  **Improved Spoken Example:** Provide one clear, natural-sounding example of how the sentence could be spoken or rephrased in ${targetLanguage}.

Return the feedback as a JSON object with the following keys: \`pronunciationAndClarity\`, \`grammarAndWordChoice\`, and \`improvedSpokenExample\`.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FEEDBACK,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pronunciationAndClarity: {
              type: Type.STRING,
              description: 'Feedback on pronunciation and clarity.',
            },
            grammarAndWordChoice: {
              type: Type.STRING,
              description: 'Feedback on grammar and word choice.',
            },
            improvedSpokenExample: {
              type: Type.STRING,
              description: `An improved example of the sentence in ${targetLanguage}.`,
            },
          },
          propertyOrdering: [
            'pronunciationAndClarity',
            'grammarAndWordChoice',
            'improvedSpokenExample',
          ],
        },
        maxOutputTokens: 512,
        temperature: 0.7,
        topK: 64,
        topP: 0.95,
      },
    });

    rawJsonStr = response.text?.trim();
    return parseJsonResponse<GenerateFeedbackResponse>(rawJsonStr, 'getSpeakingFeedback');
  } catch (error) {
    console.error('Error getting speaking feedback:', error);
    throw new Error('Failed to get feedback. Please try again.');
  }
};

export const generateWritingFeedback = async (
  writtenText: string,
  targetLanguage: string,
): Promise<GenerateWritingFeedbackResponse> => {
  let rawJsonStr = '';
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `You are a friendly, encouraging, and highly effective language tutor for learners of ${targetLanguage}. Your goal is to provide constructive feedback on written ${targetLanguage}, focusing on grammar, spelling, vocabulary, and natural flow for beginner learners. Keep feedback clear and simple. Always provide an improved version of the text.`;

    const prompt = `The user wrote the following text in ${targetLanguage}: "${writtenText}".

Please provide feedback on:
1.  **Grammar & Spelling:** Any grammatical errors or spelling mistakes?
2.  **Vocabulary & Flow:** Suggestions for more natural word choice or sentence structure?
3.  **Improved Writing Example:** Provide one clear, natural-sounding improved version of the text in ${targetLanguage}.

Return the feedback as a JSON object with the following keys: \`grammarAndSpelling\`, \`vocabularyAndFlow\`, and \`improvedWriting\`.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_WRITING,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grammarAndSpelling: {
              type: Type.STRING,
              description: 'Feedback on grammar and spelling.',
            },
            vocabularyAndFlow: {
              type: Type.STRING,
              description: 'Feedback on vocabulary and natural flow.',
            },
            improvedWriting: {
              type: Type.STRING,
              description: `An improved version of the written text in ${targetLanguage}.`,
            },
          },
          propertyOrdering: [
            'grammarAndSpelling',
            'vocabularyAndFlow',
            'improvedWriting',
          ],
        },
        maxOutputTokens: 512,
        temperature: 0.7,
        topK: 64,
        topP: 0.95,
      },
    });

    rawJsonStr = response.text?.trim();
    return parseJsonResponse<GenerateWritingFeedbackResponse>(rawJsonStr, 'generateWritingFeedback');
  } catch (error) {
    console.error('Error generating writing feedback:', error);
    throw new Error('Failed to get writing feedback. Please try again.');
  }
};

export const buildSentences = async (
  word: string,
  targetLanguage: string,
): Promise<BuildSentenceResponse> => {
  let rawJsonStr = '';
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Provide 3-5 example sentences using the word "${word}" in ${targetLanguage}, and a brief explanation of its common usage. The sentences should be suitable for a beginner language learner.

Return the response as a JSON object with the keys \`sentences\` (an array of strings) and \`explanation\` (a string).`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_SENTENCE_BUILDER,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentences: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Example sentences using the word in ${targetLanguage}.`,
            },
            explanation: {
              type: Type.STRING,
              description: `Explanation of the word's usage in ${targetLanguage}.`,
            },
          },
          propertyOrdering: ['sentences', 'explanation'],
        },
        maxOutputTokens: 256,
        temperature: 0.5,
      },
    });

    rawJsonStr = response.text?.trim();
    return parseJsonResponse<BuildSentenceResponse>(rawJsonStr, 'buildSentences');
  } catch (error) {
    console.error('Error building sentences:', error);
    throw new Error('Failed to build sentences. Please try again.');
  }
};

export const getMeaningAndContext = async (
  query: string,
  targetLanguage: string,
): Promise<GetMeaningAndContextResponse> => {
  let rawJsonStr = '';
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `For the ${targetLanguage} word or phrase "${query}", provide a concise definition, 2-3 example sentences, and a brief explanation of its common context or nuances.

Return the response as a JSON object with the keys \`definition\` (string), \`examples\` (array of strings), and \`context\` (string).`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_MEANING_CONTEXT,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: {
              type: Type.STRING,
              description: `Definition of the word/phrase in ${targetLanguage}.`,
            },
            examples: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Example sentences using the word/phrase in ${targetLanguage}.`,
            },
            context: {
              type: Type.STRING,
              description: `Contextual explanation of the word/phrase in ${targetLanguage}.`,
            },
          },
          propertyOrdering: ['definition', 'examples', 'context'],
        },
        maxOutputTokens: 512,
        temperature: 0.6,
      },
    });

    rawJsonStr = response.text?.trim();
    return parseJsonResponse<GetMeaningAndContextResponse>(rawJsonStr, 'getMeaningAndContext');
  } catch (error) {
    console.error('Error getting meaning and context:', error);
    throw new Error('Failed to get meaning and context. Please try again.');
  }
};