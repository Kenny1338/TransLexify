
import { ArrowLeftRight, CornerDownLeft, Lightbulb, Sparkles, BookText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import LanguageSelector from "./LanguageSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TranslationTheme, TranslationTone } from "@/types";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  theme?: TranslationTheme;
  onThemeChange?: (theme: TranslationTheme) => void;
  tone?: TranslationTone;
  onToneChange?: (tone: TranslationTone) => void;
  detectedTheme?: TranslationTheme;
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
  theme = "general",
  onThemeChange,
  tone = "neutral",
  onToneChange,
  detectedTheme,
}: TranslationControlsProps) {
  const isMobile = useIsMobile();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  return (
    <div className="relative flex flex-col gap-2 px-1 py-2 touch-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
      
      {/* Advanced options toggle */}
      <div className="flex justify-end mt-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide advanced options" : "Show advanced options"}
        </Button>
      </div>
      
      {/* Advanced options panel */}
      {showAdvanced && (
        <div className="mt-2 p-3 border rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 bg-card/50 backdrop-blur-sm">
          {/* Theme selector */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <BookText className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Text Theme/Domain</Label>
              
              {detectedTheme && theme === "auto" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="ml-1 bg-primary/5 text-primary text-xs font-normal">
                        Detected: {detectedTheme}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Theme detected from your text</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {onThemeChange && (
              <Select value={theme} onValueChange={(value) => onThemeChange(value as TranslationTheme)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="literary">Literary</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          {/* Tone selector */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Translation Tone</Label>
            </div>
            
            {onToneChange && (
              <Select value={tone} onValueChange={(value) => onToneChange(value as TranslationTone)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
