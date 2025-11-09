import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProcessingIndicatorProps {
  stage: string;
  progress?: number;
  message: string;
  className?: string;
}

export function ProcessingIndicator({
  stage,
  progress = 0,
  message,
  className,
}: ProcessingIndicatorProps) {
  return (
    <div className={cn("space-y-8 py-8", className)}>
      {/* Header with Animated Icon */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
          <div className="relative rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-heading">{stage}</h3>
          <p className="text-body text-muted-foreground">{message}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full max-w-md mx-auto space-y-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground">
            {progress}% complete
          </p>
        </div>
      )}

      {/* Skeleton Content Preview */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}
