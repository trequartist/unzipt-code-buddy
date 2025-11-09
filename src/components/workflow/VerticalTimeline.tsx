import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkflowStep } from "@/stores/workflowStore";

interface VerticalTimelineProps {
  steps: WorkflowStep[];
}

export function VerticalTimeline({ steps }: VerticalTimelineProps) {
  return (
    <div className="fixed left-0 top-[60px] h-[calc(100vh-60px)] w-[240px] border-r border-border bg-muted/30 p-6">
      <div className="space-y-8">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "in-progress";
          const isPending = step.status === "pending";

          return (
            <div key={step.id} className="relative">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[15px] top-[32px] h-[32px] w-[2px] transition-colors duration-300",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}

              {/* Step Content */}
              <div className="flex items-start gap-3">
                {/* Step Indicator */}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted && "border-primary bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]",
                    isCurrent && "border-primary bg-background shadow-[0_0_16px_hsl(var(--primary)/0.6)] animate-pulse",
                    isPending && "border-border bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Step Label */}
                <div className="flex-1 pt-1">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isCurrent && "text-foreground",
                      isCompleted && "text-foreground",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
