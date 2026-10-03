/**
 * ActionDock — pinned primary-action container.
 *
 * Mobile / tablet (< 1024 px):
 *   Fixed to the bottom of the viewport, full width.
 *   Content is centered and capped at 560 px on tablet.
 *   Bottom padding respects env(safe-area-inset-bottom) for iOS home indicator.
 *
 * Desktop (≥ 1024 px):
 *   Renders as a normal static card. The parent is responsible for placing
 *   it in a `sticky top-8` right column to achieve the sticky side-panel feel.
 *   SellPageShell handles this automatically when you pass `cta` there instead.
 *
 * Usage (inside a SellPageShell cta prop, or standalone):
 *
 *   <ActionDock
 *     primary={{ label: "Continue", onClick: handleNext }}
 *     secondary={{ label: "Skip for now", onClick: handleSkip }}
 *     extra={<EstimateBar low={29800} high={32400} />}
 *   />
 *
 * Uses: Button (primary + outline variants) from the existing UI system.
 */
import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

export interface ActionDockAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface ActionDockProps {
  primary: ActionDockAction;
  secondary?: ActionDockAction;
  /** Extra content rendered above the buttons (e.g. an EstimateBar) */
  extra?: React.ReactNode;
  className?: string;
}

export function ActionDock({ primary, secondary, extra, className }: ActionDockProps) {
  return (
    <div
      className={cn(
        // ── Mobile / tablet: fixed bottom bar ─────────────────────────────
        "fixed bottom-0 left-0 right-0 z-50",
        // ── Desktop: static card (parent provides sticky + column layout) ─
        "lg:static lg:rounded-2xl lg:border lg:border-border lg:shadow-[0_8px_24px_rgba(16,24,32,0.10)]",
        // iOS glass on mobile; opaque card on desktop
        "bg-transparent lg:bg-card",
        className,
      )}
      style={{ background: "transparent", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)" }}
    >
      <div
        className="px-5 pt-3 md:max-w-[560px] md:mx-auto lg:max-w-none lg:p-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
      >
        {extra && <div className="mb-3">{extra}</div>}

        {/* Primary action — full-width, 56 px tall (≥ 48 px tap target) */}
        <Button
          onClick={primary.onClick}
          disabled={primary.disabled || primary.loading}
          className="w-full h-auto min-h-14 py-3 px-4 whitespace-normal text-balance leading-snug text-base font-bold rounded-xl m-[0px]"
        >
          {primary.loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            primary.label
          )}
        </Button>

        {/* Secondary action — full-width, outline style */}
        {secondary && (
          <Button
            variant="outline"
            onClick={secondary.onClick}
            disabled={secondary.disabled}
            className="w-full h-12 text-sm font-semibold rounded-xl mt-2 border-border"
          >
            {secondary.label}
          </Button>
        )}
      </div>
    </div>
  );
}
