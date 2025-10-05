
import React, { useState } from 'react';
import { PencilIcon } from './IconComponents';

interface TextInputProps {
  onAnalyze: (text: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ onAnalyze }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How are you feeling right now? e.g., 'energetic and ready to go' or 'calm and thoughtful'"
        className="w-full h-28 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        <PencilIcon />
        Analyze Mood
      </button>
    </form>
  );
};
