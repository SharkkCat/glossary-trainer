import type { Category, StudyMode } from '../types';

interface SessionCompleteProps {
  category: Category;
  mode: StudyMode;
  totalTerms: number;
  correctAnswers?: number;
  totalAnswers?: number;
  onRestart: () => void;
  onNewCategory: () => void;
  onSwitchMode: () => void;
}

export default function SessionComplete({
  category,
  mode,
  totalTerms,
  correctAnswers = 0,
  totalAnswers = 0,
  onRestart,
  onNewCategory,
  onSwitchMode
}: SessionCompleteProps) {
  // Calculate score percentage for MCQ mode
  const scorePercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // Get encouraging message based on performance
  const getEncouragementMessage = () => {
    if (mode === 'flashcard') {
      return `You've studied all ${totalTerms} terms! 🎉`;
    }
    
    if (scorePercentage >= 90) return "Outstanding! You're a vocabulary master! 🏆";
    if (scorePercentage >= 80) return "Excellent work! You really know your terms! 🌟";
    if (scorePercentage >= 70) return "Good job! You're making great progress! 👍";
    if (scorePercentage >= 60) return "Not bad! Keep practicing to improve! 💪";
    return "Great effort! Practice makes perfect! 🎯";
  };

  // Get performance color
  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="text-center">
      {/* Celebration header */}
      <div className="mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Session Complete!
        </h2>
        <p className="text-gray-600">
          {getEncouragementMessage()}
        </p>
      </div>

      {/* Category info */}
      <div className="mb-8 p-6 bg-gray-50 rounded-xl border">
        <div className="text-3xl mb-2">{category.icon}</div>
        <div className="font-semibold text-gray-900 mb-1">
          {category.name}
        </div>
        <div className="text-sm text-gray-600">
          {mode === 'flashcard' ? 'Flashcard Mode' : 'Quiz Mode'}
        </div>
      </div>

      {/* Score display for MCQ mode */}
      {mode === 'mcq' && totalAnswers > 0 && (
        <div className="mb-8">
          <div className="text-4xl font-bold mb-2">
            <span className={getScoreColor()}>
              {correctAnswers}/{totalAnswers}
            </span>
          </div>
          <div className={`text-2xl font-semibold mb-4 ${getScoreColor()}`}>
            {scorePercentage}% Correct
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${
                scorePercentage >= 80 ? 'bg-green-500' :
                scorePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-4">
        {/* Primary action - Try different mode */}
        <button
          onClick={onSwitchMode}
          className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
        >
          {mode === 'flashcard' ? 'Try Quiz Mode 🧠' : 'Try Flashcard Mode 📚'}
        </button>

        {/* Secondary actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onRestart}
            className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
          >
            🔄 Study Again
          </button>

          <button
            onClick={onNewCategory}
            className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
          >
            📚 New Category
          </button>
        </div>
      </div>

      {/* Study tips */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <div className="font-semibold mb-2">💡 Study Tips:</div>
          <ul className="text-left space-y-1">
            {mode === 'flashcard' ? (
              <>
                <li>• Try the quiz mode to test your memory</li>
                <li>• Review terms you found difficult</li>
                <li>• Practice regularly for better retention</li>
              </>
            ) : (
              <>
                <li>• Use flashcards to reinforce learning</li>
                <li>• Review incorrect answers carefully</li>
                <li>• Focus on terms with lower scores</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
