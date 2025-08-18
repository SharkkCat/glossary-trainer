import { useState } from 'react';
import type { MCQQuestion, MCQOption } from '../types';
import { PronunciationIcon } from './PronunciationButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MCQProps {
  question: MCQQuestion;
  currentIndex: number;
  totalCount: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
}

export default function MCQ({ 
  question, 
  currentIndex, 
  totalCount, 
  onAnswer, 
  onNext, 
  onPrevious, 
  onFinish 
}: MCQProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    if (hasAnswered) return;

    const option = question.options[optionIndex];
    setSelectedOption(optionIndex);
    setHasAnswered(true);
    setShowExplanation(true);
    onAnswer(option.isCorrect);
  };

  const handleNext = () => {
    // Reset state for next question
    setSelectedOption(null);
    setHasAnswered(false);
    setShowExplanation(false);
    
    if (currentIndex + 1 >= totalCount) {
      onFinish();
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    // Reset state for previous question
    setSelectedOption(null);
    setHasAnswered(false);
    setShowExplanation(false);
    onPrevious();
  };

  // Keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (hasAnswered) {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleNext();
      }
    } else {
      // Number keys 1-4 for selecting options
      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        e.preventDefault();
        const optionIndex = parseInt(key) - 1;
        if (optionIndex < question.options.length) {
          handleOptionSelect(optionIndex);
        }
      }
    }
    
    if (e.code === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      handlePrevious();
    }
  };

  const getOptionClassName = (optionIndex: number, option: MCQOption) => {
    let baseClasses = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
    
    if (!hasAnswered) {
      baseClasses += "border-lime-200/50 dark:border-lime-700/50 hover:border-lime-400 dark:hover:border-lime-500 hover:bg-lime-50/50 dark:hover:bg-lime-900/20 cursor-pointer ";
    } else {
      if (optionIndex === selectedOption) {
        if (option.isCorrect) {
          baseClasses += "border-lime-500 bg-gradient-to-r from-lime-100 to-green-100 text-lime-800 dark:bg-gradient-to-r dark:from-lime-900/30 dark:to-green-900/30 dark:text-lime-300 ";
        } else {
          baseClasses += "border-red-500 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ";
        }
      } else if (option.isCorrect) {
        baseClasses += "border-lime-400 bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400 ";
      } else {
        baseClasses += "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-muted-foreground cursor-not-allowed ";
      }
    }
    
    return baseClasses;
  };

  const getOptionIcon = (optionIndex: number, option: MCQOption) => {
    if (!hasAnswered) return null;
    
    if (optionIndex === selectedOption) {
      return option.isCorrect ? '✓' : '✗';
    } else if (option.isCorrect) {
      return '✓';
    }
    return null;
  };

  return (
    <div className="text-center" onKeyDown={handleKeyPress} tabIndex={0}>
      {/* Progress indicator */}
      <div className="mb-8 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-lime-200/30 dark:border-lime-700/30 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <div className="text-sm font-medium text-muted-foreground">Question</div>
            <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {currentIndex + 1}<span className="text-base text-muted-foreground">/{totalCount}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-muted-foreground">Progress</div>
            <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">
              {Math.round(((currentIndex + 1) / totalCount) * 100)}%
            </div>
          </div>
        </div>
        <Progress 
          value={((currentIndex + 1) / totalCount) * 100} 
          className="h-3 bg-lime-100 dark:bg-lime-900/30 [&>div]:bg-gradient-to-r [&>div]:from-lime-500 [&>div]:to-green-500"
        />
        <div className="mt-3 text-center">
          <span className="text-xs text-muted-foreground px-3 py-1 bg-lime-50/50 dark:bg-lime-900/20 rounded-full border border-lime-200/20 dark:border-lime-700/20">
            Press 1-4 to select answer
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-lg text-muted-foreground mb-4 px-4 py-2 bg-gradient-to-r from-lime-50/30 to-green-50/30 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg text-center border border-lime-200/20 dark:border-lime-700/20">What is the Chinese translation of:</h3>
        <Card className="border-2 border-lime-200/40 dark:border-lime-700/40 bg-gradient-to-br from-white to-lime-50/30 dark:from-gray-800 dark:to-lime-900/10 hover:shadow-xl hover:shadow-lime-200/20 dark:hover:shadow-lime-900/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 bg-clip-text text-transparent px-4 py-3 bg-white/60 dark:bg-gray-700/60 rounded-xl text-center border border-lime-200/30 dark:border-lime-700/30">
              {question.term.term}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          const icon = getOptionIcon(index, option);
          return (
            <button
              key={index}
              className={getOptionClassName(index, option)}
              onClick={() => handleOptionSelect(index)}
              disabled={hasAnswered}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-br from-lime-100 to-green-100 dark:from-lime-800/50 dark:to-green-800/50 text-lime-700 dark:text-lime-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3 border border-lime-200/30 dark:border-lime-600/30">
                    {index + 1}
                  </span>
                  <span className="font-medium">{option.text}</span>
                </div>
                {icon && (
                  <span className="text-xl font-bold">
                    {icon}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <Card className="mb-6 bg-gradient-to-br from-lime-50 to-green-100 dark:from-lime-950/50 dark:to-green-900/30 border-lime-200 dark:border-lime-800">
          <CardContent className="p-5">
            <div className="text-sm text-foreground">
              <div className="font-semibold mb-3 text-center px-3 py-1 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-full text-xs uppercase tracking-wide">💡 Complete Translation</div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-background/60 rounded-lg">
                  <span><strong>Chinese:</strong> {question.term.chinese}</span>
                  <PronunciationIcon 
                    text={question.term.chinese}
                    className="flex-shrink-0"
                    onError={(error) => console.warn('Pronunciation error:', error)}
                  />
                </div>
                <div className="px-3 py-2 bg-background/40 rounded-lg text-center">
                  <strong>Pinyin:</strong> {question.term.pinyin}
                </div>
                <div className="px-3 py-2 bg-background/40 rounded-lg text-center">
                  <strong>Definition:</strong> {question.term.definition}
                </div>
                {question.term.notes && (
                  <div className="mt-3 italic px-3 py-2 bg-muted/40 rounded-lg text-center">
                    <strong>Notes:</strong> {question.term.notes}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="space-y-3">
        {/* Mobile-first: Next button prominently displayed */}
        <div className="block md:hidden">
          {hasAnswered && (
                          <Button
                onClick={handleNext}
                variant="default"
                size="lg"
                className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold"
              >
              {currentIndex + 1 >= totalCount ? 'Finish Quiz' : 'Next Question →'}
            </Button>
          )}
          {!hasAnswered && (
                          <div className="w-full py-3 text-center text-lime-600 dark:text-lime-400 text-sm bg-lime-50/50 dark:bg-lime-900/20 rounded-lg border border-dashed border-lime-300/50 dark:border-lime-600/50">
                Select an answer above to continue
              </div>
          )}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          {/* Desktop: Next button prominently displayed */}
          <div className="mb-3">
            {hasAnswered && (
              <Button
                onClick={handleNext}
                variant="default"
                size="lg"
                className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold"
              >
                {currentIndex + 1 >= totalCount ? 'Finish Quiz' : 'Next Question →'}
              </Button>
            )}
            {!hasAnswered && (
              <div className="w-full py-3 text-center text-lime-600 dark:text-lime-400 text-sm bg-lime-50/50 dark:bg-lime-900/20 rounded-lg border border-dashed border-lime-300/50 dark:border-lime-600/50">
                Select an answer above to continue
              </div>
            )}
          </div>
          
          {/* Desktop: Secondary actions */}
          <div className="flex justify-start">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="secondary"
              size="default"
            >
              ← Previous
            </Button>
          </div>
        </div>

        {/* Mobile: Secondary actions */}
        <div className="block md:hidden">
          <div className="flex justify-start">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="secondary"
              size="sm"
            >
              ← Previous
            </Button>
          </div>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="mt-4 text-xs text-muted-foreground">
        {!hasAnswered ? '1-4 to select • ← → to navigate' : 'Enter or Space for next • ← for previous'}
      </div>
    </div>
  );
}
