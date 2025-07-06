
import React, { useState } from 'react';
import { GameResult } from '../GameController';

interface DiamondsGameProps {
  onComplete: (result: GameResult) => void;
}

interface Question {
  id: number;
  type: 'logic' | 'morality';
  question: string;
  options: string[];
  weight: number;
}

const DiamondsGame = ({ onComplete }: DiamondsGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [phase, setPhase] = useState<'questions' | 'deletion' | 'finished'>('questions');
  const [deletedAnswer, setDeletedAnswer] = useState<number | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      type: 'logic',
      question: 'A man lives on the 20th floor but only takes the elevator to the 10th floor on sunny days. Why?',
      options: ['He\'s short and can\'t reach the button', 'He likes the exercise', 'The elevator is broken', 'He\'s superstitious'],
      weight: 20
    },
    {
      id: 2,
      type: 'morality',
      question: 'You can save 5 strangers by sacrificing 1 friend. What do you do?',
      options: ['Save the 5 strangers', 'Save your friend', 'Find another way', 'Do nothing'],
      weight: 30
    },
    {
      id: 3,
      type: 'logic',
      question: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
      options: ['42', '40', '38', '36'],
      weight: 25
    },
    {
      id: 4,
      type: 'morality',
      question: 'You witness a crime but reporting it would destroy an innocent family. What do you do?',
      options: ['Report immediately', 'Stay silent', 'Confront the criminal privately', 'Seek advice first'],
      weight: 35
    },
    {
      id: 5,
      type: 'logic',
      question: 'If all Bloops are Razzles and all Razzles are Lazzles, then...',
      options: ['All Bloops are Lazzles', 'Some Lazzles are Bloops', 'No Bloops are Lazzles', 'Cannot be determined'],
      weight: 15
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setPhase('deletion');
    }
  };

  const handleDeletion = (questionIndex: number) => {
    setDeletedAnswer(questionIndex);
    calculateResults();
  };

  const calculateResults = () => {
    let consistencyScore = 0;
    let unpredictabilityScore = 0;
    let logicScore = 0;
    let moralityScore = 0;

    // Calculate consistency (similar answer patterns)
    const moralAnswers = answers.filter((_, i) => questions[i].type === 'morality');
    const variance = moralAnswers.reduce((acc, ans, i, arr) => {
      return acc + Math.abs(ans - (arr.reduce((sum, a) => sum + a, 0) / arr.length));
    }, 0);
    consistencyScore = Math.max(0, 100 - variance * 20);

    // Calculate unpredictability (avoiding expected answers)
    const expectedAnswers = [0, 1, 0, 2, 0]; // Most predictable choices
    unpredictabilityScore = answers.reduce((score, ans, i) => {
      return score + (ans !== expectedAnswers[i] ? 20 : 0);
    }, 0);

    // Calculate logic and morality scores
    logicScore = answers.reduce((score, ans, i) => {
      if (questions[i].type === 'logic') {
        const correctAnswers = [0, 2, 0, 1, 0]; // Correct logic answers
        return score + (ans === correctAnswers[i] ? questions[i].weight : 0);
      }
      return score;
    }, 0);

    const totalScore = consistencyScore + unpredictabilityScore + logicScore;
    
    const result: GameResult = {
      suit: 'diamonds',
      score: totalScore,
      profile: totalScore > 180 ? '♦ Unpredictable Genius' : 
               totalScore > 120 ? '♦ Calculated Thinker' : 
               '♦ Predictable Pattern',
      breakdown: {
        'Consistency': consistencyScore,
        'Unpredictability': unpredictabilityScore,
        'Logic Score': logicScore,
        'Moral Flexibility': moralityScore
      }
    };

    onComplete(result);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center text-white max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-orbitron font-bold mb-8 text-orange-500">
          ♦ THE LAST CHOICE
        </h1>

        {phase === 'questions' && (
          <div className="space-y-8">
            <div className="mb-6">
              <p className="text-lg font-space">Question {currentQuestion + 1} of {questions.length}</p>
              <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-900 border-2 border-orange-500 p-8 rounded-lg">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  questions[currentQuestion].type === 'logic' 
                    ? 'bg-blue-600 text-blue-100' 
                    : 'bg-red-600 text-red-100'
                }`}>
                  {questions[currentQuestion].type.toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-8">
                {questions[currentQuestion].question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="p-4 bg-gray-800 hover:bg-orange-900 border-2 border-gray-600 hover:border-orange-500 rounded-lg transition-all duration-300 text-left"
                  >
                    <span className="font-bold text-orange-400 mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === 'deletion' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-red-500 mb-8">
              FINAL JUDGMENT
            </h2>
            <p className="text-xl mb-8">
              You must delete one of your previous answers. Choose wisely - this will affect your final evaluation.
            </p>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="bg-gray-900 border border-gray-600 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <p className="font-bold">Q{index + 1}: {question.question.substring(0, 50)}...</p>
                      <p className="text-orange-400">Your answer: {question.options[answers[index]]}</p>
                    </div>
                    <button
                      onClick={() => handleDeletion(index)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 border border-red-400 rounded transition-all duration-300"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiamondsGame;
