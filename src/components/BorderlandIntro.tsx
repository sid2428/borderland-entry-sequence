
import React, { useState, useEffect, useRef } from 'react';

const BorderlandIntro = () => {
  const [currentStep, setCurrentStep] = useState<'loading' | 'enter' | 'laser' | 'welcome'>('loading');
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [showLaserHole, setShowLaserHole] = useState(false);
  const [showExpandingLaser, setShowExpandingLaser] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Loading animation - exactly 5 seconds
  useEffect(() => {
    if (currentStep === 'loading') {
      const interval = setInterval(() => {
        setLoaderProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep('enter'), 500);
            return 100;
          }
          return prev + 2; // 50 steps * 100ms = 5 seconds
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleEnterClick = async () => {
    setCurrentStep('laser');
    
    // Play laser sound effect
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create satisfying laser sound
      const createLaserSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.8);
        oscillator.type = 'sawtooth';
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
      };
      
      createLaserSound();
    } catch (error) {
      console.log('Audio context not available');
    }

    // Show laser hole after 0.5s
    setTimeout(() => {
      setShowLaserHole(true);
    }, 500);

    // Expand laser after 1.5s
    setTimeout(() => {
      setShowExpandingLaser(true);
    }, 1500);

    // Transition to welcome after 3.5s
    setTimeout(() => {
      setCurrentStep('welcome');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Neon Card Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/b8c7f8f8-c49b-40ba-8726-34a372b0c5ff.png')`,
          transform: 'scale(1.1)',
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      {/* Parallax overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      
      {/* Static overlay for extra neon effect */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,20,147,0.3) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      </div>

      {/* Loading Screen */}
      {currentStep === 'loading' && (
        <div className="text-center z-10 px-8 max-w-4xl">
          <div className="space-y-12 mb-20">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 leading-tight animate-pulse">
              NEON CARD REALM
            </h1>
            <p className="text-xl md:text-2xl font-space text-pink-300 opacity-80">
              Initializing quantum deck protocol...
            </p>
          </div>

          {/* Neon Loading Bar */}
          <div className="w-full max-w-lg mx-auto">
            <div className="relative w-full h-6 bg-gray-900 rounded-full border-2 border-pink-500 overflow-hidden shadow-lg shadow-pink-500/50">
              {/* Neon glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-sm" />
              
              {/* Progress fill */}
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 transition-all duration-100 ease-out shadow-lg"
                style={{ 
                  width: `${loaderProgress}%`,
                  boxShadow: '0 0 20px rgba(255,20,147,0.8), inset 0 0 20px rgba(255,255,255,0.2)'
                }}
              />
              
              {/* Moving spark */}
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-100 ease-out"
                style={{ 
                  left: `${Math.max(0, loaderProgress - 3)}%`,
                  boxShadow: '0 0 15px rgba(255,255,255,0.9)'
                }}
              />
            </div>
            
            <div className="mt-6 font-space text-pink-400 text-lg font-bold">
              {loaderProgress}% COMPLETE
            </div>
          </div>
        </div>
      )}

      {/* Enter Button */}
      {currentStep === 'enter' && (
        <div className="text-center z-10 relative">
          <button
            onClick={handleEnterClick}
            className="relative px-20 py-8 bg-transparent border-3 border-pink-500 text-pink-400 font-orbitron font-bold text-3xl md:text-4xl hover:bg-pink-500/10 transition-all duration-300 rounded-lg shadow-lg shadow-pink-500/50 animate-pulse"
            style={{
              boxShadow: '0 0 30px rgba(255,20,147,0.6), inset 0 0 30px rgba(255,20,147,0.1)'
            }}
          >
            ENTER
            {/* Laser hole effect */}
            {showLaserHole && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      )}

      {/* Laser Animation */}
      {currentStep === 'laser' && (
        <>
          {/* Horizontal laser beam */}
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent top-1/2 transform -translate-y-1/2 z-30 shadow-lg shadow-red-500/70">
            <div className="absolute inset-0 bg-red-500 blur-sm opacity-70" />
            <div className="absolute inset-0 bg-white blur-xs opacity-50" />
          </div>

          {/* Expanding laser effect */}
          {showExpandingLaser && (
            <div className="absolute inset-0 z-40">
              <div className="absolute inset-0 bg-red-500/20 animate-ping" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/50 via-transparent to-red-500/50 animate-pulse" />
            </div>
          )}
        </>
      )}

      {/* Welcome Screen */}
      {currentStep === 'welcome' && (
        <div className="text-center z-10 px-8 max-w-6xl animate-fade-in">
          <div className="space-y-16">
            {/* Welcome Message */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 leading-tight">
                Welcome to the Realm of Cards
              </h1>
              <p className="text-lg md:text-xl font-space text-pink-300 opacity-80 max-w-2xl mx-auto">
                Every card holds a secret. Tap to reveal yours.
              </p>
            </div>

            {/* Four Playing Cards */}
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {[
                { suit: '♠', value: 'A', color: 'text-white', glow: 'shadow-white/50' },
                { suit: '♥', value: 'K', color: 'text-red-500', glow: 'shadow-red-500/50' },
                { suit: '♦', value: 'Q', color: 'text-pink-500', glow: 'shadow-pink-500/50' },
                { suit: '♣', value: 'J', color: 'text-purple-400', glow: 'shadow-purple-400/50' }
              ].map((card, index) => (
                <div
                  key={index}
                  className={`relative w-24 h-36 bg-gradient-to-br from-gray-900 to-black border-2 border-pink-500/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transform hover:scale-110 hover:rotate-3 transition-all duration-300 ${card.glow}`}
                  style={{
                    boxShadow: `0 0 20px rgba(255,20,147,0.3), inset 0 0 20px rgba(255,255,255,0.05)`,
                    animation: `float ${3 + index * 0.5}s ease-in-out infinite, glow-pulse 2s ease-in-out infinite`
                  }}
                >
                  {/* Card glow border */}
                  <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-pink-500/20 via-red-500/20 to-purple-500/20 rounded-lg blur-sm" />
                  
                  {/* Card content */}
                  <div className={`text-3xl font-bold ${card.color} z-10`}>
                    {card.value}
                  </div>
                  <div className={`text-4xl ${card.color} z-10`}>
                    {card.suit}
                  </div>
                  
                  {/* Corner markers */}
                  <div className={`absolute top-2 left-2 text-xs ${card.color} font-bold`}>
                    {card.value}
                  </div>
                  <div className={`absolute bottom-2 right-2 text-xs ${card.color} font-bold transform rotate-180`}>
                    {card.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1.1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default BorderlandIntro;
