import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MicrophoneIcon } from './IconComponents';

interface VoiceInputProps {
  onAnalyze: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onAnalyze }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dataCollectorId = useRef<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const collectedDataRef = useRef<{ pitch: number[], volume: number[] }>({ pitch: [], volume: [] });

  const stopRecording = useCallback(() => {
    if (dataCollectorId.current) {
      cancelAnimationFrame(dataCollectorId.current);
      dataCollectorId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
  }, []);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  const analyzeVocalCharacteristics = () => {
    const { pitch, volume } = collectedDataRef.current;
    if (volume.length < 60) { // Require at least 1 second of audio
        setError("Could not collect enough audio data. Please try speaking for a bit longer.");
        return;
    }

    const getAverage = (data: number[]) => data.reduce((a, b) => a + b, 0) / data.length;
    const getStdDev = (data: number[], avg: number) => Math.sqrt(data.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / data.length);

    // --- Pitch Analysis ---
    const avgPitch = getAverage(pitch);
    const pitchStdDev = getStdDev(pitch, avgPitch);
    const pitchLabel = avgPitch > 70 ? "high-pitched" : avgPitch < 40 ? "low-pitched" : "medium-pitched";
    const pitchVariationLabel = pitchStdDev > 15 ? "varied and expressive" : "monotonic";

    // --- Volume/Dynamics Analysis ---
    const avgVolume = getAverage(volume);
    const volumeStdDev = getStdDev(volume, avgVolume);
    const dynamicsLabel = volumeStdDev > 0.05 ? "dynamic" : "level";
    
    // --- Rhythm/Tempo Analysis ---
    const SILENCE_THRESHOLD = 0.01; // RMS value below which is considered silence
    const SAMPLES_PER_SECOND = 60; // Based on requestAnimationFrame ~60fps
    const MIN_BURST_SAMPLES = 5; // Min number of consecutive loud samples to be a burst

    let silenceDurationsInSamples: number[] = [];
    let speechBursts = 0;
    let currentSilenceSamples = 0;
    let inBurst = false;
    let consecutiveSpeechSamples = 0;

    volume.forEach(v => {
      if (v > SILENCE_THRESHOLD) {
        consecutiveSpeechSamples++;
        if (!inBurst && consecutiveSpeechSamples >= MIN_BURST_SAMPLES) {
            // Start of a new burst
            inBurst = true;
            speechBursts++;
            if (currentSilenceSamples > 0 && speechBursts > 1) { // Only count pauses between bursts
              silenceDurationsInSamples.push(currentSilenceSamples);
            }
            currentSilenceSamples = 0;
        }
      } else { // In silence
        inBurst = false;
        consecutiveSpeechSamples = 0;
        currentSilenceSamples++;
      }
    });

    const totalDurationSeconds = volume.length / SAMPLES_PER_SECOND;
    const speechRateHz = totalDurationSeconds > 0 ? speechBursts / totalDurationSeconds : 0;
    
    let speechRateLabel = "moderate";
    if (speechRateHz > 3.5) { // more than 3.5 speech events per second
      speechRateLabel = "rapid";
    } else if (speechRateHz < 1.5 && speechRateHz > 0) { // less than 1.5 events per second
      speechRateLabel = "slow and deliberate";
    }

    let pauseDescription = "with a moderate rhythm of pauses";
    if (speechBursts <= 1 && totalDurationSeconds > 1.5) {
      pauseDescription = "speaking continuously with few pauses";
    } else if (silenceDurationsInSamples.length > 0) {
      const avgPauseSamples = getAverage(silenceDurationsInSamples);
      const avgPauseDurationSeconds = avgPauseSamples / SAMPLES_PER_SECOND;
      if (avgPauseDurationSeconds > 0.75) {
        pauseDescription = "with long, thoughtful pauses";
      } else if (avgPauseDurationSeconds < 0.25) {
        pauseDescription = "with short, quick pauses";
      }
    }

    const description = `The user's voice is ${pitchLabel} with ${pitchVariationLabel} intonation. The speech has a ${speechRateLabel} tempo, ${pauseDescription}. The volume is ${dynamicsLabel}.`;
    onAnalyze(description);
  };


  const startRecording = async () => {
    setError(null);
    if (isListening) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;
        
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;
        analyserRef.current = analyser;
        
        source.connect(analyser);
        
        collectedDataRef.current = { pitch: [], volume: [] };
        setIsListening(true);
        
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);
        const timeDomainData = new Uint8Array(analyser.fftSize);
        const canvas = canvasRef.current;
        const canvasCtx = canvas?.getContext('2d');

        const collectAndDraw = () => {
            if (!analyserRef.current || !canvas || !canvasCtx) return;

            analyserRef.current.getByteFrequencyData(frequencyData);
            analyserRef.current.getByteTimeDomainData(timeDomainData);
            
            // --- Data Collection ---
            let weightedSum = 0;
            let totalWeight = 0;
            frequencyData.forEach((value, index) => {
                weightedSum += value * index;
                totalWeight += value;
            });
            const avgFrequencyBin = totalWeight > 0 ? weightedSum / totalWeight : 0;
            collectedDataRef.current.pitch.push(avgFrequencyBin);

            let sumSquares = 0.0;
            for (const amplitude of timeDomainData) {
                const normalized = amplitude / 128.0 - 1.0;
                sumSquares += normalized * normalized;
            }
            const rms = Math.sqrt(sumSquares / timeDomainData.length);
            collectedDataRef.current.volume.push(rms);

            // --- Visualization ---
            canvasCtx.fillStyle = 'rgb(24 24 27)'; // bg-zinc-900
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / analyserRef.current.frequencyBinCount) * 2.5;
            let x = 0;
            for(let i = 0; i < analyserRef.current.frequencyBinCount; i++) {
                const barHeight = frequencyData[i] * (canvas.height / 255);
                const hue = i / analyserRef.current.frequencyBinCount * 360;
                canvasCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }

            dataCollectorId.current = requestAnimationFrame(collectAndDraw);
        };
        collectAndDraw();

    } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Microphone access denied. Please enable it in your browser settings.");
        stopRecording();
    }
  };

  const handleToggleRecording = () => {
    if (isListening) {
      stopRecording();
      analyzeVocalCharacteristics();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-gray-400 text-center">
            {isListening ? "Speak into your microphone..." : "Click to record your voice and analyze its tone."}
        </p>
        <div className="w-full h-28 bg-zinc-900 border border-gray-600 rounded-lg">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      
        <button
            type="button"
            onClick={handleToggleRecording}
            className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ${
            isListening 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
            }`}
        >
            <MicrophoneIcon />
            <span>{isListening ? 'Stop & Analyze' : 'Start Recording'}</span>
            {isListening && <span className="absolute h-full w-full bg-white/20 rounded-lg animate-ping"></span>}
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};