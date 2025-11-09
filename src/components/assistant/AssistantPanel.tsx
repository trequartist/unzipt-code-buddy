import { useState, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useLocation } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Context-aware suggestions based on workspace and workflow state
const getContextualSuggestions = (
  pathname: string,
  isWorkflowActive: boolean,
  currentStage?: any
) => {
  // Workspace-specific suggestions
  if (pathname === "/create") {
    if (!isWorkflowActive) {
      return [
        "Start a blog post workflow",
        "What content types can I create?",
        "Help me brainstorm topics",
        "Show me workflow options",
      ];
    }
    
    // Stage-specific suggestions
    if (currentStage?.type === "input") {
      return [
        "Help me refine this topic",
        "Suggest relevant keywords",
        "What makes a good headline?",
        "Add more context to my idea",
      ];
    }
    if (currentStage?.type === "selection") {
      return [
        "Which option is best for SEO?",
        "Compare these approaches",
        "Help me decide",
        "What's trending now?",
      ];
    }
    if (currentStage?.type === "approval") {
      return [
        "Review this content",
        "Suggest improvements",
        "Check for errors",
        "Optimize for engagement",
      ];
    }
  }
  
  if (pathname === "/strategy") {
    return [
      "Analyze my content strategy",
      "Create a content calendar",
      "What's my target audience?",
      "Competitive analysis",
    ];
  }
  
  if (pathname === "/intelligence") {
    return [
      "Show content performance",
      "Analyze engagement trends",
      "What's working best?",
      "Generate insights report",
    ];
  }
  
  if (pathname === "/hub") {
    return [
      "Find recent drafts",
      "Show published content",
      "Search by topic",
      "Organize my library",
    ];
  }
  
  return [
    "How can I help you today?",
    "Start a new project",
    "Show me around",
    "What can you do?",
  ];
};

// Get contextual help prompt
const getHelpPrompt = (pathname: string, currentStage?: any) => {
  if (pathname === "/create" && currentStage) {
    const stageHelp: Record<string, string> = {
      input: "Enter your content topic or idea. I can help you refine it!",
      processing: "I'm analyzing your input and generating options...",
      selection: "Choose the approach that best fits your goals. Need help deciding?",
      approval: "Review the generated content. I can suggest edits or improvements!",
    };
    return stageHelp[currentStage.type] || "I'm here to help with your workflow!";
  }
  
  const workspaceHelp: Record<string, string> = {
    "/create": "Start creating content with AI-powered workflows",
    "/strategy": "Plan and optimize your content strategy",
    "/intelligence": "Analyze performance and get insights",
    "/hub": "Manage and organize your content library",
  };
  
  return workspaceHelp[pathname] || "Ask me anything about your content workflow";
};

export function AssistantPanel() {
  const location = useLocation();
  const { isActive, currentStageIndex, stages } = useWorkflowStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  
  const currentStage = isActive && stages[currentStageIndex] ? stages[currentStageIndex] : undefined;
  const suggestions = getContextualSuggestions(location.pathname, isActive, currentStage);
  const helpPrompt = getHelpPrompt(location.pathname, currentStage);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setIsThinking(true);

    // Simulate contextual assistant response
    setTimeout(() => {
      let responseContent = "I'm here to help! ";
      
      // Context-aware responses
      if (location.pathname === "/create" && currentStage) {
        if (currentStage.type === "input") {
          responseContent += "That's a great topic! Consider adding more specific details to help me generate better options for you.";
        } else if (currentStage.type === "selection") {
          responseContent += "Each option has its strengths. The first approach tends to be more engaging for readers, while the second is better for SEO.";
        } else if (currentStage.type === "approval") {
          responseContent += "The content looks good! I noticed a few areas where you could strengthen the opening paragraph to hook readers better.";
        }
      } else if (location.pathname === "/strategy") {
        responseContent += "I can help you plan your content strategy. Would you like to create a content calendar or analyze your target audience?";
      } else if (location.pathname === "/intelligence") {
        responseContent += "I can provide insights on your content performance. What metrics are you most interested in?";
      } else if (location.pathname === "/hub") {
        responseContent += "I can help you find and organize your content. What are you looking for?";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-heading">ContentQ</h2>
        </div>
        <p className="text-small text-muted-foreground">
          {helpPrompt}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            {/* Breathing Orb Animation */}
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" style={{ animationDuration: "2s" }} />
              <div className="absolute inset-2 animate-pulse rounded-full bg-primary/30" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/90">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-subheading">How can I help you today?</h3>
              <p className="text-small text-muted-foreground">
                {helpPrompt}
              </p>
            </div>
            {/* Context-aware Suggestion Chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((chip, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer transition-all hover:border-primary hover:bg-primary/5 hover:scale-105"
                  onClick={() => setInput(chip)}
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1",
                  message.role === "user" && "items-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            {isThinking && (
              <div className="flex flex-col gap-3">
                {/* Breathing Orb - Thinking State */}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" style={{ animationDuration: "1.5s" }} />
                    <div className="absolute inset-1 animate-pulse rounded-full bg-primary/40" style={{ animationDuration: "1.5s", animationDelay: "0.2s" }} />
                    <div className="relative h-4 w-4 rounded-full bg-primary animate-pulse" style={{ animationDuration: "1.5s", animationDelay: "0.4s" }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything..."
            className="min-h-[60px] resize-none"
            aria-label="Message assistant"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
