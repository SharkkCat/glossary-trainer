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
    if (scorePercentage >= 80) return "text-lime-600 dark:text-lime-400";
    if (scorePercentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="text-center">
      {/* Celebration header */}
      <div className="mb-8 p-6 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 dark:from-lime-950/30 dark:via-green-950/30 dark:to-emerald-900/20 rounded-xl border border-lime-200 dark:border-lime-700 shadow-xl">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Session Complete!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-lime-200/30 dark:border-lime-700/30 backdrop-blur-sm">
          {getEncouragementMessage()}
        </p>
      </div>

      {/* Category info */}
      <Card className="mb-8 bg-gradient-to-br from-white to-lime-50/30 dark:from-gray-800 dark:to-lime-900/10 border-lime-200/40 dark:border-lime-700/40">
        <CardContent className="p-6">
          <div className="text-3xl mb-2 p-3 bg-gradient-to-br from-lime-100/50 to-green-100/50 dark:from-lime-900/30 dark:to-green-900/30 rounded-xl w-fit mx-auto border border-lime-200/30 dark:border-lime-700/30">{category.icon}</div>
          <div className="font-semibold text-foreground mb-1 px-3 py-1 bg-white/60 dark:bg-gray-700/60 rounded-lg text-center border border-lime-200/20 dark:border-lime-700/20">
            {category.name}
          </div>
          <div className="text-sm text-lime-600 dark:text-lime-400 px-2 py-1 bg-lime-50/50 dark:bg-lime-900/20 rounded-md text-center border border-lime-300/30 dark:border-lime-600/30">
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
              scorePercentage >= 80 ? '[&>div]:bg-gradient-to-r [&>div]:from-lime-500 [&>div]:to-green-500' :
              scorePercentage >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
            }`}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-6">
        {/* Primary action - Try different mode */}
        <Button
          onClick={onSwitchMode}
          variant="gradient"
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {mode === 'flashcard' ? 'Try Quiz Mode 🧠' : 'Try Flashcard Mode 📚'}
        </Button>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={onRestart}
              variant="outline"
              className="h-12 flex-col gap-1 hover:bg-lime-50 hover:border-lime-300 dark:hover:bg-lime-900/20 dark:hover:border-lime-600"
            >
              <span className="text-lg">🔄</span>
              <span className="text-xs">Restart</span>
            </Button>

            <Button
              onClick={onNewCategory}
              variant="outline"
              className="h-12 flex-col gap-1 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20 dark:hover:border-green-600"
            >
              <span className="text-lg">📚</span>
              <span className="text-xs">Categories</span>
            </Button>

            <Button
              onClick={() => onSwitchMode()}
              variant="outline"
              className="h-12 flex-col gap-1 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-600"
            >
              <span className="text-lg">{mode === 'flashcard' ? '🧠' : '📖'}</span>
              <span className="text-xs">Switch</span>
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="h-12 flex-col gap-1 hover:bg-yellow-50 hover:border-yellow-300 dark:hover:bg-yellow-900/20 dark:hover:border-yellow-600"
            >
              <span className="text-lg">🏠</span>
              <span className="text-xs">Home</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Study tips */}
      <Card className="mt-8 bg-gradient-to-br from-lime-50/50 to-green-50/50 dark:from-lime-950/20 dark:to-green-950/20 border-lime-200/30 dark:border-lime-700/30">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-full text-sm font-medium">
              <span>💡</span>
              Study Tips
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mode === 'flashcard' ? (
              <>
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg text-center border border-lime-200/30 dark:border-lime-700/30">
                  <div className="text-lg mb-1">🧠</div>
                  <div className="text-xs text-muted-foreground">Try quiz mode</div>
                </div>
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg text-center border border-lime-200/30 dark:border-lime-700/30">
                  <div className="text-lg mb-1">🔄</div>
                  <div className="text-xs text-muted-foreground">Review difficult terms</div>
                </div>
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg text-center border border-lime-200/30 dark:border-lime-700/30">
                  <div className="text-lg mb-1">📅</div>
                  <div className="text-xs text-muted-foreground">Practice regularly</div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg text-center border border-lime-200/30 dark:border-lime-700/30">
                  <div className="text-lg mb-1">📖</div>
                  <div className="text-xs text-muted-foreground">Use flashcards</div>
                </div>
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg text-center border border-lime-200/30 dark:border-lime-700/30">
                  <div className="text-lg mb-1">❌</div>
                  <div className="text-xs text-muted-foreground">Review mistakes</div>
                </div>
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg text-center border border-lime-200/30 dark:border-lime-700/30">
                  <div className="text-lg mb-1">🎯</div>
                  <div className="text-xs text-muted-foreground">Focus on weak areas</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
