
import { useState, useEffect } from 'react';

export interface TranslationHistoryItem {
  id: number;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
}

export function useTranslationHistory() {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  
  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('translationHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load translation history:', error);
    }
  }, []);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('translationHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save translation history:', error);
    }
  }, [history]);
  
  // Add a new translation to history
  const addToHistory = (sourceText: string, translatedText: string, sourceLang: string, targetLang: string) => {
    if (!sourceText.trim() || !translatedText.trim()) return;
    
    const now = new Date();
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);
    
    let timestampStr: string;
    if (now.setHours(0, 0, 0, 0) === today) {
      timestampStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (now.setHours(0, 0, 0, 0) === yesterday) {
      timestampStr = `Yesterday, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      timestampStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                    `, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const newItem: TranslationHistoryItem = {
      id: Date.now(),
      sourceText,
      translatedText,
      sourceLang,
      targetLang,
      timestamp: timestampStr
    };
    
    setHistory(prev => [newItem, ...prev.slice(0, 99)]); // Keep only the last 100 translations
  };
  
  // Remove translations from history
  const removeFromHistory = (ids: number[]) => {
    setHistory(prev => prev.filter(item => !ids.includes(item.id)));
  };
  
  // Clear all history
  const clearHistory = () => {
    setHistory([]);
  };
  
  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
}
