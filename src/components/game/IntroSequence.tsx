
import React, { useState, useEffect } from 'react';

interface IntroSequenceProps {
  onComplete: () => void;
}

const IntroSequence = ({ onComplete }: IntroSequenceProps) => {
  const [phase, setPhase] = useState<'loader' | 'enter' | 'laser' | 'welcome'>('loader');
  const [progress, setProgress] = useState(0);
  const [showLaser, setShowLaser] = useState(false);
  const [laserExpand, setLaserExpand] = useState(false);

  // Loader phase (0-5s)
  useEffect(() => {
    if (phase === 'loader') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setPhase('enter'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleEnterClick = () => {
    setPhase('laser');
    setShowLaser(true);
    
    // Play synth sound (simulated with Web Audio API)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 2);
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 2);
    } catch (error) {
      console.log('Audio context not available');
    }

    // Laser sequence
    setTimeout(() => {
      setLaserExpand(true);
    }, 1000);

    setTimeout(() => {
      setPhase('welcome');
    }, 3000);

    setTimeout(() => {
      onComplete();
    }, 8000);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Background static effect */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            animation: 'glitch 0.2s infinite linear'
          }}
        />
      </div>

      {/* Loader Phase */}
      {phase === 'loader' && (
        <div className="text-center z-10 px-8 max-w-4xl animate-fade-in">
          <div className="space-y-8 mb-16">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white leading-tight">
              ゲームへようこそ
            </h1>
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-red-500 leading-tight">
              [GAME]
            </h2>
            <h3 className="text-3xl md:text-5xl font-orbitron font-bold text-white leading-tight">
              ウェルカムプレイヤー
            </h3>
            <p className="text-2xl md:text-3xl font-orbitron text-gray-300 leading-tight">
              Welcome Players
            </p>
          </div>

          {/* Square Glowing Loader */}
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 border-2 border-red-500 animate-pulse">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-100 ease-out animate-glow-pulse"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-space text-white text-xl font-bold">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Enter Button Phase */}
      {phase === 'enter' && (
        <div className="text-center z-10 animate-fade-in">
          <button
            onClick={handleEnterClick}
            className="px-20 py-8 bg-transparent border-4 border-white text-white font-orbitron font-bold text-4xl hover:bg-white hover:text-black transition-all duration-300 animate-glow-pulse"
          >
            ENTER
          </button>
        </div>
      )}

      {/* Laser Phase */}
      {phase === 'laser' && (
        <>
          {/* Vertical laser beam */}
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-2 bg-gradient-to-b from-red-500 to-transparent transition-all duration-1000 ${showLaser ? 'h-full' : 'h-0'}`}>
            <div className="absolute inset-0 bg-red-500 blur-sm opacity-70" />
            <div className="absolute inset-0 bg-white blur-xs opacity-50" />
          </div>

          {/* Expanding circular effect */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-900 transition-all duration-2000 ${laserExpand ? 'w-screen h-screen scale-150' : 'w-4 h-4'} opacity-80`} />

          {/* Glitch overlay */}
          <div className="absolute inset-0 bg-red-500 opacity-10 animate-glitch" />
        </>
      )}

      {/* Welcome Message Phase */}
      {phase === 'welcome' && (
        <div className="text-center z-10 px-8 max-w-4xl animate-fade-in">
          <div className="space-y-8">
            <p className="text-2xl md:text-3xl font-orbitron text-white leading-relaxed">
              "You've crossed the line that separates choice from consequence."
            </p>
            <p className="text-2xl md:text-3xl font-orbitron text-red-400 leading-relaxed">
              "Every move you make is already being judged."
            </p>
            <p className="text-2xl md:text-3xl font-orbitron text-white leading-relaxed">
              "Welcome to Borderland — where survival is just another illusion."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntroSequence;
