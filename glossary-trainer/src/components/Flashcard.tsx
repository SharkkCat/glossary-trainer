import { useState } from 'react';
import type { Term } from '../types';
import { PronunciationIcon } from './PronunciationButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
      {/* Simplified progress indicator */}
      <div className="mb-12 text-center">
        <div className="text-sm !text-gray-500 dark:!text-gray-400 mb-3">
          Card {currentIndex + 1} of {totalCount}
        </div>
        <Progress 
          value={((currentIndex + 1) / totalCount) * 100} 
          className="h-2 !bg-gray-200 dark:!bg-gray-700 rounded-full overflow-hidden max-w-xs mx-auto"
        />
      </div>

      {/* Flashcard */}
      <div className="relative mb-10">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front (English term) */}
          <div className="flashcard-face flashcard-front">
            <Card className="h-96 cursor-pointer hover:shadow-xl transition-all duration-300 !border-0 !bg-white dark:!bg-gray-800 rounded-3xl shadow-lg">
              <CardContent className="h-full flex flex-col justify-center items-center p-12">
                <div className="text-5xl font-bold !text-gray-900 dark:!text-white text-center leading-tight">
                  {term.term}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back (Chinese translation) */}
          <div className="flashcard-face flashcard-back">
            <Card className="h-96 cursor-pointer hover:shadow-xl transition-all duration-300 !border-0 !bg-gradient-to-br !from-blue-50 !to-indigo-50 dark:!from-blue-900/20 dark:!to-indigo-900/20 rounded-3xl shadow-lg">
              <CardContent className="h-full flex flex-col justify-center items-center p-12 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold !text-gray-900 dark:!text-white">
                    {term.chinese}
                  </div>
                  <PronunciationIcon 
                    text={term.chinese}
                    className="flex-shrink-0"
                    onError={(error) => console.warn('Pronunciation error:', error)}
                  />
                </div>
                <div className="text-xl !text-gray-600 dark:!text-gray-300">
                  {term.pinyin}
                </div>
                <div className="text-lg !text-gray-800 dark:!text-gray-200 text-center leading-relaxed max-w-md">
                  {term.definition}
                </div>
                {term.notes && (
                  <div className="text-sm !text-gray-600 dark:!text-gray-400 italic text-center max-w-md">
                    {term.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Simplified navigation */}
      <div className="mt-16 space-y-6">
        {/* Primary action - Next button */}
        <div>
          <Button
            onClick={handleNext}
            variant="default"
            size="lg"
            className="w-full !bg-green-600 hover:!bg-green-700 !text-white font-semibold !h-14 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {currentIndex + 1 >= totalCount ? 'Complete' : 'Next Card →'}
          </Button>
        </div>

        {/* Secondary actions */}
        <div className="flex justify-center items-center gap-6">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="ghost"
            size="default"
            className="!h-12 px-6 rounded-xl !text-gray-600 dark:!text-gray-400 hover:!text-gray-900 dark:hover:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-700"
          >
            ← Previous
          </Button>

          <Button
            onClick={handleFlip}
            variant="outline"
            size="default"
            className="!h-12 px-8 rounded-xl !border-2 !border-blue-200 dark:!border-blue-700 !text-blue-600 dark:!text-blue-400 hover:!bg-blue-50 dark:hover:!bg-blue-900/20"
          >
            Flip Card
          </Button>
        </div>
      </div>
    </div>
  );
}
