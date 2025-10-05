import React from 'react';
import { SearchIcon } from './IconComponents';

interface HeaderProps {
  step: 'input' | 'analyzing' | 'result';
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ step, searchQuery, onSearchChange }) => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        MeloMood
      </h1>
      <p className="mt-2 text-lg text-gray-300">
        Your personal AI DJ, tuning into your emotions.
      </p>
      {step === 'result' && (
        <div className="mt-6 relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search playlist by title or artist..."
            className="block w-full bg-gray-700/50 border border-gray-600 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            aria-label="Search playlist"
          />
        </div>
      )}
    </header>
  );
};