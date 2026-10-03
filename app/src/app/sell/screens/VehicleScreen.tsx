/**
 * VehicleScreen — Step 1 of 5 "Your car".
 *
 * Mobile layout (top-to-bottom):
 *   H2 → SpinViewer (tinted by selected color) → vehicle name + chips →
 *   color picker → mileage input → EstimateBar → fixed dock (confirm / not-my-car)
 *
 * Desktop layout (≈ 60/40 two-column):
 *   Left (sticky): SpinViewer
 *   Right (sticky card): H2, name+chips, color, mileage, estimate, inline CTAs
 *
 * Color: the SpinViewer swaps to the confirmed color's frame set (white until chosen);
 *
 * "Not my car" opens a bottom Sheet with a plate/VIN re-entry form (same lookup
 * card pattern as the landing screen).
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Camera } from "lucide-react";
import { useSell } from "../SellContext";
import { FlowTopBar } from "../FlowTopBar";
import { SpinViewer } from "../components/SpinViewer";
import { EstimateBar } from "../components/EstimateBar";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/app/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { MOCK_VEHICLE, MOCK_ESTIMATES } from "../mockData";
import { cn } from "@/app/components/ui/utils";

// ─── Colors & frames ──────────────────────────────────────────────────────────
// Color isn't in the VIN, so the car starts white (neutral) and takes on the
// customer's color once they confirm it (white, blue, gray or black).
import { VEHICLE_COLORS as COLORS, spinVideo, spinColorFor, type VehicleColorName } from "../spinAssets";

type ColorName = VehicleColorName;

// ─── US states for the re-entry sheet ────────────────────────────────────────

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function VehicleScreen() {
  const navigate = useNavigate();
  const { setVehicleConfirmed, setNavDirection, vehicleColor, setVehicleColor } = useSell();

  const selectedColor = (vehicleColor as ColorName | null) ?? null;
  const setSelectedColor = (c: ColorName) => setVehicleColor(c);
  const [mileage, setMileage] = useState("31,080");
  const [sheetOpen, setSheetOpen] = useState(false);

  const v = MOCK_VEHICLE;
  const estimate = MOCK_ESTIMATES.afterVehicle;

  const activeColor = COLORS.find((c) => c.name === selectedColor) ?? null;
  const spin = spinVideo(spinColorFor(selectedColor));

  const confirm = () => {
    setVehicleConfirmed(true);
    setNavDirection("forward");
    navigate("/sell/questions");
  };

  // Chips derived from mock vehicle data
  const chips: Array<{ label: string; positive?: boolean }> = [
    { label: "Premium Plus" },
    { label: v.drivetrain },
    { label: `${v.owners} owner` },
    { label: "No accidents reported", positive: true },
  ];

  return (
    <>
      <div className="min-h-dvh bg-card flex flex-col">
        <FlowTopBar />
        <div className="h-[108px] md:h-[49px] shrink-0" aria-hidden="true" />

        {/* ── Two-column grid on desktop, stacked on mobile ─────────── */}
        <div className="flex-1 w-full lg:max-w-[1120px] lg:mx-auto lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10 lg:px-8 lg:py-10 lg:items-start">

          {/* ── LEFT: SpinViewer ───────────────────────────────────── */}
          <div className="lg:sticky lg:top-[4.5rem]">
            {/* H2 on mobile only — sits above the SpinViewer */}
            <div className="px-5 pt-6 pb-4 lg:hidden">
              <h2 className="text-2xl font-bold text-foreground">Is this your car?</h2>
            </div>

            {/* SpinViewer — white until a color is confirmed, then that color's frames */}
            <div className="px-5 lg:px-0">
              <SpinViewer video={spin} autoRotate aspectRatio="4:3" />
            </div>
          </div>

          {/* ── RIGHT: Vehicle details + form + CTAs ──────────────── */}
          <div className="px-5 pt-5 pb-52 lg:px-0 lg:pt-0 lg:pb-0">
            <div
              className="lg:sticky lg:top-[4.5rem] lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:p-6 lg:shadow-[0_8px_24px_rgba(16,24,32,0.10)]"
            >

              {/* Desktop H2 */}
              <h2 className="hidden lg:block text-2xl font-bold text-foreground mb-5">
                Is this your car?
              </h2>

              {/* Vehicle identity */}
              <div className="mb-5">
                <p className="font-black text-xl text-foreground leading-tight">
                  {v.year} {v.make} {v.model}
                </p>
                <p className="text-muted-foreground text-sm mt-0.5">2.5 Turbo</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {chips.map(({ label, positive }) => (
                    <Badge
                      key={label}
                      variant={positive ? undefined : "secondary"}
                      className={cn(
                        "rounded-full text-xs font-semibold",
                        positive &&
                          "bg-[var(--axio-green)]/10 text-[var(--axio-green)] border border-[var(--axio-green)]/25",
                      )}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Color picker */}
              <div className="my-5">
                <p className="text-sm font-bold text-foreground mb-0.5">
                  What color is it?
                </p>
                <p className="text-xs text-muted-foreground mb-4 leading-snug">
                  Color isn&apos;t stored in your VIN, so please confirm it.
                </p>

                <div className="flex items-start gap-5">
                  {COLORS.map((color) => {
                    const active = color.name === selectedColor;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        aria-label={color.name}
                        aria-pressed={active}
                        className="flex flex-col items-center gap-1.5 group focus-visible:outline-none min-w-[48px] min-h-[48px] justify-center"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all duration-200",
                            active
                              ? "ring-2 ring-offset-2 ring-primary scale-110 border-transparent"
                              : "group-hover:scale-105",
                            color.light ? "border-border" : "border-transparent",
                            active && color.light && "ring-primary/70",
                          )}
                          style={{ background: color.hex }}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-semibold transition-colors",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {color.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Mileage input */}
              <div className="my-5">
                <label
                  htmlFor="mileage"
                  className="block text-sm font-bold text-foreground mb-1.5"
                >
                  Mileage
                </label>
                <div className="relative">
                  <Input
                    id="mileage"
                    value={mileage}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setMileage(raw ? Number(raw).toLocaleString("en-US") : "");
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    enterKeyHint="done"
                    className="h-12 pr-9 font-bold text-base rounded-xl border-[1.5px] border-[#C5D0DF] hover:border-[#8593A6] focus-visible:border-primary"
                    aria-label="Current odometer mileage"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">
                    mi
                  </span>
                </div>
              </div>

              {/* Estimate bar */}
              <EstimateBar low={estimate.low} high={estimate.high} />

              {/* Desktop CTAs — inline in the right panel */}
              <div className="hidden lg:flex flex-col gap-2 mt-5">
                <Button
                  onClick={confirm}
                  className="w-full h-14 text-base font-bold rounded-xl"
                >
                  Yes, that&apos;s my car
                </Button>
                <button
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  className="w-full h-10 text-sm text-muted-foreground font-semibold hover:text-foreground transition-colors"
                >
                  Not my car
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ── Mobile / tablet fixed dock ───────────────────────────── */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
          style={{ background: "transparent", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)" }}
        >
          <div
            className="px-5 pt-3 md:max-w-[560px] md:mx-auto"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
          >
            <Button
              onClick={confirm}
              className="w-full h-14 text-base font-bold rounded-xl"
            >
              Yes, that&apos;s my car
            </Button>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="w-full h-11 mt-1.5 text-sm text-muted-foreground font-semibold hover:text-foreground transition-colors"
            >
              Not my car
            </button>
          </div>
        </div>

      </div>

      {/* ── "Not my car" re-entry sheet ─────────────────────────── */}
      <ReenterSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}

// ─── Re-entry sheet ───────────────────────────────────────────────────────────

function ReenterSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [plate, setPlate] = useState("");
  const [plateState, setPlateState] = useState("CA");
  const [vin, setVin] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-0 pb-0 max-h-[85dvh]"
      >
        <div className="px-5 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] overflow-y-auto">
          <SheetHeader className="p-0 text-left mb-5">
            <SheetTitle>Enter your vehicle</SheetTitle>
            <SheetDescription>
              Re-enter your license plate or VIN to look up a different car.
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="plate">
            <TabsList className="w-full h-10 mb-4">
              <TabsTrigger value="plate" className="flex-1 text-sm">
                License plate
              </TabsTrigger>
              <TabsTrigger value="vin" className="flex-1 text-sm">
                VIN
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plate" className="mt-0">
              <div className="flex gap-2">
                <Input
                  placeholder="8ABC123"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="flex-1 h-12 font-mono text-base tracking-widest"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  autoComplete="off"
                  enterKeyHint="go"
                  spellCheck={false}
                  maxLength={8}
                />
                <Select value={plateState} onValueChange={setPlateState}>
                  <SelectTrigger
                    className="w-[5.5rem] h-12 shrink-0 font-mono font-bold"
                    aria-label="Issuing state"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="vin" className="mt-0 flex flex-col gap-2">
              <Input
                placeholder="1HGBH41JXMN109186"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                className="h-12 font-mono text-sm tracking-widest"
                autoCapitalize="characters"
                autoCorrect="off"
                autoComplete="off"
                enterKeyHint="go"
                spellCheck={false}
                maxLength={17}
              />
              <Button
                variant="outline"
                type="button"
                className="w-full h-11 gap-2 text-sm font-semibold"
              >
                <Camera className="w-4 h-4 shrink-0" />
                Scan VIN with camera
              </Button>
            </TabsContent>
          </Tabs>

          <Button className="w-full h-14 font-bold rounded-xl text-base mt-5">
            Look up my car
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
