import type { Term, MCQQuestion, MCQOption } from '../types';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates MCQ options with smart distractors from the same category
 */
export function generateMCQQuestion(
  correctTerm: Term,
  allTerms: Term[]
): MCQQuestion {
  // Get potential distractors from the same category
  const sameCategoryTerms = allTerms.filter(
    t => t.categoryId === correctTerm.categoryId && t.id !== correctTerm.id
  );

  // If we don't have enough terms in the same category, use terms from other categories
  const fallbackTerms = allTerms.filter(t => t.id !== correctTerm.id);
  
  // Select 3 random distractors
  const availableTerms = sameCategoryTerms.length >= 3 ? sameCategoryTerms : fallbackTerms;
  const distractors = shuffleArray(availableTerms).slice(0, 3);

  // Create options
  const options: MCQOption[] = [
    { text: correctTerm.chinese, isCorrect: true },
    ...distractors.map(term => ({ text: term.chinese, isCorrect: false }))
  ];

  // Shuffle options so correct answer isn't always first
  const shuffledOptions = shuffleArray(options);

  return {
    term: correctTerm,
    options: shuffledOptions
  };
}

/**
 * Generates a list of MCQ questions from a list of terms
 */
export function generateMCQQuestions(terms: Term[]): MCQQuestion[] {
  return terms.map(term => generateMCQQuestion(term, terms));
}

/**
 * Shuffles the terms array for random quiz order
 */
export function shuffleTerms(terms: Term[]): Term[] {
  return shuffleArray(terms);
}
