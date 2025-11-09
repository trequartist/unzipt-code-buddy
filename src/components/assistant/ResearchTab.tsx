import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResearchCard } from "./ResearchCard";
import { InsertDialog } from "./InsertDialog";

interface ResearchItem {
  id: string;
  title: string;
  source: string;
  summary: string;
  relevance: number;
  url: string;
}

interface ResearchTabProps {
  onInsertContent?: (content: string, position: "replace" | "append" | "prepend") => void;
}

export function ResearchTab({ onInsertContent }: ResearchTabProps) {
  const [query, setQuery] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [results, setResults] = useState<ResearchItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ResearchItem | null>(null);
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;
    
    setIsResearching(true);
    
    // Simulate research API call
    setTimeout(() => {
      const mockResults: ResearchItem[] = [
        {
          id: "1",
          title: "AI Trends in 2025: What to Expect",
          source: "TechCrunch",
          summary: "Leading AI experts predict significant advances in natural language processing and multimodal AI systems throughout 2025.",
          relevance: 95,
          url: "https://example.com/ai-trends-2025",
        },
        {
          id: "2",
          title: "The Future of Machine Learning",
          source: "MIT Technology Review",
          summary: "New research shows that machine learning models are becoming more efficient and accessible to smaller organizations.",
          relevance: 88,
          url: "https://example.com/ml-future",
        },
        {
          id: "3",
          title: "How AI is Transforming Healthcare",
          source: "Healthcare Weekly",
          summary: "Hospitals are implementing AI-powered diagnostic tools that improve accuracy and reduce patient wait times.",
          relevance: 82,
          url: "https://example.com/ai-healthcare",
        },
      ];
      
      setResults(mockResults);
      setIsResearching(false);
    }, 2000);
  };

  const handleUseInContent = (item: ResearchItem) => {
    setSelectedItem(item);
    setInsertDialogOpen(true);
  };

  const handleInsert = (formattedContent: string) => {
    if (onInsertContent) {
      onInsertContent(formattedContent, "append");
    }
    setInsertDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="p-4 space-y-3 border-b border-border">
        <div className="relative">
          <Input
            placeholder="Search for research on..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleResearch();
              }
            }}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button
          className="w-full"
          onClick={handleResearch}
          disabled={isResearching || !query.trim()}
        >
          {isResearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Researching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Start Research
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1 p-4">
        {results.length === 0 && !isResearching && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No research yet</h3>
            <p className="text-sm text-muted-foreground">
              Enter a search query and click "Start Research" to find relevant information.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {results.map((item) => (
            <ResearchCard
              key={item.id}
              item={item}
              compact={true}
              onUseInContent={() => handleUseInContent(item)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Insert Dialog */}
      {selectedItem && (
        <InsertDialog
          open={insertDialogOpen}
          onOpenChange={setInsertDialogOpen}
          item={selectedItem}
          onInsert={handleInsert}
        />
      )}
    </div>
  );
}
