
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon } from './IconComponents';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const setupCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Could not access camera. Please check your browser permissions and try again.");
        setIsCameraReady(false);
      }
    } else {
        setCameraError("Your browser does not support camera access.");
    }
  }, []);

  useEffect(() => {
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setupCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
        onCapture(base64Image);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-md rounded-lg overflow-hidden border-2 border-gray-700 bg-black aspect-[4/3]">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        {!isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4 text-center">
                {cameraError ? <p className="text-red-400">{cameraError}</p> : <p>Starting camera...</p>}
            </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleCapture}
        disabled={!isCameraReady}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        <CameraIcon />
        Capture Mood
      </button>
    </div>
  );
};
