import { GoogleGenAI, Type } from "@google/genai";
import { Emotion, EMOTIONS, Song, Platform, Weather } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const emotionAnalysisPrompt = `Analyze the user's facial expression in the provided image. Identify the primary emotion from the following list: ${EMOTIONS.join(', ')}. Provide your response as a single, raw JSON object with two keys: "emotion" (the detected emotion as a string) and "confidence" (a number between 0.0 and 1.0 representing your confidence level). Do not include any markdown formatting or any text outside of the JSON object.`;
const textAnalysisPrompt = `Analyze the user's text input and classify their mood into one of the following emotions: ${EMOTIONS.join(', ')}. Return only the single most fitting emotion as a string, with no additional text or punctuation.`;
const vocalAnalysisPrompt = `Analyze the following detailed description of a user's vocal characteristics to determine their emotional state. The description includes details on pitch, intonation, speech rate, pauses, and volume dynamics. Based on this, choose one of the following emotions: ${EMOTIONS.join(', ')}. For example, a low-pitched, monotonic voice with a slow speech rate and long pauses might indicate sadness or thoughtfulness. A high-pitched, dynamic voice with a rapid tempo and few pauses might indicate excitement or happiness. Return only the single most fitting emotion as a string, with no additional text or punctuation.`;

const emotionResponseSchema = {
    type: Type.OBJECT,
    properties: {
        emotion: {
            type: Type.STRING,
            enum: EMOTIONS,
            description: "The detected emotion."
        },
        confidence: {
            type: Type.NUMBER,
            description: "Confidence score between 0.0 and 1.0."
        }
    },
    required: ["emotion", "confidence"]
};

const playlistResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            album: { type: Type.STRING }
        },
        required: ["title", "artist", "album"]
    }
};

export const analyzeFacialEmotion = async (base64Image: string): Promise<{ emotion: Emotion, confidence: number }> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };
    const textPart = { text: emotionAnalysisPrompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, imagePart] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: emotionResponseSchema,
        }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (!EMOTIONS.includes(result.emotion)) {
        throw new Error(`Invalid emotion received: ${result.emotion}`);
    }

    return result;
};

export const analyzeTextEmotion = async (text: string): Promise<Emotion> => {
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${textAnalysisPrompt}\n\nUser text: "${text}"`,
  });

  const emotion = response.text.trim() as Emotion;

  if (!EMOTIONS.includes(emotion)) {
    // Fallback if the model returns something unexpected
    console.warn(`Unexpected emotion from text analysis: ${emotion}. Defaulting to Neutral.`);
    return 'Neutral';
  }

  return emotion;
};

export const analyzeVocalEmotion = async (vocalDescription: string): Promise<Emotion> => {
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${vocalAnalysisPrompt}\n\nVoice Description: "${vocalDescription}"`,
  });

  const emotion = response.text.trim() as Emotion;

  if (!EMOTIONS.includes(emotion)) {
    console.warn(`Unexpected emotion from vocal analysis: ${emotion}. Defaulting to Neutral.`);
    return 'Neutral';
  }

  return emotion;
};


interface PlaylistContext {
    platform: Platform;
    weather: Weather;
    timeOfDay: string;
    feedbackHistory: { liked: Song[], disliked: Song[] };
}

export const getPlaylistRecommendation = async (emotion: Emotion, context: PlaylistContext): Promise<Song[]> => {
    const { platform, weather, timeOfDay, feedbackHistory } = context;

    let prompt = `I'm feeling ${emotion}. It's currently ${timeOfDay} and the weather is ${weather}.
    Please recommend a playlist of 5 Hindi songs available on ${platform} that match this mood and context.
    The response must be a single, raw JSON array of objects, where each object has "title", "artist", and "album" keys.
    Do not include any markdown formatting or any text outside of the JSON array.`;

    if (feedbackHistory.liked.length > 0) {
        prompt += `\nI have previously liked these songs, so find something similar but not the same: ${feedbackHistory.liked.map(s => `${s.title} by ${s.artist}`).join(', ')}.`;
    }
    if (feedbackHistory.disliked.length > 0) {
        prompt += `\nI have previously disliked these songs, so please avoid anything similar: ${feedbackHistory.disliked.map(s => `${s.title} by ${s.artist}`).join(', ')}.`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: playlistResponseSchema,
        },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
};