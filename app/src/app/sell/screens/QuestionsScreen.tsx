/**
 * QuestionsScreen — Step 2 of 5 "Quick Questions".
 *
 * One question at a time. 4 progress dots above each question.
 * Tapping any OptionButton selects it, commits to context, then after 250 ms
 * either advances to the next question or navigates to /sell/walkaround-intro.
 *
 * Back button: returns to the previous question; only leaves the screen when
 * the user backs out of question 1.
 *
 * Layout:
 *   Mobile / tablet : single centered column (max 560 px); EstimateBar pinned
 *                     in a frosted bottom dock.
 *   Desktop         : same 560 px centered column; dock becomes an inline
 *                     block below the options.
 *
 * Animation: horizontal slide via motion/react (fade-only when prefers-reduced-motion).
 */
import { type RefObject, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { InfoIcon } from "lucide-react";
import { useSell } from "../SellContext";
import { FlowTopBar } from "../components/FlowTopBar";
import { EstimateBar } from "../components/EstimateBar";
import { OptionButton } from "../components/OptionButton";
import { MOCK_ESTIMATES } from "../mockData";
import { cn } from "@/app/components/ui/utils";

// ─── Question data ────────────────────────────────────────────────────────────

type DrivableVal  = "yes" | "issues" | "no";
type FinancingVal = "none" | "loan" | "lease";
type ConditionVal = "clean" | "damage" | "mods";
type HistoryVal   = "no" | "yes" | "unsure";
type AnyAnswer    = DrivableVal | FinancingVal | ConditionVal | HistoryVal;

interface QuestionDef {
  q: string;
  why: string;
  options: Array<{ value: AnyAnswer; title: string; description?: string }>;
}

const QUESTIONS: QuestionDef[] = [
  {
    q: "Does it start and drive?",
    why: "If it doesn't drive, we send a flatbed. It still gets an offer.",
    options: [
      { value: "yes",    title: "Yes",          description: "Starts, drives and stops normally" },
      { value: "issues", title: "It has issues", description: "Runs, but something isn't right" },
      { value: "no",     title: "No",            description: "Won't start or can't be driven" },
    ],
  },
  {
    q: "Is there a loan or lease on it?",
    why: "We pay your lender directly. You'll only need their name after you accept.",
    options: [
      { value: "none",  title: "No, I own it outright" },
      { value: "loan",  title: "Yes, a loan" },
      { value: "lease", title: "Yes, a lease" },
    ],
  },
  {
    q: "Any damage or changes we should know about?",
    why: "Telling us now means we photograph it properly, so there are no surprises at pickup.",
    options: [
      { value: "clean",  title: "No",                  description: "Nothing beyond normal wear" },
      { value: "damage", title: "Yes, damage",          description: "Dents, cracks, warning lights" },
      { value: "mods",   title: "Yes, modifications",   description: "Wheels, suspension, tint, exhaust" },
    ],
  },
  {
    q: "Any flood, fire or salvage history?",
    why: "Your history report shows none. This just confirms it.",
    options: [
      { value: "no",     title: "No" },
      { value: "yes",    title: "Yes" },
      { value: "unsure", title: "Not sure", description: "We'll check the title records for you" },
    ],
  },
];

// ─── Animation ────────────────────────────────────────────────────────────────

const SLIDE_X = 48;
const SLIDE_X_EXIT = 24;

const makeVariants = (reduced: boolean) => ({
  enter: (dir: "forward" | "back") => ({
    x: reduced ? 0 : dir === "forward" ? SLIDE_X : -SLIDE_X,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: "forward" | "back") => ({
    x: reduced ? 0 : dir === "forward" ? -SLIDE_X_EXIT : SLIDE_X_EXIT,
    opacity: 0,
  }),
});

// ─── Component ────────────────────────────────────────────────────────────────

export function QuestionsScreen() {
  const navigate = useNavigate();
  const {
    drivable, setDrivable,
    financing, setFinancing,
    condition, setCondition,
    history, setHistory,
    setNavDirection,
  } = useSell();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [pending, setPending] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, [step]);
  const reduced = useReducedMotion();
  const variants = makeVariants(!!reduced);

  const estimate = MOCK_ESTIMATES.afterVehicle;

  // Current answer for this step (to show pre-selected state on back-nav)
  const currentAnswer: AnyAnswer | null =
    step === 0 ? drivable
    : step === 1 ? financing
    : step === 2 ? condition
    : history;

  // Commit answer to shared context
  const saveAnswer = (s: number, value: AnyAnswer) => {
    if (s === 0) setDrivable(value as DrivableVal);
    else if (s === 1) setFinancing(value as FinancingVal);
    else if (s === 2) setCondition(value as ConditionVal);
    else              setHistory(value as HistoryVal);
  };

  const handleAnswer = (value: AnyAnswer) => {
    if (pending) return;
    setPending(true);
    saveAnswer(step, value);

    setTimeout(() => {
      setPending(false);
      if (step < QUESTIONS.length - 1) {
        setDirection("forward");
        setStep((s) => s + 1);
      } else {
        setNavDirection("forward");
        navigate("/sell/walkaround-intro");
      }
    }, 250);
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection("back");
      setStep((s) => s - 1);
    } else {
      setNavDirection("back");
      navigate("/sell/vehicle");
    }
  };

  return (
    <div className="min-h-dvh bg-card flex flex-col">
      {/* Use prop-based FlowTopBar directly so back logic can be overridden */}
      <FlowTopBar
        step={1}
        totalSteps={3}
        stepName="Your car"
        onBack={handleBack}
        onExit={() => navigate("/")}
      />
      <div className="h-[108px] md:h-[49px] shrink-0" aria-hidden="true" />

      {/* ── Scrollable content ────────────────────────────────────── */}
      <div className="flex-1 w-full max-w-[560px] mx-auto px-5 pt-8 pb-40 lg:pb-12">

        {/* Progress dots — static (not animated with question) */}
        <ProgressDots total={QUESTIONS.length} current={step} />

        {/* Animated question panel */}
        <div className="mt-7 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <QuestionPanel
                question={QUESTIONS[step]}
                selectedValue={currentAnswer}
                pending={pending}
                onAnswer={handleAnswer}
                headingRef={headingRef}
              />

              {/* EstimateBar — inline on desktop, hidden on mobile (fixed dock below) */}
              <div className="hidden lg:block mt-7">
                <EstimateBar low={estimate.low} high={estimate.high} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile / tablet frosted dock with EstimateBar ─────────── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: "transparent", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)" }}
      >
        <div
          className="px-5 py-3 md:max-w-[560px] md:mx-auto"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
        >
          <EstimateBar low={estimate.low} high={estimate.high} />
        </div>
      </div>
    </div>
  );
}

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={current + 1} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all duration-300",
            i === current
              ? "w-6 h-2 bg-primary"
              : i < current
              ? "w-2 h-2 bg-primary/35"
              : "w-2 h-2 bg-border",
          )}
        />
      ))}
      <span className="sr-only">
        Question {current + 1} of {total}
      </span>
    </div>
  );
}

// ─── Question panel ───────────────────────────────────────────────────────────

function QuestionPanel({
  question,
  selectedValue,
  pending,
  onAnswer,
  headingRef,
}: {
  question: QuestionDef;
  selectedValue: AnyAnswer | null;
  pending: boolean;
  onAnswer: (v: AnyAnswer) => void;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-foreground leading-tight mb-6 focus-visible:outline-none"
      >
        {question.q}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <OptionButton
            key={opt.value}
            title={opt.title}
            description={opt.description}
            selected={selectedValue === opt.value}
            onClick={() => onAnswer(opt.value)}
            disabled={pending}
          />
        ))}
      </div>

      {/* "Why we ask" hint */}
      <div className="flex items-start gap-2 mt-5">
        <InfoIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {question.why}
        </p>
      </div>
    </div>
  );
}
