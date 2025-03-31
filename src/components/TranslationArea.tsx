import { useState, useEffect, useRef } from "react";
import { ClipboardCopy, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyStatus, CharacterCount } from "@/types";

interface TranslationAreaProps {
  text: string;
  onChange?: (text: string) => void;
  language: string;
  placeholder?: string;
  isLoading?: boolean;
  readOnly?: boolean;
  characterCount?: CharacterCount;
  onTextToSpeech?: () => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
  dir?: "ltr" | "rtl";
  className?: string;
}

export default function TranslationArea({
  text,
  onChange,
  language,
  placeholder = "Enter text",
  isLoading = false,
  readOnly = false,
  characterCount,
  onTextToSpeech,
  isSpeaking = false,
  onStopSpeaking,
  dir = "ltr",
  className = "",
}: TranslationAreaProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const isExceedingLimit = characterCount && characterCount.current > characterCount.max;
  
  // Reset copy status after 2 seconds
  useEffect(() => {
    if (copyStatus === "copied") {
      const timer = setTimeout(() => setCopyStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);
  
  // Copy text to clipboard
  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyStatus("error");
      toast.error("Failed to copy text");
    }
  };
  
  // Clear text
  const handleClear = () => {
    if (onChange) {
      onChange("");
    }
  };
  
  return (
    <div className={`text-area-container ${className} flex flex-col`}>
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          readOnly={readOnly || isLoading}
          className={`min-h-[200px] h-full w-full resize-none rounded-md border-0 bg-transparent p-4 focus-visible:ring-0 focus-visible:ring-offset-0 ${
            isLoading ? "opacity-50" : ""
          } ${isExceedingLimit ? "text-destructive" : ""}`}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        )}
        
        <div className="floating-controls">
          {!readOnly && characterCount && (
            <div
              className={`text-xs ${
                isExceedingLimit
                  ? "text-destructive"
                  : characterCount.current > characterCount.max * 0.8
                  ? "text-amber-500"
                  : "text-muted-foreground"
              }`}
            >
              {characterCount.current}/{characterCount.max}
            </div>
          )}
          
          {onTextToSpeech && text && (
            <Button
              variant="ghost"
              size="icon"
              onClick={isSpeaking ? onStopSpeaking : onTextToSpeech}
              className="action-button"
              aria-label={isSpeaking ? "Stop speaking" : "Text to speech"}
            >
              {isSpeaking ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {text && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="action-button"
              aria-label="Copy to clipboard"
            >
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          )}
          
          {!readOnly && text && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="action-button"
              aria-label="Clear text"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
