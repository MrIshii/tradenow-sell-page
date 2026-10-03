/**
 * OfferScreen — Step 5 of 5, "Your offer".
 *
 * Mobile: amount (counts up on arrival) → SpinViewer with walkaround chip +
 *   adjustment hotspots → helper text + tappable PriceLines → fixed dock.
 *   Tapping a line rotates the SpinViewer to the relevant frame and opens a
 *   portalled bottom sheet with an evidence photo + action buttons.
 *
 * Desktop: large sticky SpinViewer on the left; right sticky panel holds the
 *   amount, meta, price lines, inline evidence card, and action buttons.
 *
 * Bottom sheet uses createPortal so `fixed` positioning is never trapped inside
 * the Outlet's CSS-transform context during SellRoot's AnimatePresence.
 */
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Camera, X } from "lucide-react";
import { FlowTopBar } from "../FlowTopBar";
import { SpinViewer, PriceLine, type Hotspot } from "../components";
import { Button } from "@/app/components/ui/button";
import { useSell } from "../SellContext";
import { MOCK_OFFER, fmt } from "../mockData";

import { spinVideo, spinColorFor } from "../spinAssets";

// ─── Static data ───────────────────────────────────────────────────────────────

// Positions are fractions of the 16:9 video image, measured at the angle where
// each spot faces the camera (0° = front three-quarter, 30° = head-on,
// 150° = side, 180° = rear three-quarter). All four paint colors share these
// angles. With real walkaround photos these come from the AI.
const HOTSPOTS: Hotspot[] = [
  { id: "rear-scuff",    angle: 146, x: 0.46, y: 0.47, label: "Rear door scuff",    tone: "negative" },
  { id: "bumper-scrape", angle: 175, x: 0.20, y: 0.65, label: "Bumper curb scrape",  tone: "negative" },
  { id: "tires",         angle: 0,   x: 0.49, y: 0.66, label: "New tires",           tone: "positive" },
  { id: "windshield",    angle: 0,   x: 0.47, y: 0.35, label: "Windshield",          tone: "positive" },
  { id: "paint",         angle: 29,  x: 0.46, y: 0.42, label: "Paint original",      tone: "neutral"  },
];

interface LineConfig {
  id: string;
  label: string;
  subLabel: string;
  amount: number;
  neutral?: boolean;
  hotspotId: string | null;
}

const LINES: LineConfig[] = [
  {
    id: "market",
    label: "Market value",
    subLabel: "1,184 comparable sales nearby",
    amount: MOCK_OFFER.marketValue,
    neutral: true,
    hotspotId: null,
  },
  {
    id: "rear-scuff",
    label: "Rear door scuff",
    subLabel: "Paint touch-up",
    amount: MOCK_OFFER.adjustments[0].amount,
    hotspotId: "rear-scuff",
  },
  {
    id: "bumper-scrape",
    label: "Bumper curb scrape",
    subLabel: "Refinish corner",
    amount: MOCK_OFFER.adjustments[1].amount,
    hotspotId: "bumper-scrape",
  },
  {
    id: "tires",
    label: "New tires, 2 keys & records",
    subLabel: "Nothing to replace",
    amount: MOCK_OFFER.adjustments[2].amount,
    hotspotId: "tires",
  },
  {
    id: "demand",
    label: "Local demand",
    subLabel: "Crossovers selling fast near you",
    amount: MOCK_OFFER.adjustments[3].amount,
    hotspotId: null,
  },
];

const EVIDENCE: Record<string, { headline: string; detail: string }> = {
  "rear-scuff": {
    headline: "Rear door scuff",
    detail: "~3\" scuff on the rear left door — caught in your walkaround photos.",
  },
  "bumper-scrape": {
    headline: "Bumper curb scrape",
    detail: "Light scrape on the lower rear bumper corner.",
  },
  "tires": {
    headline: "New tires, 2 keys & records",
    detail: "All four tires recently replaced. Added back because upkeep shows care.",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function OfferScreen() {
  const navigate = useNavigate();
  const { setNavDirection, vehicleColor } = useSell();
  // The customer's own color; in production these frames come from their walkaround.
  const spin = spinVideo(spinColorFor(vehicleColor));

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Synchronous initialiser avoids a "$0" flash for reduced-motion users
  const [displayAmount, setDisplayAmount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? MOCK_OFFER.total
      : 0;
  });

  // Count-up: 0 → MOCK_OFFER.total over ~900 ms with easeOutCubic
  useEffect(() => {
    if (displayAmount === MOCK_OFFER.total) return;
    const start = performance.now();
    const duration = 900;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayAmount(Math.round(MOCK_OFFER.total * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validUntil = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + MOCK_OFFER.validDays);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, []);

  const selectedEvidence = selectedHotspotId ? (EVIDENCE[selectedHotspotId] ?? null) : null;

  const handleLineSelect = (hotspotId: string) => {
    if (selectedHotspotId === hotspotId) {
      setSelectedHotspotId(null);
      setSheetOpen(false);
    } else {
      setSelectedHotspotId(hotspotId);
      setSheetOpen(true);
    }
  };

  // Clicking a spot on the car selects it and highlights the line that details it
  const handleSpotSelect = (hotspotId: string) => {
    const next = selectedHotspotId === hotspotId ? null : hotspotId;
    setSelectedHotspotId(next);
    setSheetOpen(false);
    if (!next) return;
    requestAnimationFrame(() => {
      const row = [...document.querySelectorAll<HTMLElement>(`[data-offer-line-for="${next}"]`)]
        .find((el) => el.offsetParent !== null);
      row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const closeEvidence = () => {
    setSelectedHotspotId(null);
    setSheetOpen(false);
  };

  // ── Shared JSX pieces ──────────────────────────────────────────────────────

  const amountSection = (
    <div>
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
        Your offer
      </p>
      <p
        className="font-black text-foreground tabular-nums leading-none"
        style={{ fontSize: "clamp(2.625rem, 11vw, 3.375rem)" }}
      >
        {fmt(displayAmount)}
      </p>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
        Locked until {validUntil}&ensp;·&ensp;Condition {MOCK_OFFER.condition}&thinsp;/&thinsp;10
      </p>
    </div>
  );

  const priceLinesList = (
    <div className="divide-y divide-border">
      {LINES.map((line) => (
        <div key={line.id} data-offer-line-for={line.hotspotId ?? undefined}>
        <PriceLine
          label={line.label}
          subLabel={line.subLabel}
          amount={line.amount}
          neutral={line.neutral}
          selected={line.hotspotId !== null && selectedHotspotId === line.hotspotId}
          onTap={line.hotspotId ? () => handleLineSelect(line.hotspotId!) : undefined}
        />
        </div>
      ))}
      {/* Total row */}
      <div className="flex items-center justify-between py-3.5">
        <span className="text-sm font-bold text-foreground">Your offer</span>
        <span className="text-sm font-black text-foreground tabular-nums">
          {fmt(MOCK_OFFER.total)}
        </span>
      </div>
    </div>
  );

  const actionButtons = (
    <>
      <Button
        onClick={() => { setNavDirection("forward"); navigate("/sell/payout"); }}
        className="w-full h-14 text-base font-bold rounded-xl"
      >
        Accept {fmt(MOCK_OFFER.total)}
      </Button>
      <button
        type="button"
        className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors text-center leading-relaxed"
      >
        Compare with a trade-in&ensp;·&ensp;or save for later
      </button>
    </>
  );

  // Desktop: evidence slides in below the price lines in the right panel
  const desktopEvidence = (
    <AnimatePresence>
      {selectedEvidence && (
        <motion.div
          key={selectedHotspotId}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mt-1 rounded-xl border border-border overflow-hidden"
        >
          <div className="bg-muted aspect-video flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground/35" />
          </div>
          <div className="p-3">
            <p className="text-sm font-semibold text-foreground leading-snug mb-0.5">
              {selectedEvidence.headline}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {selectedEvidence.detail}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-9 text-xs font-semibold" onClick={closeEvidence}>
                Retake this photo
              </Button>
              <Button size="sm" className="flex-1 h-9 text-xs font-semibold" onClick={closeEvidence}>
                Looks right
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-card flex flex-col">
      <FlowTopBar />
      <div className="h-[108px] md:h-[49px] shrink-0" aria-hidden="true" />

      {/* Body */}
      <div className="flex-1 lg:max-w-[1120px] lg:mx-auto lg:w-full lg:px-8 lg:py-10 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-start">

        {/* ── Left / mobile main ─────────────────────────────────── */}
        <div
          className="px-5 pt-5 lg:px-0 lg:pt-0"
          style={{ paddingBottom: "calc(9rem + env(safe-area-inset-bottom))" }}
        >
          <div className="md:max-w-[560px] md:mx-auto lg:max-w-none">

            {/* Amount — mobile only */}
            <div className="lg:hidden mb-5">{amountSection}</div>

            {/* SpinViewer with chip */}
            <div className="relative rounded-2xl overflow-hidden">
              <SpinViewer
                video={spin}
                aspectRatio="4:3"
                autoRotate={false}
                hotspots={HOTSPOTS}
                selectedHotspotId={selectedHotspotId}
                onHotspotClick={handleSpotSelect}
              />
              <span className="absolute top-3 left-3 z-10 bg-foreground/75 text-background text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm leading-none pointer-events-none">
                Your car&ensp;·&ensp;from your walkaround
              </span>
            </div>

            {/* Price breakdown — mobile only */}
            <div className="lg:hidden mt-5">
              <p className="text-xs text-muted-foreground mb-1">
                Tap a line or a spot on your car to match them
              </p>
              {priceLinesList}
            </div>

          </div>
        </div>

        {/* ── Right: desktop sticky panel ────────────────────────── */}
        <div className="hidden lg:block lg:shrink-0">
          <div className="sticky top-[4.5rem] flex flex-col gap-4">

            {/* Amount + price breakdown card */}
            <div className="bg-background rounded-2xl border border-border p-5 flex flex-col gap-4">
              {amountSection}
              <div className="border-t border-border" />
              <p className="text-xs text-muted-foreground -mt-2">
                Tap a line or a spot on your car to match them
              </p>
              {priceLinesList}
              {desktopEvidence}
            </div>

            {/* Action card */}
            <div
              className="bg-card rounded-2xl border border-border p-5"
              style={{ boxShadow: "0 8px 24px rgba(16,24,32,0.10)" }}
            >
              {actionButtons}
            </div>

          </div>
        </div>

      </div>

      {/* ── Mobile frosted dock ─────────────────────────────────────── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 "
        style={{
          backdropFilter: "blur(60px) saturate(200%)",
          
          WebkitBackdropFilter: "blur(60px) saturate(200%)",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="px-5 pt-3 md:max-w-[560px] md:mx-auto">
          {actionButtons}
        </div>
      </div>

      {/* ── Mobile evidence bottom sheet (portalled) ─────────────────── */}
      {createPortal(
        <AnimatePresence>
          {sheetOpen && selectedEvidence && (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={() => setSheetOpen(false)}
              />

              <motion.div
                key={selectedHotspotId}
                className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl lg:hidden"
                style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-9 h-1 rounded-full bg-border" />
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSheetOpen(false)}
                  className="absolute top-2.5 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Photo placeholder */}
                <div className="mx-5 mt-2 rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                  <Camera className="w-10 h-10 text-muted-foreground/35" />
                </div>

                {/* Copy + actions */}
                <div className="px-5 mt-4">
                  <p className="text-base font-bold text-foreground leading-snug mb-1">
                    {selectedEvidence.headline}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {selectedEvidence.detail}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full h-12 font-semibold"
                      onClick={closeEvidence}
                    >
                      Retake this photo
                    </Button>
                    <Button
                      className="w-full h-12 font-semibold"
                      onClick={closeEvidence}
                    >
                      Looks right
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
