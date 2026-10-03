import { ReactNode } from "react";
import { FlowTopBar } from "./FlowTopBar";

interface SellPageShellProps {
  children: ReactNode;
  /** CTA rendered in dock (mobile) and in sidebar card (desktop) */
  cta?: ReactNode;
  /** Extra content shown only in the desktop sidebar above the CTA */
  sidebarExtra?: ReactNode;
  /** Pass true to hide the top bar (e.g. full-screen loading) */
  hideTopBar?: boolean;
}

/**
 * Base shell for all flow screens (not the landing).
 *
 * Mobile / tablet (< 1024 px):
 *   - Sticky FlowTopBar
 *   - Scrollable single-column content (max 560 px on tablet)
 *   - CTA in a frosted dock pinned to bottom
 *
 * Desktop (≥ 1024 px):
 *   - FlowTopBar spans full width
 *   - Two-column grid (content | sticky sidebar with CTA + extras)
 *   - Max content width 1120 px
 */
export function SellPageShell({
  children,
  cta,
  sidebarExtra,
  hideTopBar = false,
}: SellPageShellProps) {
  return (
    <div className="min-h-dvh bg-card flex flex-col">
      {!hideTopBar && <FlowTopBar />}
      {!hideTopBar && <div className="h-[108px] md:h-[49px] shrink-0" aria-hidden="true" />}

      {/* Content + desktop sidebar */}
      <div className="flex-1 w-full lg:max-w-[1120px] lg:mx-auto lg:px-8 lg:py-10 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-start">

        {/* Main scrollable area */}
        <div
          className="flex-1 px-5 pt-6 lg:px-0 lg:pt-0"
          style={{ paddingBottom: cta ? "calc(14rem + env(safe-area-inset-bottom))" : "1.5rem" }}
        >
          {/* Tablet: center & cap at 560 px */}
          <div className="md:max-w-[560px] md:mx-auto lg:max-w-none lg:mx-0">
            {children}
          </div>
        </div>

        {/* Desktop sticky sidebar */}
        {cta && (
          <div className="hidden lg:block lg:shrink-0">
            <div className="sticky top-[4.5rem] flex flex-col gap-4">
              {sidebarExtra && (
                <div className="bg-background rounded-2xl border border-border p-5">
                  {sidebarExtra}
                </div>
              )}
              <div
                className="bg-card rounded-2xl border border-border p-5"
                style={{ boxShadow: "0 8px 24px rgba(16,24,32,0.10)" }}
              >
                {cta}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile / tablet dock — no background; ActionDock provides its own glass */}
      {cta && (
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-5 pt-3"
          style={{
            background: "transparent",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)",
          }}
        >
          {cta}
        </div>
      )}
    </div>
  );
}
