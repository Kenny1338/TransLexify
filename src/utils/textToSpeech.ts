import { toast } from "sonner";
import { TextToSpeechOptions } from "@/types";
import { playElevenLabsAudio, stopElevenLabsAudio } from "@/services/elevenLabsService";

// Flag to determine whether to use ElevenLabs or browser TTS
const USE_ELEVENLABS = !!import.meta.env.VITE_ELEVENLABS_API_KEY;

/**
 * Speak text using ElevenLabs API or fall back to browser's Speech Synthesis API
 */
export const speakText = (options: TextToSpeechOptions, onStart?: () => void, onEnd?: () => void, onError?: () => void): void => {
  if (USE_ELEVENLABS) {
    // Use ElevenLabs for high-quality speech
    playElevenLabsAudio(options, onStart, onEnd, onError);
  } else {
    // Fall back to browser's Speech Synthesis API
    speakWithBrowser(options, onStart, onEnd, onError);
  }
};

/**
 * Speak text using the browser's Speech Synthesis API
 */
const speakWithBrowser = (options: TextToSpeechOptions, onStart?: () => void, onEnd?: () => void, onError?: () => void): void => {
  if (!window.speechSynthesis) {
    toast.error("Text-to-speech is not supported in your browser");
    return;
  }
  
  try {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(options.text);
    utterance.lang = options.lang;
    
    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
      if (onError) onError();
      toast.error("Text-to-speech playback failed");
    };
    
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Text-to-speech error:", err);
    toast.error("Could not play audio");
    if (onEnd) onEnd();
  }
};

/**
 * Stop any current speech synthesis
 */
export const stopSpeaking = (onStop?: () => void): void => {
  if (USE_ELEVENLABS) {
    // Stop ElevenLabs audio
    stopElevenLabsAudio(onStop);
  } else if (window.speechSynthesis) {
    // Stop browser speech synthesis
    window.speechSynthesis.cancel();
    if (onStop) onStop();
  }
};
