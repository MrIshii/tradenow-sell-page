import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SellState {
  plate: string;
  vehicleConfirmed: boolean;
  /** Exterior color the customer confirmed (color is not encoded in the VIN). */
  vehicleColor: string | null;

  // ── Question step answers ──────────────────────────────────────────
  drivable:  "yes" | "issues" | "no"           | null;
  financing: "none" | "loan" | "lease"          | null;
  condition: "clean" | "damage" | "mods"        | null;
  history:   "no" | "yes" | "unsure"            | null;

  // ── Derived booleans ───────────────────────────────────────────────
  hasLoan: boolean | null;
  selfRating: number;
  hasIssues: boolean | null;
  hasModifications: boolean | null;

  walkaroundPhotos: Set<string>;
  closeupPhotos: Set<string>;
  navDirection: "forward" | "back";
  payoutMethod: "check" | "bank" | null;
  selectedDay: string | null;
  selectedTime: string | null;
}

interface SellContextType extends SellState {
  setPlate: (v: string) => void;
  setVehicleConfirmed: (v: boolean) => void;
  setVehicleColor: (v: string | null) => void;

  setDrivable:  (v: "yes" | "issues" | "no" | null) => void;
  /** Also derives hasLoan. */
  setFinancing: (v: "none" | "loan" | "lease" | null) => void;
  /** Also derives hasIssues + hasModifications. */
  setCondition: (v: "clean" | "damage" | "mods" | null) => void;
  setHistory:   (v: "no" | "yes" | "unsure" | null) => void;

  setHasLoan: (v: boolean) => void;
  setSelfRating: (v: number) => void;
  setHasIssues: (v: boolean) => void;
  setHasModifications: (v: boolean) => void;

  toggleWalkaroundPhoto: (id: string) => void;
  toggleCloseupPhoto: (id: string) => void;
  setNavDirection: (v: "forward" | "back") => void;
  setPayoutMethod: (v: "check" | "bank") => void;
  setSelectedDay: (v: string) => void;
  setSelectedTime: (v: string) => void;
}

const SellContext = createContext<SellContextType | null>(null);

// ─── localStorage helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = "axio_sell_v1";

interface Persisted {
  plate: string;
  vehicleConfirmed: boolean;
  vehicleColor?: string | null;
  drivable: SellState["drivable"];
  financing: SellState["financing"];
  condition: SellState["condition"];
  history: SellState["history"];
  hasLoan: boolean | null;
  hasIssues: boolean | null;
  hasModifications: boolean | null;
  walkaroundPhotos: string[];
  closeupPhotos: string[];
  payoutMethod: "check" | "bank" | null;
  selectedDay: string | null;
  selectedTime: string | null;
}

function readStorage(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

function writeStorage(s: Persisted) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

// ─── Continue on another device ─────────────────────────────────────────────────
// The QR code / texted link opens the published site and carries the progress
// saved so far (?resume=…), so the phone picks up where the computer left off.

/** Public address of the published demo (used when this page isn't it, e.g. Make's preview). */
export const PUBLIC_SITE = "https://lance-sedan-68792082.figma.site";

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string) {
  const bin = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** Link to `path` on the live site, carrying the saved progress. */
export function handoffLink(path: string): string {
  const onLiveSite =
    typeof window !== "undefined" &&
    window.self === window.top &&
    window.location.protocol === "https:" &&
    !/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  // Hash-routed builds (the standalone package, the Solid# embed) keep the page's
  // own address and put the step after "#", so no server routing is needed.
  const hashRouted = typeof window !== "undefined" && window.location.hash.startsWith("#/");
  const url = onLiveSite && hashRouted
    ? new URL(window.location.pathname, window.location.origin)
    : new URL(path, onLiveSite ? window.location.origin : PUBLIC_SITE);
  if (onLiveSite && hashRouted) url.hash = path;
  const progress = typeof window !== "undefined" ? readStorage() : null;
  if (progress) {
    try { url.searchParams.set("resume", toBase64Url(JSON.stringify(progress))); } catch {}
  }
  return url.toString();
}

/** Opens the device's messaging app with the link addressed to `phone`. */
export function smsLink(phone: string, url: string): string {
  const to = phone.replace(/[^\d+]/g, "");
  return `sms:${to}?&body=${encodeURIComponent(`Continue your TradeNow offer: ${url}`)}`;
}

/** Arriving from a handoff link: save the carried progress, then tidy the address bar. */
function importResumeFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("resume");
    if (!code) return;
    const data = JSON.parse(fromBase64Url(code)) as Persisted;
    writeStorage(data);
    params.delete("resume");
    const qs = params.toString();
    window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash);
  } catch {}
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SellProvider({ children }: { children: ReactNode }) {
  // Restore from localStorage on first render (synchronous so no flash).
  // A handoff link's carried progress is saved first, so it's what gets restored.
  const saved = typeof window !== "undefined" ? (importResumeFromUrl(), readStorage()) : null;

  const [plate, setPlate] = useState(saved?.plate ?? "8KTR214");
  const [vehicleConfirmed, setVehicleConfirmed] = useState(saved?.vehicleConfirmed ?? false);
  const [vehicleColor, setVehicleColor] = useState<string | null>(saved?.vehicleColor ?? null);

  const [drivable,  setDrivableState]  = useState<SellState["drivable"]>(saved?.drivable ?? null);
  const [financing, setFinancingState] = useState<SellState["financing"]>(saved?.financing ?? null);
  const [condition, setConditionState] = useState<SellState["condition"]>(saved?.condition ?? null);
  const [history,   setHistoryState]   = useState<SellState["history"]>(saved?.history ?? null);

  const [hasLoan,           setHasLoan]           = useState<boolean | null>(saved?.hasLoan ?? null);
  const [selfRating,        setSelfRating]         = useState(0);
  const [hasIssues,         setHasIssues]          = useState<boolean | null>(saved?.hasIssues ?? null);
  const [hasModifications,  setHasModifications]   = useState<boolean | null>(saved?.hasModifications ?? null);

  const [walkaroundPhotos, setWalkaroundPhotos] = useState<Set<string>>(
    new Set(saved?.walkaroundPhotos ?? []),
  );
  const [closeupPhotos, setCloseupPhotos] = useState<Set<string>>(
    new Set(saved?.closeupPhotos ?? []),
  );

  // navDirection is transient — never persisted
  const [navDirection, setNavDirection] = useState<"forward" | "back">("forward");

  const [payoutMethod, setPayoutMethod] = useState<"check" | "bank" | null>(saved?.payoutMethod ?? null);
  const [selectedDay,  setSelectedDay]  = useState<string | null>(saved?.selectedDay ?? null);
  const [selectedTime, setSelectedTime] = useState<string | null>(saved?.selectedTime ?? null);

  // ── Persist to localStorage on every relevant state change ──────────────────
  useEffect(() => {
    writeStorage({
      plate, vehicleConfirmed, vehicleColor,
      drivable, financing, condition, history,
      hasLoan, hasIssues, hasModifications,
      walkaroundPhotos: Array.from(walkaroundPhotos),
      closeupPhotos: Array.from(closeupPhotos),
      payoutMethod, selectedDay, selectedTime,
    });
  }, [
    plate, vehicleConfirmed, vehicleColor,
    drivable, financing, condition, history,
    hasLoan, hasIssues, hasModifications,
    walkaroundPhotos, closeupPhotos,
    payoutMethod, selectedDay, selectedTime,
  ]);

  // ── Setters with derived state ───────────────────────────────────────────────

  const setFinancing = (v: "none" | "loan" | "lease" | null) => {
    setFinancingState(v);
    setHasLoan(v === null ? null : v !== "none");
  };

  const setCondition = (v: "clean" | "damage" | "mods" | null) => {
    setConditionState(v);
    setHasIssues(v === null ? null : v === "damage");
    setHasModifications(v === null ? null : v === "mods");
  };

  const toggleWalkaroundPhoto = (id: string) =>
    setWalkaroundPhotos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleCloseupPhoto = (id: string) =>
    setCloseupPhotos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <SellContext.Provider
      value={{
        plate, setPlate,
        vehicleConfirmed, setVehicleConfirmed,
        vehicleColor, setVehicleColor,

        drivable,  setDrivable: setDrivableState,
        financing, setFinancing,
        condition, setCondition,
        history,   setHistory: setHistoryState,

        hasLoan, setHasLoan,
        selfRating, setSelfRating,
        hasIssues, setHasIssues,
        hasModifications, setHasModifications,

        walkaroundPhotos, toggleWalkaroundPhoto,
        closeupPhotos, toggleCloseupPhoto,
        navDirection, setNavDirection,
        payoutMethod, setPayoutMethod,
        selectedDay, setSelectedDay,
        selectedTime, setSelectedTime,
      }}
    >
      {children}
    </SellContext.Provider>
  );
}

export function useSell() {
  const ctx = useContext(SellContext);
  if (!ctx) throw new Error("useSell must be used within SellProvider");
  return ctx;
}
