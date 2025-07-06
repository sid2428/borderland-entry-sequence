
import React, { useState, useEffect } from 'react';
import { GameResult } from '../GameController';

interface ClubsGameProps {
  onComplete: (result: GameResult) => void;
}

interface PuzzlePiece {
  id: string;
  content: string;
  isCorrect: boolean;
  playerHas: boolean;
}

const ClubsGame = ({ onComplete }: ClubsGameProps) => {
  const [phase, setPhase] = useState<'briefing' | 'puzzle' | 'communication' | 'submission'>('briefing');
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [messages, setMessages] = useState<Array<{id: string, player: string, emoji: string, timestamp: number}>>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [successfulSyncs, setSuccessfulSyncs] = useState(0);
  const [round, setRound] = useState(1);

  const emojis = ['👍', '👎', '❓', '⚠️', '🔴', '🟢', '⭕', '✅', '❌', '💡'];
  
  // Initialize puzzle pieces
  useEffect(() => {
    const pieces: PuzzlePiece[] = [
      { id: '1', content: 'The sequence starts with 2', isCorrect: true, playerHas: true },
      { id: '2', content: 'Every third number is doubled', isCorrect: false, playerHas: true },
      { id: '3', content: 'Add 3 to get the next number', isCorrect: true, playerHas: false },
      { id: '4', content: 'The pattern repeats every 5 numbers', isCorrect: false, playerHas: false },
      { id: '5', content: 'Multiply by 2 then subtract 1', isCorrect: true, playerHas: true },
      { id: '6', content: 'The sequence is: 2, 5, 11, 23, 47...', isCorrect: true, playerHas: false }
    ];
    setPuzzlePieces(pieces);
    
    // Auto-start puzzle phase
    setTimeout(() => setPhase('puzzle'), 3000);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (phase === 'submission' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, phase]);

  // Simulate other players' messages
  useEffect(() => {
    if (phase === 'communication') {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const players = ['Alex', 'Sam', 'Jordan'];
          const player = players[Math.floor(Math.random() * players.length)];
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          
          setMessages(prev => [...prev, {
            id: Math.random().toString(),
            player,
            emoji,
            timestamp: Date.now()
          }]);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const sendEmoji = (emoji: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(),
      player: 'You',
      emoji,
      timestamp: Date.now()
    }]);
  };

  const togglePiece = (pieceId: string) => {
    setSelectedPieces(prev => 
      prev.includes(pieceId) 
        ? prev.filter(id => id !== pieceId)
        : [...prev, pieceId]
    );
  };

  const handleSubmit = () => {
    setSyncAttempts(prev => prev + 1);
    
    // Check if selected pieces are correct
    const correctPieces = puzzlePieces.filter(p => p.isCorrect).map(p => p.id);
    const playerCorrect = selectedPieces.filter(id => correctPieces.includes(id)).length;
    const totalCorrect = correctPieces.length;
    
    // Simulate other players' accuracy
    const othersAccuracy = Math.random() * 0.8 + 0.2; // 20-100% accuracy
    const syncSuccess = playerCorrect / totalCorrect > 0.6 && othersAccuracy > 0.5;
    
    if (syncSuccess) {
      setSuccessfulSyncs(prev => prev + 1);
    }

    if (round < 3) {
      setRound(prev => prev + 1);
      setTimeLeft(30);
      setSelectedPieces([]);
      setPhase('puzzle');
      
      // Generate new puzzle pieces for next round
      setTimeout(() => {
        const newPieces = puzzlePieces.map(piece => ({
          ...piece,
          playerHas: Math.random() > 0.5,
          isCorrect: Math.random() > 0.4
        }));
        setPuzzlePieces(newPieces);
        setPhase('communication');
      }, 2000);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const syncRate = successfulSyncs / syncAttempts;
    const communicationScore = Math.min(100, messages.filter(m => m.player === 'You').length * 10);
    const accuracyScore = (successfulSyncs / 3) * 100;
    const collaborationScore = syncRate * 100;
    
    const totalScore = (communicationScore + accuracyScore + collaborationScore) / 3;
    
    const result: GameResult = {
      suit: 'clubs',
      score: Math.round(totalScore),
      profile: totalScore > 80 ? '♣ Master Collaborator' : 
               totalScore > 60 ? '♣ Team Player' : 
               totalScore > 40 ? '♣ Silent Observer' :
               '♣ Lone Wolf',
      breakdown: {
        'Sync Success Rate': Math.round(syncRate * 100),
        'Communication': communicationScore,
        'Problem Solving': accuracyScore,
        'Team Collaboration': collaborationScore
      }
    };

    onComplete(result);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-orbitron font-bold mb-8 text-green-500">
          ♣ SYNC OR SINK
        </h1>

        {phase === 'briefing' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Mission Briefing</h2>
            <div className="bg-gray-900 border-2 border-green-500 p-8 rounded-lg max-w-2xl mx-auto">
              <p className="text-xl mb-4">
                You and your team must solve puzzles together, but each player only sees part of the solution.
              </p>
              <p className="text-lg mb-4">
                • Use emojis to communicate with your team
              </p>
              <p className="text-lg mb-4">
                • Submit your answers within 2 seconds of each other
              </p>
              <p className="text-lg mb-4">
                • One player has incorrect information - can you spot it?
              </p>
              <div className="mt-6 p-4 bg-yellow-900 rounded">
                <p className="text-yellow-300 font-bold">
                  Warning: Silent collaboration is key to success
                </p>
              </div>
            </div>
          </div>
        )}

        {phase === 'puzzle' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Round {round}/3</h2>
              <div className="text-lg">
                <span className="text-green-400">Syncs: {successfulSyncs}</span> / 
                <span className="text-red-400"> Attempts: {syncAttempts}</span>
              </div>
            </div>

            <div className="bg-gray-900 border-2 border-green-500 p-6 rounded-lg">
              <h3 className="text-xl mb-4">Your Puzzle Pieces:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {puzzlePieces.filter(p => p.playerHas).map(piece => (
                  <div
                    key={piece.id}
                    onClick={() => togglePiece(piece.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedPieces.includes(piece.id)
                        ? 'border-green-400 bg-green-900'
                        : 'border-gray-600 bg-gray-800 hover:border-green-600'
                    }`}
                  >
                    {piece.content}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase('communication')}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 font-orbitron font-bold text-xl border-2 border-green-400 rounded"
            >
              Ready to Communicate
            </button>
          </div>
        )}

        {phase === 'communication' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Team Communication</h3>
              <div className="bg-gray-900 border-2 border-green-500 h-64 p-4 rounded-lg overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className="mb-2 text-left">
                    <span className={`font-bold ${msg.player === 'You' ? 'text-green-400' : 'text-blue-400'}`}>
                      {msg.player}:
                    </span>
                    <span className="text-2xl ml-2">{msg.emoji}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => sendEmoji(emoji)}
                    className="text-2xl p-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Other Players' Hints</h3>
              <div className="bg-gray-900 border-2 border-yellow-500 p-4 rounded-lg">
                <div className="space-y-2 text-left">
                  <p className="text-yellow-400">Alex: "I see numbers increasing..."</p>
                  <p className="text-blue-400">Sam: "Something about patterns..."</p>
                  <p className="text-purple-400">Jordan: "The third rule seems wrong..."</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setPhase('submission');
                  setTimeLeft(5);
                }}
                className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 font-orbitron font-bold text-lg border-2 border-yellow-400 rounded"
              >
                Ready to Submit
              </button>
            </div>
          </div>
        )}

        {phase === 'submission' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-red-500">SYNC SUBMISSION</h2>
            <div className="text-2xl font-bold">
              Submit in: {timeLeft}s
            </div>

            <div className="bg-gray-900 border-2 border-red-500 p-6 rounded-lg">
              <h3 className="text-xl mb-4">Selected Pieces:</h3>
              <div className="space-y-2">
                {selectedPieces.map(pieceId => {
                  const piece = puzzlePieces.find(p => p.id === pieceId);
                  return (
                    <div key={pieceId} className="p-2 bg-green-900 border border-green-600 rounded">
                      {piece?.content}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="px-12 py-6 bg-red-600 hover:bg-red-700 font-orbitron font-bold text-2xl border-2 border-red-400 rounded animate-pulse"
            >
              SUBMIT NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsGame;
