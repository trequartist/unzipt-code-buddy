import { ChevronRight, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowType } from "@/stores/workflowStore";

interface WorkflowHeaderProps {
  workflowType: WorkflowType;
  onPause: () => void;
}

const workflowNames = {
  blog: "Blog Post",
  linkedin: "LinkedIn Post",
  calendar: "From Calendar",
};

export function WorkflowHeader({ workflowType, onPause }: WorkflowHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Create</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {workflowNames[workflowType]}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Est. 3-5 min</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onPause}>
          <X className="mr-2 h-4 w-4" />
          Pause
        </Button>
      </div>
    </div>
  );
}
