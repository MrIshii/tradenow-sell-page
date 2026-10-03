import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Circle, X } from "lucide-react";
import { useSell } from "../SellContext";

const ROWS = [
  "Comparing 1,184 sales within 150 miles",
  "Adjusting for 31,080 miles",
  "Applying condition from 38 photos",
  "Checking local demand",
];

const TICK_MS = 550;

// Synchronous read for the useState initializer — avoids a flash on first paint
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PricingScreen() {
  const navigate = useNavigate();
  const { setNavDirection } = useSell();
  const reduced = useReducedMotion() ?? prefersReduced();

  // Start fully checked for reduced-motion users so there is never an unchecked flash
  const [checkedCount, setCheckedCount] = useState(() =>
    prefersReduced() ? ROWS.length : 0
  );

  useEffect(() => {
    if (reduced) {
      setCheckedCount(ROWS.length);
      const t = setTimeout(() => {
        setNavDirection("forward");
        navigate("/sell/offer", { replace: true });
      }, 1000);
      return () => clearTimeout(t);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    ROWS.forEach((_, i) => {
      timers.push(setTimeout(() => setCheckedCount(i + 1), TICK_MS * (i + 1)));
    });

    // Navigate one tick after the last row settles
    timers.push(
      setTimeout(() => {
        setNavDirection("forward");
        navigate("/sell/offer", { replace: true });
      }, TICK_MS * (ROWS.length + 1))
    );

    return () => timers.forEach(clearTimeout);
  }, [navigate, setNavDirection, reduced]);

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6">
      {/* X — leave the sell flow, same spot as the step header's X */}
      <div className="fixed top-[59px] md:top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-center justify-end h-12 max-w-[1120px] mx-auto pr-1">
          <button
            onClick={() => navigate("/")}
            aria-label="Exit"
            className="pointer-events-auto flex items-center justify-center gap-1 h-10 min-w-10 md:pl-3 md:pr-2 rounded-xl text-foreground hover:bg-black/[0.05] transition-colors"
          >
            <span className="hidden md:inline text-[15px] font-semibold">Exit</span>
            <X className="w-5 h-5 shrink-0" strokeWidth={2.25} />
          </button>
        </div>
      </div>
      <div className="w-full max-w-[300px]">
        <h2 className="text-2xl font-black text-foreground text-center mb-8 leading-tight">
          Calculating your offer
        </h2>

        <div className="flex flex-col gap-[18px]">
          {ROWS.map((label, i) => {
            const checked = i < checkedCount;
            return (
              <motion.div
                key={label}
                className="flex items-center gap-3"
                initial={false}
                animate={{ opacity: checked ? 1 : 0.28 }}
                transition={reduced ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
              >
                <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
                  {checked ? (
                    <motion.div
                      initial={reduced ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 24 }}
                    >
                      <CheckCircle2
                        className="w-[18px] h-[18px]"
                        style={{ color: "var(--axio-green, #2F6F3E)" }}
                      />
                    </motion.div>
                  ) : (
                    <Circle className="w-[18px] h-[18px] text-muted-foreground/40" />
                  )}
                </div>

                <span className="text-sm font-medium text-foreground leading-snug">
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
