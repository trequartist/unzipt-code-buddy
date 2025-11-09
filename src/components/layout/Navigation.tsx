import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FileText, TrendingUp, Lightbulb, FolderOpen, Menu, Command } from "lucide-react";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/create", icon: FileText, label: "Create", shortcut: "Ctrl+1" },
    { to: "/strategy", icon: TrendingUp, label: "Strategy", shortcut: "Ctrl+2" },
    { to: "/intelligence", icon: Lightbulb, label: "Intelligence", shortcut: "Ctrl+3" },
    { to: "/hub", icon: FolderOpen, label: "Hub", shortcut: "Ctrl+4" },
  ];

  return (
    <nav className="flex h-full items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">Q</span>
          </div>
          <span className="text-lg font-bold">ContentQ</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Desktop Command Palette Hint */}
      <Button
        variant="outline"
        size="sm"
        className="hidden lg:flex items-center gap-2"
        onClick={() => {
          const event = new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true,
            bubbles: true,
          });
          document.dispatchEvent(event);
        }}
      >
        <Command className="h-4 w-4" />
        <span className="text-xs">Ctrl+K</span>
      </Button>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px]">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                <kbd className="hidden sm:inline-block pointer-events-none text-[10px] text-muted-foreground">
                  {item.shortcut}
                </kbd>
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
