
import { TranslationRequest, TranslationResponse } from "@/types";
import { getLanguageByCode } from "@/utils/languageData";
import { toast } from "sonner";

// Use the OpenAI API key from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// For debugging - log whether the API key is available
console.log("API Key available:", !!OPENAI_API_KEY);
console.log("API Key value type:", typeof OPENAI_API_KEY);
console.log("API Key length:", OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);
console.log("API Key first 5 chars:", OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 5) : "none");

/**
 * Translate text using OpenAI API
 */
export const translateWithOpenAI = async (request: TranslationRequest): Promise<TranslationResponse> => {
  if (!request.text.trim()) {
    return { translatedText: "" };
  }
  
  if (!OPENAI_API_KEY) {
    toast.error("OpenAI API Key is missing", {
      description: "Please set the VITE_OPENAI_API_KEY environment variable to use translation features."
    });
    return { 
      translatedText: "ERROR: OpenAI API Key is missing. Please set the VITE_OPENAI_API_KEY environment variable.",
      error: "API key missing" 
    };
  }
  
  try {
    const sourceLangName = getLanguageByCode(request.sourceLang === "auto" ? "en" : request.sourceLang)?.name || "English";
    const targetLangName = getLanguageByCode(request.targetLang)?.name || "English";
    
    let systemPrompt = `You are a translation service. Translate the given text FROM ${sourceLangName} TO ${targetLangName}. Provide ONLY the direct translation without any explanations, descriptions, or additional content. Do not include phrases like "this translates to" or descriptions of the language.`;
    
    if (request.includeContextual) {
      systemPrompt = `You are an advanced translation service specializing in contextual and cultural nuances. 
      Translate the following text FROM ${sourceLangName} TO ${targetLangName}.
      
      Your response must be in this JSON format:
      {
        "mainTranslation": "The direct translation of the text without any explanations",
        "alternatives": [
          {
            "text": "Alternative translation 1",
            "explanation": "Explanation of cultural nuances, idioms, or context considerations for this alternative"
          },
          {
            "text": "Alternative translation 2",
            "explanation": "Explanation of cultural nuances, idioms, or context considerations for this alternative"
          }
        ]
      }
      
      Provide ONLY the direct translation in the mainTranslation field, without any descriptions or extra text.
      Focus on idioms, cultural references, and linguistic subtleties when creating alternatives.
      Provide at least 2 alternative translations that preserve different aspects of the original meaning or style.`;
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: request.text
          }
        ],
        temperature: request.includeContextual ? 0.7 : 0.3,
        max_tokens: 1500
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Translation failed");
    }
    
    const data = await response.json();
    const responseContent = data.choices?.[0]?.message?.content?.trim() || "";
    
    if (request.includeContextual) {
      try {
        const parsedResponse = JSON.parse(responseContent);
        return {
          translatedText: parsedResponse.mainTranslation,
          detectedLanguage: request.sourceLang === "auto" ? "en" : request.sourceLang,
          alternatives: parsedResponse.alternatives,
        };
      } catch (parseError) {
        console.error("Failed to parse contextual translation:", parseError);
        return {
          translatedText: responseContent,
          detectedLanguage: request.sourceLang === "auto" ? "en" : request.sourceLang,
        };
      }
    }
    
    return {
      translatedText: responseContent,
      detectedLanguage: request.sourceLang === "auto" ? "en" : request.sourceLang,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
};

/**
 * Detect language of text using OpenAI
 */
export const detectLanguage = async (text: string): Promise<string> => {
  if (!text.trim()) return "en";
  
  if (!OPENAI_API_KEY) {
    toast.error("OpenAI API Key is missing", {
      description: "Please set the VITE_OPENAI_API_KEY environment variable to use language detection."
    });
    return "en";
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a language detection service. Your only task is to detect the language of the text. Reply with just the ISO 639-1 language code (like 'en', 'es', 'fr', etc.)"
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 10
      })
    });
    
    if (!response.ok) {
      throw new Error("Language detection failed");
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim().toLowerCase();
  } catch (error) {
    console.error("Language detection error:", error);
    throw error;
  }
};
