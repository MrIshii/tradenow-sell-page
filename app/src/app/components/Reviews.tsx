import { useState, useRef, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  { id: 1, name: "Marcus T.", location: "Glendale, CA", rating: 5, date: "May 28, 2026", vehicle: "2023 Toyota Tacoma", text: "Found my truck in 20 minutes and had financing sorted before I walked in the door. The monthly payment tool was spot-on. No surprises at the dealership. AutoNexus made the whole experience actually enjoyable." },
  { id: 2, name: "Priya S.", location: "Santa Monica, CA", rating: 5, date: "June 2, 2026", vehicle: "2022 Honda CR-V Hybrid", text: "I was dreading the car buying process but AutoNexus completely changed that. The pre-qualification took 3 minutes, my rate was better than my bank offered, and the dealer had everything ready. Drove home same day." },
  { id: 3, name: "Derek W.", location: "Torrance, CA", rating: 4, date: "May 19, 2026", vehicle: "2024 Chevy Silverado", text: "Really impressed with the transparency. Every fee was shown upfront. The payment calculator matched almost exactly what I paid. Only reason for 4 stars is I had to wait a bit for the trade-in appraisal." },
  { id: 4, name: "Sofia M.", location: "Pasadena, CA", rating: 5, date: "June 4, 2026", vehicle: "2022 Jeep Wrangler", text: "I specifically came to AutoNexus because of the no-haggle pricing. Zero pressure, everything online before I showed up. The Wrangler I wanted was exactly as described and the condition was perfect." },
  { id: 5, name: "James K.", location: "Burbank, CA", rating: 5, date: "June 1, 2026", vehicle: "2023 Ford F-150", text: "The search filters are incredible. I set my monthly budget, my must-haves, and AutoNexus gave me a short list that actually matched. No wasted trips. My F-150 was exactly what I wanted at a price I could afford." },
  { id: 6, name: "Anika R.", location: "Long Beach, CA", rating: 5, date: "May 30, 2026", vehicle: "2023 Tesla Model 3", text: "Buying an EV can be overwhelming but AutoNexus broke it all down clearly. Range, incentives, charging, all in one place. My Model 3 was delivered cleaner than expected and the whole deal took under 48 hours." },
  { id: 7, name: "Tom H.", location: "Riverside, CA", rating: 4, date: "May 22, 2026", vehicle: "2021 Subaru Outback", text: "Great experience overall. The CARFAX report was right there on the listing, no asking required. The dealer was professional and didn't try any last-minute add-ons. Would absolutely use AutoNexus again." },
  { id: 8, name: "Lena P.", location: "Culver City, CA", rating: 5, date: "June 5, 2026", vehicle: "2022 Hyundai Tucson", text: "I was a first-time buyer and honestly terrified. AutoNexus's guides walked me through everything. My loan came back approved in minutes and the dealer was expecting me with paperwork already prepped. Life-changing experience." },
  { id: 9, name: "Carlos V.", location: "Pomona, CA", rating: 5, date: "May 25, 2026", vehicle: "2022 RAM 1500", text: "Trade-in was seamless. Got an offer online, the dealer honored it on the spot, and it knocked a nice chunk off my monthly. AutoNexus's payment estimates were dead accurate. Couldn't be happier with my RAM." },
  { id: 10, name: "Rachel B.", location: "Sherman Oaks, CA", rating: 5, date: "June 3, 2026", vehicle: "2023 Mazda CX-5", text: "The inspection report saved me from buying a lemon. One car I liked had a flagged item so I passed on it. AutoNexus showed me a comparable one nearby with a clean bill of health. Found my CX-5 the same afternoon." },
  { id: 11, name: "Brian L.", location: "Anaheim, CA", rating: 4, date: "May 17, 2026", vehicle: "2021 Nissan Rogue", text: "Solid platform. The shop-by-payment feature is genuinely useful. It filtered out everything out of my range automatically. The dealer was responsive and the handoff was smooth. Minor quibble: photo quality on listings varies." },
  { id: 12, name: "Mei C.", location: "Irvine, CA", rating: 5, date: "June 6, 2026", vehicle: "2024 Toyota RAV4 Hybrid", text: "AutoNexus found me a RAV4 Hybrid with every option I wanted within 30 miles. The financing rate beat my credit union. I was in and out of the dealership in under two hours. This is how buying a car should always feel." },
  { id: 13, name: "Darius F.", location: "Fontana, CA", rating: 5, date: "May 31, 2026", vehicle: "2022 Kia Telluride", text: "My wife and I both loved how stress-free this was. We compared three Tellurides side-by-side, saw full breakdowns of monthly costs, and picked our favorite in an evening. The dealer had our paperwork ready the next morning." },
  { id: 14, name: "Nina G.", location: "West Hollywood, CA", rating: 5, date: "June 7, 2026", vehicle: "2023 Volvo XC40", text: "Finally, a car marketplace that respects your time. No spam calls, no pressure tactics. Clean listings, honest pricing, and a smooth buying flow. My XC40 arrived exactly as described and I got a rate I'm proud of." },
];

const CARD_W = 288;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-3.5 h-3.5 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-[#D9E2EC]"}`} />
      ))}
    </div>
  );
}

export function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const atStart = activeIndex === 0;
  const atEnd = activeIndex >= reviews.length - 1;

  const scrollTo = useCallback((index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * CARD_W, behavior: "smooth" });
    }
    setActiveIndex(index);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const next = dir === "right"
      ? Math.min(activeIndex + 1, reviews.length - 1)
      : Math.max(activeIndex - 1, 0);
    scrollTo(next);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / CARD_W);
      setActiveIndex(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-[#F5F7FA] py-14 lg:py-16">
      <div className="w-full px-10 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[#101820] font-bold" style={{ fontSize: "24px" }}>Best shoppers. Best reviews.</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#667481]">4.8 out of 5 · 12,400+ verified reviews</span>
            </div>
          </div>
          <button className="text-sm font-bold text-[#101820] border border-[#D9E2EC] bg-white px-4 py-2.5 rounded-xl hover:bg-[#D9E2EC] transition-colors hidden md:block min-h-[44px]">
            Read All Reviews
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-[#D9E2EC] flex items-center justify-center transition-opacity"
            style={{ opacity: atStart ? 0 : 1, pointerEvents: atStart ? "none" : "auto", boxShadow: "0 1px 2px rgba(16,24,32,0.08)" }}
          >
            <ChevronLeft className="w-5 h-5 text-[#008FDB]" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3"
            style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth", msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {reviews.map((r) => (
              <div
                key={r.id}
                className="flex-none bg-white rounded-2xl border border-[#D9E2EC] p-4 hover:shadow-md transition-shadow"
                style={{ width: "272px", scrollSnapAlign: "start", boxShadow: "0 1px 2px rgba(16, 24, 32, 0.08)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#101820] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {r.name[0]}
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-xs font-bold text-[#101820] mb-0.5">{r.name}</p>
                <p className="text-[10px] font-semibold text-[#667481] mb-2">{r.location} · {r.date}</p>
                <span
                  className="inline-block text-[10px] font-bold text-[#008FDB] mb-2 px-2 py-0.5 rounded-lg"
                  style={{ background: "rgba(0,143,219,0.08)" }}
                >
                  {r.vehicle}
                </span>
                <p className="text-xs text-[#667481] leading-relaxed line-clamp-4" style={{ lineHeight: "18px" }}>{r.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-[#D9E2EC] flex items-center justify-center transition-opacity"
            style={{ opacity: atEnd ? 0 : 1, pointerEvents: atEnd ? "none" : "auto", boxShadow: "0 1px 2px rgba(16,24,32,0.08)" }}
          >
            <ChevronRight className="w-5 h-5 text-[#008FDB]" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mx-[0px] my-[16px] px-[0px] py-[12px]">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="rounded-full transition-all"
              style={{
                width: i === activeIndex ? 20 : 8,
                height: 8,
                background: i === activeIndex ? "#008FDB" : "#D9E2EC",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
