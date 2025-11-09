import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageElement: HTMLImageElement | null;
  onSave: (alt: string, caption: string) => void;
  onDelete: () => void;
}

export function ImageEditDialog({
  open,
  onOpenChange,
  imageElement,
  onSave,
  onDelete,
}: ImageEditDialogProps) {
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (imageElement) {
      setAltText(imageElement.alt || "");
      
      // Check if image is inside a figure with caption
      const figure = imageElement.closest("figure");
      if (figure) {
        const figcaption = figure.querySelector("figcaption");
        setCaption(figcaption?.textContent || "");
      } else {
        setCaption("");
      }
    }
  }, [imageElement]);

  const handleSave = () => {
    if (!altText.trim()) {
      setShowWarning(true);
      return;
    }
    
    onSave(altText.trim(), caption.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Image Details</DialogTitle>
          <DialogDescription>
            Update accessibility and caption information for this image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {imageElement && (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={imageElement.src}
                alt={altText || "Preview"}
                className="w-full h-auto max-h-48 object-contain bg-muted"
              />
            </div>
          )}

          {showWarning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Alt text is required for accessibility. Please describe what's in the image.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-alt-text" className="flex items-center gap-2">
              Alt Text <span className="text-xs text-destructive">*Required</span>
            </Label>
            <Input
              id="edit-alt-text"
              placeholder="Describe the image for screen readers..."
              value={altText}
              onChange={(e) => {
                setAltText(e.target.value);
                setShowWarning(false);
              }}
              maxLength={150}
              className={showWarning ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              {altText.length}/150 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-caption">
              Caption <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="edit-caption"
              placeholder="Add a caption or additional context..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={300}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              {caption.length}/300 characters
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
