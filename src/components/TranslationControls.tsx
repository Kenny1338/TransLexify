
import { ArrowLeftRight, CornerDownLeft, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import LanguageSelector from "./LanguageSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TranslationControlsProps {
  sourceLang: string;
  targetLang: string;
  onSourceLangChange: (lang: string) => void;
  onTargetLangChange: (lang: string) => void;
  onSwapLanguages: () => void;
  onTranslate: () => void;
  isTranslating?: boolean;
  contextualMode?: boolean;
  onToggleContextualMode?: () => void;
}

export default function TranslationControls({
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  onSwapLanguages,
  onTranslate,
  isTranslating = false,
  contextualMode = false,
  onToggleContextualMode,
}: TranslationControlsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 py-2 touch-none">
      <div className="flex flex-wrap items-center gap-2">
        <LanguageSelector
          selectedLanguage={sourceLang}
          onLanguageChange={onSourceLangChange}
          label={isMobile ? undefined : "From"}
          autoDetect
        />
        
        <div className="mx-1 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSwapLanguages}
            className="rounded-full h-8 w-8 p-0 hover:bg-accent"
            aria-label="Swap languages"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>
        
        <LanguageSelector
          selectedLanguage={targetLang}
          onLanguageChange={onTargetLangChange}
          label={isMobile ? undefined : "To"}
        />
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {onToggleContextualMode && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all duration-200
            ${contextualMode 
              ? "border-primary/70 bg-primary/10" 
              : "border-input bg-background hover:bg-accent/50"}`}>
            <Switch 
              id="contextual-mode" 
              checked={contextualMode}
              onCheckedChange={onToggleContextualMode}
              className={contextualMode ? "bg-primary" : ""}
            />
            <Label htmlFor="contextual-mode" className="flex items-center gap-1.5 cursor-pointer">
              {contextualMode ? (
                <Sparkles className="h-4 w-4 text-primary" />
              ) : (
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`text-sm font-medium ${contextualMode ? "text-primary" : "text-muted-foreground"}`}>
                Contextual Translation
              </span>
              
              {contextualMode && (
                <Badge variant="outline" className="ml-1 bg-primary/5 text-primary text-xs font-normal">
                  Active
                </Badge>
              )}
            </Label>
          </div>
        )}
        
        <Button
          onClick={onTranslate}
          className={`${isMobile ? 'mt-2 w-full sm:w-auto sm:mt-0 bg-primary/90 backdrop-blur-sm' : ''}`}
          disabled={isTranslating}
        >
          {!isMobile && <CornerDownLeft className="mr-2 h-4 w-4" />}
          Translate
        </Button>
      </div>
    </div>
  );
}
