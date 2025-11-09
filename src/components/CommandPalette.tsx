import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  FileText,
  TrendingUp,
  Lightbulb,
  FolderOpen,
  Search,
  Calendar,
  BarChart3,
  Target,
  Users,
  Sparkles,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/create"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Go to Create</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl+1</span>
            </kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/strategy"))}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Go to Strategy</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl+2</span>
            </kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/intelligence"))}>
            <Lightbulb className="mr-2 h-4 w-4" />
            <span>Go to Intelligence</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl+3</span>
            </kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/hub"))}>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Go to Hub</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl+4</span>
            </kbd>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Content</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Create New Content</span>
          </CommandItem>
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>View Calendar</span>
          </CommandItem>
          <CommandItem>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>View Analytics</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Access">
          <CommandItem>
            <Target className="mr-2 h-4 w-4" />
            <span>View Campaigns</span>
          </CommandItem>
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Manage Audiences</span>
          </CommandItem>
          <CommandItem>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI Insights</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
