/**
 * SpinViewer — 360° vehicle viewer driven by a looping turntable VIDEO.
 *
 * Why video, not image frames: the source rotation has 237–239 frames per turn at
 * 24 fps. Playing the video keeps every frame (smooth), and one small file per
 * color replaces hundreds of images.
 *
 * Interaction:
 *   - Auto-rotate = the video playing on loop (one turn every ~9.5 s).
 *   - Horizontal drag pauses it and scrubs: 12 px (mouse) / 16 px (touch) per
 *     10° of rotation. The videos have a keyframe every 6 frames, so seeking to
 *     any angle is near-instant. Auto-rotate resumes 2.5 s after the last touch.
 *   - touch-action: pan-y so a vertical swipe still scrolls the page.
 *   - Arrow keys step 5° when focused. Reduced motion: no autoplay, drag only.
 *
 * Color change: the new color's video loads in a second layer, jumps to the
 * same angle, then crossfades in over 400 ms — the car keeps its pose because
 * every color's video shows the same pose at the same angle (see timeForAngle).
 *
 * Intro (optional): a one-shot zoom video whose last frame is the spin's first
 * frame, on the same pure white as the stage. Plays once per visit (introKey). Tap to skip. Waits while the page is in a
 * background tab; skipped if autoplay is blocked.
 *
 * Hotspots: placed by ANGLE (0–360°) at x / y fractions of the 16:9 video
 * image; a marker shows while the car is within a few degrees of that angle.
 *
 * Color gaps:
 *   - positive hotspot tone uses --axio-green (no --success Tailwind token).
 *   - negative hotspot tone uses --destructive.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GripHorizontal } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/components/ui/utils";
import type { SpinVideo } from "../spinAssets";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEG_PER_PX_MOUSE = 10 / 12;
const DEG_PER_PX_TOUCH = 10 / 16;
const KEY_STEP_DEG = 5;
const PAUSE_AFTER_TOUCH_MS = 2500;
const HINT_VISIBLE_MS = 3500;
const COLOR_FADE_MS = 400;
const HOTSPOT_TURN_MS = 700;
const HOTSPOT_WINDOW_DEG = 6;
const SEEK_STALL_MS = 120;

// Enlarge the car to fill the stage. Measured over every frame of all four
// colors, the car and its shadow span x 14–86% and y 24–82% of the 16:9 video,
// centered at (50.2%, 52.85%). 1.28× makes the widest angle fill ~92% of the
// stage width; the translate centers the car. Videos, intro and hotspots all
// share this box, so they stay aligned.
const CAR_ZOOM = 1.28;
const MEDIA_BOX_TRANSFORM = `translateY(-50%) scale(${CAR_ZOOM}) translate(-0.2%, -2.85%)`;

const TONE_COLOR = {
  positive: "var(--axio-green)",    /* gap: no --success Tailwind token */
  negative: "var(--destructive)",   /* gap: no --warning Tailwind token; using --destructive */
  neutral:  "var(--primary)",
} as const;

// The intro zoom plays once per visit to the page (introKey, e.g. the router's
// location key). A remount or refresh during the same visit goes straight to the
// looping 360; arriving at the page again plays the zoom again.
const INTRO_SEEN_KEY = "autonexus_intro_seen";
let introSeenThisPage: string | null = null;
function introSeen(key: string) {
  if (introSeenThisPage === key) return true;
  try { return sessionStorage.getItem(INTRO_SEEN_KEY) === key; } catch { return false; }
}
function markIntroSeen(key: string) {
  introSeenThisPage = key;
  try { sessionStorage.setItem(INTRO_SEEN_KEY, key); } catch { /* storage blocked: page-level flag still applies */ }
}

const wrapDeg = (d: number) => ((d % 360) + 360) % 360;
const arcDeg = (from: number, to: number) => ((to - from + 540) % 360) - 180; // shortest signed arc

// ─── Angle ↔ time (lockstep across colors) ──────────────────────────────────
// Every spin video starts on the same frame and shows the same pose at frame N
// up to frame 221. After that the turn closes back to its start in a different
// number of frames per color (white: 12, navy: 10, grey: 11, black: 11), then all
// end with the same 6 frames. Angles are measured on a shared 233-frame turn,
// with the closing stretch mapped proportionally, so every color shows the same
// pose at the same angle.
const FPS = 24;
const TURN_FRAMES = 233;   // shared angle axis
const LAST_SHARED = 221;   // last frame before the turn closes
const CLOSE_FRAMES = 6;    // shared-axis frames the closing stretch covers
const TAIL_FRAMES = 6;     // frames after the close, identical in every color

function closeSteps(v: HTMLVideoElement) {
  return Math.max(1, Math.round(v.duration * FPS) - LAST_SHARED - TAIL_FRAMES);
}

function timeForAngle(v: HTMLVideoElement, deg: number) {
  const m = closeSteps(v);
  const w = (wrapDeg(deg) / 360) * TURN_FRAMES;
  const r = w <= LAST_SHARED ? w
    : w < LAST_SHARED + CLOSE_FRAMES ? LAST_SHARED + ((w - LAST_SHARED) * m) / CLOSE_FRAMES
    : w - CLOSE_FRAMES + m;
  return r / FPS;
}

function angleForTime(v: HTMLVideoElement, t: number) {
  const m = closeSteps(v);
  const r = t * FPS;
  const w = r <= LAST_SHARED ? r
    : r < LAST_SHARED + m ? LAST_SHARED + ((r - LAST_SHARED) * CLOSE_FRAMES) / m
    : r - m + CLOSE_FRAMES;
  return wrapDeg((w / TURN_FRAMES) * 360);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Hotspot {
  id: string;
  /** Rotation angle (0–360°) at which this spot faces the camera. */
  angle: number;
  /** 0–1 fraction of the 16:9 video image width */
  x: number;
  /** 0–1 fraction of the 16:9 video image height */
  y: number;
  label: string;
  tone: "positive" | "negative" | "neutral";
}

export interface SpinIntro {
  mp4: string;
  poster: string;
}

export interface SpinViewerProps {
  video: SpinVideo;
  aspectRatio?: "4:3" | "16:9";
  autoRotate?: boolean;
  hotspots?: Hotspot[];
  selectedHotspotId?: string | null;
  /** Called when a marker on the car is clicked (makes markers clickable). */
  onHotspotClick?: (id: string) => void;
  /** One-shot intro video that ends on the spin's first frame. */
  intro?: SpinIntro;
  /** Identifies one visit to the page; the intro plays once per key. */
  introKey?: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SpinViewer({
  video,
  aspectRatio = "4:3",
  autoRotate = false,
  hotspots = [],
  selectedHotspotId,
  onHotspotClick,
  intro,
  introKey = "default",
  className,
}: SpinViewerProps) {
  const reduced = useReducedMotion();

  // Two video layers so a color change can crossfade at the same angle.
  const [slots, setSlots] = useState<[SpinVideo, SpinVideo | null]>([video, null]);
  const [active, setActive] = useState<0 | 1>(0);
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const videoRefs = [refA, refB];

  const [ready, setReady] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [pulsingId, setPulsingId] = useState<string | null>(null);
  const [introPlaying, setIntroPlaying] = useState(() => Boolean(intro) && !reduced && !introSeen(introKey));

  const introRef = useRef<HTMLVideoElement>(null);
  const angleRef = useRef(0);
  const holdUntilRef = useRef(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastXRef = useRef(0);
  const degPerPxRef = useRef(DEG_PER_PX_MOUSE);
  const seekTargetRef = useRef<number | null>(null);
  const tweenRef = useRef<number | null>(null);
  const lastSeekAtRef = useRef(0);
  const activeRef = useRef<0 | 1>(0);
  activeRef.current = active;

  const activeVideo = () => videoRefs[activeRef.current].current;

  // ── Angle ↔ time ──────────────────────────────────────────────────────────

  const angleFromVideo = (v: HTMLVideoElement) =>
    v.duration ? angleForTime(v, v.currentTime) : angleRef.current;

  /** Scrub the active video to an angle, coalescing seeks so the decoder never queues up. */
  const seekTo = useCallback((deg: number) => {
    const v = videoRefs[activeRef.current].current;
    angleRef.current = wrapDeg(deg);
    setAngle(angleRef.current);
    if (!v || !v.duration) return;
    seekTargetRef.current = angleRef.current;
    // Coalesce seeks while the decoder is busy — but never wait on one that stalls
    // (slow devices, background tabs): after SEEK_STALL_MS jump to the latest angle.
    const now = performance.now();
    if (!v.seeking || now - lastSeekAtRef.current > SEEK_STALL_MS) {
      v.currentTime = timeForAngle(v, seekTargetRef.current);
      seekTargetRef.current = null;
      lastSeekAtRef.current = now;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSeeked = (i: 0 | 1) => {
    const v = videoRefs[i].current;
    if (i !== activeRef.current || !v || seekTargetRef.current === null) return;
    v.currentTime = timeForAngle(v, seekTargetRef.current);
    seekTargetRef.current = null;
  };

  // ── Play / pause ─────────────────────────────────────────────────────────

  const canAutoPlay = autoRotate && !reduced && !introPlaying;
  const canAutoPlayRef = useRef(canAutoPlay);
  canAutoPlayRef.current = canAutoPlay;
  const draggingRef = useRef(false);

  const play = useCallback(() => {
    const v = videoRefs[activeRef.current].current;
    if (!v || !canAutoPlayRef.current || draggingRef.current || tweenRef.current !== null) return;
    if (Date.now() < holdUntilRef.current) return;
    v.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const holdThenResume = useCallback(() => {
    holdUntilRef.current = Date.now() + PAUSE_AFTER_TOUCH_MS;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => play(), PAUSE_AFTER_TOUCH_MS + 20);
  }, [play]);

  useEffect(() => {
    const v = activeVideo();
    if (!v) return;
    if (canAutoPlay && !draggingRef.current) play();
    else v.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAutoPlay, active, ready]);

  useEffect(() => () => { if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current); }, []);

  // Track the angle while playing (for hotspots).
  useEffect(() => {
    if (!hotspots.length) return;
    let raf = 0;
    const tick = () => {
      const v = videoRefs[activeRef.current].current;
      if (v && !v.paused && v.duration) {
        const a = angleFromVideo(v);
        angleRef.current = a;
        setAngle((prev) => (Math.abs(arcDeg(prev, a)) > 0.5 ? a : prev));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotspots.length]);

  // ── Color change: load the new video in the spare layer, match time, crossfade ──

  useEffect(() => {
    const cur = slots[activeRef.current];
    if (cur && video.src === cur.src) return;
    const spare = (activeRef.current === 0 ? 1 : 0) as 0 | 1;
    setSlots((prev) => {
      const next: [SpinVideo, SpinVideo | null] = [prev[0], prev[1]];
      if (spare === 0) next[0] = video; else next[1] = video;
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.src]);

  const onSpareReady = (i: 0 | 1) => {
    if (i === activeRef.current) return;
    const from = videoRefs[activeRef.current].current;
    const to = videoRefs[i].current;
    if (!to || !to.duration) return;
    const wasPlaying = from ? !from.paused : false;
    const a = from ? angleFromVideo(from) : angleRef.current;
    const commit = () => {
      to.removeEventListener("seeked", commit);
      if (wasPlaying) to.play().catch(() => {});
      setActive(i);
      setTimeout(() => from?.pause(), COLOR_FADE_MS + 50);
    };
    to.addEventListener("seeked", commit);
    to.currentTime = timeForAngle(to, a);
  };

  // ── Intro video ──────────────────────────────────────────────────────────

  const endIntro = useCallback(() => {
    markIntroSeen(introKey);
    setIntroPlaying(false);
    seekTo(0);
  }, [seekTo, introKey]);

  useEffect(() => {
    if (!introPlaying) return;
    const v = introRef.current;
    if (!v) return;
    // Browsers pause silent video in background tabs: wait until visible.
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          if (document.visibilityState === "hidden") return;
          endIntro(); // autoplay genuinely blocked (e.g. iOS Low Power Mode)
        });
      }
    };
    const onVisible = () => { if (document.visibilityState === "visible") tryPlay(); };
    if (document.visibilityState === "visible") tryPlay();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [introPlaying, endIntro]);

  // ── Hint auto-hide ───────────────────────────────────────────────────────

  useEffect(() => {
    if (introPlaying) return;
    const t = setTimeout(() => setShowHint(false), HINT_VISIBLE_MS);
    return () => clearTimeout(t);
  }, [introPlaying]);

  // ── Hotspot navigation: turn along the shortest arc, then pulse ───────────

  useEffect(() => {
    if (!selectedHotspotId) return;
    const hs = hotspots.find((h) => h.id === selectedHotspotId);
    const v = activeVideo();
    if (!hs || !v) return;
    v.pause();
    const start = v.duration ? angleFromVideo(v) : angleRef.current;
    const delta = arcDeg(start, hs.angle);
    const t0 = performance.now();
    if (tweenRef.current !== null) cancelAnimationFrame(tweenRef.current);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / HOTSPOT_TURN_MS);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      seekTo(start + delta * eased);
      if (p < 1) tweenRef.current = requestAnimationFrame(step);
      else {
        tweenRef.current = null;
        setPulsingId(selectedHotspotId);
        holdThenResume();
      }
    };
    tweenRef.current = requestAnimationFrame(step);
    return () => {
      if (tweenRef.current !== null) cancelAnimationFrame(tweenRef.current);
      tweenRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotspotId]);

  // ── Pointer + keyboard ───────────────────────────────────────────────────

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (introPlaying) { endIntro(); return; }
    const v = activeVideo();
    v?.pause();
    if (v?.duration) angleRef.current = angleFromVideo(v);
    draggingRef.current = true;
    setIsDragging(true);
    setShowHint(false);
    lastXRef.current = e.clientX;
    degPerPxRef.current = e.pointerType === "touch" ? DEG_PER_PX_TOUCH : DEG_PER_PX_MOUSE;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    if (dx === 0) return;
    lastXRef.current = e.clientX;
    seekTo(angleRef.current + dx * degPerPxRef.current);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    holdThenResume();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    if (introPlaying) endIntro();
    const v = activeVideo();
    v?.pause();
    if (v?.duration) angleRef.current = angleFromVideo(v);
    seekTo(angleRef.current + (e.key === "ArrowRight" ? KEY_STEP_DEG : -KEY_STEP_DEG));
    holdThenResume();
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const aspectStyle = aspectRatio === "4:3" ? "4 / 3" : "16 / 9";
  const visibleHotspots = introPlaying
    ? []
    : hotspots.filter((h) => Math.abs(arcDeg(angle, h.angle)) <= HOTSPOT_WINDOW_DEG);

  return (
    <div
      role="img"
      tabIndex={0}
      aria-label="360-degree view of your vehicle. Drag or use arrow keys to rotate."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-white",
        "select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      style={{ aspectRatio: aspectStyle, touchAction: "pan-y" }}
    >
      {/* Media box: the 16:9 video image, enlarged and centered on the car */}
      <div
        className="absolute left-0 top-1/2 w-full pointer-events-none"
        style={{ aspectRatio: "16 / 9", transform: MEDIA_BOX_TRANSFORM }}
      >
      {/* Spin video layers (active on top; the other fades out after a color change) */}
      {slots.map((s, i) =>
        s ? (
          <video
            key={s.src}
            ref={videoRefs[i]}
            src={s.src}
            poster={s.poster}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onCanPlay={() => {
              if (i === activeRef.current) setReady(true);
              else onSpareReady(i as 0 | 1);
            }}
            onSeeked={() => onSeeked(i as 0 | 1)}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{
              // Stays visible under the intro (which covers it), so the intro's last
              // frame hands off to the spin's first frame with no fade.
              opacity: i === active ? 1 : 0,
              zIndex: i === active ? 2 : 1,
              transition: `opacity ${COLOR_FADE_MS}ms ease-in-out`,
            }}
          />
        ) : null,
      )}

      {/* One-shot intro; shot on pure white, so it sits straight on the stage */}
      {intro && introPlaying && (
        <video
          ref={introRef}
          muted
          playsInline
          preload="auto"
          poster={intro.poster}
          onPlaying={() => markIntroSeen(introKey)}
          onEnded={endIntro}
          onError={endIntro}
          className="absolute inset-0 z-[4] w-full h-full object-contain pointer-events-none"
        >
          <source src={intro.mp4} type="video/mp4" />
        </video>
      )}
      </div>

      {/* Loading state — until the spin video can play */}
      <AnimatePresence>
        {!ready && !introPlaying && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none"
          >
            <div className="w-7 h-7 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotspot layer: same box (and enlargement) as the media box */}
      <div
        className="absolute left-0 z-[6] w-full top-1/2 pointer-events-none"
        style={{ aspectRatio: "16 / 9", transform: MEDIA_BOX_TRANSFORM }}
      >
        {visibleHotspots.map((hotspot) => {
          const selected = selectedHotspotId === hotspot.id;
          const pulsing = pulsingId === hotspot.id;
          const toneColor = TONE_COLOR[hotspot.tone];
          return (
            <div
              key={hotspot.id}
              className="absolute"
              style={{ left: `${hotspot.x * 100}%`, top: `${hotspot.y * 100}%`, transform: "translate(-50%, -50%)" }}
            >
              {/* Clickable area (36 px) around the marker; doesn't start a drag */}
              {onHotspotClick && (
                <button
                  type="button"
                  aria-label={hotspot.label}
                  aria-pressed={selected}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); onHotspotClick(hotspot.id); }}
                  className="absolute left-1/2 top-1/2 w-9 h-9 -ml-[18px] -mt-[18px] rounded-full pointer-events-auto cursor-pointer z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              )}
              <AnimatePresence>
                {pulsing && (
                  <motion.div
                    key="pulse"
                    className="absolute rounded-full"
                    style={{ width: 16, height: 16, top: "50%", left: "50%", marginTop: -8, marginLeft: -8, background: toneColor }}
                    initial={{ scale: 1, opacity: 0.75 }}
                    animate={{ scale: 3.5, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    onAnimationComplete={() => setPulsingId(null)}
                  />
                )}
              </AnimatePresence>

              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform duration-200",
                  selected ? "scale-[1.4]" : "scale-100",
                )}
                style={{ background: toneColor }}
              />

              <AnimatePresence>
                {selected && (
                  <motion.div
                    key="label"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-bold text-white shadow-lg"
                    style={{ background: toneColor }}
                  >
                    {hotspot.label}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `5px solid ${toneColor}` }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* "Drag to rotate" hint chip — after the intro, fades out */}
      <AnimatePresence>
        {showHint && !introPlaying && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 z-[7] pointer-events-none"
          >
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 px-2.5 py-1.5 h-auto text-[11px] shadow-sm rounded-full"
            >
              <GripHorizontal className="w-3.5 h-3.5 opacity-60" />
              Drag to rotate
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
