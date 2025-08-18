import { useState } from 'react';
import type { MCQQuestion, MCQOption } from '../types';

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
      baseClasses += "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer ";
    } else {
      if (optionIndex === selectedOption) {
        if (option.isCorrect) {
          baseClasses += "border-green-500 bg-green-100 text-green-800 ";
        } else {
          baseClasses += "border-red-500 bg-red-100 text-red-800 ";
        }
      } else if (option.isCorrect) {
        baseClasses += "border-green-500 bg-green-50 text-green-700 ";
      } else {
        baseClasses += "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed ";
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
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {currentIndex + 1} of {totalCount}
          </span>
          <span className="text-sm text-gray-500">
            Press 1-4 to select
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-lg text-gray-600 mb-4">What is the Chinese translation of:</h3>
        <div className="text-3xl font-bold text-gray-900 mb-6 p-6 bg-gray-50 rounded-xl border">
          {question.term.term}
        </div>
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
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-2">Complete translation:</div>
            <div className="mb-1">
              <strong>Chinese:</strong> {question.term.chinese}
            </div>
            <div className="mb-1">
              <strong>Pinyin:</strong> {question.term.pinyin}
            </div>
            <div>
              <strong>Definition:</strong> {question.term.definition}
            </div>
            {question.term.notes && (
              <div className="mt-2 italic">
                <strong>Notes:</strong> {question.term.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          ← Previous
        </button>

        {hasAnswered && (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
          >
            {currentIndex + 1 >= totalCount ? 'Finish Quiz' : 'Next Question →'}
          </button>
        )}

        {!hasAnswered && (
          <div className="px-6 py-2 text-gray-400">
            Select an answer above
          </div>
        )}
      </div>

      {/* Keyboard hints */}
      <div className="mt-4 text-xs text-gray-400">
        {!hasAnswered ? '1-4 to select • ← → to navigate' : 'Enter or Space for next • ← for previous'}
      </div>
    </div>
  );
}
