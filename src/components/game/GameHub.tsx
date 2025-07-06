
import React, { useState, useEffect } from 'react';
import { spade, diamond, heart, club } from 'lucide-react';
import { Suit } from '../GameController';

interface GameHubProps {
  onCardSelect: (suit: Suit) => void;
}

const GameHub = ({ onCardSelect }: GameHubProps) => {
  const [hoveredCard, setHoveredCard] = useState<Suit | null>(null);

  const cards = [
    { suit: 'spades' as Suit, icon: '♠', name: 'SPADES', subtitle: 'Adrenaline Lockdown', color: 'text-white' },
    { suit: 'diamonds' as Suit, icon: '♦', name: 'DIAMONDS', subtitle: 'The Last Choice', color: 'text-red-500' },
    { suit: 'hearts' as Suit, icon: '♥', name: 'HEARTS', subtitle: 'Trustfall', color: 'text-red-500' },
    { suit: 'clubs' as Suit, icon: '♣', name: 'CLUBS', subtitle: 'Sync or Sink', color: 'text-white' },
  ];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background laser beams */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-gradient-to-b from-red-500 via-red-600 to-transparent opacity-30"
            style={{
              left: `${(i + 1) * 12}%`,
              height: '100%',
              animation: `laser-scan ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Static background effect */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'glitch 0.3s infinite linear'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white mb-4 animate-fade-in">
            BORDERLAND
          </h1>
          <p className="text-xl md:text-2xl font-space text-gray-400 mb-16 animate-fade-in">
            Choose your trial
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {cards.map((card, index) => (
              <div
                key={card.suit}
                className="relative group cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setHoveredCard(card.suit)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onCardSelect(card.suit)}
              >
                {/* Card Container */}
                <div className={`
                  relative w-48 h-72 bg-gradient-to-b from-gray-900 to-black border-2 border-gray-700
                  rounded-lg transform transition-all duration-300 animate-fade-in
                  ${hoveredCard === card.suit 
                    ? 'scale-110 border-red-500 shadow-2xl shadow-red-500/50 animate-glow-pulse' 
                    : 'hover:scale-105'
                  }
                `}>
                  {/* Hover glow effect */}
                  {hoveredCard === card.suit && (
                    <div className="absolute inset-0 bg-red-500 opacity-10 rounded-lg animate-pulse" />
                  )}

                  {/* Card Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <div className={`text-8xl mb-4 ${card.color} transition-all duration-300`}>
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                      {card.name}
                    </h3>
                    <p className="text-sm font-space text-gray-400 text-center">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Floating animation */}
                  <div className="absolute inset-0 animate-pulse opacity-50">
                    <div className="w-full h-full border border-red-500 rounded-lg" />
                  </div>
                </div>

                {/* Tooltip */}
                {hoveredCard === card.suit && (
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black border border-red-500 px-4 py-2 rounded animate-fade-in">
                    <p className="text-red-400 font-space text-sm whitespace-nowrap">
                      Click to Begin Trial
                    </p>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHub;
