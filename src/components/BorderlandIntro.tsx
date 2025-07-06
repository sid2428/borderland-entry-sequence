
import React, { useState, useEffect, useRef } from 'react';

const BorderlandIntro = () => {
  const [currentStep, setCurrentStep] = useState<'dialogue' | 'enter' | 'laser'>('dialogue');
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const laserSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio context and sounds
  useEffect(() => {
    // Create audio context for background music
    const createAudioContext = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(55, audioContext.currentTime); // Low A note
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      
      return { oscillator, gainNode, audioContext };
    };

    // Create laser sound effect
    const createLaserSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      return audioContext;
    };

    return () => {
      // Cleanup audio context
    };
  }, []);

  // Handle loader animation
  useEffect(() => {
    if (currentStep === 'dialogue') {
      const interval = setInterval(() => {
        setLoaderProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep('enter'), 1000);
            return 100;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleEnterClick = async () => {
    setCurrentStep('laser');
    
    // Play ambient music
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(110, audioContext.currentTime);
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 3);
      
      oscillator.start();
      
      // Play laser sound
      setTimeout(() => {
        const laserOscillator = audioContext.createOscillator();
        const laserGain = audioContext.createGain();
        
        laserOscillator.connect(laserGain);
        laserGain.connect(audioContext.destination);
        
        laserOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        laserOscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        laserOscillator.type = 'square';
        laserGain.gain.setValueAtTime(0.2, audioContext.currentTime);
        laserGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        laserOscillator.start();
        laserOscillator.stop(audioContext.currentTime + 0.5);
      }, 500);
      
    } catch (error) {
      console.log('Audio context not available');
    }

    // Trigger glitch effect after laser completes
    setTimeout(() => {
      setShowGlitch(true);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Background Static Effect */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            animation: 'glitch 0.1s infinite linear'
          }}
        />
      </div>

      {/* Step 1: Dialogue + Loader */}
      {currentStep === 'dialogue' && (
        <div className="text-center z-10 px-8 max-w-4xl">
          <div className="space-y-8 mb-16">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white leading-tight">
              Welcome to the Borderland.
            </h1>
            <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white leading-tight">
              Your presence has been recorded.
            </h2>
            <p className="text-2xl md:text-4xl font-orbitron font-bold text-white leading-tight">
              You may not leave unless the game ends — or you do.
            </p>
            <p className="text-lg md:text-xl font-space text-gray-300 mt-8">
              The countdown has already begun...
            </p>
          </div>

          {/* Progress Loader */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative w-full h-4 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
              {/* Loader Fill */}
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-100 ease-out"
                style={{ width: `${loaderProgress}%` }}
              />
              
              {/* Moving Dot */}
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg transition-all duration-100 ease-out"
                style={{ left: `${Math.max(0, loaderProgress - 2)}%` }}
              />
            </div>
            
            {/* Progress Text */}
            <div className="mt-4 font-space text-gray-400 text-sm">
              {loaderProgress}% COMPLETE
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Enter Button */}
      {currentStep === 'enter' && (
        <div className="text-center z-10">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <button
            onClick={handleEnterClick}
            className="relative z-20 px-16 py-6 bg-transparent border-2 border-red-600 text-red-500 font-orbitron font-bold text-2xl md:text-3xl hover:bg-red-600 hover:text-white transition-all duration-300 animate-fade-in animate-glow-pulse"
          >
            ENTER
          </button>
        </div>
      )}

      {/* Step 3: Laser Animation */}
      {currentStep === 'laser' && (
        <>
          {/* Laser Line */}
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg animate-laser-scan z-30">
            <div className="absolute inset-0 bg-red-500 blur-sm opacity-70" />
            <div className="absolute inset-0 bg-white blur-xs opacity-50" />
          </div>

          {/* Red Haze Effect */}
          <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-red-900 to-transparent animate-red-haze z-20 opacity-0" />

          {/* Glitched Text */}
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${showGlitch ? 'animate-glitch animate-fade-out' : ''}`}>
            <div className="text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white opacity-30">
                Welcome to the Borderland.
              </h1>
              <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white opacity-20">
                Your presence has been recorded.
              </h2>
            </div>
          </div>

          {/* Final Message */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40">
            <div className="animate-fade-in" style={{ animationDelay: '3s' }}>
              <p className="font-orbitron text-red-400 text-xl opacity-60">
                Begin.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BorderlandIntro;
