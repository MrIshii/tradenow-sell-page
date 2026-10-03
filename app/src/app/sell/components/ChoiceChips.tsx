/**
 * ChoiceChips — single-select chips for short categorical answers.
 *
 * 48 px tall (meets the min tap-target spec).
 * Each chip is a full button element (not a Badge — that's for display only).
 * Selected chip gets the primary background; unselected uses the background/
 * border tokens.
 *
 * Example: ownership count 1 / 2 / 3+
 */
import * as React from "react";
import { cn } from "@/app/components/ui/utils";

export interface ChipOption<T extends string = string> {
  value: T;
  label: string;
}

export interface ChoiceChipsProps<T extends string = string> {
  options: ChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
}

export function ChoiceChips<T extends string = string>({
  options,
  value,
  onChange,
  className,
}: ChoiceChipsProps<T>) {
  return (
    <div
      role="group"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={selected}
            className={cn(
              // Sizing — 48 px tall, horizontal padding
              "h-12 px-5 rounded-full border-2 font-semibold text-sm transition-all whitespace-nowrap",
              // Default
              "bg-background border-border text-foreground hover:border-primary/50 active:border-primary",
              // Selected
              selected && "bg-primary border-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
