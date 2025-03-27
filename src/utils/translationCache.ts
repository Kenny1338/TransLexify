
import { TranslationRequest, TranslationResponse } from "@/types";

// Cache for translations
const translationCache = new Map<string, TranslationResponse>();

/**
 * Generate a cache key for a translation request
 */
export const getCacheKey = (request: TranslationRequest): string => {
  return `${request.sourceLang}|${request.targetLang}|${request.text}|${request.includeContextual ? 'contextual' : 'simple'}`;
};

/**
 * Get a cached translation if available
 */
export const getCachedTranslation = (request: TranslationRequest): TranslationResponse | undefined => {
  const cacheKey = getCacheKey(request);
  return translationCache.get(cacheKey);
};

/**
 * Cache a translation result
 */
export const cacheTranslation = (request: TranslationRequest, response: TranslationResponse): void => {
  const cacheKey = getCacheKey(request);
  translationCache.set(cacheKey, response);
};
