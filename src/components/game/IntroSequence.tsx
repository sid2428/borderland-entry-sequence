
import React, { useState, useEffect } from 'react';

interface IntroSequenceProps {
  onComplete: () => void;
}

const IntroSequence = ({ onComplete }: IntroSequenceProps) => {
  const [phase, setPhase] = useState<'loader' | 'enter' | 'laser' | 'blackout' | 'welcome'>('loader');
  const [progress, setProgress] = useState(0);
  const [showLasers, setShowLasers] = useState(false);
  const [showBlackout, setShowBlackout] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

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
    
    // Play cinematic laser burst sound with dark techno background
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Background dark techno/synth soundtrack
      const bgOscillator = audioContext.createOscillator();
      const bgGain = audioContext.createGain();
      bgOscillator.connect(bgGain);
      bgGain.connect(audioContext.destination);
      bgOscillator.frequency.setValueAtTime(55, audioContext.currentTime);
      bgOscillator.type = 'sawtooth';
      bgGain.gain.setValueAtTime(0.1, audioContext.currentTime);
      bgOscillator.start();
      
      // Fiery laser burst sound
      const laserOscillator = audioContext.createOscillator();
      const laserGain = audioContext.createGain();
      laserOscillator.connect(laserGain);
      laserGain.connect(audioContext.destination);
      laserOscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
      laserOscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 1);
      laserOscillator.type = 'square';
      laserGain.gain.setValueAtTime(0.3, audioContext.currentTime);
      laserGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      laserOscillator.start();
      laserOscillator.stop(audioContext.currentTime + 1);
      
    } catch (error) {
      console.log('Audio context not available');
    }

    // Laser sequence
    setTimeout(() => {
      setShowLasers(true);
    }, 200);

    // Blackout after laser overwhelm
    setTimeout(() => {
      setShowBlackout(true);
      setPhase('blackout');
    }, 2000);

    // Welcome message after blackout
    setTimeout(() => {
      setShowWelcome(true);
      setPhase('welcome');
    }, 3000);

    // Complete sequence
    setTimeout(() => {
      onComplete();
    }, 13000);
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

      {/* Laser Phase - Fiery vertical beam and raining lasers */}
      {phase === 'laser' && (
        <>
          {/* Primary fiery vertical laser beam piercing the button */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-full bg-gradient-to-b from-red-500 via-orange-400 to-red-600 animate-pulse z-30">
            <div className="absolute inset-0 bg-red-500 blur-lg opacity-80" />
            <div className="absolute inset-0 bg-white blur-sm opacity-60" />
            <div className="absolute inset-0 bg-orange-300 blur-xs opacity-40" />
          </div>

          {/* Dozens of raining laser beams */}
          {showLasers && [...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 bg-gradient-to-b from-red-500 via-orange-400 to-transparent opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                height: '100%',
                animation: `laser-rain ${0.8 + Math.random() * 0.6}s ease-in infinite`,
                animationDelay: `${Math.random() * 1.5}s`
              }}
            >
              <div className="absolute inset-0 bg-red-500 blur-md opacity-70" />
              <div className="absolute inset-0 bg-white blur-sm opacity-50" />
              
              {/* Spark particles on impact */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-4 bg-orange-400 rounded-full animate-ping opacity-75" />
                <div className="w-2 h-2 bg-white rounded-full animate-pulse opacity-90" />
              </div>
            </div>
          ))}

          {/* Light flare overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-red-400 via-transparent to-transparent opacity-30 animate-pulse z-20" />
          
          {/* Overwhelming light effect */}
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse z-25" />
        </>
      )}

      {/* Blackout Phase */}
      {showBlackout && (
        <div className="absolute inset-0 bg-black z-40 animate-fade-in" />
      )}

      {/* Glitched Welcome Message Phase */}
      {showWelcome && (
        <div className="absolute inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center px-8 max-w-4xl space-y-8">
            <p className="text-2xl md:text-3xl font-orbitron text-white leading-relaxed animate-glitch">
              "You've crossed the line that separates choice from consequence."
            </p>
            <p className="text-2xl md:text-3xl font-orbitron text-red-400 leading-relaxed animate-glitch" style={{ animationDelay: '0.5s' }}>
              "Every move you make is already being judged."
            </p>
            <p className="text-2xl md:text-3xl font-orbitron text-white leading-relaxed animate-glitch" style={{ animationDelay: '1s' }}>
              "Welcome to Borderland — where survival is just another illusion."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntroSequence;
