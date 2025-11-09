import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Eye,
  Download,
  Share2,
  FileText,
  FileCode,
  Hash,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useToast } from "@/hooks/use-toast";
import novel from "novel";

export function ContentEditor() {
  const { editorTitle, editorContent, updateEditorTitle, updateEditorContent } = useWorkflowStore();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(true);
  const [content, setContent] = useState(editorContent || "");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Update word and character counts
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setCharCount(text.length);
  }, [content]);

  // Auto-save functionality
  useEffect(() => {
    if (!isSaved) {
      const timer = setTimeout(() => {
        updateEditorContent(content);
        setIsSaved(true);
        toast({
          title: "Auto-saved",
          description: "Your content has been saved",
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved, content, updateEditorContent, toast]);

  const handleEditorUpdate = (editor?: { getHTML: () => string; getText: () => string }) => {
    if (!editor) return;
    const html = editor.getHTML();
    setContent(html);
    updateEditorContent(html);
    setIsSaved(false);
    
    // Update counts
    const text = editor.getText();
    setCharCount(text.length);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  };

  const handleExport = (format: "markdown" | "html" | "text") => {
    let exportContent = "";
    let filename = `${editorTitle || "untitled"}`;
    let mimeType = "text/plain";

    switch (format) {
      case "markdown":
        exportContent = content.replace(/<[^>]*>/g, "");
        filename += ".md";
        mimeType = "text/markdown";
        break;
      case "html":
        exportContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${editorTitle || "Untitled"}</title>
</head>
<body>
  <h1>${editorTitle || "Untitled"}</h1>
  ${content}
</body>
</html>`;
        filename += ".html";
        mimeType = "text/html";
        break;
      case "text":
        exportContent = content.replace(/<[^>]*>/g, "");
        filename += ".txt";
        break;
    }

    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported successfully",
      description: `Content exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Brief Header */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
        <Badge variant="outline" className="gap-1">
          <FileText className="h-3 w-3" />
          Brief
        </Badge>
        <span className="text-small text-muted-foreground">
          AI in Healthcare • 1,500-2,000 words • Target: 8 min read
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={isSaved ? "success" : "secondary"} className="gap-1">
            {isSaved ? (
              <>
                <Check className="h-3 w-3" />
                Saved
              </>
            ) : (
              "Saving..."
            )}
          </Badge>
        </div>
      </div>

      {/* Title Input */}
      <div>
        <Input
          placeholder="Untitled Document"
          value={editorTitle}
          onChange={(e) => {
            updateEditorTitle(e.target.value);
            setIsSaved(false);
          }}
          className="border-0 text-3xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Editor Toolbar & Stats */}
      <div className="sticky top-0 z-10 flex items-center justify-end gap-2 rounded-lg border border-border bg-card/95 p-2 backdrop-blur">
        <span className="text-xs text-muted-foreground">
          {wordCount} words • {charCount} characters
        </span>
      </div>

      {/* Novel Editor with slash commands */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <novel.Editor
          defaultValue={content}
          onUpdate={handleEditorUpdate}
          className="min-h-[500px]"
          disableLocalStorage
        />
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-background/95 py-4 backdrop-blur">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSaved(true);
              toast({ title: "Draft saved" });
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("markdown")}>
                <Hash className="mr-2 h-4 w-4" />
                Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("html")}>
                <FileCode className="mr-2 h-4 w-4" />
                HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("text")}>
                <FileText className="mr-2 h-4 w-4" />
                Plain Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Button variant="default" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
