export interface Language {
  code: string;
  name: string;
  nativeName?: string;
  direction?: 'ltr' | 'rtl';
}

export type TranslationTheme = 
  | 'auto' 
  | 'general' 
  | 'technical' 
  | 'medical' 
  | 'legal' 
  | 'business' 
  | 'academic' 
  | 'literary' 
  | 'casual';

export type TranslationTone = 
  | 'neutral' 
  | 'formal' 
  | 'informal' 
  | 'friendly' 
  | 'professional';

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  includeContextual?: boolean;
  theme?: TranslationTheme;
  tone?: TranslationTone;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  detectedTheme?: TranslationTheme;
  alternatives?: ContextualTranslation[];
  error?: string;
}

export interface ContextualTranslation {
  text: string;
  explanation: string;
  context?: string;
  style?: string;
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
