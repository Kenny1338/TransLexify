import { Dispatch, SetStateAction, MouseEvent } from "react";
import { Grip } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import TranslationArea from "@/components/TranslationArea";
import ContextualTranslationPanel from "@/components/ContextualTranslationPanel";
import { TranslationTheme, TranslationTone, ContextualTranslation } from "@/types";

interface DesktopTranslationViewProps {
  sourceText: string;
  translatedText: string;
  setSourceText: Dispatch<SetStateAction<string>>;
  sourceLang: string;
  targetLang: string;
  characterCount: any;
  isTranslating: boolean;
  isSpeaking: boolean;
  sourceDir: "ltr" | "rtl";
  targetDir: "ltr" | "rtl";
  dividerPosition: number;
  isDragging: boolean;
  handleDividerMouseDown: () => void;
  handleSourceTTS: () => void;
  handleTargetTTS: () => void;
  stopSpeaking: () => void;
  contextualMode: boolean;
  isContextualPanelCollapsed: boolean;
  toggleContextualPanel: () => void;
  contextualAlternatives: ContextualTranslation[];
  handleSelectAlternative: (text: string) => void;
  theme: TranslationTheme;
  tone: TranslationTone;
  detectedTheme?: TranslationTheme;
}

export default function DesktopTranslationView({
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
  dividerPosition,
  isDragging,
  handleDividerMouseDown,
  handleSourceTTS,
  handleTargetTTS,
  stopSpeaking,
  contextualMode,
  isContextualPanelCollapsed,
  toggleContextualPanel,
  contextualAlternatives,
  handleSelectAlternative,
  theme,
  tone,
  detectedTheme,
}: DesktopTranslationViewProps) {
  return (
    <>
      <div 
        id="translation-container"
        className="relative mt-4 flex h-[calc(100vh-350px)] min-h-[280px] overflow-hidden rounded-lg border bg-card/50 backdrop-blur-sm transition-all glass-panel"
      >
        <div
          className="translate-container"
          style={{ width: `${dividerPosition}%` }}
        >
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
          />
        </div>
        
        <div
          className="absolute top-0 bottom-0 z-10 flex cursor-col-resize items-center justify-center"
          style={{ left: `calc(${dividerPosition}% - 8px)` }}
          onMouseDown={handleDividerMouseDown}
        >
          <div className="flex h-12 w-4 flex-col items-center justify-center rounded-full">
            <Grip className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <Separator
          orientation="vertical"
          className="absolute top-0 bottom-0 z-0"
          style={{ left: `${dividerPosition}%` }}
        />
        
        <div
          className="translate-container"
          style={{ width: `${100 - dividerPosition}%` }}
        >
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
          />
        </div>
      </div>
      
      {/* Contextual translations panel for desktop */}
      {contextualMode && translatedText && !isTranslating && (
        <div className="container mt-6">
          <ContextualTranslationPanel
            alternatives={contextualAlternatives}
            onSelectAlternative={handleSelectAlternative}
            targetLang={targetLang}
            isCollapsed={isContextualPanelCollapsed}
            onToggleCollapse={toggleContextualPanel}
            theme={theme}
            detectedTheme={detectedTheme}
            tone={tone}
          />
        </div>
      )}
    </>
  );
}
