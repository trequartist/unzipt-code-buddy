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
import { AssistantPanel } from "../assistant/AssistantPanel";

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
    insertIntoInput,
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
      <div className="ml-[240px] flex flex-1 animate-fade-in">
        <div className="flex-1 p-8">
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

            {/* Input Stage - User provides input via Assistant Panel */}
            {currentStage.type === "input" && (
              <div className="pt-8 pb-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="max-w-md text-center space-y-6">
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
                    <div className="relative bg-primary/10 p-6 rounded-full">
                      <svg
                        className="h-16 w-16 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">Ready to create?</h3>
                    <p className="text-muted-foreground">
                      Use the <span className="font-semibold text-foreground">ContentQ AI Assistant</span> on the right to share your topic, ideas, or upload supporting documents.
                    </p>
                  </div>
                  
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-start gap-3 text-left">
                      <div className="mt-0.5">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-1 text-sm">
                        <p className="font-medium">Type your content idea in the Chat tab</p>
                        <p className="text-xs text-muted-foreground">
                          Or use the Context tab to upload reference documents
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
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

        {/* Assistant Panel - Fixed Right Sidebar */}
        <aside className="hidden w-[400px] border-l border-border bg-background lg:block">
          <div className="sticky top-0 h-[calc(100vh-60px)]">
            <AssistantPanel 
              currentInput={currentStage.type === "input" ? currentStage.inputValue : undefined}
              onInsertContent={insertIntoInput}
              onUpdateInput={(newValue) => updateStageData({ inputValue: newValue })}
            />
          </div>
        </aside>
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
