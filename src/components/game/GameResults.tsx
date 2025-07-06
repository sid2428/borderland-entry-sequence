
import React from 'react';
import { GameResult } from '../GameController';

interface GameResultsProps {
  result: GameResult;
  onReturnToHub: () => void;
}

const GameResults = ({ result, onReturnToHub }: GameResultsProps) => {
  const getSuitColor = (suit: string) => {
    switch (suit) {
      case 'spades': return 'text-white';
      case 'diamonds': return 'text-orange-500';
      case 'hearts': return 'text-pink-500';
      case 'clubs': return 'text-green-500';
      default: return 'text-white';
    }
  };

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'spades': return '♠';
      case 'diamonds': return '♦';
      case 'hearts': return '♥';
      case 'clubs': return '♣';
      default: return '?';
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getVisaAssignment = (suit: string, score: number) => {
    const baseVisa = {
      spades: { type: 'Survivor', days: 3 },
      diamonds: { type: 'Thinker', days: 4 },
      hearts: { type: 'Trustbreaker', days: 2 },
      clubs: { type: 'Harmonizer', days: 5 }
    }[suit] || { type: 'Player', days: 1 };

    // Adjust days based on performance
    const bonusDays = score >= 160 ? 2 : score >= 120 ? 1 : score >= 80 ? 0 : -1;
    const finalDays = Math.max(1, baseVisa.days + bonusDays);

    return {
      type: baseVisa.type,
      days: finalDays
    };
  };

  const visa = getVisaAssignment(result.suit, result.score);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-4xl mx-auto p-8 animate-fade-in">
        <h1 className="text-5xl font-orbitron font-bold mb-8">
          TRIAL COMPLETE
        </h1>

        {/* Main Result Card */}
        <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-8 mb-8">
          <div className={`text-8xl mb-6 ${getSuitColor(result.suit)}`}>
            {getSuitSymbol(result.suit)}
          </div>
          
          <h2 className={`text-4xl font-orbitron font-bold mb-4 ${getSuitColor(result.suit)}`}>
            {result.profile}
          </h2>
          
          <div className={`text-6xl font-bold mb-6 ${getGradeColor(result.score)}`}>
            {result.score}/200
          </div>

          <div className="w-full bg-gray-800 h-4 rounded-full mb-8">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${
                result.score >= 160 ? 'bg-green-500' :
                result.score >= 120 ? 'bg-yellow-500' :
                result.score >= 80 ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (result.score / 200) * 100)}%` }}
            />
          </div>
        </div>

        {/* Visa Assignment Card */}
        <div className={`bg-gray-900 border-4 rounded-lg p-6 mb-8 animate-fade-in ${getSuitColor(result.suit).replace('text-', 'border-')}`} style={{ animationDelay: '0.5s' }}>
          <h3 className="text-3xl font-orbitron font-bold mb-4 text-yellow-400">VISA GRANTED</h3>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`text-6xl ${getSuitColor(result.suit)}`}>
              {getSuitSymbol(result.suit)}
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold">{visa.type}</p>
              <p className={`text-4xl font-orbitron font-bold ${visa.days >= 4 ? 'text-green-400' : visa.days >= 3 ? 'text-yellow-400' : 'text-orange-400'}`}>
                {visa.days}-DAY VISA
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-300">
            {visa.days >= 4 
              ? "Exceptional performance grants extended survival privileges."
              : visa.days >= 3
              ? "Above average results. You've earned your stay."
              : visa.days >= 2
              ? "Minimum requirements met. Prove yourself further."
              : "Barely acceptable. Your time is limited."
            }
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-6">Psychological Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(result.breakdown).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-space text-lg">{category}</span>
                  <span className={`font-bold ${getGradeColor(score)}`}>
                    {Math.round(score)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${getGradeColor(score)}`}
                    style={{ 
                      width: `${Math.min(100, score)}%`,
                      backgroundColor: score >= 80 ? '#10b981' :
                                     score >= 60 ? '#f59e0b' :
                                     score >= 40 ? '#f97316' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Assessment */}
        <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-red-400 mb-4">Borderland Assessment</h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            {result.score >= 160 
              ? "Exceptional performance. You demonstrate the qualities needed to survive in the Borderland. Your mind is both sharp and adaptable."
              : result.score >= 120
              ? "Above average capabilities. You show promise, but the Borderland will test you further. Stay vigilant."
              : result.score >= 80
              ? "Standard performance. You have potential, but survival will require growth. Learn from each trial."
              : "Below expectations. The Borderland is unforgiving to those who are unprepared. Consider your weaknesses carefully."
            }
          </p>
        </div>

        {/* Return Button with smooth animation */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '1s' }}>
          <button
            onClick={onReturnToHub}
            className="px-12 py-4 bg-red-600 hover:bg-red-700 font-orbitron font-bold text-xl border-2 border-red-400 rounded transition-all duration-300 animate-glow-pulse"
          >
            RETURN TO HUB
          </button>
          
          <p className="text-gray-400 font-space">
            Choose another trial to continue your evaluation
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
