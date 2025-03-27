
import { toast } from "sonner";
import { TextToSpeechOptions } from "@/types";

/**
 * Speak text using the browser's Speech Synthesis API
 */
export const speakText = (options: TextToSpeechOptions, onStart?: () => void, onEnd?: () => void, onError?: () => void): void => {
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
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    if (onStop) onStop();
  }
};
