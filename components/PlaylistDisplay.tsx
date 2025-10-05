import React from 'react';
import { Emotion, Song, Platform } from '../types';
import { ThumbsUpIcon, ThumbsDownIcon, MusicPlatformIcon, RefreshIcon, TrashIcon } from './IconComponents';

interface PlaylistDisplayProps {
  emotion: Emotion | null;
  playlist: Song[];
  platform: Platform;
  onReset: () => void;
  onFeedback: (song: Song, type: 'like' | 'dislike') => void;
  feedbackHistory: { liked: Song[], disliked: Song[] };
  searchQuery: string;
  onClearFeedback: () => void;
}

export const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({ emotion, playlist, platform, onReset, onFeedback, feedbackHistory, searchQuery, onClearFeedback }) => {
  const emotionColorMap: Record<Emotion, string> = {
    Happy: 'from-yellow-400 to-orange-500',
    Sad: 'from-blue-400 to-indigo-500',
    Angry: 'from-red-500 to-red-700',
    Fear: 'from-purple-500 to-purple-700',
    Surprise: 'from-pink-400 to-rose-500',
    Excited: 'from-lime-400 to-green-500',
    Neutral: 'from-gray-500 to-gray-600',
    Calm: 'from-sky-400 to-cyan-500',
    Content: 'from-emerald-400 to-teal-500',
    Energetic: 'from-amber-400 to-yellow-500',
    Thoughtful: 'from-indigo-400 to-violet-500',
  };

  const gradient = emotion ? emotionColorMap[emotion] : emotionColorMap['Neutral'];

  const filteredPlaylist = searchQuery
    ? playlist.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : playlist;
  
  const hasFeedback = feedbackHistory.liked.length > 0 || feedbackHistory.disliked.length > 0;

  return (
    <div className="p-4 sm:p-6">
      <div className={`text-center p-6 rounded-t-lg bg-gradient-to-br ${gradient}`}>
        {emotion && (
            <div className="mb-3">
                <span className="inline-block bg-black/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-inner">
                    {emotion}
                </span>
            </div>
        )}
        <h2 className="text-3xl font-bold text-white shadow-black/30 text-shadow">Your Curated Playlist</h2>
        <p className="text-white/80 mt-1">Based on your mood for {platform}</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-b-lg">
        {filteredPlaylist.length > 0 ? (
          <ul className="space-y-3">
            {filteredPlaylist.map((song) => (
              <SongItem key={`${song.title}-${song.artist}`} song={song} platform={platform} onFeedback={onFeedback} feedbackHistory={feedbackHistory} />
            ))}
          </ul>
        ) : playlist.length > 0 && searchQuery ? (
          <p className="text-center text-gray-400 py-4">
            No songs match your search for "<span className="font-semibold text-gray-300">{searchQuery}</span>".
          </p>
        ) : (
          <p className="text-center text-gray-400 py-4">No songs found. Try a different mood!</p>
        )}
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-2 font-semibold text-white bg-gray-600 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
          >
            <RefreshIcon />
            Start Over
          </button>
          {hasFeedback && (
            <button
              onClick={onClearFeedback}
              className="inline-flex items-center gap-2 px-6 py-2 font-semibold text-white bg-red-600/80 rounded-full shadow-lg hover:bg-red-700/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
              aria-label="Clear all feedback history"
            >
              <TrashIcon />
              Clear Feedback
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const createSearchLink = (song: Song, platform: Platform): string => {
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  switch (platform) {
    case 'Spotify':
      return `https://open.spotify.com/search/${query}`;
    case 'YouTube Music':
      return `https://music.youtube.com/search?q=${query}`;
    case 'Apple Music':
      return `https://music.apple.com/us/search?term=${query}`;
    default:
      return '#';
  }
};

interface SongItemProps {
    song: Song;
    platform: Platform;
    onFeedback: (song: Song, type: 'like' | 'dislike') => void;
    feedbackHistory: { liked: Song[], disliked: Song[] };
}

const SongItem: React.FC<SongItemProps> = ({ song, platform, onFeedback, feedbackHistory }) => {
    const isLiked = feedbackHistory.liked.some(s => s.title === song.title && s.artist === song.artist);
    const isDisliked = feedbackHistory.disliked.some(s => s.title === song.title && s.artist === song.artist);

    const searchLink = createSearchLink(song, platform);

    const itemClasses = `flex items-center bg-gray-700/50 p-3 rounded-lg transition-all duration-200 group ${
      isLiked ? 'bg-green-900/50 ring-1 ring-green-500/50' : ''
    } ${
      isDisliked ? 'opacity-50 hover:opacity-100' : 'hover:scale-[1.02] hover:bg-gray-700'
    }`;

    return (
        <li className={itemClasses}>
            <a 
              href={searchLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex items-center flex-grow min-w-0 ${isDisliked ? 'pointer-events-none' : ''}`}
              aria-label={`Listen to ${song.title} by ${song.artist} on ${platform}`}
              tabIndex={isDisliked ? -1 : 0}
            >
              <div className="flex-shrink-0 text-purple-400">
                <MusicPlatformIcon platform={platform} />
              </div>
              <div className="flex-grow ml-4 min-w-0">
                  <p className={`font-semibold text-white truncate transition-colors ${!isDisliked && 'group-hover:text-purple-300'}`}>{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist} &middot; {song.album}</p>
              </div>
            </a>
            <div className="flex items-center gap-1 ml-4">
                <button
                    onClick={() => onFeedback(song, 'like')}
                    className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-green-500 text-white' : 'hover:bg-green-500/20 text-green-400'}`}
                    aria-pressed={isLiked}
                    aria-label={isLiked ? "Unlike song" : "Like song"}
                >
                    <ThumbsUpIcon />
                </button>
                <button
                    onClick={() => onFeedback(song, 'dislike')}
                    className={`p-2 rounded-full transition-colors ${isDisliked ? 'bg-red-500 text-white' : 'hover:bg-red-500/20 text-red-400'}`}
                    aria-pressed={isDisliked}
                    aria-label={isDisliked ? "Remove dislike for song" : "Dislike song"}
                >
                    <ThumbsDownIcon />
                </button>
            </div>
        </li>
    );
};