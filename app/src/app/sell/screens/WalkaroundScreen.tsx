/**
 * WalkaroundScreen — full-screen portrait camera walkaround.
 *
 * Uses React.createPortal so the `fixed inset-0` container lands on <body>
 * and is never trapped inside a CSS-transform ancestor (the SellRoot
 * AnimatePresence outlet), which would break fixed positioning.
 *
 * Mobile: tries getUserMedia({ video: { facingMode: "environment" } }).
 *   Success → shows live rear camera feed.
 *   Failure (desktop preview, permission denied) → SimulatedFeed: a looping
 *   phone-camera walkaround clip (placeholder photo while it loads).
 *
 *   Coverage auto-advances +2 % every 400 ms while unpaused. Findings chips
 *   appear at preset thresholds. At 100 % all walkaround positions are marked
 *   captured (for downstream ConfirmScreen), then after 1 s the screen
 *   navigates forward to /sell/closeups.
 *
 * Desktop: "Continue on your phone" card (QR code + SMS) centered on a dark
 *   full-screen background — identical handoff to WalkaroundIntroScreen.
 */
import { type CSSProperties, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { X, Pause, Play, QrCode } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSell, handoffLink, smsLink } from "../SellContext";
import { WALKAROUND_POSITIONS } from "../mockData";
import { cn } from "@/app/components/ui/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

// Mockup demo: "Allow camera and start" goes straight to the walkaround without asking
// for the real camera, and the walkaround video below plays as the camera feed.
// Set to false to use the device's rear camera again.
export const DEMO_CAMERA = true;

// Simulated camera feed, shown whenever no camera is available: a phone-camera clip walking
// around a white CX-50 (8 s, looped), with the driveway photo shown while it loads.
// Both hosted in the Trade Now media library on Solid#.
const PLACEHOLDER_FRAME =
  "https://solid-tenant-assets.nyc3.digitaloceanspaces.com/company_78/uploads/ast_fa1e5b81/autonexus-scan-camera-bg.jpg";
const PLACEHOLDER_VIDEO =
  "https://solid-tenant-assets.nyc3.digitaloceanspaces.com/company_78/uploads/ast_854a6ab0/tradenow-walkaround-pov.mp4";

const INSTRUCTIONS = [
  { at: 0,   text: "Start at the front of the car" },
  { at: 18,  text: "Walk slowly down the passenger side" },
  { at: 40,  text: "Now the back of the car" },
  { at: 60,  text: "Up the driver side" },
  { at: 80,  text: "Almost there. Back to the front" },
  { at: 100, text: "Done. Nice work!" },
] as const;

interface Finding {
  id: string;
  label: string;
  type: "success" | "warning";
}

const FINDING_THRESHOLDS: Array<{ at: number; item: Finding }> = [
  { at: 18, item: { id: "front",  label: "✓ Front",             type: "success" } },
  { at: 30, item: { id: "scuff",  label: "Scuff · rear door",   type: "warning" } },
  { at: 50, item: { id: "rear",   label: "✓ Rear",              type: "success" } },
  { at: 58, item: { id: "scrape", label: "Scrape · rear bumper", type: "warning" } },
  { at: 72, item: { id: "driver", label: "✓ Driver side",        type: "success" } },
  { at: 88, item: { id: "roof",   label: "✓ Roof and glass",     type: "success" } },
];

// ─── Component ────────────────────────────────────────────────────────────────

type WalkaroundView = "camera" | "desktop";

export function WalkaroundScreen() {
  const navigate = useNavigate();
  const { setNavDirection, toggleWalkaroundPhoto, walkaroundPhotos } = useSell();

  const isPreview = typeof window !== "undefined" && window.self !== window.top;

  // Always starts as "camera" — never changes on load
  const [viewMode, setViewMode] = useState<WalkaroundView>("camera");
  const isDesktopMode = viewMode === "desktop";

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [coverage, setCoverage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [textSent, setTextSent] = useState(false);
  const [qrError, setQrError] = useState(false);
  // Live link to this step on the published site, carrying progress so far
  const [pageUrl] = useState(() => handoffLink("/sell/walkaround"));

  const videoRef   = useRef<HTMLVideoElement>(null);
  const streamRef  = useRef<MediaStream | null>(null);
  const advancedRef  = useRef(false);
  const completedRef = useRef(false);

  // ── Camera ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isDesktopMode || DEMO_CAMERA) { setHasCamera(false); return; }

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
  }, [isDesktopMode]);

  // ── Coverage progression ───────────────────────────────────────────────────
  useEffect(() => {
    if (paused || coverage >= 100 || isDesktopMode) return;
    const id = setInterval(() => setCoverage((v) => Math.min(100, v + 2)), 400);
    return () => clearInterval(id);
  }, [paused, coverage, isDesktopMode]);

  // ── Findings ───────────────────────────────────────────────────────────────
  useEffect(() => {
    FINDING_THRESHOLDS.forEach(({ at, item }) => {
      if (coverage >= at) {
        setFindings((prev) =>
          prev.some((f) => f.id === item.id) ? prev : [...prev, item],
        );
      }
    });
  }, [coverage]);

  // ── Complete + auto-advance ────────────────────────────────────────────────
  useEffect(() => {
    if (coverage < 100) return;
    if (!completedRef.current) {
      completedRef.current = true;
      WALKAROUND_POSITIONS.forEach((p) => {
        if (!walkaroundPhotos.has(p.id)) toggleWalkaroundPhoto(p.id);
      });
    }
    if (!advancedRef.current) {
      advancedRef.current = true;
      setTimeout(() => { setNavDirection("forward"); navigate("/sell/closeups"); }, 1_000);
    }
  }, [coverage]);  // eslint-disable-line

  const stopAndGoBack = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setNavDirection("back");
    navigate("/sell/walkaround-intro");
  };

  const skipForDemo = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    WALKAROUND_POSITIONS.forEach((p) => {
      if (!walkaroundPhotos.has(p.id)) toggleWalkaroundPhoto(p.id);
    });
    setNavDirection("forward");
    navigate("/sell/confirm");
  };

  const currentInstruction =
    [...INSTRUCTIONS].reverse().find((i) => coverage >= i.at)?.text ??
    INSTRUCTIONS[0].text;

  const recentFindings = findings.slice(-3);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(pageUrl)}`;

  // ── Desktop: full-screen dark card ─────────────────────────────────────────
  if (isDesktopMode) {
    return createPortal(
      <div className="fixed inset-0 z-[100] bg-[#080D12] flex flex-col items-center justify-center px-5">
        <button
          onClick={stopAndGoBack}
          className="absolute top-6 left-6 w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}
          aria-label="Go back"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <span className="text-white/50 text-[15px] font-semibold mb-8">
          Step 2 of 3 · Walkaround &amp; condition
        </span>

        <div
          className="w-full max-w-sm rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <p className="text-base font-bold text-white mb-1">
            Continue on your phone
          </p>
          <p className="text-[14px] text-white/55 mb-5 leading-relaxed">
            The walkaround must happen on a phone with a rear camera. Scan the
            QR code or text yourself a link — your progress is saved.
          </p>

          <div className="flex justify-center mb-5">
            <div className="w-40 h-40 rounded-xl overflow-hidden bg-white flex items-center justify-center">
              {qrError ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center text-gray-400">
                  <QrCode className="w-10 h-10 opacity-30" />
                  <span className="text-xs">Open on your phone</span>
                </div>
              ) : (
                <img
                  src={qrSrc}
                  alt="Scan to open on your phone"
                  className="w-full h-full object-cover"
                  onError={() => setQrError(true)}
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>

          <p className="text-[14px] font-bold text-white mb-2">Text me a link</p>
          <div className="flex gap-2">
            <input
              type="tel"
              inputMode="tel"
              placeholder="(801) 555-0192"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 h-11 rounded-xl px-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <button
              onClick={() => { setTextSent(true); window.location.href = smsLink(phoneNumber, pageUrl); }}
              disabled={!phoneNumber.trim()}
              className="h-11 px-5 font-bold text-[14px] rounded-xl bg-primary text-primary-foreground shrink-0 transition-opacity disabled:opacity-40"
            >
              Send
            </button>
          </div>
          {textSent && (
            <p className="text-[14px] font-semibold mt-3" style={{ color: "var(--axio-green)" }}>
              Your messaging app should open with the link. Send it to your phone to continue.
            </p>
          )}

          <div className="flex items-center gap-3 mt-5" style={{ color: "rgba(255,255,255,0.15)" }}>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>demo</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>
          <button
            type="button"
            onClick={skipForDemo}
            className="mt-3 w-full text-[14px] font-semibold text-center py-1 transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Skip walkaround →
          </button>
          {isPreview && (
            <WalkaroundViewChips viewMode={viewMode} onSwitch={setViewMode} dark />
          )}
        </div>
      </div>,
      document.body,
    );
  }

  // ── Mobile: full-screen camera UI ──────────────────────────────────────────
  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden touch-none">

      {/* ── Camera feed layer ─────────────────────────────────────── */}
      {hasCamera === true && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted playsInline
        />
      )}
      {hasCamera === false && <SimulatedFeed />}
      {hasCamera === null && (
        <div className="absolute inset-0" style={{ background: "#060C11" }} />
      )}

      {/* ── Dark gradient overlays ────────────────────────────────── */}
      <div
        className="absolute top-0 inset-x-0 h-44 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, transparent 100%)" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-60 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)" }}
      />

      {/* ── Corner brackets ───────────────────────────────────────── */}
      <CornerBrackets />

      {/* ── "Camera simulated" badge ──────────────────────────────── */}
      {hasCamera === false && !DEMO_CAMERA && (
        <div
          className="absolute inset-x-0 z-20 flex justify-center pointer-events-none"
          style={{ top: "calc(env(safe-area-inset-top, 14px) + 58px)" }}
        >
          <div
            className="rounded-full px-3 py-1"
            style={{ background: "rgba(0,0,0,0.45)" }}
          >
            <span className="text-white/50 text-[10px] font-semibold tracking-widest uppercase">
              Camera simulated
            </span>
          </div>
        </div>
      )}

      {/* ── Interactive UI ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex flex-col">

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 mt-1 pt-[71px] md:pt-4"
        >
          <button
            onClick={() => setShowStopDialog(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(12px)" }}
            aria-label="Stop walkaround"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex-1 min-w-0 flex flex-col items-center text-center" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            <span className="text-white/75 text-[10px] font-semibold uppercase tracking-widest leading-none">
              Step 2 of 3
            </span>
            <span className="text-white text-[15px] font-semibold leading-tight mt-1">
              Walkaround &amp; condition
            </span>
          </div>

          {/* Right spacer to mirror X button */}
          <div className="w-12 shrink-0" />
        </div>

        {/* Instruction pill + findings */}
        <div className="flex flex-col items-center gap-2.5 mt-4 px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentInstruction}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              className="rounded-full px-5 py-2.5"
              style={{
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
              }}
            >
              <p className="text-base font-bold text-gray-900 text-center whitespace-nowrap">
                {currentInstruction}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Latest 3 findings */}
          <div className="flex flex-wrap justify-center gap-2 min-h-[26px]">
            <AnimatePresence>
              {recentFindings.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 22 }}
                  className={cn(
                    "px-3 py-1 rounded-full text-[13px] font-bold border",
                    f.type === "success"
                      ? "border-[var(--axio-green)]/35 text-[var(--axio-green)]"
                      : "text-amber-700 border-amber-500/35",
                  )}
                  style={{
                    background:
                      f.type === "success"
                        ? "rgba(34,197,94,0.18)"
                        : "rgba(251,191,36,0.18)",
                  }}
                >
                  {f.label}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Middle spacer — car lives here */}
        <div className="flex-1" />

        {/* Bottom row */}
        <div
          className="flex items-center justify-between px-6"
          style={{ paddingBottom: isPreview ? "1rem" : "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          {/* Mini-map */}
          <MiniMap coverage={coverage} />

          {/* Coverage stats */}
          <div className="text-center flex-1 px-3">
            <p className="text-[42px] font-black text-white tabular-nums leading-none">
              {Math.round(coverage)}%
            </p>
            <p className="text-[14px] text-white/60 font-medium mt-1">
              of your car covered
            </p>
          </div>

          {/* Pause / resume */}
          <button
            onClick={() => setPaused((p) => !p)}
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(14px)",
            }}
            aria-label={paused ? "Resume" : "Pause"}
          >
            {paused ? (
              <Play className="w-7 h-7 text-white" style={{ marginLeft: "3px" }} />
            ) : (
              <Pause className="w-7 h-7 text-white" />
            )}
          </button>
        </div>

        {/* Prototype view switcher — camera mode bottom */}
        {isPreview && (
          <div
            className="flex justify-center pb-3"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <WalkaroundViewChips viewMode={viewMode} onSwitch={setViewMode} dark />
          </div>
        )}
      </div>

      {/* ── Stop walkaround dialog ──────────────────────────────────── */}
      <AnimatePresence>
        {showStopDialog && (
          <motion.div
            key="stop-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-50 flex items-center justify-center px-5"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.18, type: "spring", stiffness: 320, damping: 26 }}
              className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-[18px] font-bold text-foreground mb-2">
                Stop the walkaround?
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-5">
                Your progress is saved. You can come back and resume where you
                left off.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={stopAndGoBack}
                  className="w-full h-12 rounded-xl font-bold text-[15px] bg-destructive text-destructive-foreground transition-opacity hover:opacity-90"
                >
                  Stop walkaround
                </button>
                <button
                  onClick={() => setShowStopDialog(false)}
                  className="w-full h-12 rounded-xl font-semibold text-[15px] border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Continue walking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

// ─── Simulated feed ───────────────────────────────────────────────────────────

function SimulatedFeed() {
  const reduced = useReducedMotion();
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #4A6E8A 0%, #7BA8C4 35%, #8BAE8A 65%, #4F7A5B 100%)",
      }}
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={PLACEHOLDER_VIDEO}
        poster={PLACEHOLDER_FRAME}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Corner brackets ──────────────────────────────────────────────────────────

function CornerBrackets() {
  const SIZE = 28;
  const B = "2.5px solid rgba(255,255,255,0.72)";

  const corners: Array<CSSProperties> = [
    { top: "20%", left: "8%",   width: SIZE, height: SIZE, borderTop: B, borderLeft: B },
    { top: "20%", right: "8%",  width: SIZE, height: SIZE, borderTop: B, borderRight: B },
    { bottom: "26%", left: "8%",  width: SIZE, height: SIZE, borderBottom: B, borderLeft: B },
    { bottom: "26%", right: "8%", width: SIZE, height: SIZE, borderBottom: B, borderRight: B },
  ];

  return (
    <>
      {corners.map((style, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={style}
        />
      ))}
    </>
  );
}

// ─── Mini-map ─────────────────────────────────────────────────────────────────

function MiniMap({ coverage }: { coverage: number }) {
  const r  = 26;
  const cx = 32;
  const cy = 32;
  const circumference = 2 * Math.PI * r;   // ≈ 163.4
  const filledArc = (Math.min(coverage, 100) / 100) * circumference;

  // User dot — clockwise from top (12 o'clock = front of car = 0%)
  const dotAngleRad = ((coverage / 100) * 360 - 90) * (Math.PI / 180);
  const dotX = cx + r * Math.cos(dotAngleRad);
  const dotY = cy + r * Math.sin(dotAngleRad);

  return (
    <svg
      viewBox="0 0 64 64"
      className="w-16 h-16 shrink-0"
      aria-label={`${Math.round(coverage)}% of car covered`}
    >
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={r}
              fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="3" />

      {/* Coverage arc — clockwise from top */}
      {filledArc > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeDasharray={`${filledArc} 9999`}
          strokeLinecap="round"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: `${cx}px ${cy}px`,
            transition: "stroke-dasharray 0.4s linear",
          }}
        />
      )}

      {/* Top-down car icon */}
      <rect x="22" y="16" width="20" height="32" rx="6"
            fill="white" fillOpacity="0.85" />
      <rect x="25" y="22" width="14" height="20" rx="4"
            fill="white" fillOpacity="0.22" />

      {/* User position dot */}
      <circle cx={dotX} cy={dotY} r="5.5" fill="var(--primary)" />
      <circle cx={dotX} cy={dotY} r="2.5" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

// ─── Prototype view chips ─────────────────────────────────────────────────────

function WalkaroundViewChips({
  viewMode,
  onSwitch,
  dark = false,
}: {
  viewMode: WalkaroundView;
  onSwitch: (v: WalkaroundView) => void;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 justify-center pt-1">
      {(["camera", "desktop"] as WalkaroundView[]).map((v) => {
        const active = viewMode === v;
        const bg = dark
          ? active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.08)"
          : active ? "#0B1F3A" : "#F5F8FC";
        const color = dark
          ? active ? "#0B1F3A" : "rgba(255,255,255,0.45)"
          : active ? "#ffffff" : "#8593A6";
        const border = dark
          ? active ? "1px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.15)"
          : `1px solid ${active ? "#0B1F3A" : "#E3E9F2"}`;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onSwitch(v)}
            style={{
              padding: "2px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              lineHeight: 1.6,
              border,
              background: bg,
              color,
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        );
      })}
    </div>
  );
}
