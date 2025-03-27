
export interface Language {
  code: string;
  name: string;
  nativeName?: string;
  direction?: 'ltr' | 'rtl';
}

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  includeContextual?: boolean;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  alternatives?: ContextualTranslation[];
  error?: string;
}

export interface ContextualTranslation {
  text: string;
  explanation: string;
}

export interface TextToSpeechOptions {
  text: string;
  lang: string;
}

export type CopyStatus = 'idle' | 'copied' | 'error';

export interface CharacterCount {
  current: number;
  max: number;
}
