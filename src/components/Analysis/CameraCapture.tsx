import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, FlipHorizontal, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string>('');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasStream, setHasStream] = useState(false);

  const stopCamera = useCallback(() => {
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // Clear video source
    if (videoRef.current) {
      const video = videoRef.current;
      video.srcObject = null;
      video.load(); // Force cleanup
    }

    setIsVideoReady(false);
    setHasStream(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      // First ensure any existing streams are stopped
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Wait a bit before starting new stream
      await new Promise(resolve => setTimeout(resolve, 100));

      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasStream(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      stopCamera(); // Make sure to cleanup on error

      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            setError('Please allow camera access in your browser settings');
            break;
          case 'NotFoundError':
            setError('No camera found on your device');
            break;
          case 'NotReadableError':
            setError('Camera is busy. Please refresh the page or restart your browser');
            break;
          default:
            setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('Failed to start camera');
      }
      setIsVideoReady(false);
    }
  }, [facingMode, stopCamera]);

  const toggleCamera = () => {
    setFacingMode(current => current === 'user' ? 'environment' : 'user');
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) {
      setError('Camera is not ready');
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        setError('Failed to capture image');
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      onCapture(imageData);
      onClose();
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture image');
    }
  };

  // Start camera when component mounts or facingMode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      startCamera();
    }, 500); // Add a small delay before starting camera

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [facingMode, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (videoRef.current) {
      setIsVideoReady(true);
    }
  }, [videoRef]);

  const handleCapture = () => {
    captureImage();
  };

  return (
    <div className="space-y-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {!hasStream && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Camera size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Camera access required</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please allow access to your camera</p>
              </div>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${hasStream ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleCapture}
          disabled={!hasStream}
          className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Camera className="mr-2 h-5 w-5" />
          Capture Photo
        </button>

        <button
          onClick={onClose}
          className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <X className="mr-2 h-5 w-5" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
