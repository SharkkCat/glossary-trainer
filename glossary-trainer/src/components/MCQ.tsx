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
      baseClasses += "border-border hover:border-primary hover:bg-accent cursor-pointer ";
    } else {
      if (optionIndex === selectedOption) {
        if (option.isCorrect) {
          baseClasses += "border-green-500 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ";
        } else {
          baseClasses += "border-red-500 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ";
        }
      } else if (option.isCorrect) {
        baseClasses += "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 ";
      } else {
        baseClasses += "border-border bg-muted text-muted-foreground cursor-not-allowed ";
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
      <div className="mb-6 p-4 bg-muted/20 rounded-xl border border-border/30">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-foreground font-medium px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            Question {currentIndex + 1} of {totalCount}
          </span>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-background/50 rounded-md">
            Press 1-4 to select
          </span>
        </div>
        <Progress 
          value={((currentIndex + 1) / totalCount) * 100} 
          className="h-3 bg-muted/50 [&>div]:bg-purple-500"
        />
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-lg text-muted-foreground mb-4 px-4 py-2 bg-muted/20 rounded-lg text-center">What is the Chinese translation of:</h3>
        <Card className="border-2 bg-gradient-to-br from-card to-muted/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-foreground px-4 py-3 bg-background/50 rounded-xl text-center">
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
                  <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
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
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-5">
            <div className="text-sm text-foreground">
              <div className="font-semibold mb-3 text-center px-3 py-1 bg-blue-600 text-white rounded-full text-xs uppercase tracking-wide">💡 Complete Translation</div>
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
              className="w-full !bg-purple-600 hover:!bg-purple-700 !text-white font-semibold"
            >
              {currentIndex + 1 >= totalCount ? 'Finish Quiz' : 'Next Question →'}
            </Button>
          )}
          {!hasAnswered && (
            <div className="w-full py-3 text-center text-muted-foreground text-sm !bg-gray-100 dark:!bg-gray-800 rounded-lg border border-dashed">
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
                className="w-full !bg-purple-600 hover:!bg-purple-700 !text-white font-semibold"
              >
                {currentIndex + 1 >= totalCount ? 'Finish Quiz' : 'Next Question →'}
              </Button>
            )}
            {!hasAnswered && (
              <div className="w-full py-3 text-center text-muted-foreground text-sm !bg-gray-100 dark:!bg-gray-800 rounded-lg border border-dashed">
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
