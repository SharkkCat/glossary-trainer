import type { Category, StudyMode } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
    if (scorePercentage >= 80) return "text-green-600 dark:text-green-400";
    if (scorePercentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="text-center">
      {/* Celebration header */}
      <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Session Complete!
        </h2>
        <p className="text-muted-foreground px-4 py-2 bg-background/40 rounded-lg">
          {getEncouragementMessage()}
        </p>
      </div>

      {/* Category info */}
      <Card className="mb-8 bg-gradient-to-br from-card to-muted/10 border-border/50">
        <CardContent className="p-6">
          <div className="text-3xl mb-2 p-2 bg-background/40 rounded-xl w-fit mx-auto">{category.icon}</div>
          <div className="font-semibold text-foreground mb-1 px-3 py-1 bg-background/30 rounded-lg text-center">
            {category.name}
          </div>
          <div className="text-sm text-muted-foreground px-2 py-1 bg-muted/30 rounded-md text-center">
            {mode === 'flashcard' ? 'Flashcard Mode' : 'Quiz Mode'}
          </div>
        </CardContent>
      </Card>

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
          <Progress 
            value={scorePercentage} 
            className={`h-4 mb-4 ${
              scorePercentage >= 80 ? '[&>div]:bg-green-500' :
              scorePercentage >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
            }`}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-4">
        {/* Primary action - Try different mode */}
        <Button
          onClick={onSwitchMode}
          className="w-full px-6 py-4 font-semibold"
          size="lg"
        >
          {mode === 'flashcard' ? 'Try Quiz Mode 🧠' : 'Try Flashcard Mode 📚'}
        </Button>

        {/* Secondary actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={onRestart}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 font-medium"
            size="default"
          >
            🔄 Study Again
          </Button>

          <Button
            onClick={onNewCategory}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 font-medium"
            size="default"
          >
            📚 New Category
          </Button>
        </div>
      </div>

      {/* Study tips */}
      <Card className="mt-8 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-5">
          <div className="text-sm text-foreground">
            <div className="font-semibold mb-3 text-center px-3 py-1 bg-amber-600 text-white rounded-full text-xs uppercase tracking-wide">💡 Study Tips</div>
            <ul className="text-left space-y-2">
              {mode === 'flashcard' ? (
                <>
                  <li className="px-3 py-2 bg-background/40 rounded-lg">• Try the quiz mode to test your memory</li>
                  <li className="px-3 py-2 bg-background/40 rounded-lg">• Review terms you found difficult</li>
                  <li className="px-3 py-2 bg-background/40 rounded-lg">• Practice regularly for better retention</li>
                </>
              ) : (
                <>
                  <li className="px-3 py-2 bg-background/40 rounded-lg">• Use flashcards to reinforce learning</li>
                  <li className="px-3 py-2 bg-background/40 rounded-lg">• Review incorrect answers carefully</li>
                  <li className="px-3 py-2 bg-background/40 rounded-lg">• Focus on terms with lower scores</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
