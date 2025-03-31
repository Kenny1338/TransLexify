import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { TranslationRequest, TranslationResponse, TextToSpeechOptions, ContextualTranslation, TranslationTheme, TranslationTone } from "@/types";
import { translateWithOpenAI, detectLanguage } from "@/services/translationService";
import { getCachedTranslation, cacheTranslation } from "@/utils/translationCache";
import { speakText, stopSpeaking as stopSpeechSynthesis } from "@/utils/textToSpeech";

export function useTranslation() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("es");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [contextualAlternatives, setContextualAlternatives] = useState<ContextualTranslation[]>([]);
  const [contextualMode, setContextualMode] = useState(false);
  const [translationTheme, setTranslationTheme] = useState<TranslationTheme>("general");
  const [translationTone, setTranslationTone] = useState<TranslationTone>("neutral");
  const [detectedTheme, setDetectedTheme] = useState<TranslationTheme | undefined>(undefined);

  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxCharacterLimit = 5000;

  // Swap source and target languages
  const swapLanguages = useCallback(() => {
    // Behalte "auto" nicht beim Tauschen bei
    const newSourceLang = targetLang;
    setSourceLang(newSourceLang);
    // Setze targetLang auf die erkannte Sprache oder auf die vorherige sourceLang, falls keine erkannt wurde
    setTargetLang(detectedLanguage || (sourceLang === "auto" ? "en" : sourceLang));
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setDetectedLanguage(null);
    setContextualAlternatives([]);
    setDetectedTheme(undefined);
  }, [sourceLang, targetLang, sourceText, translatedText, detectedLanguage]);

  // Toggle contextual translation mode
  const toggleContextualMode = useCallback(() => {
    const newMode = !contextualMode;
    setContextualMode(newMode);
    if (newMode && sourceText.trim()) {
      translateText(true);
    }
  }, [contextualMode, sourceText]);

  // Translate text with debounce
  const translateText = useCallback(async (immediate = false) => {
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    const performTranslation = async () => {
      if (!sourceText.trim()) {
        setTranslatedText("");
        setContextualAlternatives([]);
        setIsTranslating(false);
        return;
      }

      try {
        setIsTranslating(true);
        setError(null);

        const request: TranslationRequest = {
          text: sourceText,
          sourceLang,
          targetLang,
          includeContextual: contextualMode,
          theme: translationTheme,
          tone: translationTone
        };

        // Check cache first
        const cachedResponse = getCachedTranslation(request);
        if (cachedResponse) {
          setTranslatedText(cachedResponse.translatedText);
          setContextualAlternatives(cachedResponse.alternatives || []);
          if (cachedResponse.detectedLanguage) {
            setDetectedLanguage(cachedResponse.detectedLanguage);
          }
          if (cachedResponse.detectedTheme) {
            setDetectedTheme(cachedResponse.detectedTheme);
          }
          setIsTranslating(false);
          return;
        }

        // Perform translation
        const response = await translateWithOpenAI(request);

        // Cache the result
        cacheTranslation(request, response);

        setTranslatedText(response.translatedText);
        setContextualAlternatives(response.alternatives || []);

        if (response.detectedLanguage) {
          setDetectedLanguage(response.detectedLanguage);
        }

        if (response.detectedTheme) {
          setDetectedTheme(response.detectedTheme);
        }
      } catch (err) {
        console.error("Translation error:", err);
        setError(err instanceof Error ? err.message : "Translation failed");
        toast.error("Translation failed", {
          description: err instanceof Error ? err.message : "Please try again later",
        });
      } finally {
        setIsTranslating(false);
      }
    };

    if (immediate) {
      performTranslation();
    } else {
      translationTimeoutRef.current = setTimeout(performTranslation, 500);
    }
  }, [sourceText, sourceLang, targetLang, contextualMode, translationTheme, translationTone]);

  // Detect language of source text
  const handleDetectLanguage = useCallback(async () => {
    if (!sourceText.trim()) return;

    try {
      setIsDetecting(true);

      const detectedLangCode = await detectLanguage(sourceText);

      setDetectedLanguage(detectedLangCode);
      setSourceLang(detectedLangCode);

      translateText(true);
    } catch (err) {
      console.error("Language detection error:", err);
      toast.error("Language detection failed");
    } finally {
      setIsDetecting(false);
    }
  }, [sourceText, translateText]);

  // Text to speech functionality
  const speak = useCallback(({ text, lang }: TextToSpeechOptions) => {
    speakText(
      { text, lang },
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    stopSpeechSynthesis(() => setIsSpeaking(false));
  }, []);

  // Effect to translate when text or languages change
  useEffect(() => {
    if (sourceText.length > 0) {
      translateText();
    } else {
      setTranslatedText("");
    }

    return () => {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, [sourceText, sourceLang, targetLang, translateText]);

  // Effect to clean up speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    sourceText,
    setSourceText,
    translatedText,
    setTranslatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    isTranslating,
    isDetecting,
    isSpeaking,
    detectedLanguage,
    error,
    swapLanguages,
    translateText,
    detectLanguage: handleDetectLanguage,
    speak,
    stopSpeaking,
    characterCount: {
      current: sourceText.length,
      max: maxCharacterLimit,
    },
    contextualAlternatives,
    contextualMode,
    toggleContextualMode,
    translationTheme,
    setTranslationTheme,
    translationTone,
    setTranslationTone,
    detectedTheme
  };
}
