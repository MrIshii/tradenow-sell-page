/**
 * EstimateBar — pill-shaped row showing "Estimated offer" + price range.
 *
 * The range briefly flashes the primary color whenever low or high changes,
 * giving the user clear feedback that the estimate has been refined.
 *
 * Layout: label on the left, formatted range on the right.
 *         Both sit on a light primary tint background with a subtle border.
 *
 * Uses: no external UI components — styled purely with design tokens.
 */
import { useState, useEffect, useRef } from "react";
import { cn } from "@/app/components/ui/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export interface EstimateBarProps {
  low: number;
  high: number;
  /** Overrides the default "Estimated offer" label */
  label?: string;
  className?: string;
}

export function EstimateBar({
  low,
  high,
  label = "Estimated offer",
  className,
}: EstimateBarProps) {
  const [highlighted, setHighlighted] = useState(false);
  const prevLow = useRef(low);
  const prevHigh = useRef(high);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (low !== prevLow.current || high !== prevHigh.current) {
      prevLow.current = low;
      prevHigh.current = high;

      setHighlighted(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHighlighted(false), 650);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [low, high]);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-full px-4 py-2.5 border transition-colors duration-300",
        highlighted
          ? "bg-primary/10 border-primary/30"
          : "bg-primary/5 border-primary/15",
        className,
      )}
    >
      <span className="text-primary font-bold text-xs uppercase tracking-wide">
        {label}
      </span>

      <span
        className={cn(
          "font-black text-sm tabular-nums transition-colors duration-300",
          highlighted ? "text-primary" : "text-foreground",
        )}
      >
        {fmt(low)}
        <span className="mx-1 font-normal text-muted-foreground">–</span>
        {fmt(high)}
      </span>
    </div>
  );
}
