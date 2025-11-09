import { useWorkflowStore } from "@/stores/workflowStore";
import { WorkflowContainer } from "@/components/workflow/WorkflowContainer";
import { ContentEditor } from "@/components/editor/ContentEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Linkedin, Calendar, Clock, ArrowRight } from "lucide-react";

interface WorkflowCard {
  id: string;
  icon: typeof FileText;
  title: string;
  description: string;
  shortcut: string;
}

const workflows: WorkflowCard[] = [
  {
    id: "blog",
    icon: FileText,
    title: "Blog Post",
    description: "Long-form content for your blog",
    shortcut: "B",
  },
  {
    id: "linkedin",
    icon: Linkedin,
    title: "LinkedIn Post",
    description: "Professional update for LinkedIn",
    shortcut: "L",
  },
  {
    id: "calendar",
    icon: Calendar,
    title: "From Calendar",
    description: "Create from scheduled topic",
    shortcut: "C",
  },
];

const mockDrafts = [
  {
    id: "1",
    title: "AI in Healthcare: Revolutionizing Patient Care",
    status: "In Progress",
    lastModified: "2 hours ago",
    progress: 65,
  },
  {
    id: "2",
    title: "The Future of Remote Work",
    status: "Draft",
    lastModified: "Yesterday",
    progress: 30,
  },
];

export default function Create() {
  const { isActive, startWorkflow, currentStageIndex, stages } = useWorkflowStore();

  // Check if we're in editor mode (last stage)
  const isEditorMode = isActive && currentStageIndex === stages.length - 1;

  // If workflow is active and not in editor mode, show workflow container
  if (isActive && !isEditorMode) {
    return <WorkflowContainer />;
  }

  // If in editor mode, show editor
  if (isEditorMode) {
    return <ContentEditor />;
  }

  // Otherwise show workflow selection screen
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-display">Create Content</h1>
        <p className="text-body text-muted-foreground">
          Start a new piece of content or continue where you left off
        </p>
      </div>

      {/* Start New Section */}
      <section className="space-y-4">
        <h2 className="text-label text-muted-foreground">START NEW</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => {
            const Icon = workflow.icon;
            return (
              <Card
                key={workflow.id}
                className="group cursor-pointer transition-all duration-200 hover:-translate-y-1"
                onClick={() => startWorkflow(workflow.id as "blog" | "linkedin" | "calendar")}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-mono">
                      {workflow.shortcut}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-subheading">{workflow.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {workflow.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full justify-between opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Start Workflow
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Continue Working Section */}
      {mockDrafts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-label text-muted-foreground">CONTINUE WORKING</h2>
          <div className="space-y-3">
            {mockDrafts.map((draft) => (
              <Card
                key={draft.id}
                className="group cursor-pointer transition-all duration-200 hover:shadow-md"
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-subheading">{draft.title}</h3>
                    <div className="flex items-center gap-3 text-small text-muted-foreground">
                      <Badge variant={draft.status === "In Progress" ? "info" : "default"} size="sm">
                        {draft.status}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {draft.lastModified}
                      </span>
                      <span>{draft.progress}% complete</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
