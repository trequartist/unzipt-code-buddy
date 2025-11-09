import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StageCardProps {
  children: ReactNode;
  className?: string;
}

export function StageCard({ children, className }: StageCardProps) {
  return (
    <Card
      className={cn(
        "animate-fade-in border border-border/50 bg-card/50 backdrop-blur-sm p-8 shadow-lg transition-all duration-300",
        className
      )}
    >
      {children}
    </Card>
  );
}
