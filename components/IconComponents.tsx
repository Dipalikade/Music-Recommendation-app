import React from 'react';
import { Platform, Weather } from '../types';

export const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    <path fillRule="evenodd" d="M14.5 10a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM2 9.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z" clipRule="evenodd" />
  </svg>
);

export const PencilIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

export const MicrophoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" />
  </svg>
);

export const ThumbsUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.364a1 1 0 00.942-.671l1.659-5.808a1 1 0 00-1.9- .54l-1.34 4.692V10h-1v6.111l-1-1.85V10h-1v4.75L9 13.018V10h-1v3.333L7 12.03V10H6z" />
    </svg>
);

export const ThumbsDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1H6.636a1 1 0 00-.942.671L4.035 8.48A1 1 0 006 10h1V3.889l1 1.85V10h1V5.25L11 6.982V10h1V6.667L13 7.97V10h1z" />
    </svg>
);

export const RefreshIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a14.6 14.6 0 0115 2.1M20 20a14.6 14.6 0 01-15-2.1" />
  </svg>
);

export const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const LocationMarkerIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

export const TrashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const SpotifyIcon: React.FC = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 168 168"><path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.25 37.494 83.742 83.743 83.742 46.25 0 83.744-37.493 83.744-83.742s-37.494-83.742-83.744-83.742m38.404 120.78a5.225 5.225 0 01-7.18 2.553l-33.536-20.584a5.227 5.227 0 01-2.553-7.18 5.225 5.225 0 017.18-2.553l33.536 20.584a5.226 5.226 0 012.553 7.18m8.31-23.013a5.227 5.227 0 01-8.243 3.243L84.15 80.343a5.227 5.227 0 01-3.243-8.244 5.227 5.227 0 018.244-3.243l38.313 22.988a5.226 5.226 0 013.243 8.243M83.454 52.825a5.227 5.227 0 01-4.008-8.995l46.29-27.822a5.227 5.227 0 018.995 4.008 5.227 5.227 0 01-4.008 8.995l-46.29 27.822a5.223 5.223 0 01-1.02.587h.04z"/></svg>
);

export const AppleMusicIcon: React.FC = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.11 9.091a3.72 3.72 0 01-1.09-2.617c0-2.318 1.488-3.528 3.528-3.575a.355.355 0 01.35.378v.118a3.916 3.916 0 00-2.385 3.693c0 2.128 1.25 3.338 3.106 3.338a.33.33 0 01.33.33v-.023a4.005 4.005 0 01-3.84 2.87c-2.363 0-3.6-1.34-4.665-1.34-1.11 0-2.43 1.34-4.286 1.34-2.225 0-3.957-1.554-5.11-3.818C1.554 11.235 2.13 6.09 4.39 3.868c1.133-1.133 2.64-1.84 4.195-1.84 2.083 0 3.283 1.25 4.286 1.25s1.945-1.25 3.887-1.25c1.11 0 2.503.566 3.55 1.692a.37.37 0 01-.023.543l-1.02.81a.36.36 0 01-.482-.047c-.742-.765-1.533-1.157-2.477-1.157-1.363 0-2.686 1.043-3.6 1.043-1.043 0-2.43-1.205-4.032-1.205-2.015 0-3.864 1.488-5.018 3.016-1.923 2.57 0 7.42 2.64 7.42.925 0 1.67-.543 2.92-1.647a.38.38 0 01.528-.024l.995.787c-.833 1.133-2.083 2.15-3.692 2.15-2.037 0-3.015-1.84-3.106-1.887a.36.36 0 01.306-.612c.164.07 1.76.81 2.848.81.948 0 1.945-1.02 3.48-1.02s2.293 1.02 3.338 1.02c1.458 0 2.408-.995 3.237-2.196a.37.37 0 01.543-.164l.972.543c-.413.788-1.043 1.488-1.9 1.923z"/></svg>
);

export const YouTubeMusicIcon: React.FC = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 14.5c-2.485 0-4.5-2.015-4.5-4.5S9.515 7.5 12 7.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm5.176-3.824l-3.21 1.832a5.96 5.96 0 00-3.966 0L6.824 5.676A8.003 8.003 0 0112 4c1.815 0 3.504.606 4.896 1.632l.28-.156z"/></svg>
);

export const MusicPlatformIcon: React.FC<{ platform: Platform }> = ({ platform }) => {
  switch (platform) {
    case 'Spotify': return <SpotifyIcon />;
    case 'Apple Music': return <AppleMusicIcon />;
    case 'YouTube Music': return <YouTubeMusicIcon />;
    default: return null;
  }
};

export const SunnyIcon: React.FC = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
export const CloudyIcon: React.FC = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
export const RainyIcon: React.FC = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10a4 4 0 00-4-4h-1.42A5.992 5.992 0 006 10c0 .35.02.69.06.1A4.002 4.002 0 003 14a4 4 0 004 4h10a4 4 0 004-4c0-1.1-.45-2.1-1.17-2.83M16 14v4M12 16v4M8 14v4" /></svg>;
export const SnowyIcon: React.FC = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 10a4 4 0 00-4-4h-1.42A5.992 5.992 0 006 10c0 .35.02.69.06.1A4.002 4.002 0 003 14a4 4 0 004 4h10a4 4 0 004-4c0-1.1-.45-2.1-1.17-2.83M16 17l-1-1 1-1m-4 2l-1-1 1-1m-4 2l-1-1 1-1" /></svg>;

export const WeatherIcon: React.FC<{ weather: Weather }> = ({ weather }) => {
  switch (weather) {
    case 'Sunny': return <SunnyIcon />;
    case 'Cloudy': return <CloudyIcon />;
    case 'Rainy': return <RainyIcon />;
    case 'Snowy': return <SnowyIcon />;
    default: return null;
  }
};