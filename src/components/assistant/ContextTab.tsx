import { useState, useEffect } from "react";
import { Sparkles, Trash2, FileText, FileImage, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DocumentUpload } from "./DocumentUpload";

interface ContextDocument {
  id: string;
  name: string;
  type: "pdf" | "docx" | "txt" | "md" | "image";
  size: string;
  uploadDate: string;
  preview: string;
  active: boolean;
  tags?: string[];
}

interface ContextTabProps {
  onContextCountChange?: (count: number) => void;
}

export function ContextTab({ onContextCountChange }: ContextTabProps) {
  const [documents, setDocuments] = useState<ContextDocument[]>([]);

  const activeCount = documents.filter((d) => d.active).length;

  useEffect(() => {
    if (onContextCountChange) {
      onContextCountChange(activeCount);
    }
  }, [activeCount, onContextCountChange]);

  const handleFileUpload = (files: File[]) => {
    const newDocs: ContextDocument[] = files.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      type: getFileType(file.name),
      size: formatFileSize(file.size),
      uploadDate: new Date().toLocaleDateString(),
      preview: "Document content preview will appear here...",
      active: true,
      tags: ["recent"],
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const toggleContext = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, active: !doc.active } : doc
      )
    );
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const clearAll = () => {
    setDocuments([]);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Upload Zone */}
      <div className="p-4 border-b border-border">
        <DocumentUpload onUpload={handleFileUpload} />
      </div>

      {/* Active Context Indicator */}
      {activeCount > 0 && (
        <div className="p-4 pb-2">
          <Card className="p-3 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {activeCount} document{activeCount !== 1 ? "s" : ""} in AI context
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Document List */}
      <ScrollArea className="flex-1 p-4 pt-2">
        {documents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No documents yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload documents to include them in your AI context.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1 min-w-0">
                  <FileIcon type={doc.type} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{doc.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {doc.size} • {doc.uploadDate}
                    </p>
                    {doc.tags && (
                      <div className="flex gap-1 mt-2">
                        {doc.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs h-5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={doc.active}
                    onCheckedChange={() => toggleContext(doc.id)}
                    aria-label="Include in AI context"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeDocument(doc.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {documents.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearAll}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => console.log("Export list")}
              className="flex-1"
            >
              Export List
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  const iconClass = "h-10 w-10 text-muted-foreground";
  
  if (type === "image") {
    return <FileImage className={iconClass} />;
  }
  
  if (type === "pdf" || type === "docx") {
    return <FileText className={iconClass} />;
  }
  
  return <File className={iconClass} />;
}

function getFileType(filename: string): "pdf" | "docx" | "txt" | "md" | "image" {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
    return "image";
  }
  
  if (ext === "pdf") return "pdf";
  if (ext === "docx" || ext === "doc") return "docx";
  if (ext === "txt") return "txt";
  if (ext === "md") return "md";
  
  return "txt";
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}
