import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import imgSedan from "../../imports/67A68ED1-2AE2-45BA-9667-7569E26F5690-2.png";
import imgSUV from "../../imports/F620BAD4-ABE3-4093-99F4-B4F4F26B7B93-2.png";
import imgFastback from "../../imports/590B7C3E-889C-41FB-96ED-5362DC379D20-2.png";
import imgTruck from "../../imports/A255EC0B-F5F0-485E-AAD7-1820422EE623-2.png";
import imgEV from "../../imports/98D533DE-BAEA-4A5D-AB71-B4C6D4EDE69F-2.png";
import imgHybrid from "../../imports/54A5D4D8-0A3E-4E1E-892A-5DF10DCCFA29-2.png";
import imgCoupe from "../../imports/2967CBC8-129E-41BF-921B-ECC5EC2D1807-2.png";
import imgHatchback from "../../imports/76A24C27-040B-4AFF-BE98-3678FAABC889-3.png";
import imgWagon from "../../imports/7F93E2FF-3F83-467C-8BF2-FB0F74FB51D6-2.png";
import imgConvertible from "../../imports/AC3D0769-739A-4FF6-B9EC-62CC4181991E-2.png";

const bodyStyles = [
  { label: "Sedan", img: imgSedan },
  { label: "SUV", img: imgSUV },
  { label: "Fastback", img: imgFastback },
  { label: "Truck", img: imgTruck },
  { label: "Electric", img: imgEV },
  { label: "Hybrid", img: imgHybrid },
  { label: "Coupe", img: imgCoupe },
  { label: "Hatchback", img: imgHatchback },
  { label: "Wagon", img: imgWagon },
  { label: "Convertible", img: imgConvertible },
];

const CARD_W = 136; // card width + gap

export function ShopByBodyStyle() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const atStart = activeIndex === 0;
  const atEnd = activeIndex >= bodyStyles.length - 1;

  const scrollTo = useCallback((index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * CARD_W, behavior: "smooth" });
    }
    setActiveIndex(index);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const next = dir === "right"
      ? Math.min(activeIndex + 1, bodyStyles.length - 1)
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
    <div className="flex flex-col gap-4">
      <h2 className="text-[#101820] font-bold" style={{ fontSize: "24px" }}>Shop by body style</h2>

      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-[#D9E2EC] xl:hidden flex items-center justify-center transition-opacity"
          style={{ opacity: atStart ? 0 : 1, pointerEvents: atStart ? "none" : "auto", boxShadow: "0 1px 2px rgba(16,24,32,0.08)" }}
        >
          <ChevronLeft className="w-5 h-5 text-[#008FDB]" />
        </button>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto"
          style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth", msOverflowStyle: "none", scrollbarWidth: "none", padding: "8px 4px 10px", margin: "-8px -4px -10px" }}
        >
          {bodyStyles.map(({ label, img }) => (
            <button
              key={label}
              className="relative flex-none xl:flex-1 bg-white border border-[#D9E2EC] rounded-2xl p-3 hover:border-[#008FDB] hover:shadow-md transition-all group overflow-hidden"
              style={{ scrollSnapAlign: "start", width: "120px", minWidth: "120px" }}
            >
              <img
                src={img}
                alt={label}
                className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-200"
                style={{ mixBlendMode: "multiply" }}
              />
              <span className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold text-[#101820] group-hover:text-[#008FDB] transition-colors">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-[#D9E2EC] xl:hidden flex items-center justify-center transition-opacity"
          style={{ opacity: atEnd ? 0 : 1, pointerEvents: atEnd ? "none" : "auto", boxShadow: "0 1px 2px rgba(16,24,32,0.08)" }}
        >
          <ChevronRight className="w-5 h-5 text-[#008FDB]" />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex xl:hidden justify-center gap-1.5">
        {bodyStyles.map((_, i) => (
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
  );
}
