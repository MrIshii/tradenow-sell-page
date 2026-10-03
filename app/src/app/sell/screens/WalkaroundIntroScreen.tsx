import { useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Loader2, X } from "lucide-react";
import { useSell, handoffLink, smsLink } from "../SellContext";
import { DEMO_CAMERA } from "./WalkaroundScreen";

// ─── State ────────────────────────────────────────────────────────────────────

type ScreenState = "default" | "denied" | "handoff" | "insecure";

// ─── Tip data ─────────────────────────────────────────────────────────────────

const TIPS = [
  {
    title: "Daylight, out of the garage",
    description: "Shade is fine. Avoid dusk or streetlights.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>
      </svg>
    ),
  },
  {
    title: "About 2 steps back",
    description: "The frame guide turns blue when the distance is right.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4"/>
      </svg>
    ),
  },
  {
    title: "Keep the phone upright",
    description: "No need to turn it sideways.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="7" y="2" width="10" height="20" rx="2"/>
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function WalkaroundIntroScreen() {
  const navigate = useNavigate();
  const { setNavDirection } = useSell();

  // Always starts as "default" — never changes on load, only after button tap
  const [screenState, setScreenState] = useState<ScreenState>("default");
  const [requesting, setRequesting] = useState(false);

  // Preview mode: running inside Figma Make iframe
  const isPreview = typeof window !== "undefined" && window.self !== window.top;

  const handleBack = () => {
    setNavDirection("back");
    navigate("/sell/questions");
  };

  const handleStart = async () => {
    if (requesting) return;

    // In preview, skip getUserMedia and go straight to walkaround
    if (isPreview) {
      setNavDirection("forward");
      navigate("/sell/walkaround");
      return;
    }

    setRequesting(true);

    // Mockup demo: treat the camera as allowed after a short "Requesting access…"
    // beat; the walkaround plays its video in place of the camera feed.
    if (DEMO_CAMERA) {
      setTimeout(() => {
        setNavDirection("forward");
        navigate("/sell/walkaround");
      }, 700);
      return;
    }

    // Browsers only offer the camera on https (or localhost). On a plain-http
    // page the camera API is missing entirely — say so instead of implying the
    // device has no camera.
    if (!window.isSecureContext) {
      setScreenState("insecure");
      setRequesting(false);
      return;
    }

    // No camera API available (old browser, or a device without a camera)
    if (!navigator.mediaDevices?.getUserMedia) {
      setScreenState("handoff");
      setRequesting(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.getTracks().forEach((t) => t.stop());
      setNavDirection("forward");
      navigate("/sell/walkaround");
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setScreenState("denied");
      } else {
        // NotFoundError, OverconstrainedError, or anything else
        setScreenState("handoff");
      }
      setRequesting(false);
    }
  };

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: "100dvh" }}>

      {/* Status bar spacer — mobile only */}
      <div className="md:hidden shrink-0" style={{ height: "59px" }} />

      {/* ── Top bar ────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center bg-white"
        style={{ height: "56px", paddingLeft: "8px", paddingRight: "12px" }}
      >
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back"
          className="h-11 min-w-11 md:pl-2 md:pr-3 md:gap-0.5 rounded-full flex items-center justify-center text-foreground transition-colors shrink-0"
          style={{ WebkitTapHighlightColor: "transparent" }}
          onMouseDown={(e) => (e.currentTarget.style.background = "#F5F8FC")}
          onMouseUp={(e) => (e.currentTarget.style.background = "")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
        >
          <ChevronLeft strokeWidth={2} className="w-5 h-5" />
          <span className="hidden md:inline text-[15px] font-semibold">Back</span>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#8593A6",
              lineHeight: 1,
            }}
          >
            STEP 2 OF 3
          </span>
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#0B1F3A", lineHeight: 1.3, marginTop: "2px" }}>
            Walkaround &amp; condition
          </span>
        </div>

        {/* Leave the sell flow: X on phones, "Exit X" on desktop */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Exit"
          className="flex h-11 min-w-11 md:pl-3 md:pr-2 gap-1 rounded-full items-center justify-center text-foreground transition-colors shrink-0"
          style={{ WebkitTapHighlightColor: "transparent" }}
          onMouseDown={(e) => (e.currentTarget.style.background = "#F5F8FC")}
          onMouseUp={(e) => (e.currentTarget.style.background = "")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
        >
          <span className="hidden md:inline text-[15px] font-semibold">Exit</span>
          <X strokeWidth={2} className="w-5 h-5" />
        </button>
      </header>

      {/* Progress bar */}
      <div
        className="shrink-0 rounded-full overflow-hidden"
        style={{ height: "4px", margin: "0 20px", background: "#E3E9F2" }}
      >
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: "46%" }} />
      </div>

      {/* ── Scrollable content ──────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="flex flex-col md:max-w-[560px] md:mx-auto lg:grid lg:max-w-[1120px] lg:mx-auto lg:px-8 lg:items-start"
          style={{ paddingTop: "18px", paddingBottom: "24px", gap: "18px", gridTemplateColumns: "55% 1fr" }}
        >
          {/* Illustration card — always shown */}
          <div
            className="mx-5 lg:mx-0 lg:sticky lg:top-6 rounded-[22px] flex items-center justify-center overflow-hidden"
            style={{ background: "#EAF1FF", aspectRatio: "16 / 10" }}
          >
            <div style={{ width: "72%" }}>
              <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: "block", width: "100%" }}>
                <ellipse cx="100" cy="62" rx="78" ry="46" fill="none" stroke="#1F4FD8" strokeWidth="2" strokeDasharray="5 6"/>
                <rect x="72" y="42" width="56" height="40" rx="12" fill="#FFFFFF" stroke="#0B1F3A" strokeWidth="2"/>
                <rect x="80" y="48" width="14" height="28" rx="4" fill="#0B1F3A" opacity=".15"/>
                <rect x="106" y="48" width="14" height="28" rx="4" fill="#0B1F3A" opacity=".15"/>
                <circle cx="178" cy="62" r="7" fill="#1F4FD8"/>
                <path d="M178 44 l-8 -8 M178 44 l8 -8" stroke="#1F4FD8" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col px-5 lg:px-0" style={{ gap: "18px" }}>

            {/* Heading — always shown */}
            <h2
              style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#0B1F3A", textWrap: "balance" } as CSSProperties}
            >
              Walk slowly around your car
            </h2>

            {/* Paragraph — always shown */}
            <p style={{ fontSize: "16px", lineHeight: 1.5, color: "#56657A" }}>
              Hold your phone upright and keep the whole car in view. It takes about 2&nbsp;minutes, and we&apos;ll tell you where to go next.
            </p>

            {/* Middle section — swaps based on state */}
            {screenState === "default" && <TipsList />}
            {screenState === "denied" && <DeniedCard />}
            {screenState === "insecure" && <InsecureCard />}
            {screenState === "handoff" && <HandoffCard />}

            {/* Desktop-only CTA */}
            <div className="hidden lg:block">
              <DockContent
                screenState={screenState}
                requesting={requesting}
                onStart={handleStart}
                onBack={() => setScreenState("default")}
                onTryAnother={() => setScreenState("handoff")}
                isPreview={isPreview}
                onSwitchState={(s) => { setRequesting(false); setScreenState(s); }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom dock (mobile + tablet only) ─────── */}
      <div
        className="lg:hidden shrink-0 bg-white"
        style={{
          borderTop: "1px solid #E3E9F2",
          paddingTop: "12px",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingBottom: "calc(14px + env(safe-area-inset-bottom))",
        }}
      >
        <DockContent
          screenState={screenState}
          requesting={requesting}
          onStart={handleStart}
          onBack={() => setScreenState("default")}
          onTryAnother={() => setScreenState("handoff")}
          isPreview={isPreview}
          onSwitchState={(s) => { setRequesting(false); setScreenState(s); }}
        />
      </div>
    </div>
  );
}

// ─── Tips list ────────────────────────────────────────────────────────────────

function TipsList() {
  return (
    <div className="flex flex-col" style={{ gap: "14px" }}>
      {TIPS.map(({ title, description, icon }) => (
        <div key={title} className="flex items-center" style={{ gap: "12px" }}>
          <div
            className="shrink-0 flex items-center justify-center text-primary"
            style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#F5F8FC" }}
          >
            {icon}
          </div>
          <div>
            <p style={{ fontSize: "15.5px", fontWeight: 600, color: "#0B1F3A", lineHeight: 1.3 }}>{title}</p>
            <p style={{ fontSize: "14.5px", color: "#56657A", lineHeight: 1.4 }}>{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Denied card ──────────────────────────────────────────────────────────────

function DeniedCard() {
  return (
    <div style={{ background: "#F5F8FC", borderRadius: "16px", padding: "16px" }}>
      <p style={{ fontSize: "15px", fontWeight: 600, color: "#0B1F3A", marginBottom: "6px" }}>
        Camera access is off
      </p>
      <p style={{ fontSize: "14px", color: "#56657A", lineHeight: 1.5 }}>
        Turn it on in your browser settings, then tap Try again. If the camera still won&apos;t work on this device, tap Try another way to continue on your phone.
      </p>
    </div>
  );
}

function InsecureCard() {
  return (
    <div style={{ background: "#F5F8FC", borderRadius: "16px", padding: "16px" }}>
      <p style={{ fontSize: "15px", fontWeight: 600, color: "#0B1F3A", marginBottom: "6px" }}>
        Camera needs a secure connection
      </p>
      <p style={{ fontSize: "14px", color: "#56657A", lineHeight: 1.5 }}>
        This page was opened without https, so your browser won&apos;t allow the camera.
        Open the https link to this page, then tap Try again.
      </p>
    </div>
  );
}

// ─── Handoff card (QR + phone input) ─────────────────────────────────────────

function HandoffCard() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const [copied, setCopied] = useState(false);

  // Live link to the walkaround on the published site, carrying progress so far
  const pageUrl = handoffLink("/sell/walkaround-intro");
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(pageUrl)}`;

  const textLink = () => {
    setSent(true);
    window.location.href = smsLink(phone, pageUrl);
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(pageUrl); setCopied(true); } catch { /* the field below can be selected instead */ }
  };

  return (
    <div style={{ background: "#F5F8FC", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div className="flex justify-center">
        <img src={qrSrc} alt="Scan with your phone to continue" width={160} height={160} style={{ borderRadius: "12px", display: "block" }} />
      </div>
      <p className="text-center" style={{ fontSize: "14px", color: "#56657A", lineHeight: 1.5 }}>
        Scan with your phone to continue. Your progress is saved.
      </p>
      <div style={{ height: "1px", background: "#E3E9F2" }} />
      <div className="flex gap-2">
        <input
          type="tel"
          inputMode="tel"
          placeholder="(801) 555-0192"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Your phone number"
          className="flex-1 text-sm font-medium rounded-xl border"
          style={{ height: "44px", paddingLeft: "12px", paddingRight: "12px", borderColor: "#E3E9F2", background: "white", color: "#0B1F3A", outline: "none" }}
        />
        <button
          type="button"
          onClick={textLink}
          disabled={!phone.trim()}
          className="shrink-0 font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ height: "44px", paddingLeft: "16px", paddingRight: "16px", borderRadius: "12px", fontSize: "14px", background: "var(--color-primary)" }}
        >
          Text me a link
        </button>
      </div>
      {sent && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontSize: "13px", color: "#56657A", textAlign: "center", lineHeight: 1.5 }}>
            Your messaging app should open with the link. Send it to your phone, or copy it:
          </p>
          <div className="flex gap-2 items-center">
            <input
              readOnly
              value={pageUrl}
              aria-label="Link to continue on your phone"
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 min-w-0 text-xs rounded-xl border"
              style={{ height: "36px", paddingLeft: "10px", paddingRight: "10px", borderColor: "#E3E9F2", background: "white", color: "#56657A" }}
            />
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 font-semibold"
              style={{ height: "36px", paddingLeft: "12px", paddingRight: "12px", borderRadius: "10px", fontSize: "13px", color: "#0B1F3A", border: "1.5px solid #D3DCEA", background: "white" }}
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dock content (shared by pinned dock + desktop inline) ────────────────────

function DockContent({
  screenState,
  requesting,
  onStart,
  onBack,
  onTryAnother,
  isPreview = false,
  onSwitchState,
}: {
  screenState: ScreenState;
  requesting: boolean;
  onStart: () => void;
  onBack: () => void;
  /** Camera can't be used on this device: continue on another one (QR / text link). */
  onTryAnother?: () => void;
  isPreview?: boolean;
  onSwitchState?: (s: ScreenState) => void;
}) {
  if (screenState === "handoff") {
    return (
      <div className="flex flex-col" style={{ gap: "6px" }}>
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center font-semibold transition-opacity hover:opacity-70"
          style={{ fontSize: "15px", color: "#8593A6", paddingTop: "4px", paddingBottom: "4px" }}
        >
          ← Back to instructions
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: "6px" }}>
      <button
        type="button"
        onClick={onStart}
        disabled={requesting}
        className="w-full font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-70"
        style={{ height: "56px", borderRadius: "16px", fontSize: "17px", background: "var(--color-primary)" }}
      >
        {requesting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            Requesting access…
          </>
        ) : screenState === "denied" || screenState === "insecure" ? (
          "Try again"
        ) : (
          "Allow camera and start"
        )}
      </button>

      {(screenState === "denied" || screenState === "insecure") && onTryAnother && (
        <button
          type="button"
          onClick={onTryAnother}
          className="w-full font-semibold flex items-center justify-center transition-colors hover:bg-[#F5F8FC]"
          style={{ height: "52px", borderRadius: "16px", fontSize: "16px", color: "#0B1F3A", background: "#FFFFFF", border: "1.5px solid #D3DCEA" }}
        >
          Try another way
        </button>
      )}

      {screenState === "denied" || screenState === "insecure" ? (
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center font-semibold transition-opacity hover:opacity-70"
          style={{ fontSize: "14px", color: "#8593A6", paddingTop: "6px", paddingBottom: "2px" }}
        >
          ← Back to instructions
        </button>
      ) : (
        <p className="text-center" style={{ fontSize: "13px", color: "#8593A6" }}>
          Only used for this evaluation. Nothing is recorded until you start.
        </p>
      )}
    </div>
  );
}

