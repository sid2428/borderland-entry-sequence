
import React, { useState, useEffect, useRef } from 'react';
import { GameResult } from '../GameController';

interface SpadesGameProps {
  onComplete: (result: GameResult) => void;
}

const SpadesGame = ({ onComplete }: SpadesGameProps) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'waiting' | 'finished'>('playing');
  const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOnTarget, setIsOnTarget] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [colorFlash, setColorFlash] = useState<'green' | 'red' | null>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [targetZone, setTargetZone] = useState({ min: 40, max: 60 });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Round timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      nextRound();
    }
  }, [timeLeft, gameState]);

  // Round 1: Moving dot tracking
  useEffect(() => {
    if (round === 1 && gameState === 'playing') {
      const interval = setInterval(() => {
        setDotPosition({
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [round, gameState]);

  // Round 2: Color flash game
  useEffect(() => {
    if (round === 2 && gameState === 'playing') {
      const interval = setInterval(() => {
        setColorFlash(Math.random() > 0.5 ? 'green' : 'red');
        setTimeout(() => setColorFlash(null), 1000);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [round, gameState]);

  // Round 3: Shaky slider
  useEffect(() => {
    if (round === 3 && gameState === 'playing') {
      const interval = setInterval(() => {
        setSliderValue(prev => prev + (Math.random() - 0.5) * 10);
        setTargetZone({
          min: Math.random() * 30 + 20,
          max: Math.random() * 30 + 50
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [round, gameState]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });

      if (round === 1) {
        const distance = Math.sqrt(
          Math.pow(x - dotPosition.x, 2) + Math.pow(y - dotPosition.y, 2)
        );
        const onTarget = distance < 5;
        setIsOnTarget(onTarget);
        if (onTarget) {
          setScore(prev => prev + 10);
        }
      }
    }
  };

  const handleClick = () => {
    if (round === 2 && colorFlash === 'green') {
      setScore(prev => prev + 20);
    } else if (round === 2 && colorFlash === 'red') {
      setScore(prev => prev - 10);
    }
  };

  const nextRound = () => {
    if (round < 5) {
      setRound(prev => prev + 1);
      setTimeLeft(round === 4 ? 20 : 10);
      setGameState('playing');
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const result: GameResult = {
      suit: 'spades',
      score,
      profile: score > 150 ? '♠ Tactical Master' : score > 100 ? '♠ Focused Operative' : '♠ Nervous Recruit',
      breakdown: {
        'Focus Duration': Math.min(100, score / 2),
        'Reaction Speed': Math.min(100, (score / 200) * 100),
        'Stress Resistance': Math.min(100, (score / 150) * 100)
      }
    };
    onComplete(result);
  };

  const handleFinalChoice = (choice: 'exit' | 'wait') => {
    if (choice === 'wait') {
      setScore(prev => prev + 50);
    }
    finishGame();
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-orbitron font-bold mb-4 text-red-500">
          ♠ ADRENALINE LOCKDOWN
        </h1>
        
        <div className="mb-6">
          <p className="text-xl font-space">Round {round}/5</p>
          <p className="text-lg">Score: {score}</p>
          <p className="text-lg">Time: {timeLeft}s</p>
        </div>

        {/* Round 1: Moving Dot */}
        {round === 1 && (
          <div 
            ref={gameAreaRef}
            className="relative w-96 h-96 mx-auto border-2 border-red-500 bg-gray-900 cursor-none"
            onMouseMove={handleMouseMove}
          >
            <div className="absolute top-4 left-4 text-sm">
              Keep mouse on the glowing dot
            </div>
            <div 
              className="absolute w-8 h-8 bg-red-500 rounded-full animate-pulse"
              style={{
                left: `${dotPosition.x}%`,
                top: `${dotPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
            <div 
              className={`absolute w-4 h-4 rounded-full border-2 ${isOnTarget ? 'border-green-500' : 'border-white'}`}
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        )}

        {/* Round 2: Color Flash */}
        {round === 2 && (
          <div 
            className="w-96 h-96 mx-auto border-2 border-red-500 bg-gray-900 flex items-center justify-center cursor-pointer"
            onClick={handleClick}
          >
            <div className="text-center">
              <p className="mb-8">Green = Click, Red = Don't Click</p>
              <div 
                className={`w-32 h-32 rounded-full border-4 transition-all duration-300 ${
                  colorFlash === 'green' ? 'bg-green-500 border-green-300' :
                  colorFlash === 'red' ? 'bg-red-500 border-red-300' :
                  'bg-gray-700 border-gray-500'
                }`}
              />
            </div>
          </div>
        )}

        {/* Round 3: Shaky Slider */}
        {round === 3 && (
          <div className="w-96 mx-auto">
            <p className="mb-4">Keep the slider in the target zone</p>
            <div className="relative h-8 bg-gray-800 border-2 border-red-500">
              <div 
                className="absolute h-full bg-green-500 opacity-50"
                style={{
                  left: `${targetZone.min}%`,
                  width: `${targetZone.max - targetZone.min}%`
                }}
              />
              <div 
                className="absolute w-2 h-full bg-red-500"
                style={{ left: `${Math.max(0, Math.min(98, sliderValue))}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full mt-4"
            />
          </div>
        )}

        {/* Round 4: Audio-Visual Chaos */}
        {round === 4 && (
          <div className="w-96 h-96 mx-auto border-2 border-red-500 bg-gray-900 flex items-center justify-center animate-glitch">
            <div className="text-center animate-pulse">
              <p className="text-2xl font-bold mb-4">CHAOS MODE</p>
              <p>Click only when you see a valid cue</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-16 h-16 border-2 cursor-pointer transition-all duration-200 ${
                      Math.random() > 0.7 ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300'
                    }`}
                    onClick={() => setScore(prev => prev + 5)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Round 5: Final Choice */}
        {round === 5 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">FINAL TRIAL</h2>
            <p className="text-xl mb-8">
              You can exit now with your current score, or wait and risk losing everything.
              <br />
              What do you choose?
            </p>
            <div className="space-x-8">
              <button
                onClick={() => handleFinalChoice('exit')}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 font-orbitron font-bold text-xl border-2 border-red-400"
              >
                EXIT NOW
              </button>
              <button
                onClick={() => handleFinalChoice('wait')}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 font-orbitron font-bold text-xl border-2 border-green-400"
              >
                WAIT & RISK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpadesGame;
