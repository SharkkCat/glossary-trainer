import { useState, useEffect } from 'react';

/**
 * Speech Synthesis Utilities for Chinese Pronunciation
 * Handles feature detection, voice selection, and TTS functionality
 */

export interface VoiceInfo {
  voice: SpeechSynthesisVoice;
  quality: 'high' | 'medium' | 'low';
  isDefault: boolean;
}

export interface SpeechSynthesisSupport {
  isSupported: boolean;
  hasChineseVoices: boolean;
  chineseVoices: VoiceInfo[];
  errorMessage?: string;
}

/**
 * Check if Web Speech API and Chinese voices are available
 */
export const checkSpeechSynthesisSupport = (): SpeechSynthesisSupport => {
  // Check if Web Speech API is available
  if (!('speechSynthesis' in window)) {
    return {
      isSupported: false,
      hasChineseVoices: false,
      chineseVoices: [],
      errorMessage: 'Web Speech API not supported in this browser'
    };
  }

  // Get available voices
  const voices = speechSynthesis.getVoices();
  
  // Filter Chinese voices (zh, zh-CN, zh-TW, zh-HK, etc.)
  const chineseVoices = voices
    .filter(voice => voice.lang.toLowerCase().startsWith('zh'))
    .map(voice => ({
      voice,
      quality: getVoiceQuality(voice),
      isDefault: voice.default
    }))
    .sort((a, b) => {
      // Sort by quality (high first), then by default status
      if (a.quality !== b.quality) {
        const qualityOrder = { high: 3, medium: 2, low: 1 };
        return qualityOrder[b.quality] - qualityOrder[a.quality];
      }
      return a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1;
    });

  const hasChineseVoices = chineseVoices.length > 0;

  return {
    isSupported: true,
    hasChineseVoices,
    chineseVoices,
    errorMessage: !hasChineseVoices ? 'No Chinese voices available on this device' : undefined
  };
};

/**
 * Determine voice quality based on name and characteristics
 */
const getVoiceQuality = (voice: SpeechSynthesisVoice): 'high' | 'medium' | 'low' => {
  const name = voice.name.toLowerCase();
  
  // High quality indicators
  if (name.includes('google') || name.includes('natural') || name.includes('neural')) {
    return 'high';
  }
  
  // Medium quality indicators
  if (name.includes('enhanced') || name.includes('premium') || voice.localService) {
    return 'medium';
  }
  
  // Default to low quality
  return 'low';
};

/**
 * Get the best available Chinese voice
 */
export const getBestChineseVoice = (): SpeechSynthesisVoice | null => {
  const support = checkSpeechSynthesisSupport();
  
  if (!support.hasChineseVoices || support.chineseVoices.length === 0) {
    return null;
  }
  
  // Return the highest quality voice (already sorted)
  return support.chineseVoices[0].voice;
};

/**
 * Speak Chinese text with error handling
 */
export const speakChinese = async (
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: string) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Check support
      const support = checkSpeechSynthesisSupport();
      if (!support.isSupported || !support.hasChineseVoices) {
        const error = support.errorMessage || 'Chinese speech synthesis not available';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      // Get the best Chinese voice
      const voice = getBestChineseVoice();
      if (!voice) {
        const error = 'No suitable Chinese voice found';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.8; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Event handlers
      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const error = `Speech synthesis error: ${event.error}`;
        onError?.(error);
        reject(new Error(error));
      };

      // Speak the text
      speechSynthesis.speak(utterance);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown speech synthesis error';
      onError?.(errorMessage);
      reject(new Error(errorMessage));
    }
  });
};

/**
 * Stop any ongoing speech
 */
export const stopSpeech = (): void => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
};

/**
 * Hook for components to check speech synthesis support
 * Handles the async nature of voice loading
 */
export const useSpeechSynthesisSupport = () => {
  const [support, setSupport] = useState<SpeechSynthesisSupport>({
    isSupported: false,
    hasChineseVoices: false,
    chineseVoices: []
  });

  useEffect(() => {
    const checkSupport = () => {
      const currentSupport = checkSpeechSynthesisSupport();
      setSupport(currentSupport);
    };

    // Initial check
    checkSupport();

    // Voices might load asynchronously, so check again after a delay
    const timeoutId = setTimeout(checkSupport, 100);

    // Listen for voice changes (some browsers fire this event)
    if ('speechSynthesis' in window) {
      speechSynthesis.addEventListener('voiceschanged', checkSupport);
    }

    return () => {
      clearTimeout(timeoutId);
      if ('speechSynthesis' in window) {
        speechSynthesis.removeEventListener('voiceschanged', checkSupport);
      }
    };
  }, []);

  return support;
};


