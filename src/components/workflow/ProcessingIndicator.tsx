import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className={cn("flex flex-col items-center justify-center space-y-6 py-12", className)}>
      {/* Animated Spinner */}
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>

      {/* Status Text */}
      <div className="space-y-2 text-center">
        <h3 className="text-heading">{stage}</h3>
        <p className="text-body text-muted-foreground">{message}</p>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full max-w-md space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-small text-muted-foreground">
            {progress}% complete
          </p>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 animate-pulse rounded-full bg-primary"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
