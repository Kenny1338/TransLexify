
import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Language } from "@/types";
import { languages, getPopularLanguages } from "@/utils/languageData";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (langCode: string) => void;
  label?: string;
  placeholder?: string;
  autoDetect?: boolean;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  label = "Select language",
  placeholder = "Search languages...",
  autoDetect = false,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const commandRef = useRef<HTMLDivElement>(null);
  
  const popularLanguages = getPopularLanguages();
  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);
  
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="flex flex-col space-y-1">
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[180px] justify-between bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {selectedLanguage === "auto" ? (
                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : null}
              <span className="truncate">
                {selectedLanguage === "auto"
                  ? "Detect Language"
                  : selectedLang?.name || "Select language"}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command ref={commandRef} className="max-h-[300px]">
            <CommandInput
              placeholder={placeholder}
              value={query}
              onValueChange={setQuery}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              {autoDetect && (
                <CommandGroup heading="Auto">
                  <CommandItem
                    key="auto"
                    value="auto"
                    onSelect={() => {
                      onLanguageChange("auto");
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Detect Language</span>
                    </div>
                    {selectedLanguage === "auto" && (
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </CommandItem>
                </CommandGroup>
              )}
              
              <CommandGroup heading="Popular">
                {popularLanguages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={`${language.name} ${language.nativeName || ""}`}
                    onSelect={() => {
                      onLanguageChange(language.code);
                      setOpen(false);
                    }}
                  >
                    <span>
                      {language.nativeName
                        ? `${language.name} (${language.nativeName})`
                        : language.name}
                    </span>
                    {language.code === selectedLanguage && (
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandGroup heading="All Languages">
                {languages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={`${language.name} ${language.nativeName || ""}`}
                    onSelect={() => {
                      onLanguageChange(language.code);
                      setOpen(false);
                    }}
                  >
                    <span>
                      {language.nativeName
                        ? `${language.name} (${language.nativeName})`
                        : language.name}
                    </span>
                    {language.code === selectedLanguage && (
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
