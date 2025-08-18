import { useState } from 'react';
import type { Term } from '../types';

interface FlashcardProps {
  term: Term;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
}

export default function Flashcard({ 
  term, 
  currentIndex, 
  totalCount, 
  onNext, 
  onPrevious, 
  onFinish 
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex + 1 >= totalCount) {
      onFinish();
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    onPrevious();
  };

  // Keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      handleFlip();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      if (currentIndex > 0) handlePrevious();
    } else if (e.code === 'ArrowRight' || e.code === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="text-center" onKeyDown={handleKeyPress} tabIndex={0}>
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Card {currentIndex + 1} of {totalCount}
          </span>
          <span className="text-sm text-gray-500">
            Press Space to flip
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative mb-8">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front (English term) */}
          <div className="flashcard-face flashcard-front">
            <div className="h-80 flex flex-col justify-center items-center bg-white border-2 border-gray-200 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200">
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {term.term}
              </div>
              <div className="text-sm text-gray-500 px-4">
                Click to reveal translation
              </div>
            </div>
          </div>

          {/* Back (Chinese translation) */}
          <div className="flashcard-face flashcard-back">
            <div className="h-80 flex flex-col justify-center items-center bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200">
              <div className="text-4xl font-bold text-gray-900 mb-3">
                {term.chinese}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                {term.pinyin}
              </div>
              <div className="text-lg text-gray-800 px-6">
                {term.definition}
              </div>
              {term.notes && (
                <div className="text-sm text-gray-600 mt-3 px-6 italic">
                  {term.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          ← Previous
        </button>

        <button
          onClick={handleFlip}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          {isFlipped ? 'Show English' : 'Show Chinese'}
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          {currentIndex + 1 >= totalCount ? 'Finish' : 'Next →'}
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="mt-4 text-xs text-gray-400">
        ← → arrows to navigate • Space to flip • Enter for next
      </div>


    </div>
  );
}
