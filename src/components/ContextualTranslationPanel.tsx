
import { useState } from 'react';
import { ContextualTranslation } from '@/types';
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
}

export default function ContextualTranslationPanel({
  alternatives,
  onSelectAlternative,
  targetLang,
  isCollapsed = false,
  onToggleCollapse
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

  if (isCollapsed) {
    return (
      <div className="mt-4 animate-pulse-light">
        <Button 
          variant="outline" 
          onClick={onToggleCollapse}
          className="flex gap-2 items-center border-primary/40 text-primary border-dashed hover:border-primary"
        >
          <Lightbulb className="h-4 w-4 text-primary" />
          <span>Show contextual suggestions</span>
        </Button>
      </div>
    );
  }

  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/15">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-lg">Contextual Translation Suggestions</h3>
            <p className="text-sm text-muted-foreground">Different translation options based on context and nuances</p>
          </div>
        </div>
        
        {onToggleCollapse && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="text-muted-foreground hover:text-foreground">
            <MinusCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {alternatives.map((alt, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-200 overflow-hidden ${
              activeIndex === index 
                ? 'ring-2 ring-primary/70 shadow-md shadow-primary/10' 
                : 'hover:border-primary/30 hover:shadow-sm'
            }`}
          >
            <CardHeader className="pb-2 relative pt-8">
              <Badge variant="outline" className="absolute top-3 left-3 bg-primary/5 hover:bg-primary/10 text-primary font-medium">
                Alternative {index + 1}
              </Badge>
              
              <div className="absolute top-3 right-3 flex">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyAlternative(alt.text)}
                  className="h-8 w-8 rounded-full"
                  aria-label="Copy to clipboard"
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      aria-label="More information"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        Context Explanation
                      </h4>
                      <p className="text-sm text-muted-foreground">{alt.explanation}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <CardTitle className="text-xl mt-2 mb-1">
                {alt.text}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="text-sm mb-4 p-3 bg-muted/30 rounded-md border border-muted/50">
                <p className="text-muted-foreground">{alt.explanation}</p>
              </div>
              
              <Button 
                variant={activeIndex === index ? "default" : "outline"} 
                className={`w-full ${activeIndex === index ? 'bg-primary' : 'hover:bg-primary/10 hover:text-primary border-primary/20'}`}
                onClick={() => {
                  onSelectAlternative(alt.text);
                  setActiveIndex(index);
                }}
              >
                {activeIndex === index ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  "Use this translation"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
