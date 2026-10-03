import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Check, Calendar } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useSell } from "../SellContext";
import { MOCK_OFFER, fmt } from "../mockData";
import { FlowTopBar } from "../FlowTopBar";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

// ─── Timeline data ────────────────────────────────────────────────────────────

type StepStatus = "done" | "current" | "upcoming";

interface TimelineStep {
  id: string;
  label: string;
  subLabel: string;
  status: StepStatus;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DoneScreen() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { hasLoan, selectedDay, selectedTime } = useSell();

  useEffect(() => { headingRef.current?.focus(); }, []);

  const pickupLine = selectedDay && selectedTime
    ? `Pickup ${selectedDay} · ${selectedTime}`
    : "Pickup confirmed";

  const STEPS: TimelineStep[] = [
    {
      id: "offer",
      label: "Offer accepted",
      subLabel: `${fmt(MOCK_OFFER.total)} · locked`,
      status: "done",
    },
    {
      id: "bos",
      label: "Bill of sale signed",
      subLabel: "Copy sent to your email",
      status: "done",
    },
    {
      id: "pickup",
      label: "Pickup and 60-second condition match",
      subLabel: "We text you when the driver is on the way",
      status: "current",
    },
    {
      id: "payment",
      label: "Payment sent",
      subLabel: "Instant to Checking ••4417",
      status: "upcoming",
    },
  ];

  return (
    <div className="min-h-dvh bg-card flex flex-col">
      <FlowTopBar />
      <div className="h-[108px] md:h-[49px] shrink-0" aria-hidden="true" />

      <div className="flex-1 w-full max-w-[560px] mx-auto px-5 pt-10 pb-16">

        {/* ── Success hero ──────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col items-center text-center mb-10"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Icon circle */}
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ background: "color-mix(in srgb, var(--axio-green) 13%, transparent)" }}
            initial={reduced ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05, type: "spring", stiffness: 260, damping: 22 }}
          >
            <Check
              className="w-9 h-9 stroke-[2.5]"
              style={{ color: "var(--axio-green)" }}
            />
          </motion.div>

          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-[28px] font-black text-foreground leading-tight mb-2 focus-visible:outline-none"
          >
            {"You're all set"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {pickupLine}
          </p>
        </motion.div>

        {/* ── Timeline ──────────────────────────────────────────────────── */}
        <motion.div
          className="mb-8"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        >
          {STEPS.map((step, idx) => {
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={step.id} className="flex gap-4">
                {/* Connector column */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
                  <StepDot status={step.status} />
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 mt-0.5"
                      style={{
                        minHeight: 32,
                        background: step.status === "done"
                          ? "var(--axio-green)"
                          : "var(--border)",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={cn("min-w-0", isLast ? "pb-0" : "pb-6")}>
                  <p
                    className={cn(
                      "text-sm font-bold leading-snug",
                      step.status === "upcoming"
                        ? "text-muted-foreground"
                        : "text-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      "text-xs leading-relaxed mt-0.5",
                      "text-muted-foreground",
                    )}
                  >
                    {step.subLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-3"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28, ease: "easeOut" }}
        >
          <Button
            variant="outline"
            className="w-full h-12 font-semibold gap-2"
            onClick={() => {/* stub — calendar add */}}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            Add pickup to calendar
          </Button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full h-12 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Back to home
          </button>
        </motion.div>

      </div>
    </div>
  );
}

// ─── Step dot ─────────────────────────────────────────────────────────────────

function StepDot({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "var(--axio-green)" }}
      >
        <Check className="w-4 h-4 text-white stroke-[2.5]" />
      </div>
    );
  }

  if (status === "current") {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2"
        style={{ borderColor: "var(--primary)", background: "transparent" }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "var(--primary)" }}
        />
      </div>
    );
  }

  // upcoming
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-border"
      style={{ background: "transparent" }}
    >
      <div className="w-2 h-2 rounded-full bg-border" />
    </div>
  );
}
