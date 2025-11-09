import { useState } from "react";
import { Search, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Source {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

interface ResearchResult {
  id: string;
  answer: string;
  sources: Source[];
  timestamp: Date;
}

interface ResearchTabProps {
  onInsertContent?: (content: string, position: "replace" | "append" | "prepend") => void;
}

export function ResearchTab({ onInsertContent }: ResearchTabProps) {
  const [query, setQuery] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [threads, setThreads] = useState<ResearchResult[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const { toast } = useToast();

  const handleResearch = async () => {
    if (!query.trim()) return;
    
    setIsResearching(true);
    
    // Simulate Perplexity-style research API call
    setTimeout(() => {
      const newThread: ResearchResult = {
        id: Date.now().toString(),
        answer: `Based on current research, ${query} involves several key factors:\n\nFirst, there's significant momentum in this area with multiple organizations investing heavily. The technology is advancing rapidly, with new developments emerging regularly.\n\nSecond, practical applications are already being deployed across various industries, showing promising results in efficiency and outcomes.\n\nThird, while challenges remain, the trajectory suggests continued growth and innovation in the coming years.`,
        sources: [
          {
            id: "1",
            title: "TechCrunch - Latest Trends Report",
            url: "https://techcrunch.com",
          },
          {
            id: "2",
            title: "MIT Technology Review",
            url: "https://technologyreview.com",
          },
          {
            id: "3",
            title: "Forbes Analysis",
            url: "https://forbes.com",
          },
        ],
        timestamp: new Date(),
      };
      
      setThreads(prev => [newThread, ...prev]);
      setSelectedThread(newThread.id);
      setIsResearching(false);
      setQuery("");
    }, 2000);
  };

  const currentThread = threads.find(t => t.id === selectedThread);

  const handleInsert = (content: string) => {
    if (onInsertContent) {
      onInsertContent(content, "append");
      toast({
        title: "Content inserted",
        description: "Research has been added to your input.",
      });
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Search Header */}
      <div className="p-4 space-y-3 border-b border-border">
        <div className="relative">
          <Input
            placeholder="Ask anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isResearching) {
                handleResearch();
              }
            }}
            className="pr-10 h-11 text-base"
            disabled={isResearching}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleResearch}
            disabled={isResearching || !query.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
          >
            {isResearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1">
        {threads.length === 0 && !isResearching && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="mb-6 p-4 rounded-full bg-primary/10">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Research anything</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Get AI-powered answers with sources and citations to enhance your content.
            </p>
          </div>
        )}

        {isResearching && threads.length === 0 && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              </div>
              <span className="text-sm font-medium">Researching...</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
            </div>
          </div>
        )}

        {currentThread && (
          <div className="p-6 space-y-6">
            {/* Answer */}
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {currentThread.answer}
                </p>
              </div>

              {/* Insert Button */}
              {onInsertContent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsert(currentThread.answer)}
                  className="gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Insert into content
                </Button>
              )}
            </div>

            {/* Sources */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">SOURCES</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              
              <div className="grid gap-2">
                {currentThread.sources.map((source, index) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center shrink-0">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {source.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {new URL(source.url).hostname}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Thread History */}
        {threads.length > 1 && (
          <div className="border-t border-border p-4 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground mb-3">PREVIOUS SEARCHES</h4>
            {threads.slice(1).map((thread) => (
              <Button
                key={thread.id}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedThread(thread.id)}
                className="w-full justify-start text-left h-auto py-2 px-3"
              >
                <div className="truncate text-sm">{thread.answer.split('\n')[0].substring(0, 60)}...</div>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
