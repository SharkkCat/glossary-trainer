// Core data interfaces
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Term {
  id: string;
  categoryId: string;
  term: string;
  definition: string;
  example?: string;
}

// Quiz interfaces
export interface MCQOption {
  text: string;
  isCorrect: boolean;
}

export interface MCQQuestion {
  term: Term;
  options: MCQOption[];
}

// App state interfaces
export type StudyMode = 'flashcard' | 'mcq';

export type SessionState = 'category-selection' | 'studying' | 'completed';

export interface SessionData {
  category: Category | null;
  terms: Term[];
  currentTermIndex: number;
  mode: StudyMode;
  state: SessionState;
  correctAnswers?: number;
  totalAnswers?: number;
}
