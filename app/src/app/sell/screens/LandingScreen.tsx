import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowRight, Camera, Clock, Lock, Truck } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { SpinViewer } from "../components/SpinViewer";
import { ActionDock } from "../components/ActionDock";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useSell } from "../SellContext";

// ─── Static data ──────────────────────────────────────────────────────────────

// Generic white vehicle: intro zoom, then the 36-frame white spin.
import { spinVideo, INTRO_VIDEO } from "../spinAssets";

/** true on ≥1024 px, decided once — only the visible SpinViewer plays the intro. */
function useIsDesktopOnce() {
  const [desktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  return desktop;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY",
];

const TRUST_FACTS = [
  { icon: Clock,  stat: "~10 min",  label: "to an offer" },
  { icon: Lock,   stat: "7 days",   label: "offer locked" },
  { icon: Truck,  stat: "$0",       label: "pickup" },
] as const;

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Enter your plate",
    body: "We confirm your year, make, trim, and history in seconds.",
  },
  {
    n: "2",
    title: "Walk around it with your phone",
    body: "8 exterior angles and 4 close-ups, guided step by step.",
  },
  {
    n: "3",
    title: "Get paid at pickup",
    body: "We come to you. Cash out or put the offer toward your next car.",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function LandingScreen() {
  const navigate = useNavigate();
  const { key: visitKey } = useLocation();
  const { setNavDirection, setVehicleColor, setDrivable, setFinancing, setCondition, setHistory, closeupPhotos, toggleCloseupPhoto } = useSell();
  const whiteSpin = spinVideo("white");
  const isDesktop = useIsDesktopOnce();

  const [plate, setPlate] = useState("");
  const [plateState, setPlateState] = useState("UT");
  const [vin, setVin] = useState("");

  const start = () => {
    // A new estimate starts fresh: the white car (same as this screen), no
    // paint color and no question answered. Nothing is assumed.
    setVehicleColor(null);
    setDrivable(null); setFinancing(null); setCondition(null); setHistory(null);
    // No close-up photo is taken yet: clear any from an earlier run.
    closeupPhotos.forEach((id) => toggleCloseupPhoto(id));
    setNavDirection("forward");
    navigate("/sell/vehicle");
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="px-5 pt-8 pb-6 md:px-8 lg:px-10 xl:px-16 lg:pt-14 lg:pb-12">
          <div className="max-w-[1120px] mx-auto">
            <div className="lg:grid lg:grid-cols-[1fr_460px] lg:gap-14 lg:items-start">

              {/* Left column: copy + SpinViewer (mobile) + lookup card + desktop CTA */}
              <div className="flex flex-col gap-5 lg:gap-6">

                {/* Headline */}
                <div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                    Sell or Trade
                  </span>
                  <h1 className="mt-2 font-black text-foreground leading-[1.1] tracking-tight text-[2rem] md:text-4xl lg:text-5xl">
                    Sell your car from your phone in 3&nbsp;steps and 10&nbsp;minutes.
                  </h1>
                  <p className="mt-3 text-foreground text-lg font-semibold leading-snug tracking-tight max-w-md">
                    A firm offer with every dollar explained. We pick the car up and pay you.
                  </p>
                </div>

                {/* SpinViewer — mobile/tablet only; desktop shows it in the right column */}
                <div className="lg:hidden">
                  <SpinViewer video={whiteSpin} autoRotate aspectRatio="4:3" intro={isDesktop ? undefined : INTRO_VIDEO} introKey={visitKey} />
                </div>

                {/* Lookup card ─ segmented plate / VIN lookup */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
                  <Tabs defaultValue="plate">
                    <TabsList className="w-full h-10">
                      <TabsTrigger value="plate" className="flex-1 text-sm">
                        License plate
                      </TabsTrigger>
                      <TabsTrigger value="vin" className="flex-1 text-sm">
                        VIN
                      </TabsTrigger>
                    </TabsList>

                    {/* ── Plate tab ─────────────────────────────────── */}
                    <TabsContent value="plate" className="mt-3">
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
                          aria-label="License plate number"
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
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    {/* ── VIN tab ───────────────────────────────────── */}
                    <TabsContent value="vin" className="mt-3 flex flex-col gap-2">
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
                        aria-label="17-character VIN"
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
                </div>

                {/* Desktop inline CTA — hidden on mobile (ActionDock handles that) */}
                <div className="hidden lg:block">
                  <Button
                    onClick={start}
                    className="h-14 px-8 text-base font-bold rounded-xl gap-2"
                  >
                    Get my offer
                    <ArrowRight className="w-5 h-5 shrink-0" />
                  </Button>
                </div>

              </div>

              {/* Right column: SpinViewer — desktop only */}
              <div className="hidden lg:block sticky top-20">
                <SpinViewer video={whiteSpin} autoRotate aspectRatio="4:3" intro={isDesktop ? INTRO_VIDEO : undefined} introKey={visitKey} />
              </div>

            </div>
          </div>
        </section>

        {/* ── TRUST FACTS ─────────────────────────────────────── */}
        <section className="border-t border-border bg-muted/30 px-5 py-7 md:px-8 lg:px-10 xl:px-16">
          <div className="max-w-[1120px] mx-auto">
            <div className="grid grid-cols-3 gap-4 md:max-w-[480px] md:mx-auto lg:max-w-none lg:gap-10">
              {TRUST_FACTS.map(({ icon: Icon, stat, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] text-primary" />
                  </div>
                  <p className="font-black text-foreground text-[15px] lg:text-lg leading-none">
                    {stat}
                  </p>
                  <p className="text-muted-foreground text-xs lg:text-sm leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────── */}
        {/*
          pb-28 on mobile: clears the ActionDock (~70px) + a comfortable gap.
          pb-10 on desktop: normal section breathing room.
        */}
        <section className="border-t border-border px-5 pt-8 pb-28 md:px-8 lg:px-10 xl:px-16 lg:pb-16">
          <div className="max-w-[1120px] mx-auto md:max-w-[560px] lg:max-w-[1120px]">
            <h2 className="text-xl font-bold text-foreground mb-6">How it works</h2>
            <ol className="flex flex-col divide-y divide-border lg:grid lg:grid-cols-3 lg:divide-y-0 lg:gap-10">
              {HOW_IT_WORKS.map(({ n, title, body }) => (
                <li key={n} className="flex items-start gap-4 py-4 lg:py-0 lg:flex-col lg:gap-3">
                  <span className="text-4xl font-black text-primary/20 leading-none w-8 shrink-0 lg:w-auto">
                    {n}
                  </span>
                  <div>
                    <p className="font-bold text-sm text-foreground">{title}</p>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

      </main>

      <Footer />

      {/* Spacer so footer content clears the fixed ActionDock on mobile */}
      <div className="lg:hidden h-[calc(6rem+env(safe-area-inset-bottom))] bg-[#101820]" />

      {/*
        Mobile/tablet ActionDock.
        Fixed at bottom-0, same z-50 as the floating tab bar — ActionDock
        renders later in the DOM so it stacks above the tab bar, which is
        the expected UX for a primary-flow entry point.
      */}
      <div className="lg:hidden">
        <ActionDock
          primary={{ label: "Get my offer", onClick: start }}
        />
      </div>
    </div>
  );
}
