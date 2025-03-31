import { useState } from 'react';
import { ContextualTranslation, TranslationTheme, TranslationTone } from '@/types';
import { 
  Card,
  Card as CardPrimitive,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardCopy, 
  Lightbulb, 
  MinusCircle, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ContextualTranslationPanelProps {
  alternatives: ContextualTranslation[];
  onSelectAlternative: (text: string) => void;
  targetLang: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  theme?: TranslationTheme;
  tone?: TranslationTone;
  detectedTheme?: TranslationTheme;
}

export default function ContextualTranslationPanel({
  alternatives,
  onSelectAlternative,
  targetLang,
  isCollapsed = false,
  onToggleCollapse,
  theme,
  tone,
  detectedTheme
}: ContextualTranslationPanelProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const copyAlternative = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Error copying text");
    }
  };

  const handleUseAlternative = (text: string, index: number) => {
    setActiveIndex(index);
    onSelectAlternative(text);
  };

  if (alternatives.length === 0) return null;

  return (
    <Card className="contextual-panel relative bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-base">Alternative Translations</CardTitle>
            
            {detectedTheme && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2 gap-1 text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                    Detected Theme: {detectedTheme}
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 text-sm">
                  <p>TransLexify has detected the theme of your text as <strong>{detectedTheme}</strong>.</p>
                  <p className="mt-2">This helps provide more accurate and contextually relevant translations.</p>
                </PopoverContent>
              </Popover>
            )}
            
            {theme && theme !== "general" && (
              <Badge variant="outline" className="gap-1 text-xs">
                <MessageCircle className="h-3 w-3" />
                {theme}
              </Badge>
            )}
            
            {tone && tone !== "neutral" && (
              <Badge variant="outline" className="gap-1 text-xs">
                <MessageCircle className="h-3 w-3" />
                {tone}
              </Badge>
            )}
          </div>
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expand alternatives" : "Collapse alternatives"}
            >
              {isCollapsed ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <MinusCircle className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <CardDescription>
          Choose an alternative translation or stick with the main one
        </CardDescription>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alternatives.map((alt, index) => (
              <div
                key={index}
                className={`relative rounded-lg border bg-background/80 p-3 transition-all hover:bg-accent/50 ${
                  activeIndex === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-1 text-xs">
                      {alt.context || "Alternative"}
                    </Badge>
                    {alt.style && (
                      <Badge variant="secondary" className="ml-1 mb-1 text-xs">
                        {alt.style}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyAlternative(alt.text)}
                    >
                      <ClipboardCopy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-green-500"
                      onClick={() => handleUseAlternative(alt.text, index)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm" dir={targetLang === 'ar' || targetLang === 'he' ? 'rtl' : 'ltr'}>
                  {alt.text}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
