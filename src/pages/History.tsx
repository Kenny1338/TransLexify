
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Languages, Clock, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslationHistory } from "@/hooks/useTranslationHistory";

export default function History() {
  const { history, removeFromHistory, clearHistory } = useTranslationHistory();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const deleteSelected = () => {
    removeFromHistory(selectedItems);
    setSelectedItems([]);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all translation history?")) {
      clearHistory();
      setSelectedItems([]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Translation History</h1>
            <p className="mt-2 text-muted-foreground">
              View and manage your recent translations
            </p>
          </div>
          
          {history.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {history.length} translation{history.length !== 1 ? 's' : ''}
                </p>
                
                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={deleteSelected}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete selected
                    </Button>
                  )}
                  
                  {history.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClearAll}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {history.map(item => (
                  <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Languages className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{item.sourceLang} → {item.targetLang}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              {item.timestamp}
                            </CardDescription>
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div className="rounded-md bg-muted/50 p-3">
                        <p className="font-medium text-muted-foreground mb-1">Original</p>
                        <p>{item.sourceText}</p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-3">
                        <p className="font-medium text-muted-foreground mb-1">Translation</p>
                        <p>{item.translatedText}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No translation history</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Your recent translations will appear here once you start using the translator.
              </p>
              <Button asChild>
                <Link to="/">Start Translating</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
