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
      {/* Enhanced progress indicator */}
      <div className="mb-8 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-lime-200/30 dark:border-lime-700/30 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <div className="text-sm font-medium text-muted-foreground">Progress</div>
            <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {currentIndex + 1}<span className="text-base text-muted-foreground">/{totalCount}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-muted-foreground">Completion</div>
            <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {Math.round(((currentIndex + 1) / totalCount) * 100)}%
            </div>
          </div>
        </div>
        <Progress 
          value={((currentIndex + 1) / totalCount) * 100} 
          className="h-3 bg-lime-100 dark:bg-lime-900/30 rounded-full overflow-hidden [&>div]:bg-gradient-to-r [&>div]:from-lime-500 [&>div]:to-green-500"
        />
      </div>

      {/* Flashcard */}
      <div className="relative mb-12">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front (English term) */}
          <div className="flashcard-face flashcard-front">
            <Card className="h-96 cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 dark:from-lime-900/20 dark:via-green-900/20 dark:to-emerald-900/20 rounded-3xl shadow-xl hover:shadow-lime-200/50 dark:hover:shadow-lime-900/20">
              <CardContent className="h-full flex flex-col justify-center items-center p-12 space-y-4">
                <div className="text-5xl font-bold bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 bg-clip-text text-transparent text-center leading-tight">
                  {term.term}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-lime-200/30 dark:border-lime-700/30 backdrop-blur-sm">
                  Click to reveal translation
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back (Chinese translation) */}
          <div className="flashcard-face flashcard-back">
            <Card className="h-96 cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-lime-900/20 rounded-3xl shadow-xl hover:shadow-green-200/50 dark:hover:shadow-green-900/20">
              <CardContent className="h-full flex flex-col justify-center items-center p-12 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 bg-clip-text text-transparent">
                    {term.chinese}
                  </div>
                  <PronunciationIcon 
                    text={term.chinese}
                    className="flex-shrink-0"
                    onError={(error) => console.warn('Pronunciation error:', error)}
                  />
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-300 px-3 py-1 bg-lime-100/50 dark:bg-lime-900/30 rounded-lg">
                  {term.pinyin}
                </div>
                <div className="text-lg text-gray-800 dark:text-gray-200 text-center leading-relaxed max-w-md px-4 py-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-green-200/30 dark:border-green-700/30 backdrop-blur-sm">
                  {term.definition}
                </div>
                {term.notes && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 italic text-center max-w-md px-3 py-2 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200/30 dark:border-emerald-700/30">
                    {term.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 space-y-6">
        {/* Primary action - Next button */}
        <div>
          <Button
            onClick={handleNext}
            variant="default"
            size="lg"
            className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold h-14 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
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
            className="h-12 px-6 rounded-xl text-gray-600 dark:text-gray-400 hover:text-lime-700 dark:hover:text-lime-300 hover:bg-lime-100/50 dark:hover:bg-lime-900/20"
          >
            ← Previous
          </Button>

          <Button
            onClick={handleFlip}
            variant="outline"
            size="default"
            className="h-12 px-8 rounded-xl border-2 border-lime-200 dark:border-lime-700 text-lime-600 dark:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 hover:border-lime-300 dark:hover:border-lime-600"
          >
            Flip Card
          </Button>
        </div>
      </div>
    </div>
  );
}
