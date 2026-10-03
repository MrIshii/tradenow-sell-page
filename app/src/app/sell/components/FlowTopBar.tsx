import * as React from "react";
import { ChevronLeft, MoreHorizontal, X } from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import { cn } from "@/app/components/ui/utils";

export interface FlowTopBarProps {
  step: number;
  totalSteps?: number;
  stepName: string;
  onBack?: (() => void) | null;
  /** Leave the sell flow: an X at the top right ("Exit X" on desktop) in place of the menu. */
  onExit?: () => void;
  hideStepCount?: boolean;
  className?: string;
}

export function FlowTopBar({
  step,
  totalSteps = 3,
  stepName,
  onBack,
  onExit,
  hideStepCount = false,
  className,
}: FlowTopBarProps) {
  const progress = Math.round((step / totalSteps) * 100);

  return (
    <div
      className={cn(
        "fixed top-[59px] md:top-0 left-0 right-0 z-40 bg-white border-b border-gray-100",
        className,
      )}
      style={{ background: "white" }}
    >
      <div className="flex items-center h-12 max-w-[1120px] mx-auto">
        {/* Back button — 56px wide on phones, wider on desktop to balance "Exit" */}
        <div className="w-14 md:w-28 flex items-center justify-start pl-1 shrink-0">
          {onBack != null && (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="flex items-center gap-0.5 h-10 pl-1 pr-3 rounded-xl text-foreground hover:bg-black/[0.05] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 shrink-0" strokeWidth={2.5} />
              <span className="text-[15px] font-semibold">Back</span>
            </button>
          )}
        </div>

        {/* Center label */}
        <div className="flex-1 text-center">
          {!hideStepCount && (
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-none mb-0.5">
              Step {step} of {totalSteps}
            </p>
          )}
          <p className="text-[14px] font-bold text-foreground leading-tight">{stepName}</p>
        </div>

        {/* Right — exit the flow ("Exit" label on desktop, X only on phones). Mirrors left width */}
        <div className="w-14 md:w-28 flex items-center justify-end pr-1 shrink-0">
          {onExit ? (
            <button
              onClick={onExit}
              aria-label="Exit"
              className="flex items-center justify-center gap-1 h-10 min-w-10 md:pl-3 md:pr-2 rounded-xl text-foreground hover:bg-black/[0.05] transition-colors"
            >
              <span className="hidden md:inline text-[15px] font-semibold">Exit</span>
              <X className="w-5 h-5 shrink-0" strokeWidth={2.25} />
            </button>
          ) : (
            <button
              aria-label="More options"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground hover:bg-black/[0.05] transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <Progress
        value={progress}
        className="h-1 rounded-none bg-border [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-500"
      />
    </div>
  );
}
