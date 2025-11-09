import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function FloatingActionButton({
  onClick,
  disabled = false,
  children,
  className,
}: FloatingActionButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "fixed bottom-8 right-8 h-14 px-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)]",
        "bg-gradient-to-r from-primary to-primary/90",
        disabled && "opacity-50 hover:scale-100",
        className
      )}
    >
      {children}
    </Button>
  );
}
