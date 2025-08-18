import { useState, useEffect } from 'react';
import { Category, Term, SessionData, SessionState, StudyMode } from './types';
import categoriesData from './data/categories.json';
import termsData from './data/terms.json';

function App() {
  const [session, setSession] = useState<SessionData>({
    category: null,
    terms: [],
    currentTermIndex: 0,
    mode: 'flashcard',
    state: 'category-selection'
  });

  const categories: Category[] = categoriesData;
  const terms: Term[] = termsData;

  // Test that data loads correctly
  useEffect(() => {
    console.log('Categories loaded:', categories);
    console.log('Terms loaded:', terms);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Glossary Trainer
          </h1>
          <p className="text-gray-600">
            Master technical terms with flashcards and quizzes
          </p>
        </header>

        <main className="bg-white rounded-lg shadow-md p-6">
          {session.state === 'category-selection' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Choose a Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      const categoryTerms = terms.filter(t => t.categoryId === category.id);
                      setSession({
                        ...session,
                        category,
                        terms: categoryTerms,
                        state: 'studying'
                      });
                    }}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-500">
                      {terms.filter(t => t.categoryId === category.id).length} terms
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {session.state === 'studying' && session.category && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                {session.category.icon} {session.category.name}
              </h2>
              <p className="text-gray-600">
                {session.terms.length} terms loaded successfully!
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setSession({ ...session, state: 'category-selection', category: null })}
              >
                Back to Categories
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App
