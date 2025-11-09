import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { optimizeImage, formatFileSize, isImageFile } from "@/utils/imageOptimizer";

interface ImageData {
  url: string;
  alt: string;
  caption: string;
}

interface ImageUploadZoneProps {
  onImageInsert: (imageData: ImageData) => void;
}

export function ImageUploadZone({ onImageInsert }: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [showAccessibilityWarning, setShowAccessibilityWarning] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processImage = async (file: File) => {
    if (!isImageFile(file)) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setIsProcessing(true);
    setProgress(20);

    try {
      const originalSize = file.size;
      
      setProgress(40);
      const optimizedUrl = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
      });
      
      setProgress(80);
      const optimizedSize = Math.round((optimizedUrl.length * 3) / 4);
      const saved = ((originalSize - optimizedSize) / originalSize * 100).toFixed(0);
      
      setPreview(optimizedUrl);
      setProgress(100);
      
      toast.success(
        `Image optimized! ${formatFileSize(originalSize)} → ${formatFileSize(optimizedSize)} (${saved}% saved)`
      );
    } catch (error) {
      console.error("Image optimization error:", error);
      toast.error("Failed to optimize image");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await processImage(files[0]);
      }
    },
    []
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processImage(files[0]);
    }
  };

  const handleInsert = () => {
    if (preview) {
      if (!altText.trim()) {
        setShowAccessibilityWarning(true);
        return;
      }
      
      onImageInsert({
        url: preview,
        alt: altText.trim(),
        caption: caption.trim(),
      });
      
      // Reset state
      setPreview(null);
      setAltText("");
      setCaption("");
      setShowAccessibilityWarning(false);
      toast.success("Image inserted with accessibility details");
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setAltText("");
    setCaption("");
    setShowAccessibilityWarning(false);
  };

  if (preview) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Configure Image</span>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={preview}
            alt={altText || "Preview"}
            className="w-full h-auto max-h-64 object-contain bg-muted"
          />
        </div>

        {showAccessibilityWarning && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Alt text is required for accessibility. Please describe what's in the image.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="alt-text" className="flex items-center gap-2">
              Alt Text <span className="text-xs text-destructive">*Required</span>
            </Label>
            <Input
              id="alt-text"
              placeholder="Describe the image for screen readers..."
              value={altText}
              onChange={(e) => {
                setAltText(e.target.value);
                setShowAccessibilityWarning(false);
              }}
              maxLength={150}
              className={showAccessibilityWarning ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              {altText.length}/150 characters - Describe what's in the image
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">
              Caption <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="caption"
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
        </div>

        <div className="flex gap-2">
          <Button onClick={handleInsert} className="flex-1">
            <ImageIcon className="mr-2 h-4 w-4" />
            Insert Image
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative rounded-lg border-2 border-dashed transition-colors
        ${isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/20"}
        ${isProcessing ? "pointer-events-none opacity-60" : "cursor-pointer hover:border-primary/50"}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center gap-3 p-6">
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        
        {isProcessing ? (
          <div className="w-full max-w-xs space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              Optimizing image...
            </p>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop an image here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
