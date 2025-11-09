import { ExternalLink, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResearchItem {
  id: string;
  title: string;
  source: string;
  summary: string;
  relevance: number;
  url: string;
}

interface ResearchCardProps {
  item: ResearchItem;
  compact?: boolean;
  onUseInContent?: () => void;
  onSave?: () => void;
}

export function ResearchCard({ item, compact = false, onUseInContent, onSave }: ResearchCardProps) {
  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return "text-green-500";
    if (relevance >= 70) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <Card className="hover:border-border-hover transition-colors">
      <CardHeader className={compact ? "p-4 pb-2" : ""}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className={compact ? "text-sm" : "text-base"}>{item.title}</CardTitle>
            <CardDescription className="mt-1 text-xs">
              {item.source}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            <TrendingUp className={`h-3 w-3 mr-1 ${getRelevanceColor(item.relevance)}`} />
            {item.relevance}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className={compact ? "p-4 pt-2" : ""}>
        <p className={`text-muted-foreground mb-3 ${compact ? "text-xs" : "text-sm"}`}>
          {item.summary}
        </p>
        
        <div className="flex gap-2">
          {onUseInContent && (
            <Button
              size="sm"
              onClick={onUseInContent}
              className="flex-1"
            >
              Use in Content
            </Button>
          )}
          
          {onSave && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSave}
            >
              Save
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(item.url, "_blank")}
            className="px-2"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
