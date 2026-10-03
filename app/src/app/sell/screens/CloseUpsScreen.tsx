/**
 * CloseUpsScreen — Step 3 of 5 "Close-ups".
 *
 * A checklist of required shots. The currently highlighted row is the first
 * incomplete shot; any row can also be tapped to jump to it. Tapping the
 * ActionDock CTA opens a full-screen CaptureView portal with a translucent
 * outline guide for that shot and a shutter button.
 *
 * Shots are built dynamically:
 *   Base (5): Odometer, Dashboard, Front-left tire, Driver seat, Both keys.
 *   +1 conditional: "The damage you mentioned" if question 3 → "damage";
 *                   "Your modifications" if question 3 → "mods".
 *
 * Desktop: left column = checklist; right column (360 px, sticky) = guide
 *   preview card + ActionDock/CTA.
 * Mobile: full-width checklist, ActionDock fixed to bottom.
 */
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { Camera, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSell } from "../SellContext";
import { DEMO_CAMERA } from "./WalkaroundScreen";
import { FlowTopBar } from "../FlowTopBar";
import { ActionDock } from "../components/ActionDock";
import { cn } from "@/app/components/ui/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShotDef {
  id: string;
  title: string;
  hint: string;
  tag?: { label: string; variant: "success" | "primary" };
}

type CapturePhase = "preview" | "flash" | "saved";

// ─── Shot data ────────────────────────────────────────────────────────────────

function buildShots(condition: string | null): ShotDef[] {
  const base: ShotDef[] = [
    { id: "odometer",    title: "Odometer",          hint: "Engine on, so warning lights show" },
    { id: "dashboard",   title: "Dashboard",          hint: "All warning lights" },
    { id: "tire-fl",     title: "Front-left tire",    hint: "Tread depth" },
    { id: "driver-seat", title: "Driver seat",        hint: "Wear and stains" },
    {
      id: "keys", title: "Both keys", hint: "",
      tag: { label: "+$150", variant: "success" },
    },
  ];
  if (condition === "damage") {
    base.push({
      id: "damage", title: "The damage you mentioned", hint: "",
      tag: { label: "You told us", variant: "primary" },
    });
  } else if (condition === "mods") {
    base.push({
      id: "mods", title: "Your modifications", hint: "",
      tag: { label: "You told us", variant: "primary" },
    });
  }
  return base;
}

// ─── Guide shapes (SVG, viewBox 0 0 100 178) ─────────────────────────────────

const S = "rgba(255,255,255,0.75)";   // stroke
const F = "rgba(255,255,255,0.05)";   // fill
const D = "2 1.5";                    // dasharray

const GUIDE_SHAPES: Record<string, ReactNode> = {
  odometer: (
    <>
      <ellipse cx="50" cy="93" rx="38" ry="22"
               fill={F} stroke={S} strokeWidth="0.6" strokeDasharray={D} />
      {/* Speedo arc */}
      <path d="M 20 103 A 32 32 0 0 1 80 103"
            fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
      {/* Needle */}
      <line x1="50" y1="93" x2="68" y2="84"
            stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
    </>
  ),
  dashboard: (
    <>
      <rect x="6" y="74" width="88" height="30" rx="3"
            fill={F} stroke={S} strokeWidth="0.6" strokeDasharray={D} />
      {[20, 32, 44, 56, 68, 80].map((x) => (
        <circle key={x} cx={x} cy="89" r="2.5"
                fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.35" />
      ))}
    </>
  ),
  "tire-fl": (
    <>
      <circle cx="50" cy="90" r="37"
              fill="rgba(255,255,255,0.04)" stroke={S}
              strokeWidth="0.6" strokeDasharray={D} />
      <circle cx="50" cy="90" r="16"
              fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
      {[-36, -18, 0, 18, 36].map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return (
          <line key={deg}
                x1={50 + 17 * Math.cos(a)} y1={90 + 17 * Math.sin(a)}
                x2={50 + 36 * Math.cos(a)} y2={90 + 36 * Math.sin(a)}
                stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        );
      })}
    </>
  ),
  "driver-seat": (
    <rect x="15" y="28" width="70" height="122" rx="8"
          fill="rgba(255,255,255,0.04)" stroke={S}
          strokeWidth="0.6" strokeDasharray={D} />
  ),
  keys: (
    <>
      <rect x="8"  y="70" width="37" height="38" rx="5"
            fill={F} stroke={S} strokeWidth="0.6" strokeDasharray={D} />
      <rect x="55" y="70" width="37" height="38" rx="5"
            fill={F} stroke={S} strokeWidth="0.6" strokeDasharray={D} />
      {/* Blade stubs */}
      <line x1="26.5" y1="108" x2="26.5" y2="116"
            stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
      <line x1="73.5" y1="108" x2="73.5" y2="116"
            stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
    </>
  ),
  damage: (
    <>
      <circle cx="50" cy="90" r="42"
              fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.65)"
              strokeWidth="0.6" strokeDasharray="3 2" />
      <line x1="44" y1="84" x2="56" y2="96"
            stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" />
      <line x1="56" y1="84" x2="44" y2="96"
            stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" />
    </>
  ),
  mods: (
    <circle cx="50" cy="90" r="42"
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.6" strokeDasharray="3 2" />
  ),
};

const GUIDE_LABELS: Record<string, string> = {
  odometer:    "Frame the whole instrument cluster",
  dashboard:   "Capture all visible warning lights",
  "tire-fl":   "Show tread depth from straight ahead",
  "driver-seat": "Step back — capture the full seat",
  keys:        "Place both keys flat, side by side",
  damage:      "Get close — focus on the damage",
  mods:        "Show the modification clearly",
};

// ─── Placeholder frame (for simulated camera) ────────────────────────────────

const PLACEHOLDER_FRAME =
  "https://images.unsplash.com/photo-1712815780855-5cce5961f8ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// Sample close-up photos (the car used in the demo), hosted in the Trade Now media
// library on Solid#. `full` is the simulated camera view while taking the shot;
// `thumb` is the checklist thumbnail once it's taken.
const ASSETS = "https://solid-tenant-assets.nyc3.digitaloceanspaces.com/company_78/uploads";
const SHOT_PHOTOS: Record<string, { full: string; thumb: string }> = {
  odometer:      { full: `${ASSETS}/ast_403bcc08/tradenow-closeup-odometer.jpg`,    thumb: `${ASSETS}/ast_7f098b68/tradenow-closeup-odometer-thumb.jpg` },
  dashboard:     { full: `${ASSETS}/ast_5f7fdbe6/tradenow-closeup-dashboard.jpg`,   thumb: `${ASSETS}/ast_b9fbc092/tradenow-closeup-dashboard-thumb.jpg` },
  "tire-fl":     { full: `${ASSETS}/ast_2aa2eac0/tradenow-closeup-tire-fl.jpg`,     thumb: `${ASSETS}/ast_38942484/tradenow-closeup-tire-fl-thumb.jpg` },
  "driver-seat": { full: `${ASSETS}/ast_64443c3e/tradenow-closeup-driver-seat.jpg`, thumb: `${ASSETS}/ast_49904d78/tradenow-closeup-driver-seat-thumb.jpg` },
  keys:          { full: `${ASSETS}/ast_1801640c/tradenow-closeup-keys.jpg`,        thumb: `${ASSETS}/ast_1fdefa6e/tradenow-closeup-keys-thumb.jpg` },
  // "The damage you mentioned" (hosted with the GitHub demo page)
  damage:        { full: "https://mrishii.github.io/tradenow-sell-page/media/tradenow-closeup-damage.jpg", thumb: "https://mrishii.github.io/tradenow-sell-page/media/tradenow-closeup-damage-thumb.jpg" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CloseUpsScreen() {
  const navigate = useNavigate();
  const {
    condition,
    closeupPhotos,
    toggleCloseupPhoto,
    setNavDirection,
  } = useSell();

  const shots = useMemo(() => buildShots(condition), [condition]);

  // Desktop: the page always opens with no photos taken. Phones are unchanged.
  const [freshDesktopStart] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  useLayoutEffect(() => {
    if (freshDesktopStart) closeupPhotos.forEach((id) => toggleCloseupPhoto(id));
  }, []);  // eslint-disable-line

  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (freshDesktopStart) return 0;
    const first = shots.findIndex((s) => !closeupPhotos.has(s.id));
    return first !== -1 ? first : 0;
  });
  const [captureOpen, setCaptureOpen] = useState(false);

  const allDone = shots.every((s) => closeupPhotos.has(s.id));
  const currentShot = shots[selectedIndex];

  const goToConfirm = () => {
    setNavDirection("forward");
    navigate("/sell/confirm");
  };

  const onCapture = () => {
    const shotId = shots[selectedIndex].id;
    if (!closeupPhotos.has(shotId)) toggleCloseupPhoto(shotId);
    setCaptureOpen(false);

    // Advance to the next incomplete shot
    setSelectedIndex((prev) => {
      const captured = new Set([...closeupPhotos, shotId]);
      const next = shots.findIndex((s, i) => i > prev && !captured.has(s.id));
      if (next !== -1) return next;
      const anyNext = shots.findIndex((s) => !captured.has(s.id));
      return anyNext !== -1 ? anyNext : prev;
    });
  };

  const primaryAction = allDone
    ? { label: "Continue", onClick: goToConfirm }
    : {
        label: `Take photo: ${currentShot.title}`,
        onClick: () => setCaptureOpen(true),
      };

  return (
    <>
      <div className="min-h-dvh bg-card flex flex-col">
        <FlowTopBar />
        <div className="h-[108px] md:h-[49px] shrink-0" aria-hidden="true" />

        {/* ── Two-column grid on desktop, stacked on mobile ─────────── */}
        <div className="flex-1 w-full lg:max-w-[1120px] lg:mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:px-8 lg:py-10 lg:items-start">

          {/* ── LEFT: checklist ───────────────────────────────────────── */}
          <div className="px-5 pt-6 pb-36 lg:px-0 lg:pt-0 lg:pb-0">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              A few quick photos
            </h2>
            <p className="text-[15px] text-muted-foreground mt-1.5 mb-6 leading-relaxed">
              An outline on screen shows exactly how to frame each shot.
            </p>

            <div className="flex flex-col gap-2.5">
              {shots.map((shot, i) => (
                <ShotRow
                  key={shot.id}
                  shot={shot}
                  isDone={closeupPhotos.has(shot.id)}
                  isCurrent={i === selectedIndex && !closeupPhotos.has(shot.id)}
                  onClick={() => {
                    setSelectedIndex(i);
                    // Phones: tapping a photo opens the camera for it right away.
                    // Desktop: tapping shows its framing guide on the right.
                    if (!window.matchMedia("(min-width: 1024px)").matches) setCaptureOpen(true);
                  }}
                />
              ))}
            </div>

            {/* Desktop "Continue" when all done */}
            {allDone && (
              <div className="hidden lg:block mt-6">
                <button
                  onClick={goToConfirm}
                  className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-xl text-base hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: guide preview + CTA (desktop only) ─────────────── */}
          <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-[4.5rem]">
            <GuidePreview shot={currentShot} />
            {!allDone && (
              <ActionDock primary={primaryAction} />
            )}
          </div>

        </div>
      </div>

      {/* ── Mobile ActionDock ────────────────────────────────────────── */}
      <div className="lg:hidden">
        <ActionDock primary={primaryAction} />
      </div>

      {/* ── Capture view portal ──────────────────────────────────────── */}
      {captureOpen && (
        <CaptureView
          shot={currentShot}
          onCapture={onCapture}
          onClose={() => setCaptureOpen(false)}
        />
      )}
    </>
  );
}

// ─── Shot row ─────────────────────────────────────────────────────────────────

function ShotRow({
  shot,
  isDone,
  isCurrent,
  onClick,
}: {
  shot: ShotDef;
  isDone: boolean;
  isCurrent: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-2xl border-2 transition-all text-left",
        isDone
          ? "border-[var(--axio-green)]/30 bg-[var(--axio-green)]/5"
          : isCurrent
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-background hover:border-primary/30 active:border-primary/60",
      )}
    >
      {/* 52px thumbnail */}
      <div
        className={cn(
          "w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0",
          isDone
            ? "bg-[var(--axio-green)]/12"
            : isCurrent
            ? "bg-primary/10"
            : "bg-muted/50",
        )}
      >
        {isDone && SHOT_PHOTOS[shot.id] ? (
          <span className="relative w-full h-full rounded-xl overflow-hidden">
            <img src={SHOT_PHOTOS[shot.id].thumb} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            <CheckCircle2
              className="absolute right-0.5 bottom-0.5 w-[18px] h-[18px] rounded-full bg-white"
              style={{ color: "var(--axio-green)" }}
            />
          </span>
        ) : isDone ? (
          <CheckCircle2
            className="w-[26px] h-[26px]"
            style={{ color: "var(--axio-green)" }}
          />
        ) : (
          <Camera
            className={cn(
              "w-[26px] h-[26px]",
              isCurrent ? "text-primary" : "text-muted-foreground",
            )}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-1">
        <p className="text-sm font-bold text-foreground leading-snug">
          {shot.title}
        </p>
        {shot.hint && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            {shot.hint}
          </p>
        )}
        {/* Finished: tap the row to take it again */}
        {isDone && (
          <p className="text-xs font-bold text-primary mt-1 leading-snug">Tap to retake</p>
        )}
      </div>

      {/* Optional tag */}
      {shot.tag && (
        <div
          className={cn(
            "shrink-0 mt-1 px-2.5 py-1 rounded-full text-[11px] font-bold",
            shot.tag.variant === "success"
              ? "bg-[var(--axio-green)]/12 text-[var(--axio-green)]"
              : "bg-primary/10 text-primary",
          )}
        >
          {shot.tag.label}
        </div>
      )}
    </button>
  );
}

// ─── Guide preview card (desktop right column) ────────────────────────────────

function GuidePreview({ shot }: { shot: ShotDef }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-border"
      style={{ boxShadow: "0 8px 24px rgba(16,24,32,0.10)" }}
    >
      {/* Dark camera-like preview */}
      <div
        className="w-full aspect-[3/4] flex items-center justify-center relative"
        style={{
          background: "linear-gradient(160deg, #0D1620 0%, #111820 100%)",
        }}
      >
        {/* The shot's sample photo, under the frame outline */}
        <img
          src={SHOT_PHOTOS[shot.id]?.full ?? PLACEHOLDER_FRAME}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <svg
          viewBox="0 0 100 178"
          className="relative w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {GUIDE_SHAPES[shot.id]}
        </svg>
        {/* Corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((corner) => {
          const s: CSSProperties = {
            position: "absolute",
            width: 22,
            height: 22,
          };
          const b = "2px solid rgba(255,255,255,0.55)";
          if (corner === "tl") { s.top = 16; s.left = 16; s.borderTop = b; s.borderLeft = b; }
          if (corner === "tr") { s.top = 16; s.right = 16; s.borderTop = b; s.borderRight = b; }
          if (corner === "bl") { s.bottom = 16; s.left = 16; s.borderBottom = b; s.borderLeft = b; }
          if (corner === "br") { s.bottom = 16; s.right = 16; s.borderBottom = b; s.borderRight = b; }
          return <div key={corner} style={s} />;
        })}
        {/* Guide label */}
        <div
          className="absolute bottom-3 inset-x-3 flex justify-center"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="rounded-full px-3 py-1.5 text-center"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="text-white/75 text-xs font-semibold">
              {GUIDE_LABELS[shot.id]}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-sm font-bold text-foreground">{shot.title}</p>
        {shot.hint && (
          <p className="text-xs text-muted-foreground mt-0.5">{shot.hint}</p>
        )}
        {shot.tag && (
          <div
            className={cn(
              "inline-flex mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold",
              shot.tag.variant === "success"
                ? "bg-[var(--axio-green)]/12 text-[var(--axio-green)]"
                : "bg-primary/10 text-primary",
            )}
          >
            {shot.tag.label}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Capture view ─────────────────────────────────────────────────────────────

function CaptureView({
  shot,
  onCapture,
  onClose,
}: {
  shot: ShotDef;
  onCapture: () => void;
  onClose: () => void;
}) {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<CapturePhase>("preview");
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Mockup demo: show the sample photo for this shot instead of the camera.
    if (DEMO_CAMERA) { setHasCamera(false); return; }
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setHasCamera(true);
      })
      .catch(() => { if (mounted) setHasCamera(false); });

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const triggerShutter = () => {
    if (phase !== "preview") return;
    setPhase("flash");
    setTimeout(() => setPhase("saved"), 160);
    setTimeout(() => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onCapture();
    }, 900);
  };

  const handleClose = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden touch-none">

      {/* Camera feed */}
      {hasCamera === true && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted playsInline
        />
      )}
      {hasCamera === false && <SimulatedFeed src={SHOT_PHOTOS[shot.id]?.full} />}
      {hasCamera === null && (
        <div className="absolute inset-0" style={{ background: "#060C11" }} />
      )}

      {/* Gradient overlays */}
      <div
        className="absolute top-0 inset-x-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-52 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
      />

      {/* Guide SVG overlay — between top bar and shutter area */}
      <div className="absolute top-[16%] bottom-[22%] inset-x-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 178"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {GUIDE_SHAPES[shot.id]}
        </svg>
      </div>

      {/* Top bar */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between px-4 z-10 pt-[71px] md:pt-4"
      >
        <button
          onClick={handleClose}
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(12px)" }}
          aria-label="Cancel"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="flex flex-col items-center">
          <span
            className="text-white text-[15px] font-semibold"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            {shot.title}
          </span>
          <span className="text-white/55 text-[12px] mt-0.5">
            {GUIDE_LABELS[shot.id]}
          </span>
        </div>

        <div className="w-11 shrink-0" />
      </div>

      {/* Shutter button */}
      <div
        className="absolute inset-x-0 flex justify-center z-10"
        style={{ bottom: "max(2.5rem, env(safe-area-inset-bottom))", paddingBottom: "1rem" }}
      >
        <button
          onClick={triggerShutter}
          disabled={phase !== "preview"}
          className="w-[76px] h-[76px] rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "3px solid rgba(255,255,255,0.65)",
            backdropFilter: "blur(14px)",
          }}
          aria-label="Take photo"
        >
          <div className="w-[52px] h-[52px] rounded-full bg-white" />
        </button>
      </div>

      {/* Flash + saved overlays */}
      <AnimatePresence>
        {phase === "flash" && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.88 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 z-20 bg-white pointer-events-none"
          />
        )}
        {phase === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18, type: "spring", stiffness: 320, damping: 26 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div
              className="rounded-full px-7 py-4 flex items-center gap-2"
              style={{
                background: "rgba(34,197,94,0.88)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span className="text-white text-[18px] font-bold">✓ Saved</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

// ─── Simulated feed ───────────────────────────────────────────────────────────

function SimulatedFeed({ src }: { src?: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #4A6E8A 0%, #7BA8C4 35%, #8BAE8A 65%, #4F7A5B 100%)",
      }}
    >
      {src ? (
        <img
          src={src}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
          draggable={false}
        />
      ) : (
        <motion.div
          className="absolute inset-0"
          animate={{ x: [0, 24, 0, -24, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          <img
            src={PLACEHOLDER_FRAME}
            className="w-full h-full object-cover"
            style={{ transform: "scale(1.1)", opacity: 0.88 }}
            alt=""
            draggable={false}
          />
        </motion.div>
      )}
    </div>
  );
}
