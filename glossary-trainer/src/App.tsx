import { useState, useEffect } from 'react';
import type { Category, Term, SessionData, MCQQuestion } from './types';
import categoriesData from './data/categories.json';
import termsData from './data/terms.json';
import CategorySelector from './components/CategorySelector';
import Flashcard from './components/Flashcard';
import MCQ from './components/MCQ';
import SessionComplete from './components/SessionComplete';
import PronunciationInfo from './components/PronunciationInfo';
import { shuffleTerms, generateMCQQuestions } from './utils/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function App() {
  const [session, setSession] = useState<SessionData>({
    category: null,
    terms: [],
    currentTermIndex: 0,
    mode: 'flashcard',
    state: 'category-selection',
    correctAnswers: 0,
    totalAnswers: 0
  });

  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories: Category[] = categoriesData;
  const terms: Term[] = termsData;

  // Test that data loads correctly
  useEffect(() => {
    console.log('Categories loaded:', categories.length);
    console.log('Terms loaded:', terms.length);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      // Only handle global shortcuts when studying
      if (session.state !== 'studying') return;
      
      // Prevent default for our keyboard shortcuts
      if (['Escape'].includes(e.key)) {
        e.preventDefault();
        
        switch (e.key) {
          case 'Escape':
            handleNewCategory();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyPress);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, [session.state]);

  // Handle category selection
  const handleCategorySelect = async (category: Category, categoryTerms: Term[]) => {
    setIsLoading(true);
    
    // Add small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const shuffledTerms = shuffleTerms(categoryTerms);
    const questions = generateMCQQuestions(shuffledTerms);
    
    setSession({
      category,
      terms: shuffledTerms,
      currentTermIndex: 0,
      mode: 'flashcard',
      state: 'studying',
      correctAnswers: 0,
      totalAnswers: 0
    });
    setMcqQuestions(questions);
    setIsLoading(false);
  };

  // Navigation handlers
  const handleNext = () => {
    setSession(prev => ({
      ...prev,
      currentTermIndex: prev.currentTermIndex + 1
    }));
  };

  const handlePrevious = () => {
    setSession(prev => ({
      ...prev,
      currentTermIndex: Math.max(0, prev.currentTermIndex - 1)
    }));
  };

  const handleFinish = () => {
    setSession(prev => ({
      ...prev,
      state: 'completed'
    }));
  };

  // MCQ answer handler
  const handleMCQAnswer = (isCorrect: boolean) => {
    setSession(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers! + (isCorrect ? 1 : 0),
      totalAnswers: prev.totalAnswers! + 1
    }));
  };

  // Session completion handlers
  const handleRestart = () => {
    const shuffledTerms = shuffleTerms(session.terms);
    const questions = generateMCQQuestions(shuffledTerms);
    
    setSession(prev => ({
      ...prev,
      terms: shuffledTerms,
      currentTermIndex: 0,
      state: 'studying',
      correctAnswers: 0,
      totalAnswers: 0
    }));
    setMcqQuestions(questions);
  };

  const handleNewCategory = () => {
    setSession({
      category: null,
      terms: [],
      currentTermIndex: 0,
      mode: 'flashcard',
      state: 'category-selection',
      correctAnswers: 0,
      totalAnswers: 0
    });
    setMcqQuestions([]);
  };

  const handleSwitchMode = () => {
    const newMode = session.mode === 'flashcard' ? 'mcq' : 'flashcard';
    const shuffledTerms = shuffleTerms(session.terms);
    const questions = newMode === 'mcq' ? generateMCQQuestions(shuffledTerms) : [];
    
    setSession(prev => ({
      ...prev,
      mode: newMode,
      terms: shuffledTerms,
      currentTermIndex: 0,
      state: 'studying',
      correctAnswers: 0,
      totalAnswers: 0
    }));
    setMcqQuestions(questions);
  };

  // Mode switching during study session
  const handleModeSwitch = () => {
    const newMode = session.mode === 'flashcard' ? 'mcq' : 'flashcard';
    const questions = newMode === 'mcq' ? generateMCQQuestions(session.terms) : [];
    
    setSession(prev => ({
      ...prev,
      mode: newMode,
      currentTermIndex: 0,
      correctAnswers: 0,
      totalAnswers: 0
    }));
    setMcqQuestions(questions);
  };

  // Get current term or question
  const currentTerm = session.terms[session.currentTermIndex];
  const currentQuestion = mcqQuestions[session.currentTermIndex];

  return (
    <div className="min-h-screen !bg-blue-50 dark:!bg-gray-900 px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-12">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8 sm:mb-12 p-6 sm:p-8 rounded-2xl !bg-white dark:!bg-gray-800 !border !border-blue-200 dark:!border-gray-700 shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold !text-gray-900 dark:!text-white mb-3 tracking-tight">
            📚 Glossary Trainer
          </h1>
          <p className="text-base sm:text-lg !text-gray-600 dark:!text-gray-300 leading-relaxed">
            Master technical terms with flashcards and quizzes
          </p>
        </header>

        <Card className="shadow-2xl !bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 min-h-[500px]">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading terms...</p>
              </div>
            </div>
          )}

          {!isLoading && session.state === 'category-selection' && (
            <>
              <CategorySelector
                categories={categories}
                terms={terms}
                onCategorySelect={handleCategorySelect}
              />
              
              {/* Show pronunciation info if there are issues */}
              <div className="mt-6">
                <PronunciationInfo autoShow={false} />
              </div>
            </>
          )}

          {!isLoading && session.state === 'studying' && session.category && (
            <div>
              {/* Simplified header */}
              <div className="flex justify-between items-center mb-12">
                <Button
                  onClick={handleNewCategory}
                  variant="ghost"
                  size="sm"
                  className="!text-gray-500 dark:!text-gray-400 hover:!text-gray-700 dark:hover:!text-gray-200"
                >
                  ← Categories
                </Button>
                
                <div className="text-center">
                  <div className="text-sm !text-gray-900 dark:!text-white font-medium">
                    {session.category.icon} {session.category.name}
                  </div>
                  <div className="text-xs !text-gray-500 dark:!text-gray-400 mt-1">
                    {session.mode === 'flashcard' ? 'Flashcard Mode' : 'Quiz Mode'}
                  </div>
                </div>
                
                <Button
                  onClick={handleModeSwitch}
                  variant="ghost"
                  size="sm"
                  className="!text-blue-600 dark:!text-blue-400 hover:!text-blue-800 dark:hover:!text-blue-200"
                >
                  Switch Mode
                </Button>
              </div>

              {/* Study content */}
              {session.mode === 'flashcard' && currentTerm && (
                <Flashcard
                  term={currentTerm}
                  currentIndex={session.currentTermIndex}
                  totalCount={session.terms.length}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onFinish={handleFinish}
                />
              )}

              {session.mode === 'mcq' && currentQuestion && (
                <MCQ
                  question={currentQuestion}
                  currentIndex={session.currentTermIndex}
                  totalCount={session.terms.length}
                  onAnswer={handleMCQAnswer}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onFinish={handleFinish}
                />
              )}
            </div>
          )}

          {!isLoading && session.state === 'completed' && session.category && (
            <SessionComplete
              category={session.category}
              mode={session.mode}
              totalTerms={session.terms.length}
              correctAnswers={session.correctAnswers}
              totalAnswers={session.totalAnswers}
              onRestart={handleRestart}
              onNewCategory={handleNewCategory}
              onSwitchMode={handleSwitchMode}
            />
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App
