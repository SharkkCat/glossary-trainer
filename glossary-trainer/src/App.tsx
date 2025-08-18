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
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            📚 Glossary Trainer
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Master technical terms with flashcards and quizzes
          </p>
        </header>

        <main className="bg-white rounded-lg shadow-md p-4 sm:p-6 min-h-[500px]">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading terms...</p>
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
              {/* Mode switcher and back button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <button
                  onClick={handleNewCategory}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
                >
                  ← Back to Categories
                </button>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm text-gray-500 font-medium">
                    {session.category.icon} {session.category.name}
                  </span>
                  <button
                    onClick={handleModeSwitch}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    Switch to {session.mode === 'flashcard' ? 'Quiz' : 'Flashcard'} Mode
                  </button>
                </div>
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
        </main>
      </div>
    </div>
  );
}

export default App
