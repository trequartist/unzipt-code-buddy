import { ReactNode, useState } from "react";
import { Navigation } from "./Navigation";
import { AssistantPanel } from "../assistant/AssistantPanel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Header with Navigation - Fixed 60px */}
      <header className="fixed top-0 z-50 h-[60px] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navigation />
      </header>

      {/* Main Content Area */}
      <div className="mt-[60px] flex flex-1 overflow-hidden">
        {/* Main Workspace - Flex 1 */}
        <main id="main-content" className="flex-1 overflow-y-auto" role="main">
          <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Desktop Assistant Panel - Fixed 400px */}
        <aside className="hidden w-[400px] border-l border-border bg-background lg:block">
          <AssistantPanel />
        </aside>
      </div>

      {/* Mobile Assistant FAB */}
      <Sheet open={assistantOpen} onOpenChange={setAssistantOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg lg:hidden z-50"
            aria-label="Open assistant"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          <AssistantPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
}
