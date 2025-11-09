import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Eye,
  Search,
  Share2,
  MoreHorizontal,
  FileText,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  List,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function ContentEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (value: string) => {
    setContent(value);
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Brief Header */}
      <div className="flex items-center gap-3 rounded-lg border border-border-light bg-card p-4">
        <Badge variant="info">Brief</Badge>
        <span className="text-small text-muted-foreground">
          AI in Healthcare • 1,500-2,000 words • 8 min read
        </span>
        <Button variant="ghost" size="sm" className="ml-auto">
          View Full Brief
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 rounded-lg border border-border-light bg-card p-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-small text-muted-foreground">
            {wordCount} words
          </span>
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-4">
        <Input
          placeholder="Enter your title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-semibold"
        />

        <Textarea
          placeholder="Start writing your content..."
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="min-h-[500px] resize-none font-sans text-base leading-relaxed"
        />
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            SEO Check
          </Button>
          <Button variant="default" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
