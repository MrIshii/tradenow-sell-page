import { useState, useRef, useEffect, useCallback } from "react";
import { Heart, MapPin, Gauge, ChevronLeft, ChevronRight } from "lucide-react";

const vehicles = [
  // ── Pre-Owned ──────────────────────────────────────────────────────────────
  {
    id: 1, year: 2021, make: "Toyota", model: "Tacoma", trim: "TRD Off Road 4x4",
    price: 34985, monthly: 489, miles: 38420, location: "Sandy, UT",
    condition: "Used", badge: "Great Value", badgeBg: "#008FDB", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 2, year: 2020, make: "Ford", model: "F-150", trim: "XLT SuperCrew 4WD",
    price: 37900, monthly: 531, miles: 52100, location: "Ogden, UT",
    condition: "Used", badge: "Price Drop", badgeBg: "#C1121F", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 3, year: 2020, make: "Jeep", model: "Wrangler", trim: "Unlimited Sahara",
    price: 31500, monthly: 441, miles: 44700, location: "Orem, UT",
    condition: "Used", badge: "Verified Vehicle", badgeBg: "#2F6F3E", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1591738802175-709fedef8288?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 4, year: 2022, make: "RAM", model: "1500", trim: "Laramie 4x4",
    price: 45750, monthly: 639, miles: 22100, location: "Salt Lake City, UT",
    condition: "Used", badge: null, badgeBg: "", badgeText: "", carfax: true,
    img: "https://images.unsplash.com/photo-1749237435732-3969d62a5123?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 5, year: 2021, make: "Honda", model: "CR-V", trim: "EX-L AWD",
    price: 29400, monthly: 411, miles: 31800, location: "Riverdale, UT",
    condition: "Used", badge: "Great Value", badgeBg: "#008FDB", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1623597780975-38ccd5030c83?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 6, year: 2021, make: "Toyota", model: "RAV4", trim: "XLE Premium AWD",
    price: 31500, monthly: 441, miles: 29800, location: "Sandy, UT",
    condition: "Used", badge: "Great Value", badgeBg: "#008FDB", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1615887110697-0819ec23465f?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 7, year: 2022, make: "Tesla", model: "Model 3", trim: "Long Range AWD",
    price: 38500, monthly: 539, miles: 18100, location: "South Jordan, UT",
    condition: "Used", badge: "Low Mileage", badgeBg: "#D9E2EC", badgeText: "#101820", carfax: true,
    img: "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 8, year: 2020, make: "Subaru", model: "Outback", trim: "Limited XT",
    price: 26750, monthly: 374, miles: 48200, location: "Ogden, UT",
    condition: "Used", badge: "Verified Vehicle", badgeBg: "#2F6F3E", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1609772168547-d216c44c3f85?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 9, year: 2021, make: "Nissan", model: "Rogue", trim: "SV AWD",
    price: 23400, monthly: 327, miles: 34900, location: "Orem, UT",
    condition: "Used", badge: null, badgeBg: "", badgeText: "", carfax: true,
    img: "https://images.unsplash.com/photo-1551817280-6d59c77ce1b8?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 10, year: 2021, make: "Hyundai", model: "Tucson", trim: "SEL AWD",
    price: 24900, monthly: 348, miles: 37400, location: "Salt Lake City, UT",
    condition: "Used", badge: "Price Drop", badgeBg: "#C1121F", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1575090536203-2a6193126514?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 11, year: 2020, make: "Chevrolet", model: "Silverado 1500", trim: "LT Crew Cab 4WD",
    price: 38200, monthly: 534, miles: 55600, location: "Murray, UT",
    condition: "Used", badge: "Great Value", badgeBg: "#008FDB", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1592869070665-ed8ee2baad3b?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 12, year: 2021, make: "Mazda", model: "CX-5", trim: "Grand Touring AWD",
    price: 27800, monthly: 389, miles: 26300, location: "Provo, UT",
    condition: "Used", badge: "Verified Vehicle", badgeBg: "#2F6F3E", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1643142311296-304953706775?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 13, year: 2020, make: "GMC", model: "Sierra 1500", trim: "SLE Crew Cab 4WD",
    price: 36500, monthly: 511, miles: 47800, location: "Riverdale, UT",
    condition: "Used", badge: null, badgeBg: "", badgeText: "", carfax: true,
    img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 14, year: 2022, make: "Kia", model: "Telluride", trim: "EX AWD",
    price: 39900, monthly: 558, miles: 19200, location: "Sandy, UT",
    condition: "Used", badge: "Low Mileage", badgeBg: "#D9E2EC", badgeText: "#101820", carfax: true,
    img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 15, year: 2021, make: "Ford", model: "Explorer", trim: "XLT 4WD",
    price: 33700, monthly: 471, miles: 41500, location: "South Jordan, UT",
    condition: "Used", badge: "Great Value", badgeBg: "#008FDB", badgeText: "#FFFFFF", carfax: true,
    img: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400&h=240&fit=crop&auto=format",
  },

  // ── New ────────────────────────────────────────────────────────────────────
  {
    id: 16, year: 2025, make: "Chevrolet", model: "Silverado 1500", trim: "LT Trail Boss",
    price: 54995, monthly: 769, miles: 8, location: "South Jordan, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1592869070665-ed8ee2baad3b?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 17, year: 2025, make: "Ford", model: "F-150", trim: "Lariat PowerBoost 4WD",
    price: 62400, monthly: 871, miles: 12, location: "Ogden, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 18, year: 2025, make: "Toyota", model: "RAV4 Hybrid", trim: "XSE AWD",
    price: 38500, monthly: 539, miles: 5, location: "Sandy, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1615887110697-0819ec23465f?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 19, year: 2025, make: "Honda", model: "CR-V", trim: "Sport Hybrid AWD",
    price: 36900, monthly: 516, miles: 0, location: "Riverdale, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1623597780975-38ccd5030c83?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 20, year: 2025, make: "Jeep", model: "Grand Cherokee", trim: "Limited 4x4",
    price: 52800, monthly: 738, miles: 22, location: "Orem, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 21, year: 2025, make: "Tesla", model: "Model Y", trim: "Long Range AWD",
    price: 49990, monthly: 699, miles: 3, location: "South Jordan, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 22, year: 2025, make: "RAM", model: "1500", trim: "Big Horn Crew Cab 4x4",
    price: 51200, monthly: 716, miles: 18, location: "Murray, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1749237435732-3969d62a5123?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 23, year: 2025, make: "Hyundai", model: "Tucson", trim: "SEL Hybrid AWD",
    price: 34600, monthly: 484, miles: 0, location: "Salt Lake City, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1575090536203-2a6193126514?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 24, year: 2025, make: "Nissan", model: "Pathfinder", trim: "SL 4WD",
    price: 44800, monthly: 626, miles: 9, location: "Provo, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1551817280-6d59c77ce1b8?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 25, year: 2025, make: "Kia", model: "Telluride", trim: "SX AWD",
    price: 47900, monthly: 669, miles: 14, location: "Sandy, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 26, year: 2025, make: "Subaru", model: "Outback", trim: "Onyx Edition XT",
    price: 38200, monthly: 534, miles: 0, location: "Ogden, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1609772168547-d216c44c3f85?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 27, year: 2025, make: "GMC", model: "Sierra 1500", trim: "Elevation Crew Cab 4WD",
    price: 55300, monthly: 773, miles: 7, location: "Riverdale, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 28, year: 2025, make: "Toyota", model: "Tundra", trim: "SR5 CrewMax 4WD",
    price: 56400, monthly: 788, miles: 11, location: "South Jordan, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 29, year: 2025, make: "Ford", model: "Explorer", trim: "ST-Line 4WD",
    price: 46700, monthly: 653, miles: 4, location: "Murray, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400&h=240&fit=crop&auto=format",
  },
  {
    id: 30, year: 2025, make: "Mazda", model: "CX-50", trim: "Turbo Premium Plus AWD",
    price: 42900, monthly: 600, miles: 0, location: "Salt Lake City, UT",
    condition: "New", badge: "New Arrival", badgeBg: "#101820", badgeText: "#FFFFFF", carfax: false,
    img: "https://images.unsplash.com/photo-1609037406966-e0809e3ed8c6?w=400&h=240&fit=crop&auto=format",
  },
];

function CarfaxBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-[#003087] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg">
      <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 110 10A5 5 0 018 3zm-.5 2v4l3 1.5-.5 1L6.5 10V5h1z"/>
      </svg>
      CARFAX Inspected
    </span>
  );
}

const CARD_W = 272;

export function PopularVehicles() {
  const [tab, setTab] = useState<"used" | "new">("used");
  const [saved, setSaved] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayed = tab === "new"
    ? vehicles.filter((v) => v.condition === "New")
    : vehicles.filter((v) => v.condition === "Used");

  const atStart = activeIndex === 0;
  const atEnd = activeIndex >= displayed.length - 1;

  const toggleSave = (id: number) => {
    setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const scrollTo = useCallback((index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * CARD_W, behavior: "smooth" });
    }
    setActiveIndex(index);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const next = dir === "right"
      ? Math.min(activeIndex + 1, displayed.length - 1)
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

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    setActiveIndex(0);
  }, [tab]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#101820] font-bold mb-1" style={{ fontSize: "24px" }}>Best Deals</h2>
          <p className="text-xs font-semibold text-[#667481]">Based on ZIP code 84095 · Showing {displayed.length} results</p>
        </div>
        <div className="flex bg-white border border-[#D9E2EC] rounded-xl overflow-hidden">
          <button
            onClick={() => setTab("used")}
            className={`px-4 py-2 text-xs font-bold transition-colors min-h-[40px] ${tab === "used" ? "bg-[#101820] text-white" : "text-[#667481] hover:bg-[#F5F7FA]"}`}
          >
            Pre-Owned
          </button>
          <button
            onClick={() => setTab("new")}
            className={`px-4 py-2 text-xs font-bold transition-colors min-h-[40px] ${tab === "new" ? "bg-[#101820] text-white" : "text-[#667481] hover:bg-[#F5F7FA]"}`}
          >
            New
          </button>
        </div>
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
          className="flex gap-4 overflow-x-auto bg-[#00000000]"
          style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth", msOverflowStyle: "none", scrollbarWidth: "none", padding: "12px 4px 16px", margin: "-12px -4px -16px" }}
        >
          {(displayed.length > 0 ? displayed : vehicles).map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-[#D9E2EC] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex-none w-64"
              style={{ scrollSnapAlign: "start", boxShadow: "0 2px 8px rgba(16, 24, 32, 0.08)" }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={v.img}
                  alt={`${v.year} ${v.make} ${v.model}`}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {v.badge && (
                  <span
                    className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: v.badgeBg, color: v.badgeText }}
                  >
                    {v.badge}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(v.id); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform border border-[#D9E2EC]"
                >
                  <Heart className={`w-3.5 h-3.5 ${saved.includes(v.id) ? "fill-[#C1121F] text-[#C1121F]" : "text-[#667481]"}`} />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#667481] mb-0.5">{v.condition} · {v.year}</p>
                <p className="text-sm font-bold text-[#101820] leading-tight">{v.make} {v.model}</p>
                <p className="text-xs text-[#667481] mb-2">{v.trim}</p>
                {v.carfax && <div className="mb-2"><CarfaxBadge /></div>}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-base font-black text-[#101820]" style={{ fontVariantNumeric: "tabular-nums" }}>${v.price.toLocaleString()}</p>
                    <p className="text-[10px] font-semibold text-[#667481]">${v.monthly}/mo est.</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-[#667481]">
                      <Gauge className="w-3 h-3" />
                      {v.miles.toLocaleString()} mi
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-[#667481]">
                      <MapPin className="w-3 h-3" />
                      {v.location}
                    </div>
                  </div>
                </div>
                <button className="w-full text-sm font-bold bg-[#008FDB] text-white py-2 rounded-xl hover:bg-[#00648F] transition-colors min-h-[40px]">
                  View Details
                </button>
              </div>
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

      <div className="flex justify-center gap-1.5 mx-[0px] mt-[42px] mb-[0px]">
        {(displayed.length > 0 ? displayed : vehicles).map((_, i) => (
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

      <div className="mt-8 text-center">
        <button className="text-sm font-bold text-[#101820] border border-[#D9E2EC] bg-[#F5F7FA] px-6 py-3 rounded-xl hover:bg-[#D9E2EC] transition-colors min-h-[44px]">
          View All Vehicles →
        </button>
      </div>
    </div>
  );
}
