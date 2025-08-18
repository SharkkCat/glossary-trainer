import { useState } from 'react';
import { useSpeechSynthesisSupport } from '../utils/speechSynthesis';

interface PronunciationInfoProps {
  /** Whether to show the info automatically or only when clicked */
  autoShow?: boolean;
  /** Custom className */
  className?: string;
}

export default function PronunciationInfo({ 
  autoShow = false, 
  className = '' 
}: PronunciationInfoProps) {
  const [isVisible, setIsVisible] = useState(autoShow);
  const support = useSpeechSynthesisSupport();

  // Only show if there are issues with pronunciation support
  const shouldShowInfo = !support.isSupported || !support.hasChineseVoices;

  if (!shouldShowInfo && !autoShow) {
    return null;
  }

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const getInfoContent = () => {
    if (!support.isSupported) {
      return {
        icon: '⚠️',
        title: 'Audio Pronunciation Not Available',
        message: 'Your browser doesn\'t support the Web Speech API. Pronunciation features will not be available.',
        suggestions: [
          'Try using Google Chrome or Microsoft Edge for the best experience',
          'Update your browser to the latest version'
        ]
      };
    }

    if (!support.hasChineseVoices) {
      return {
        icon: '🔊',
        title: 'Chinese Voices Not Found',
        message: 'No Chinese text-to-speech voices are installed on your device.',
        suggestions: [
          'On Windows: Go to Settings > Time & Language > Speech > Add voices',
          'On Mac: Go to System Preferences > Accessibility > Speech > System Voice > Customize',
          'On Android: Install Chinese language pack in Settings > Language & Input',
          'On iOS: Go to Settings > Accessibility > Spoken Content > Voices > Chinese'
        ]
      };
    }

    // Fallback (shouldn't reach here if shouldShowInfo logic is correct)
    return {
      icon: '✅',
      title: 'Pronunciation Available',
      message: 'Chinese pronunciation is available on your device.',
      suggestions: []
    };
  };

  const info = getInfoContent();

  if (!isVisible && !autoShow) {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline ${className}`}
        type="button"
      >
        <span role="img" aria-hidden="true">ℹ️</span>
        Audio not working?
      </button>
    );
  }

  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">
          {info.icon}
        </span>
        <div className="flex-1">
          <h4 className="font-medium text-amber-900 mb-1">
            {info.title}
          </h4>
          <p className="text-sm text-amber-800 mb-3">
            {info.message}
          </p>
          {info.suggestions.length > 0 && (
            <div className="text-sm text-amber-700">
              <p className="font-medium mb-2">To enable pronunciation:</p>
              <ul className="list-disc list-inside space-y-1">
                {info.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {!autoShow && (
          <button
            onClick={handleToggle}
            className="text-amber-600 hover:text-amber-800 flex-shrink-0"
            aria-label="Close pronunciation info"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Compact info button that shows a tooltip/popover with pronunciation help
 */
export function PronunciationHelpButton({ className = '' }: { className?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const support = useSpeechSynthesisSupport();

  // Only show if there are pronunciation issues
  if (support.isSupported && support.hasChineseVoices) {
    return null;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="text-gray-400 hover:text-gray-600 text-sm"
        aria-label="Pronunciation help"
        type="button"
      >
        <span role="img" aria-hidden="true">🔊❓</span>
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 max-w-xs">
            <div className="relative">
              {!support.isSupported ? (
                <p>Audio not supported in this browser. Try Chrome or Edge.</p>
              ) : (
                <p>No Chinese voices found. Install Chinese language pack in your device settings.</p>
              )}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
