import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Search, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatTab } from "./ChatTab";
import { ResearchTab } from "./ResearchTab";
import { ContextTab } from "./ContextTab";

interface AssistantPanelProps {
  currentInput?: string;
  onInsertContent?: (content: string, position: "replace" | "append" | "prepend") => void;
  onUpdateInput?: (newValue: string) => void;
}

export function AssistantPanel({ 
  currentInput, 
  onInsertContent,
  onUpdateInput 
}: AssistantPanelProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "research" | "context">("chat");
  const [contextDocsCount, setContextDocsCount] = useState(0);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">ContentQ AI Assistant</h2>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-1 flex-col">
        <div className="border-b border-border px-4 pt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="research" className="gap-2">
              <Search className="h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger value="context" className="gap-2 relative">
              <FileText className="h-4 w-4" />
              Context
              {contextDocsCount > 0 && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {contextDocsCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="h-full m-0 p-0">
            <ChatTab 
              currentInput={currentInput}
              onInsertContent={onInsertContent}
              onUpdateInput={onUpdateInput}
            />
          </TabsContent>

          <TabsContent value="research" className="h-full m-0 p-0">
            <ResearchTab 
              onInsertContent={onInsertContent}
            />
          </TabsContent>

          <TabsContent value="context" className="h-full m-0 p-0">
            <ContextTab 
              onContextCountChange={setContextDocsCount}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
