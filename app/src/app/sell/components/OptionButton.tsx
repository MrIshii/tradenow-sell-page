/**
 * OptionButton — large tappable answer row.
 *
 * Min height 64 px (≥ 48 px tap target).
 * Shows a title, an optional one-line description, and a trailing chevron.
 * Selected state: primary border + subtle primary tint background.
 *
 * Typically used in a vertical stack for single-select questions where the
 * answer needs more context than a ChoiceChip can provide.
 *
 * No external UI component fits this pattern exactly, so this is a new
 * primitive styled entirely with design tokens.
 */
import * as React from "react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

export interface OptionButtonProps {
  title: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  /** Optional leading icon or element */
  leading?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function OptionButton({
  title,
  description,
  selected = false,
  onClick,
  leading,
  disabled = false,
  className,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        // Layout
        "w-full flex items-center gap-4 px-4 rounded-2xl border-2 transition-all",
        // Sizing — min 64 px
        "min-h-[64px] py-4",
        // Default state
        "bg-background border-border hover:border-primary/40 active:border-primary active:bg-primary/5",
        // Selected state — primary border + tint
        selected && "bg-primary/5 border-primary",
        // Disabled
        disabled && "opacity-40 pointer-events-none",
        className,
      )}
    >
      {/* Optional leading content */}
      {leading && (
        <div className="shrink-0 text-muted-foreground">{leading}</div>
      )}

      {/* Text block */}
      <div className="flex-1 text-left min-w-0">
        <p
          className={cn(
            "text-sm font-bold leading-snug text-foreground truncate",
            selected && "text-foreground",
          )}
        >
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground leading-snug mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>

      {/* Trailing icon */}
      <div className="shrink-0">
        {selected ? (
          /* gap: no --success Tailwind color token; using --axio-green CSS var */
          <CheckCircle2
            className="w-5 h-5"
            style={{ color: "var(--axio-green)" }}
          />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
    </button>
  );
}
