import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Sparkles, TrendingUp, Target, Zap, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkflowStore } from "@/stores/workflowStore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatTabProps {
  currentInput?: string;
  onInsertContent?: (content: string, position: "replace" | "append" | "prepend") => void;
  onUpdateInput?: (newValue: string) => void;
}

export function ChatTab({ currentInput, onInsertContent, onUpdateInput }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { isActive, currentStageIndex, stages } = useWorkflowStore();
  
  const currentStage = isActive && stages[currentStageIndex] ? stages[currentStageIndex] : undefined;
  const isInputStage = currentStage?.type === "input";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickActions = [
    { icon: Sparkles, label: "Improve this", action: "improve" },
    { icon: TrendingUp, label: "Add examples", action: "examples" },
    { icon: Target, label: "Suggest keywords", action: "keywords" },
    { icon: Zap, label: "Make it longer", action: "longer" },
    { icon: Volume2, label: "Change tone", action: "tone" },
  ];

  const handleQuickAction = (action: string) => {
    let prompt = "";
    switch (action) {
      case "improve":
        prompt = "Improve this content to make it more engaging and clear.";
        break;
      case "examples":
        prompt = "Add relevant examples to illustrate the key points.";
        break;
      case "keywords":
        prompt = "Suggest SEO keywords for this content.";
        break;
      case "longer":
        prompt = "Expand this content with more details and depth.";
        break;
      case "tone":
        prompt = "Suggest different tone variations for this content.";
        break;
    }
    
    if (currentInput) {
      handleSend(prompt);
    }
  };

  const handleSend = (customPrompt?: string) => {
    const messageText = customPrompt || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I can help you with that. ${isInputStage && currentInput ? `Based on your current input: "${currentInput.substring(0, 50)}..."` : ""} Here are my suggestions...`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1000);
  };

  const handleInsertMessage = (content: string) => {
    if (onInsertContent) {
      onInsertContent(content, "append");
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Writing Assistant Mode Badge */}
      {isInputStage && currentInput && (
        <div className="p-4 pb-0">
          <Card className="p-3 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-medium">Writing Assistant Mode</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {currentInput.length} characters • Active
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      {isInputStage && currentInput && (
        <div className="p-4 pb-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.action}
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction(action.action)}
                className="justify-start gap-2"
              >
                <action.icon className="h-3 w-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium mb-2">How can I help you?</h3>
            <p className="text-sm text-muted-foreground">
              {isInputStage
                ? "I'm here to help you write better content. Use quick actions or ask me anything."
                : "Ask me anything about your content workflow."}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.role === "assistant" && onInsertContent && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleInsertMessage(message.content)}
                    className="mt-2 h-7 text-xs"
                  >
                    Insert into input
                  </Button>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg bg-muted p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

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
            onClick={() => handleSend()}
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

function MessageCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
