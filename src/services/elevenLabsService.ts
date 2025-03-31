import { toast } from "sonner";
import { TextToSpeechOptions } from "@/types";

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Default voice IDs for different languages
// These are placeholder IDs - you might want to replace them with actual voice IDs
// from the ElevenLabs dashboard that match your desired language voices
const VOICE_MAP: Record<string, string> = {
  default: "21m00Tcm4TlvDq8ikWAM", // Rachel - English (US)
  en: "21m00Tcm4TlvDq8ikWAM", // Rachel - English (US)  
  de: "AZnzlk1XvdvUeBnXmlld", // Aleno - German
  es: "EXAVITQu4vr4xnSDxMaL", // Sergio - Spanish
  fr: "MF3mGyEYCl7XYWbV9V6O", // Elli - French
  it: "UeuTzRN3HjgJUw7W4KRl", // Belle - Italian
  // Add more languages as needed
};

interface ElevenLabsResponse {
  audio_url?: string;
  message?: string;
  error?: string;
}

/**
 * Get the most suitable voice for a given language
 */
const getVoiceForLanguage = (languageCode: string): string => {
  // Split language code if it includes a locale (e.g., "en-US" -> "en")
  const baseLanguage = languageCode.split("-")[0].toLowerCase();
  return VOICE_MAP[baseLanguage] || VOICE_MAP.default;
};

/**
 * Convert text to speech using ElevenLabs API
 */
export const textToSpeech = async (options: TextToSpeechOptions): Promise<string | null> => {
  if (!ELEVENLABS_API_KEY) {
    toast.error("ElevenLabs API key is missing");
    return null;
  }

  const voiceId = getVoiceForLanguage(options.lang);
  const url = `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: options.text,
        model_id: "eleven_multilingual_v2", // Using multilingual model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to convert text to speech");
    }

    // Convert the response to a blob
    const audioBlob = await response.blob();
    
    // Create a URL for the audio blob
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("ElevenLabs API error:", error);
    toast.error("Failed to generate speech");
    return null;
  }
};

// Current audio element playing ElevenLabs audio
let currentAudio: HTMLAudioElement | null = null;

/**
 * Play audio from ElevenLabs
 */
export const playElevenLabsAudio = async (
  options: TextToSpeechOptions,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): Promise<void> => {
  try {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    // Convert text to speech and get audio URL
    const audioUrl = await textToSpeech(options);
    if (!audioUrl) {
      if (onError) onError();
      return;
    }

    // Create a new audio element
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    // Set up event handlers
    audio.onplay = () => {
      if (onStart) onStart();
    };
    
    audio.onended = () => {
      if (onEnd) onEnd();
      // Clean up the blob URL when done
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.onerror = () => {
      if (onError) onError();
      toast.error("Error playing audio");
      // Clean up the blob URL on error
      URL.revokeObjectURL(audioUrl);
    };

    // Play the audio
    await audio.play();
  } catch (error) {
    console.error("Audio playback error:", error);
    if (onError) onError();
    toast.error("Failed to play audio");
  }
};

/**
 * Stop any currently playing audio
 */
export const stopElevenLabsAudio = (onStop?: () => void): void => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    if (onStop) onStop();
  }
};
