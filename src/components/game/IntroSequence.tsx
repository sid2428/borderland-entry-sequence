
import React, { useState, useEffect } from 'react';

interface IntroSequenceProps {
  onComplete: () => void;
}

const IntroSequence = ({ onComplete }: IntroSequenceProps) => {
  const [phase, setPhase] = useState<'loader' | 'enter' | 'laser' | 'blackout' | 'welcome'>('loader');
  const [progress, setProgress] = useState(0);
  const [laserBeams, setLaserBeams] = useState<number[]>([]);
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
    
    // Play subtle ambient psychological-thriller BGM
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Ambient background pad
      const padOscillator = audioContext.createOscillator();
      const padGain = audioContext.createGain();
      padOscillator.connect(padGain);
      padGain.connect(audioContext.destination);
      padOscillator.frequency.setValueAtTime(65, audioContext.currentTime); // Low C
      padOscillator.type = 'sine';
      padGain.gain.setValueAtTime(0.03, audioContext.currentTime);
      padOscillator.start();
      
      // Heartbeat-like pulse
      const pulseOscillator = audioContext.createOscillator();
      const pulseGain = audioContext.createGain();
      pulseOscillator.connect(pulseGain);
      pulseGain.connect(audioContext.destination);
      pulseOscillator.frequency.setValueAtTime(80, audioContext.currentTime);
      pulseOscillator.type = 'triangle';
      pulseGain.gain.setValueAtTime(0.02, audioContext.currentTime);
      pulseOscillator.start();
      
      // Subtle tension synth
      const synthOscillator = audioContext.createOscillator();
      const synthGain = audioContext.createGain();
      synthOscillator.connect(synthGain);
      synthGain.connect(audioContext.destination);
      synthOscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      synthOscillator.type = 'sawtooth';
      synthGain.gain.setValueAtTime(0.01, audioContext.currentTime);
      synthOscillator.start();
      
    } catch (error) {
      console.log('Audio context not available');
    }

    // Timed laser sequence - one beam every 0.1s for 5 seconds total
    const totalBeams = 24;
    const beamInterval = 5000 / totalBeams; // 5 seconds divided by total beams
    
    for (let i = 0; i < totalBeams; i++) {
      setTimeout(() => {
        setLaserBeams(prev => [...prev, i]);
      }, i * beamInterval);
    }

    // Blackout after laser sequence (5s)
    setTimeout(() => {
      setShowBlackout(true);
      setPhase('blackout');
    }, 5000);

    // Welcome message after blackout (immediately after blackout)
    setTimeout(() => {
      setShowWelcome(true);
      setPhase('welcome');
    }, 5200);

    // Complete sequence after 5 seconds of welcome message
    setTimeout(() => {
      onComplete();
    }, 10200); // 5s laser + 5s welcome = 10.2s total
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

      {/* Timed Laser Phase - One beam at a time falling */}
      {phase === 'laser' && (
        <>
          {laserBeams.map((beamIndex) => (
            <div
              key={beamIndex}
              className="absolute w-2 bg-gradient-to-b from-red-500 via-orange-400 to-transparent opacity-80"
              style={{
                left: `${(beamIndex * 4) + 10}%`,
                height: '100%',
                animation: `laser-rain 1.2s ease-in`,
              }}
            >
              <div className="absolute inset-0 bg-red-500 blur-md opacity-70" />
              <div className="absolute inset-0 bg-white blur-sm opacity-50" />
            </div>
          ))}

          {/* Light flare overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-red-400 via-transparent to-transparent opacity-20 animate-pulse z-20" />
        </>
      )}

      {/* Blackout Phase */}
      {showBlackout && (
        <div className="absolute inset-0 bg-black z-40 animate-fade-in" />
      )}

      {/* Glitched Welcome Message Phase - 5 seconds only */}
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
