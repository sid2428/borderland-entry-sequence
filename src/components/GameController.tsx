
import React, { useState } from 'react';
import IntroSequence from './game/IntroSequence';
import GameHub from './game/GameHub';
import SpadesGame from './games/SpadesGame';
import DiamondsGame from './games/DiamondsGame';
import HeartsGame from './games/HeartsGame';
import ClubsGame from './games/ClubsGame';
import GameResults from './game/GameResults';

export type GamePhase = 'intro' | 'hub' | 'spades' | 'diamonds' | 'hearts' | 'clubs' | 'results';
export type Suit = 'spades' | 'diamonds' | 'hearts' | 'clubs';

export interface GameResult {
  suit: Suit;
  score: number;
  profile: string;
  breakdown: Record<string, number>;
}

const GameController = () => {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('intro');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleIntroComplete = () => {
    setCurrentPhase('hub');
  };

  const handleCardSelect = (suit: Suit) => {
    setCurrentPhase(suit);
  };

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
    setCurrentPhase('results');
  };

  const handleReturnToHub = () => {
    setCurrentPhase('hub');
    setGameResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {currentPhase === 'intro' && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}
      
      {currentPhase === 'hub' && (
        <GameHub onCardSelect={handleCardSelect} />
      )}
      
      {currentPhase === 'spades' && (
        <SpadesGame onComplete={handleGameComplete} />
      )}
      
      {currentPhase === 'diamonds' && (
        <DiamondsGame onComplete={handleGameComplete} />
      )}
      
      {currentPhase === 'hearts' && (
        <HeartsGame onComplete={handleGameComplete} />
      )}
      
      {currentPhase === 'clubs' && (
        <ClubsGame onComplete={handleGameComplete} />
      )}
      
      {currentPhase === 'results' && gameResult && (
        <GameResults 
          result={gameResult} 
          onReturnToHub={handleReturnToHub} 
        />
      )}
    </div>
  );
};

export default GameController;
