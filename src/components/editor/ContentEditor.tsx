import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Eye,
  Download,
  Share2,
  Sparkles,
  FileText,
  FileCode,
  Hash,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { ImageUploadZone } from "./ImageUploadZone";
import { ImageEditDialog } from "./ImageEditDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContentEditor() {
  const { editorTitle, editorContent, updateEditorTitle, updateEditorContent } = useWorkflowStore();
  const { toast: showToast } = useToast();
  const [isSaved, setIsSaved] = useState(true);
  const [content, setContent] = useState(editorContent || "");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

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
        showToast({
          title: "Auto-saved",
          description: "Your content has been saved",
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved, content, updateEditorContent, showToast]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsSaved(false);
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const editorDiv = document.getElementById("rich-editor");
    if (editorDiv) {
      handleContentChange(editorDiv.innerHTML);
    }
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

    showToast({
      title: "Exported successfully",
      description: `Content exported as ${format.toUpperCase()}`,
    });
  };

  const handleAICommand = (command: string) => {
    showToast({
      title: "AI Feature",
      description: `${command} - Coming soon with AI integration`,
    });
  };

  const handleImageInsert = (imageData: { url: string; alt: string; caption: string }) => {
    let html: string;
    
    if (imageData.caption) {
      // Use semantic figure element with caption
      html = `
        <figure style="margin: 24px 0; text-align: center;">
          <img 
            src="${imageData.url}" 
            alt="${imageData.alt}" 
            style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" 
          />
          <figcaption style="margin-top: 8px; font-size: 0.875rem; color: hsl(var(--muted-foreground)); font-style: italic;">
            ${imageData.caption}
          </figcaption>
        </figure>
      `;
    } else {
      // Just the image with alt text
      html = `
        <img 
          src="${imageData.url}" 
          alt="${imageData.alt}" 
          style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" 
        />
      `;
    }
    
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = document.createElement('div');
        container.innerHTML = html;
        range.insertNode(container.firstChild!);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current.innerHTML += html;
      }
      
      handleContentChange(editorRef.current.innerHTML);
    }
    
    setShowImageDialog(false);
  };

  const handleEditorDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEditorDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setShowImageDialog(true);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      e.preventDefault();
      setSelectedImage(target as HTMLImageElement);
      setShowEditDialog(true);
    }
  };

  const handleImageEdit = (alt: string, caption: string) => {
    if (!selectedImage || !editorRef.current) return;

    const figure = selectedImage.closest("figure");
    
    if (caption) {
      // Create or update figure with caption
      if (figure) {
        // Update existing figure
        selectedImage.alt = alt;
        const figcaption = figure.querySelector("figcaption");
        if (figcaption) {
          figcaption.textContent = caption;
        } else {
          const newCaption = document.createElement("figcaption");
          newCaption.textContent = caption;
          newCaption.style.cssText = "margin-top: 8px; font-size: 0.875rem; color: hsl(var(--muted-foreground)); font-style: italic;";
          figure.appendChild(newCaption);
        }
      } else {
        // Wrap image in figure
        const newFigure = document.createElement("figure");
        newFigure.style.cssText = "margin: 24px 0; text-align: center;";
        
        const parent = selectedImage.parentNode;
        if (parent) {
          parent.insertBefore(newFigure, selectedImage);
          newFigure.appendChild(selectedImage);
          
          const figcaption = document.createElement("figcaption");
          figcaption.textContent = caption;
          figcaption.style.cssText = "margin-top: 8px; font-size: 0.875rem; color: hsl(var(--muted-foreground)); font-style: italic;";
          newFigure.appendChild(figcaption);
        }
        selectedImage.alt = alt;
      }
    } else {
      // Remove caption if exists
      selectedImage.alt = alt;
      if (figure) {
        const parent = figure.parentNode;
        if (parent) {
          parent.insertBefore(selectedImage, figure);
          parent.removeChild(figure);
        }
      }
    }
    
    handleContentChange(editorRef.current.innerHTML);
    toast.success("Image details updated");
  };

  const handleImageDelete = () => {
    if (!selectedImage || !editorRef.current) return;

    const figure = selectedImage.closest("figure");
    if (figure) {
      figure.remove();
    } else {
      selectedImage.remove();
    }
    
    handleContentChange(editorRef.current.innerHTML);
    setShowEditDialog(false);
    toast.success("Image removed");
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

      {/* Editor Toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-2 rounded-lg border border-border bg-card/95 p-2 backdrop-blur">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("bold")}
          >
            <strong>B</strong>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("italic")}
          >
            <em>I</em>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("underline")}
          >
            <u>U</u>
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("formatBlock", "<h1>")}
          >
            H1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("formatBlock", "<h2>")}
          >
            H2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("formatBlock", "<h3>")}
          >
            H3
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("insertUnorderedList")}
          >
            • List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("insertOrderedList")}
          >
            1. List
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat("formatBlock", "<blockquote>")}
          >
            "
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* Image Upload */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <ImageIcon className="h-4 w-4" />
              Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Drag and drop an image or click to browse. Images will be automatically optimized.
              </DialogDescription>
            </DialogHeader>
            <ImageUploadZone onImageInsert={handleImageInsert} />
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* AI Commands */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleAICommand("Improve Writing")}>
              <Sparkles className="mr-2 h-4 w-4" />
              Improve Writing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAICommand("Make Shorter")}>
              Shorten
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAICommand("Make Longer")}>
              Expand
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAICommand("Fix Grammar")}>
              Fix Grammar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAICommand("Change Tone: Professional")}>
              Tone: Professional
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAICommand("Change Tone: Casual")}>
              Tone: Casual
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAICommand("Change Tone: Friendly")}>
              Tone: Friendly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {wordCount} words • {charCount} characters
          </span>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div
          ref={editorRef}
          id="rich-editor"
          contentEditable
          className="prose prose-sm max-w-none min-h-[500px] focus:outline-none"
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
          onDragOver={handleEditorDragOver}
          onDrop={handleEditorDrop}
          onClick={handleImageClick}
          suppressContentEditableWarning
        />
      </div>

      {/* Image Edit Dialog */}
      <ImageEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        imageElement={selectedImage}
        onSave={handleImageEdit}
        onDelete={handleImageDelete}
      />

      {/* Action Bar */}
      <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-background/95 py-4 backdrop-blur">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSaved(true);
              showToast({ title: "Draft saved" });
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
          <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
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
