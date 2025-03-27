
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useTranslationHistory } from "@/hooks/useTranslationHistory";
import { useIsMobile } from "@/hooks/use-mobile";
import TranslationControls from "@/components/TranslationControls";
import MobileTranslationView from "@/components/MobileTranslationView";
import DesktopTranslationView from "@/components/DesktopTranslationView";
import TranslationHeader from "@/components/TranslationHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLanguageByCode } from "@/utils/languageData";

const Index = () => {
  const {
    sourceText,
    setSourceText,
    translatedText,
    setTranslatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    isTranslating,
    isSpeaking,
    swapLanguages,
    translateText,
    speak,
    stopSpeaking,
    characterCount,
    contextualAlternatives,
    contextualMode,
    toggleContextualMode,
  } = useTranslation();
  
  const { addToHistory } = useTranslationHistory();
  const isMobile = useIsMobile();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(isMobile ? 100 : 50);
  const [prevTranslatedText, setPrevTranslatedText] = useState("");
  const [isContextualPanelCollapsed, setIsContextualPanelCollapsed] = useState(false);
  
  // Get text direction based on selected language
  const sourceDir = getLanguageByCode(sourceLang)?.direction || "ltr";
  const targetDir = getLanguageByCode(targetLang)?.direction || "ltr";
  
  // Handle window resize for mobile view
  useEffect(() => {
    if (isMobile) {
      setDividerPosition(100);
    } else {
      setDividerPosition(50);
    }
  }, [isMobile]);
  
  // Handle divider drag on desktop
  const handleDividerMouseDown = () => {
    if (isMobile) return;
    setIsDragging(true);
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const container = document.getElementById("translation-container");
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constrain to reasonable limits
      if (newPosition > 20 && newPosition < 80) {
        setDividerPosition(newPosition);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  
  // Handle text-to-speech for source/target text
  const handleSourceTTS = () => {
    speak({ text: sourceText, lang: sourceLang });
  };
  
  const handleTargetTTS = () => {
    speak({ text: translatedText, lang: targetLang });
  };
  
  // Force translation
  const handleTranslateNow = () => {
    translateText(true);
  };
  
  // Handle selecting alternative translation
  const handleSelectAlternative = (text: string) => {
    setTranslatedText(text);
  };
  
  // Toggle contextual panel
  const toggleContextualPanel = () => {
    setIsContextualPanelCollapsed(!isContextualPanelCollapsed);
  };
  
  // Save to history when translation changes
  useEffect(() => {
    if (
      translatedText &&
      translatedText !== prevTranslatedText &&
      sourceText.trim() &&
      !isTranslating
    ) {
      addToHistory(sourceText, translatedText, sourceLang, targetLang);
      setPrevTranslatedText(translatedText);
    }
  }, [translatedText, sourceText, sourceLang, targetLang, isTranslating, addToHistory, prevTranslatedText]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-4 sm:py-6">
        <div className="container px-2 sm:px-4">
          <TranslationHeader />
          
          <TranslationControls
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceLangChange={setSourceLang}
            onTargetLangChange={setTargetLang}
            onSwapLanguages={swapLanguages}
            onTranslate={handleTranslateNow}
            isTranslating={isTranslating}
            contextualMode={contextualMode}
            onToggleContextualMode={toggleContextualMode}
          />
          
          {/* Mobile view */}
          {isMobile && (
            <MobileTranslationView 
              sourceText={sourceText}
              translatedText={translatedText}
              setSourceText={setSourceText}
              sourceLang={sourceLang}
              targetLang={targetLang}
              characterCount={characterCount}
              isTranslating={isTranslating}
              isSpeaking={isSpeaking}
              sourceDir={sourceDir}
              targetDir={targetDir}
              handleSourceTTS={handleSourceTTS}
              handleTargetTTS={handleTargetTTS}
              stopSpeaking={stopSpeaking}
              contextualMode={contextualMode}
              isContextualPanelCollapsed={isContextualPanelCollapsed}
              toggleContextualPanel={toggleContextualPanel}
              contextualAlternatives={contextualAlternatives}
              handleSelectAlternative={handleSelectAlternative}
            />
          )}
          
          {/* Desktop view */}
          {!isMobile && (
            <DesktopTranslationView
              sourceText={sourceText}
              translatedText={translatedText}
              setSourceText={setSourceText}
              sourceLang={sourceLang}
              targetLang={targetLang}
              characterCount={characterCount}
              isTranslating={isTranslating}
              isSpeaking={isSpeaking}
              sourceDir={sourceDir}
              targetDir={targetDir}
              dividerPosition={dividerPosition}
              isDragging={isDragging}
              handleDividerMouseDown={handleDividerMouseDown}
              handleSourceTTS={handleSourceTTS}
              handleTargetTTS={handleTargetTTS}
              stopSpeaking={stopSpeaking}
              contextualMode={contextualMode}
              isContextualPanelCollapsed={isContextualPanelCollapsed}
              toggleContextualPanel={toggleContextualPanel}
              contextualAlternatives={contextualAlternatives}
              handleSelectAlternative={handleSelectAlternative}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
