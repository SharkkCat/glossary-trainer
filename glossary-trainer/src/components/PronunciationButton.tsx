import { useState, useEffect } from 'react';
import { useSpeechSynthesisSupport, speakChinese, stopSpeech } from '../utils/speechSynthesis';

interface PronunciationButtonProps {
  /** Chinese text to pronounce */
  text: string;
  /** Optional className for styling */
  className?: string;
  /** Callback when pronunciation starts */
  onStart?: () => void;
  /** Callback when pronunciation ends */
  onEnd?: () => void;
  /** Callback when an error occurs */
  onError?: (error: string) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show text label next to icon */
  showLabel?: boolean;
}

export default function PronunciationButton({
  text,
  className = '',
  onStart,
  onEnd,
  onError,
  size = 'md',
  showLabel = false
}: PronunciationButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const support = useSpeechSynthesisSupport();

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Always render the button - let users try it
  // if (!support.isSupported || !support.hasChineseVoices) {
  //   return null;
  // }

  const handleSpeak = async () => {
    if (isPlaying) {
      // Stop current speech
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    // Check support before attempting to speak
    if (!support.isSupported) {
      setHasError(true);
      const error = 'Web Speech API not supported in this browser. Try Chrome or Edge.';
      onError?.(error);
      console.warn('Pronunciation error:', error);
      return;
    }

    if (!support.hasChineseVoices) {
      setHasError(true);
      const error = 'No Chinese voices found. Please install Chinese language pack in your device settings.';
      onError?.(error);
      console.warn('Pronunciation error:', error);
      return;
    }

    setHasError(false);
    setIsPlaying(true);

    try {
      await speakChinese(
        text,
        () => {
          setIsPlaying(true);
          onStart?.();
        },
        () => {
          setIsPlaying(false);
          onEnd?.();
        },
        (error) => {
          setIsPlaying(false);
          setHasError(true);
          onError?.(error);
          console.warn('Pronunciation error:', error);
        }
      );
    } catch (error) {
      setIsPlaying(false);
      setHasError(true);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(errorMessage);
      console.warn('Pronunciation error:', errorMessage);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const iconSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-1
    bg-blue-500 hover:bg-blue-600 
    text-white font-medium
    rounded-full
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${hasError ? 'bg-red-500 hover:bg-red-600' : ''}
    ${isPlaying ? 'bg-green-500 hover:bg-green-600' : ''}
    ${className}
  `;

  // Icon based on state
  const getIcon = () => {
    if (hasError) return '❌';
    if (isPlaying) return '⏹️';
    return '🔊';
  };

  // Tooltip text
  const getTooltipText = () => {
    if (hasError) {
      if (!support.isSupported) return 'Web Speech API not supported';
      if (!support.hasChineseVoices) return 'Chinese voices not available';
      return 'Pronunciation failed';
    }
    if (isPlaying) return 'Stop pronunciation';
    return 'Play pronunciation';
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling to parent
        handleSpeak();
      }}
      disabled={!text.trim()}
      className={baseClasses}
      title={getTooltipText()}
      aria-label={`${getTooltipText()}: ${text}`}
      type="button"
    >
      <span className={iconSizeClasses[size]} role="img" aria-hidden="true">
        {getIcon()}
      </span>
      {showLabel && (
        <span className="ml-1 text-xs font-medium">
          {isPlaying ? 'Stop' : 'Play'}
        </span>
      )}
    </button>
  );
}

/**
 * Simple pronunciation icon button (compact version)
 */
export function PronunciationIcon({ 
  text, 
  className = '', 
  onError 
}: { 
  text: string; 
  className?: string; 
  onError?: (error: string) => void;
}) {
  return (
    <PronunciationButton
      text={text}
      size="sm"
      className={className}
      onError={onError}
    />
  );
}

/**
 * Pronunciation button with label (for forms and prominent placement)
 */
export function PronunciationButtonWithLabel({ 
  text, 
  className = '', 
  onError 
}: { 
  text: string; 
  className?: string; 
  onError?: (error: string) => void;
}) {
  return (
    <PronunciationButton
      text={text}
      size="md"
      showLabel={true}
      className={className}
      onError={onError}
    />
  );
}
