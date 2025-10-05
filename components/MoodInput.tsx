import React from 'react';
import { CameraCapture } from './CameraCapture';
import { TextInput } from './TextInput';
import { VoiceInput } from './VoiceInput';
import { InputMode } from '../types';
import { CameraIcon, PencilIcon, MicrophoneIcon } from './IconComponents';

interface MoodInputProps {
  onAnalyze: (data: string) => void;
  error: string | null;
  mode: InputMode;
  setMode: (mode: InputMode) => void;
}

export const MoodInput: React.FC<MoodInputProps> = ({ onAnalyze, error, mode, setMode }) => {
  return (
    <div className="p-4">
      <div className="flex border-b border-gray-700 mb-4">
        <TabButton active={mode === 'camera'} onClick={() => setMode('camera')}>
          <CameraIcon />
          <span>Use Camera</span>
        </TabButton>
        <TabButton active={mode === 'text'} onClick={() => setMode('text')}>
          <PencilIcon />
          <span>Use Text</span>
        </TabButton>
        <TabButton active={mode === 'voice'} onClick={() => setMode('voice')}>
          <MicrophoneIcon />
          <span>Use Voice</span>
        </TabButton>
      </div>

      {mode === 'camera' && <CameraCapture onCapture={onAnalyze} />}
      {mode === 'text' && <TextInput onAnalyze={onAnalyze} />}
      {mode === 'voice' && <VoiceInput onAnalyze={onAnalyze} />}

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm">
          <p className="font-semibold">Analysis Failed</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

interface TabButtonProps {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ children, active, onClick }) => {
    const baseClasses = "flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-t-lg";
    const activeClasses = "border-b-2 border-purple-400 text-white";
    const inactiveClasses = "text-gray-400 hover:text-white hover:bg-gray-700/50";
    
    return (
        <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
};