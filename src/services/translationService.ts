import { TranslationRequest, TranslationResponse, TranslationTheme } from "@/types";
import { getLanguageByCode } from "@/utils/languageData";
import { toast } from "sonner";

// Use the OpenAI API key from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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
    // Detect the language first if set to auto
    let actualSourceLang = request.sourceLang;
    if (actualSourceLang === "auto") {
      try {
        actualSourceLang = await detectLanguage(request.text);
      } catch (error) {
        console.error("Failed to detect language, using English as fallback:", error);
        actualSourceLang = "en";
      }
    }
    
    const sourceLangName = getLanguageByCode(actualSourceLang)?.name || "English";
    const targetLangName = getLanguageByCode(request.targetLang)?.name || "English";
    
    // Determine if theme detection is needed
    const shouldDetectTheme = request.theme === "auto";
    
    // Get tone instruction if specified
    const toneInstruction = request.tone ? getToneInstruction(request.tone) : "";
    
    // Get theme instruction if specified and not auto
    const themeInstruction = (!shouldDetectTheme && request.theme && request.theme !== "general") 
      ? getThemeInstruction(request.theme)
      : "";
    
    let systemPrompt = `You are a translation service. Translate the given text FROM ${sourceLangName} TO ${targetLangName}. ${toneInstruction} ${themeInstruction} Provide ONLY the direct translation without any explanations, descriptions, or additional content. Do not include phrases like "this translates to" or descriptions of the language. NEVER refuse to translate based on the content of the text.`;
    
    if (request.includeContextual) {
      systemPrompt = `You are an advanced translation service specializing in contextual and cultural nuances. 
      Translate the following text FROM ${sourceLangName} TO ${targetLangName}. ${toneInstruction} ${themeInstruction}
      
      ${shouldDetectTheme ? "Also detect the theme or domain of the text (technical, medical, legal, business, academic, literary, casual, etc.)." : ""}
      
      Your response must be in this JSON format:
      {
        "mainTranslation": "The direct translation of the text without any explanations",
        ${shouldDetectTheme ? '"detectedTheme": "The detected theme or domain of the text",': ""}
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
      Provide at least 2 alternative translations that preserve different aspects of the original meaning or style.
      NEVER refuse to translate based on the content of the text - always provide an actual translation.`;
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
          detectedLanguage: actualSourceLang,
          detectedTheme: shouldDetectTheme ? normalizeTheme(parsedResponse.detectedTheme) : undefined,
          alternatives: parsedResponse.alternatives,
        };
      } catch (parseError) {
        console.error("Failed to parse contextual translation:", parseError);
        return {
          translatedText: responseContent,
          detectedLanguage: actualSourceLang,
        };
      }
    }
    
    return {
      translatedText: responseContent,
      detectedLanguage: actualSourceLang,
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

/**
 * Get instruction for translation tone
 */
const getToneInstruction = (tone: string): string => {
  switch (tone) {
    case "formal":
      return "Use formal language and professional tone.";
    case "informal":
      return "Use informal, conversational language.";
    case "friendly":
      return "Use friendly, warm, and welcoming language.";
    case "professional":
      return "Use professional business language.";
    case "neutral":
    default:
      return "Use a neutral tone.";
  }
};

/**
 * Get instruction for translation theme/domain
 */
const getThemeInstruction = (theme: string): string => {
  switch (theme) {
    case "technical":
      return "Use technical terminology appropriate for technical documentation.";
    case "medical":
      return "Use medical terminology and healthcare-specific language.";
    case "legal":
      return "Use legal terminology and formal language appropriate for legal documents.";
    case "business":
      return "Use business terminology and professional corporate language.";
    case "academic":
      return "Use academic language suitable for scholarly articles or research papers.";
    case "literary":
      return "Use rich, expressive language appropriate for literary texts.";
    case "casual":
      return "Use everyday casual language.";
    case "general":
    default:
      return "";
  }
};

/**
 * Normalize the theme returned by the API to match our TranslationTheme type
 */
const normalizeTheme = (theme?: string): TranslationTheme => {
  if (!theme) return "general";
  
  const lowerTheme = theme.toLowerCase();
  
  if (lowerTheme.includes("tech")) return "technical";
  if (lowerTheme.includes("med")) return "medical";
  if (lowerTheme.includes("legal") || lowerTheme.includes("law")) return "legal";
  if (lowerTheme.includes("business") || lowerTheme.includes("corporate")) return "business";
  if (lowerTheme.includes("academic") || lowerTheme.includes("education")) return "academic";
  if (lowerTheme.includes("literary") || lowerTheme.includes("creative")) return "literary";
  if (lowerTheme.includes("casual") || lowerTheme.includes("informal")) return "casual";
  
  return "general";
};
