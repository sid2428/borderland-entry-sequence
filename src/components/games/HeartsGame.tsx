
import React, { useState, useEffect } from 'react';
import { GameResult } from '../GameController';

interface HeartsGameProps {
  onComplete: (result: GameResult) => void;
}

interface Player {
  id: string;
  name: string;
  isTraitor: boolean;
  isAlive: boolean;
  suspicionLevel: number;
}

const HeartsGame = ({ onComplete }: HeartsGameProps) => {
  const [phase, setPhase] = useState<'lobby' | 'question' | 'voting' | 'results'>('lobby');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [playerVote, setPlayerVote] = useState<string>('');
  const [betrayalScore, setBetrayalScore] = useState(0);
  const [trustScore, setTrustScore] = useState(100);

  const questions = [
    "Who would you trust with your life?",
    "Who seems most nervous right now?",
    "Who would betray the group for personal gain?",
    "Who is hiding something important?",
    "Who would you eliminate if you had to choose?"
  ];

  // Initialize mock multiplayer lobby
  useEffect(() => {
    const mockPlayers: Player[] = [
      { id: 'player1', name: 'You', isTraitor: false, isAlive: true, suspicionLevel: 0 },
      { id: 'player2', name: 'Alex', isTraitor: Math.random() > 0.7, isAlive: true, suspicionLevel: Math.random() * 50 },
      { id: 'player3', name: 'Sam', isTraitor: Math.random() > 0.7, isAlive: true, suspicionLevel: Math.random() * 50 },
      { id: 'player4', name: 'Jordan', isTraitor: Math.random() > 0.7, isAlive: true, suspicionLevel: Math.random() * 50 },
      { id: 'player5', name: 'Casey', isTraitor: Math.random() > 0.7, isAlive: true, suspicionLevel: Math.random() * 50 },
    ];

    // Ensure at least one traitor exists (maybe)
    if (!mockPlayers.some(p => p.isTraitor)) {
      const randomPlayer = mockPlayers[Math.floor(Math.random() * (mockPlayers.length - 1)) + 1];
      randomPlayer.isTraitor = Math.random() > 0.5; // Still might not be a traitor
    }

    setPlayers(mockPlayers);
    
    // Auto start after 3 seconds
    setTimeout(() => setPhase('question'), 3000);
  }, []);

  const handleVote = (targetId: string) => {
    setPlayerVote(targetId);
    
    // Simulate other players voting
    const otherVotes: Record<string, string> = {};
    players.filter(p => p.id !== 'player1' && p.isAlive).forEach(player => {
      const alivePlayers = players.filter(p => p.isAlive && p.id !== player.id);
      const randomTarget = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      otherVotes[player.id] = randomTarget.id;
    });

    otherVotes['player1'] = targetId;
    setVotes(otherVotes);

    // Calculate results
    const voteCounts: Record<string, number> = {};
    Object.values(otherVotes).forEach(vote => {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });

    const eliminated = Object.entries(voteCounts).reduce((a, b) => 
      voteCounts[a[0]] > voteCounts[b[0]] ? a : b
    )[0];

    // Update suspicion and trust scores
    const eliminatedPlayer = players.find(p => p.id === eliminated);
    if (eliminatedPlayer?.isTraitor) {
      setTrustScore(prev => prev + 20);
    } else {
      setBetrayalScore(prev => prev + 25);
      setTrustScore(prev => prev - 15);
    }

    // Remove eliminated player
    setPlayers(prev => prev.map(p => 
      p.id === eliminated ? { ...p, isAlive: false } : p
    ));

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setPhase('question');
        setPlayerVote('');
        setVotes({});
      } else {
        finishGame();
      }
    }, 3000);

    setPhase('results');
  };

  const finishGame = () => {
    const alivePlayers = players.filter(p => p.isAlive);
    const traitorsLeft = alivePlayers.filter(p => p.isTraitor).length;
    const totalTraitors = players.filter(p => p.isTraitor).length;
    
    const finalScore = Math.max(0, trustScore - betrayalScore + (traitorsLeft === 0 ? 50 : -30));
    
    const result: GameResult = {
      suit: 'hearts',
      score: finalScore,
      profile: finalScore > 120 ? '♥ Trustworthy Leader' : 
               finalScore > 80 ? '♥ Cautious Survivor' : 
               finalScore > 40 ? '♥ Paranoid Betrayer' :
               '♥ Emotionally Reactive',
      breakdown: {
        'Trust Level': trustScore,
        'Betrayal Score': betrayalScore,
        'Social Intuition': Math.max(0, 100 - (totalTraitors - traitorsLeft) * 20),
        'Emotional Control': Math.max(0, 100 - betrayalScore)
      }
    };

    onComplete(result);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-orbitron font-bold mb-8 text-pink-500">
          ♥ TRUSTFALL
        </h1>

        {phase === 'lobby' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Waiting for Players...</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {players.map((player, index) => (
                <div 
                  key={player.id} 
                  className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                    index < players.length ? 'border-green-500 bg-green-900' : 'border-gray-500 bg-gray-800'
                  }`}
                >
                  <div className="text-lg font-bold">{player.name}</div>
                  <div className="text-sm text-gray-400">
                    {index < players.length ? 'Connected' : 'Waiting...'}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-lg text-yellow-400 animate-pulse">
              Game starting soon...
            </p>
          </div>
        )}

        {phase === 'question' && (
          <div className="space-y-8">
            <div className="mb-6">
              <p className="text-lg font-space">Round {currentQuestion + 1} of {questions.length}</p>
              <p className="text-sm text-gray-400">Trust: {trustScore}% | Suspicion: {betrayalScore}%</p>
            </div>

            <div className="bg-gray-900 border-2 border-pink-500 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-8 text-pink-400">
                {questions[currentQuestion]}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {players.filter(p => p.isAlive && p.id !== 'player1').map(player => (
                  <button
                    key={player.id}
                    onClick={() => setPhase('voting')}
                    className="p-6 bg-gray-800 hover:bg-pink-900 border-2 border-gray-600 hover:border-pink-500 rounded-lg transition-all duration-300"
                  >
                    <div className="text-xl font-bold">{player.name}</div>
                    <div className={`text-sm mt-2 ${
                      player.suspicionLevel > 30 ? 'text-red-400' : 
                      player.suspicionLevel > 15 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      Suspicion: {Math.round(player.suspicionLevel)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === 'voting' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-red-500">ELIMINATION VOTE</h2>
            <p className="text-xl mb-8">Choose who to eliminate from the game</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {players.filter(p => p.isAlive && p.id !== 'player1').map(player => (
                <button
                  key={player.id}
                  onClick={() => handleVote(player.id)}
                  className="p-6 bg-red-900 hover:bg-red-800 border-2 border-red-600 hover:border-red-400 rounded-lg transition-all duration-300"
                >
                  <div className="text-xl font-bold">{player.name}</div>
                  <div className="text-sm text-red-300">ELIMINATE</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'results' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-500">VOTE RESULTS</h2>
            
            <div className="bg-gray-900 border-2 border-yellow-500 p-6 rounded-lg">
              <h3 className="text-xl mb-4">Vote Breakdown:</h3>
              {Object.entries(votes).map(([voter, target]) => {
                const voterName = players.find(p => p.id === voter)?.name;
                const targetName = players.find(p => p.id === target)?.name;
                return (
                  <div key={voter} className="text-lg">
                    {voterName} voted for {targetName}
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 bg-red-800 rounded">
                <p className="text-xl font-bold">
                  Player Eliminated: {players.find(p => !p.isAlive && p.id !== 'player1')?.name}
                </p>
              </div>
            </div>

            <div className="text-lg">
              <p>Remaining Players: {players.filter(p => p.isAlive).length}</p>
              <p className="text-yellow-400">Trust Level: {trustScore}%</p>
              <p className="text-red-400">Betrayal Score: {betrayalScore}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartsGame;
