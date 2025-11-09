import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface ResearchItem {
  id: string;
  title: string;
  source: string;
  summary: string;
  relevance: number;
  url: string;
}

interface InsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ResearchItem;
  onInsert: (formattedContent: string) => void;
}

type InsertFormat = "quote" | "paraphrase" | "bullet" | "summary";

export function InsertDialog({ open, onOpenChange, item, onInsert }: InsertDialogProps) {
  const [format, setFormat] = useState<InsertFormat>("paraphrase");

  const formatContent = (): string => {
    switch (format) {
      case "quote":
        return `"${item.summary}"\n\nSource: ${item.source} - ${item.title}\n${item.url}`;
      
      case "paraphrase":
        return `${item.summary}\n\n[Based on research from ${item.source}]`;
      
      case "bullet":
        return `• ${item.summary}\n  Source: ${item.source}`;
      
      case "summary":
        return `${item.title}\n\n${item.summary}`;
      
      default:
        return item.summary;
    }
  };

  const handleInsert = () => {
    onInsert(formatContent());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Insert Research</DialogTitle>
          <DialogDescription>
            Choose how you'd like to format this content before inserting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-3 block">Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as InsertFormat)}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="quote" id="quote" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="quote" className="font-medium cursor-pointer">
                      Direct quote with citation
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Insert as a quoted block with full source attribution
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="paraphrase" id="paraphrase" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="paraphrase" className="font-medium cursor-pointer">
                      Paraphrased content
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Insert as rephrased text with source note
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="bullet" id="bullet" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="bullet" className="font-medium cursor-pointer">
                      Bullet point
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Insert as a concise bullet point with source
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="summary" id="summary" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="summary" className="font-medium cursor-pointer">
                      Summary only
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Insert just the summary without attribution
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Preview */}
          <div>
            <Label className="mb-2 block">Preview</Label>
            <Card className="p-3 bg-muted">
              <p className="text-sm whitespace-pre-wrap">{formatContent()}</p>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
