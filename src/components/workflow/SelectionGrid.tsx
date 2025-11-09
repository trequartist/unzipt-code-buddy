import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SelectionOption {
  id: string;
  title: string;
  description: string;
}

interface SelectionGridProps {
  options: SelectionOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
}

export function SelectionGrid({
  options,
  selected,
  onChange,
  multiSelect = false,
}: SelectionGridProps) {
  const handleSelect = (optionId: string) => {
    if (multiSelect) {
      const newSelected = selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId];
      onChange(newSelected);
    } else {
      onChange([optionId]);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        
        return (
          <Card
            key={option.id}
            className={cn(
              "group relative cursor-pointer p-6 transition-all duration-300 hover:shadow-xl",
              isSelected
                ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                : "hover:-translate-y-1 hover:border-primary/50"
            )}
            onClick={() => handleSelect(option.id)}
          >
            {/* Selection Indicator */}
            <div
              className={cn(
                "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300",
                isSelected
                  ? "border-primary bg-primary scale-110 shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                  : "border-border bg-background group-hover:border-primary/50 group-hover:scale-105"
              )}
            >
              {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
            </div>

            <div className="space-y-2 pr-8">
              <h3 className={cn(
                "text-subheading transition-colors duration-300",
                isSelected ? "text-primary" : "group-hover:text-primary"
              )}>
                {option.title}
              </h3>
              <p className="text-small text-muted-foreground">
                {option.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
