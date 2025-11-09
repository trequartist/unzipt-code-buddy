import { ReactNode } from "react";
import { ChevronRight, X, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useWorkflowStore } from "@/stores/workflowStore";
import { SelectionGrid } from "./SelectionGrid";
import { ProcessingIndicator } from "./ProcessingIndicator";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface WorkflowContainerProps {
  children?: ReactNode;
}

export function WorkflowContainer({ children }: WorkflowContainerProps) {
  const {
    workflowType,
    currentStageIndex,
    steps,
    stages,
    pauseWorkflow,
    previousStage,
    completeStage,
    updateStageData,
  } = useWorkflowStore();

  const currentStage = stages[currentStageIndex];

  if (!currentStage) return null;

  const canProceed = () => {
    if (currentStage.type === "input") {
      return currentStage.inputValue && currentStage.inputValue.trim().length > 0;
    }
    if (currentStage.type === "selection") {
      return currentStage.selectedOptions && currentStage.selectedOptions.length > 0;
    }
    return true;
  };

  const handleProceed = () => {
    completeStage();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-small text-muted-foreground">
          <span>Create</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">
            {workflowType === "blog" && "Blog Post"}
            {workflowType === "linkedin" && "LinkedIn Post"}
            {workflowType === "calendar" && "From Calendar"}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={pauseWorkflow}>
          <X className="mr-2 h-4 w-4" />
          Pause Workflow
        </Button>
      </div>

      {/* Progress Bar */}
      <ProgressBar steps={steps} showLabels animated />

      {/* Stage Content */}
      <div className="min-h-[400px] space-y-6">
        <div className="space-y-2">
          <h2 className="text-heading">{currentStage.title}</h2>
          <p className="text-body text-muted-foreground">
            {currentStage.description}
          </p>
        </div>

        {/* Input Stage */}
        {currentStage.type === "input" && (
          <div className="space-y-4">
            <Textarea
              placeholder={currentStage.placeholder}
              value={currentStage.inputValue || ""}
              onChange={(e) =>
                updateStageData({ inputValue: e.target.value })
              }
              rows={8}
              maxLength={2000}
              className="resize-none"
            />
            {currentStage.allowFileUpload && (
              <Card className="flex items-center justify-center border-2 border-dashed p-8 transition-colors hover:border-primary">
                <div className="text-center">
                  <p className="text-small text-muted-foreground">
                    Drop files here or click to upload
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Supports: {currentStage.acceptedFiles}
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Selection Stage */}
        {currentStage.type === "selection" && currentStage.options && (
          <SelectionGrid
            options={currentStage.options}
            selected={currentStage.selectedOptions || []}
            onChange={(selected) =>
              updateStageData({ selectedOptions: selected })
            }
            multiSelect={currentStage.multiSelect}
          />
        )}

        {/* Processing Stage */}
        {currentStage.type === "processing" && (
          <ProcessingIndicator
            stage={currentStage.processingStage || "Processing"}
            progress={currentStage.progress}
            message={currentStage.message || "Please wait..."}
          />
        )}

        {/* Approval Stage */}
        {currentStage.type === "approval" && (
          <Card className="p-8">
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-6">
                <h3 className="mb-4 text-subheading">Content Brief</h3>
                <div className="space-y-3 text-small">
                  <div>
                    <strong>Title:</strong> AI in Healthcare: The Transformation Story
                  </div>
                  <div>
                    <strong>Word Count:</strong> 1,500-2,000 words
                  </div>
                  <div>
                    <strong>Key Sections:</strong>
                    <ul className="ml-4 mt-2 list-disc space-y-1 text-muted-foreground">
                      <li>Introduction: The current state of healthcare</li>
                      <li>The AI revolution in diagnostics</li>
                      <li>Patient care improvements</li>
                      <li>Cost savings and efficiency</li>
                      <li>Future outlook</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {children}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        {currentStage.canGoBack ? (
          <Button variant="secondary" onClick={previousStage}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        ) : (
          <div />
        )}

        <div className="flex gap-3">
          {currentStage.type === "selection" && (
            <Button variant="ghost" onClick={() => console.log("Regenerate")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Options
            </Button>
          )}
          <Button
            variant="default"
            onClick={handleProceed}
            disabled={!canProceed() || currentStage.type === "processing"}
          >
            {currentStage.primaryAction}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
