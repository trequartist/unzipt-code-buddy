import { ReactNode } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/stores/workflowStore";
import { SelectionGrid } from "./SelectionGrid";
import { ProcessingIndicator } from "./ProcessingIndicator";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { VerticalTimeline } from "./VerticalTimeline";
import { StageCard } from "./StageCard";
import { FloatingActionButton } from "./FloatingActionButton";
import { WorkflowHeader } from "./WorkflowHeader";

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
    <div className="flex min-h-[calc(100vh-60px)]">
      {/* Vertical Timeline - Fixed Left Sidebar */}
      <VerticalTimeline steps={steps} currentIndex={currentStageIndex} />

      {/* Main Content Area - Offset for timeline */}
      <div className="ml-[240px] flex-1 animate-fade-in p-8">
        {/* Header */}
        {workflowType && (
          <WorkflowHeader workflowType={workflowType} onPause={pauseWorkflow} />
        )}

        {/* Stage Content Card */}
        <StageCard className="min-h-[500px]">
          <div className="space-y-6">
            {/* Stage Header */}
            <div className="space-y-3">
              <h2 className="text-display font-bold">{currentStage.title}</h2>
              <p className="text-body text-muted-foreground">
                {currentStage.description}
              </p>
            </div>

            {/* Input Stage */}
            {currentStage.type === "input" && (
              <div className="space-y-4 pt-4">
                <div className="relative">
                  <Textarea
                    placeholder={currentStage.placeholder}
                    value={currentStage.inputValue || ""}
                    onChange={(e) =>
                      updateStageData({ inputValue: e.target.value })
                    }
                    rows={10}
                    maxLength={2000}
                    className="resize-none text-base"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {currentStage.inputValue?.length || 0} / 2000
                  </div>
                </div>
                {currentStage.allowFileUpload && (
                  <Card className="flex items-center justify-center border-2 border-dashed p-12 transition-all duration-300 hover:border-primary hover:bg-primary/5">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Drop files here or click to upload
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Supports: {currentStage.acceptedFiles}
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Selection Stage */}
            {currentStage.type === "selection" && currentStage.options && (
              <div className="pt-4">
                <SelectionGrid
                  options={currentStage.options}
                  selected={currentStage.selectedOptions || []}
                  onChange={(selected) =>
                    updateStageData({ selectedOptions: selected })
                  }
                  multiSelect={currentStage.multiSelect}
                />
              </div>
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
              <div className="pt-4">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                  <div className="space-y-6">
                    <h3 className="text-heading font-semibold">Content Brief</h3>
                    <div className="space-y-4 text-body">
                      <div className="rounded-lg bg-background/80 p-4">
                        <strong className="text-foreground">Title:</strong>
                        <p className="mt-1 text-muted-foreground">
                          AI in Healthcare: The Transformation Story
                        </p>
                      </div>
                      <div className="rounded-lg bg-background/80 p-4">
                        <strong className="text-foreground">Word Count:</strong>
                        <p className="mt-1 text-muted-foreground">1,500-2,000 words</p>
                      </div>
                      <div className="rounded-lg bg-background/80 p-4">
                        <strong className="text-foreground">Key Sections:</strong>
                        <ul className="ml-4 mt-3 list-disc space-y-2 text-muted-foreground">
                          <li>Introduction: The current state of healthcare</li>
                          <li>The AI revolution in diagnostics</li>
                          <li>Patient care improvements</li>
                          <li>Cost savings and efficiency</li>
                          <li>Future outlook</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {children}
          </div>
        </StageCard>

        {/* Bottom Actions - Desktop Only */}
        <div className="mt-6 flex items-center justify-between">
          {currentStage.canGoBack ? (
            <Button variant="ghost" onClick={previousStage} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStage.type === "selection" && (
            <Button variant="ghost" onClick={() => console.log("Regenerate")} size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {currentStage.type !== "processing" && (
        <FloatingActionButton
          onClick={handleProceed}
          disabled={!canProceed()}
        >
          {currentStage.primaryAction}
          <ArrowRight className="ml-2 h-4 w-4" />
        </FloatingActionButton>
      )}
    </div>
  );
}
