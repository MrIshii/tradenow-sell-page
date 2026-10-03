/**
 * ConfirmScreen — Step 4 of 5 "Last few details".
 *
 * Four supplementary question cards, each with ChoiceChips. Nothing is
 * pre-selected (no answer is assumed); "See my offer" unlocks once all four
 * are answered.
 *
 * Estimate animation: starts with the post-vehicle range (29,800–32,400),
 * then narrows to the post-walkaround range (30,600–31,900) after 800 ms.
 * EstimateBar's built-in flash draws attention to the update.
 *
 * Mobile: cards in a single column; EstimateBar + CTA in fixed frosted dock.
 * Desktop: cards in a single top-to-bottom list; sticky right sidebar shows estimate + action.
 */
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useSell } from "../SellContext";
import { SellPageShell } from "../SellPageShell";
import { ChoiceChips, EstimateBar } from "../components";
import { Button } from "@/app/components/ui/button";
import { MOCK_ESTIMATES, fmt } from "../mockData";
import { cn } from "@/app/components/ui/utils";

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfirmScreen() {
  const navigate = useNavigate();
  const { setNavDirection } = useSell();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  // ── Supplementary question answers (local — not persisted to global context)
  const [tiresReceipt, setTiresReceipt]   = useState<"yes" | "no" | null>(null);
  const [keysCount,    setKeysCount]       = useState<"1" | "2" | "3+" | null>(null);
  const [serviceRecs,  setServiceRecs]     = useState<"yes" | "no" | null>(null);
  const [petSmoke,     setPetSmoke]        = useState<"neither" | "smoke" | "pets" | null>(null);
  const allAnswered = tiresReceipt !== null && keysCount !== null && serviceRecs !== null && petSmoke !== null;

  // ── Estimate animation: widen on mount then narrow after 800 ms ─────────────
  const [estimateLow,  setEstimateLow]  = useState(MOCK_ESTIMATES.afterVehicle.low);
  const [estimateHigh, setEstimateHigh] = useState(MOCK_ESTIMATES.afterVehicle.high);

  useEffect(() => {
    const t = setTimeout(() => {
      setEstimateLow(MOCK_ESTIMATES.afterWalkaround.low);
      setEstimateHigh(MOCK_ESTIMATES.afterWalkaround.high);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const goToPricing = () => {
    setNavDirection("forward");
    navigate("/sell/pricing");
  };

  // ── CTA (mobile dock + desktop sidebar card) ───────────────────────────────
  const cta = (
    <div>
      <EstimateBar low={estimateLow} high={estimateHigh} />
      <Button
        onClick={goToPricing}
        disabled={!allAnswered}
        className="w-full h-14 mt-4 text-base font-bold rounded-xl"
      >
        See my offer
      </Button>
    </div>
  );

  // ── Desktop sidebar extra (above CTA card) ─────────────────────────────────
  const sidebarExtra = (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        Refined estimate
      </span>
      <span className="text-[22px] font-black text-foreground tabular-nums leading-tight">
        {fmt(estimateLow)} – {fmt(estimateHigh)}
      </span>
      <span className="text-xs text-muted-foreground mt-0.5">
        Based on your answers and photos
      </span>
    </div>
  );

  return (
    <SellPageShell cta={cta} sidebarExtra={sidebarExtra}>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-foreground leading-tight focus-visible:outline-none"
      >
        Last few details
      </h2>
      <p className="text-[15px] text-muted-foreground mt-1.5 mb-6 leading-relaxed">
        These help us give you the most accurate offer.
      </p>

      {/* One card per row at every width: the questions read top to bottom like a list */}
      <div className="flex flex-col gap-4">

        {/* 1 — Tires (contextual insight card) */}
        <QuestionCard
          badge="We noticed"
          question="Your tires look recently replaced. Do you have the receipt?"
        >
          <ChoiceChips<"yes" | "no">
            options={[
              { value: "yes", label: "Yes" },
              { value: "no",  label: "No"  },
            ]}
            value={tiresReceipt}
            onChange={setTiresReceipt}
          />
        </QuestionCard>

        {/* 2 — Keys */}
        <QuestionCard question="How many keys do you have?">
          <ChoiceChips<"1" | "2" | "3+">
            options={[
              { value: "1",   label: "1"  },
              { value: "2",   label: "2"  },
              { value: "3+",  label: "3+" },
            ]}
            value={keysCount}
            onChange={setKeysCount}
          />
        </QuestionCard>

        {/* 3 — Service records */}
        <QuestionCard question="Any service records?">
          <ChoiceChips<"yes" | "no">
            options={[
              { value: "yes", label: "Yes, add later" },
              { value: "no",  label: "No" },
            ]}
            value={serviceRecs}
            onChange={setServiceRecs}
          />
        </QuestionCard>

        {/* 4 — Smoke / pets */}
        <QuestionCard question="Has it been smoked in, or carried pets?">
          <ChoiceChips<"neither" | "smoke" | "pets">
            options={[
              { value: "neither", label: "Neither" },
              { value: "smoke",   label: "Smoke" },
              { value: "pets",    label: "Pets" },
            ]}
            value={petSmoke}
            onChange={setPetSmoke}
          />
        </QuestionCard>

      </div>
    </SellPageShell>
  );
}

// ─── Question card ────────────────────────────────────────────────────────────

function QuestionCard({
  badge,
  question,
  children,
  className,
}: {
  badge?: string;
  question: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-background rounded-2xl border border-border p-4 flex flex-col gap-3",
        className,
      )}
    >
      {/* Contextual insight badge — e.g. "We noticed" */}
      {badge && (
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {badge}
          </span>
        </div>
      )}

      {/* Question text */}
      <p className="text-sm font-bold text-foreground leading-snug">
        {question}
      </p>

      {/* Chips */}
      {children}
    </div>
  );
}
