import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Building2, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { FlowTopBar } from "../FlowTopBar";
import { PriceLine } from "../components";
import { Button } from "@/app/components/ui/button";
import { useSell } from "../SellContext";
import {
  MOCK_OFFER,
  LOAN_PAYOFF,
  PAYOUT_TO_CUSTOMER,
  PICKUP_DAYS,
  TIME_WINDOWS,
  fmt,
} from "../mockData";
import { cn } from "@/app/components/ui/utils";

type BankState = "idle" | "connecting" | "connected";

export function PayoutScreen() {
  const navigate = useNavigate();
  const { hasLoan, setPayoutMethod, setSelectedDay, setSelectedTime, setNavDirection } = useSell();

  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [bankState, setBankState] = useState<BankState>("idle");
  const [day, setDay] = useState(PICKUP_DAYS[0]);
  const [time, setTime] = useState(TIME_WINDOWS[1]);

  useEffect(() => { headingRef.current?.focus(); }, []);

  // null means question wasn't answered — default to showing loan for safety
  const showLoan = hasLoan !== false;
  const netAmount = showLoan ? PAYOUT_TO_CUSTOMER : MOCK_OFFER.total;
  const canConfirm = bankState === "connected";

  useEffect(() => { setSelectedDay(day); }, [day, setSelectedDay]);
  useEffect(() => { setSelectedTime(time); }, [time, setSelectedTime]);

  const handleBankConnect = () => {
    if (bankState !== "idle") return;
    setBankState("connecting");
    setTimeout(() => {
      setBankState("connected");
      setPayoutMethod("bank");
    }, 700);
  };

  const handleConfirm = () => {
    setNavDirection("forward");
    navigate("/sell/done");
  };

  // ── Section: payout breakdown card ──────────────────────────────────────────

  const payoutCard = (
    <div className="bg-background rounded-2xl border border-border overflow-hidden">
      <div className="divide-y divide-border px-4">
        <PriceLine
          label="Your offer"
          subLabel="Locked for 7 days"
          amount={MOCK_OFFER.total}
          neutral
        />
        {showLoan && (
          <PriceLine
            label="Loan payoff"
            subLabel="Paid straight to your lender"
            amount={-LOAN_PAYOFF}
          />
        )}
        {/* "You receive" — large display type */}
        <div className="py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-foreground shrink-0">You receive</span>
            <span
              className="font-black text-foreground tabular-nums leading-none"
              style={{ fontSize: "clamp(1.75rem, 7vw, 2.25rem)" }}
            >
              {fmt(netAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Section: bank connect row ────────────────────────────────────────────────

  const bankRow = (
    <button
      type="button"
      onClick={handleBankConnect}
      disabled={bankState !== "idle"}
      aria-label={bankState === "idle" ? "Connect your bank" : undefined}
      className={cn(
        "w-full text-left rounded-2xl border-2 transition-all duration-300",
        bankState === "idle" &&
          "border-dashed border-border hover:border-primary/50 active:scale-[0.99]",
        bankState === "connecting" &&
          "border-dashed border-border opacity-70 cursor-default",
        bankState === "connected" &&
          "border-solid cursor-default",
      )}
      style={
        bankState === "connected"
          ? { borderColor: "var(--axio-green)" }
          : undefined
      }
    >
      <div className="px-4 py-4 flex items-center gap-3">
        <AnimatePresence mode="wait" initial={false}>
          {bankState === "idle" && (
            <motion.div
              key="idle"
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
              className="contents"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  Connect your bank
                </p>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                  Secure sign-in, no account numbers to type
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </motion.div>
          )}

          {bankState === "connecting" && (
            <motion.div
              key="connecting"
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
              className="contents"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-foreground/50 animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  Connecting…
                </p>
              </div>
            </motion.div>
          )}

          {bankState === "connected" && (
            <motion.div
              key="connected"
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
              className="contents"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "color-mix(in srgb, var(--axio-green) 14%, transparent)" }}
              >
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: "var(--axio-green)" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  Checking ••4417 connected ✓
                </p>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                  Instant payout at pickup
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );

  // ── Section: day picker ──────────────────────────────────────────────────────

  const daySection = (
    <div>
      <p className="text-sm font-bold text-foreground mb-3">Pickup day</p>
      <div
        className="flex gap-2.5 overflow-x-auto pb-1 -mx-5 px-5 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Pickup day"
      >
        {PICKUP_DAYS.map((d) => {
          const commaIdx = d.indexOf(", ");
          const weekday = d.slice(0, commaIdx);
          const date = d.slice(commaIdx + 2);
          const selected = day === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              aria-pressed={selected}
              aria-label={d}
              className={cn(
                "shrink-0 flex flex-col items-center justify-center gap-1 rounded-xl border-2 transition-all",
                selected
                  ? "bg-foreground border-foreground text-background"
                  : "bg-background border-border text-foreground hover:border-foreground/40 active:scale-[0.97]",
              )}
              style={{ width: 68, height: 72 }}
            >
              <span
                className={cn(
                  "text-[11px] font-semibold leading-none",
                  selected ? "text-background/70" : "text-muted-foreground",
                )}
              >
                {weekday}
              </span>
              <span className="text-sm font-bold leading-snug text-center px-1">
                {date}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── Section: time picker ─────────────────────────────────────────────────────

  const timeSection = (
    <div>
      <p className="text-sm font-bold text-foreground mb-3">Time</p>
      <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="Pickup time">
        {TIME_WINDOWS.map((t) => {
          const selected = time === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              aria-pressed={selected}
              className={cn(
                "h-12 rounded-xl border-2 text-sm font-semibold transition-all",
                selected
                  ? "bg-foreground border-foreground text-background"
                  : "bg-background border-border text-foreground hover:border-foreground/40 active:scale-[0.97]",
              )}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── Section: muted note ──────────────────────────────────────────────────────

  const mutedNote = (
    <p className="text-xs text-muted-foreground leading-relaxed">
      Pickup at the address on your registration. You can change it on the next screen.
    </p>
  );

  // ── CTA button ───────────────────────────────────────────────────────────────

  const confirmButton = (
    <Button
      onClick={canConfirm ? handleConfirm : undefined}
      disabled={!canConfirm}
      className="w-full h-14 text-base font-bold rounded-xl transition-all"
    >
      {canConfirm ? "Confirm sale & pickup" : "Connect your bank to continue"}
    </Button>
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-card flex flex-col">
      <FlowTopBar />
      <div className="h-[108px] md:h-[49px] shrink-0" aria-hidden="true" />

      {/* Body */}
      <div className="flex-1 lg:max-w-[1120px] lg:mx-auto lg:w-full lg:px-8 lg:py-10 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-start">

        {/* ── Left / mobile main ───────────────────────────────────────── */}
        <div
          className="px-5 pt-6 lg:px-0 lg:pt-0"
          style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
        >
          <div className="md:max-w-[560px] md:mx-auto lg:max-w-none">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl font-black text-foreground mb-5 focus-visible:outline-none"
            >
              How you'll get paid
            </h2>

            <div className="flex flex-col gap-3">
              {payoutCard}
              {bankRow}
            </div>

            {/* Day + time shown inline on mobile/tablet only */}
            <div className="lg:hidden mt-7 flex flex-col gap-6">
              {daySection}
              {timeSection}
              {mutedNote}
            </div>
          </div>
        </div>

        {/* ── Right: desktop sticky panel ──────────────────────────────── */}
        <div className="hidden lg:block lg:shrink-0">
          <div className="sticky top-[4.5rem] flex flex-col gap-4">
            {/* Pickup + time card */}
            <div className="bg-background rounded-2xl border border-border p-5 flex flex-col gap-5">
              {daySection}
              <div className="border-t border-border" />
              {timeSection}
              <div className="border-t border-border" />
              {mutedNote}
            </div>

            {/* Confirm button card */}
            <div
              className="bg-card rounded-2xl border border-border p-5"
              style={{ boxShadow: "0 8px 24px rgba(16,24,32,0.10)" }}
            >
              {confirmButton}
            </div>
          </div>
        </div>

      </div>

      {/* ── Mobile frosted dock ──────────────────────────────────────────────── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 "
        style={{
          backdropFilter: "blur(60px) saturate(200%)",
          
          WebkitBackdropFilter: "blur(60px) saturate(200%)",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="px-5 pt-3 md:max-w-[560px] md:mx-auto">
          {confirmButton}
        </div>
      </div>
    </div>
  );
}
