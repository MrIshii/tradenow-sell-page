/**
 * PriceLine — a single labeled price row for offer breakdowns.
 *
 * The amount aligns right and uses tabular-nums for clean column alignment.
 * Positive amounts (> 0) use the success color (--axio-green).
 * Negative amounts (< 0) use the warning/error color (--destructive).
 *
 * When `onTap` is provided:
 *   - A small "See →" affordance appears to the right of the amount.
 *   - The whole row is tappable and shows hover/active states.
 *   - When `selected` is true, a primary tint and outline highlight the row.
 *
 * Color gap note: no --success or --warning Tailwind token exists in this
 * design system. Positive uses --axio-green, negative uses --destructive.
 */
import * as React from "react";
import { cn } from "@/app/components/ui/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(n));

export interface PriceLineProps {
  label: string;
  subLabel?: string;
  /** Raw dollar amount. Positive = addition, negative = deduction, 0 = neutral */
  amount: number;
  /** Neutral display: no color coding, shows amount as-is without +/- prefix */
  neutral?: boolean;
  onTap?: () => void;
  selected?: boolean;
  className?: string;
}

export function PriceLine({
  label,
  subLabel,
  amount,
  neutral = false,
  onTap,
  selected = false,
  className,
}: PriceLineProps) {
  const formatted = neutral
    ? fmt(Math.abs(amount))
    : amount > 0
    ? `+${fmt(amount)}`
    : amount < 0
    ? `−${fmt(amount)}` // − U+2212 minus sign
    : fmt(0);

  const amountStyle: React.CSSProperties = neutral
    ? {}
    : amount > 0
    ? { color: "var(--axio-green)" } /* gap: no --success Tailwind token; using --axio-green */
    : amount < 0
    ? { color: "var(--destructive)" } /* gap: no --warning Tailwind token; using --destructive */
    : {};

  const Tag = onTap ? "button" : "div";

  return (
    <Tag
      type={onTap ? "button" : undefined}
      onClick={onTap}
      aria-pressed={onTap ? selected : undefined}
      className={cn(
        "w-full flex items-start justify-between py-3.5 transition-colors",
        onTap &&
          "rounded-xl hover:bg-background active:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
        selected && "bg-primary/10 ring-2 ring-inset ring-primary/60 rounded-xl hover:bg-primary/10",
        (onTap || selected) && "px-3 -mx-3",
        className,
      )}
    >
      {/* Label column */}
      <div className="flex flex-col gap-0.5 text-left">
        <span className="text-sm text-foreground leading-snug">{label}</span>
        {subLabel && (
          <span className="text-xs text-muted-foreground leading-snug">{subLabel}</span>
        )}
      </div>

      {/* Amount + optional See link */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <span
          className="text-sm font-bold tabular-nums"
          style={amountStyle}
        >
          {formatted}
        </span>
        {onTap && (
          <span className="text-primary text-xs font-semibold">
            See&nbsp;›
          </span>
        )}
      </div>
    </Tag>
  );
}
