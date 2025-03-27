
import { Dispatch, SetStateAction } from "react";
import { CharacterCount } from "@/types";
import TranslationArea from "@/components/TranslationArea";
import ContextualTranslationPanel from "@/components/ContextualTranslationPanel";

interface MobileTranslationViewProps {
  sourceText: string;
  translatedText: string;
  setSourceText: Dispatch<SetStateAction<string>>;
  sourceLang: string;
  targetLang: string;
  characterCount: CharacterCount;
  isTranslating: boolean;
  isSpeaking: boolean;
  sourceDir: "ltr" | "rtl";
  targetDir: "ltr" | "rtl";
  handleSourceTTS: () => void;
  handleTargetTTS: () => void;
  stopSpeaking: () => void;
  contextualMode: boolean;
  isContextualPanelCollapsed: boolean;
  toggleContextualPanel: () => void;
  contextualAlternatives: any[];
  handleSelectAlternative: (text: string) => void;
}

export default function MobileTranslationView({
  sourceText,
  translatedText,
  setSourceText,
  sourceLang,
  targetLang,
  characterCount,
  isTranslating,
  isSpeaking,
  sourceDir,
  targetDir,
  handleSourceTTS,
  handleTargetTTS,
  stopSpeaking,
  contextualMode,
  isContextualPanelCollapsed,
  toggleContextualPanel,
  contextualAlternatives,
  handleSelectAlternative,
}: MobileTranslationViewProps) {
  return (
    <div className="mt-4 flex flex-col space-y-4">
      {/* Source text area */}
      <div className="rounded-lg border bg-card/50 backdrop-blur-sm glass-panel">
        <TranslationArea
          text={sourceText}
          onChange={setSourceText}
          language={sourceLang}
          placeholder="Enter text to translate"
          characterCount={characterCount}
          onTextToSpeech={handleSourceTTS}
          isSpeaking={isSpeaking}
          onStopSpeaking={stopSpeaking}
          dir={sourceDir}
          className="py-2 px-2"
        />
      </div>
      
      {/* Target text area (only show if there's translated text) */}
      {translatedText && (
        <div className="rounded-lg border bg-card/50 backdrop-blur-sm glass-panel">
          <TranslationArea
            text={translatedText}
            language={targetLang}
            placeholder="Translation"
            isLoading={isTranslating}
            readOnly
            onTextToSpeech={handleTargetTTS}
            isSpeaking={isSpeaking}
            onStopSpeaking={stopSpeaking}
            dir={targetDir}
            className="py-2 px-2"
          />
        </div>
      )}
      
      {/* Contextual translations panel for mobile */}
      {contextualMode && translatedText && !isTranslating && (
        <ContextualTranslationPanel
          alternatives={contextualAlternatives}
          onSelectAlternative={handleSelectAlternative}
          targetLang={targetLang}
          isCollapsed={isContextualPanelCollapsed}
          onToggleCollapse={toggleContextualPanel}
        />
      )}
    </div>
  );
}
