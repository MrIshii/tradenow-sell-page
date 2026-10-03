import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Sparkles } from "lucide-react";
import heroImg from "../../imports/067bc735-5ae1-4ce6-ae75-e7a47237150e.png";
import imgSUVs from "../../imports/01b7082c-f03c-4d2c-9cbc-402b96c0c4ad.png";
import imgSedans from "../../imports/5ca2303f-4530-4b10-86bf-3c2175738592.png";
import imgTrucks from "../../imports/2f0a0bc4-a6e2-4524-b0dc-725bd95be28b.png";
import imgEVs from "../../imports/6d61ec94-680f-4da7-b938-8ec0ec6f6e4b.png";
import imgHybrids from "../../imports/d632cffa-13a6-4285-a7b7-921b6985f398.png";
import imgCoupes from "../../imports/a96b421a-1a53-4c9e-9d81-fed81528d6aa.png";
import imgHatchbacks from "../../imports/f37dfa9b-d7db-4d91-ac2e-c842b2221304.png";
import imgWagons from "../../imports/2955f391-f1f6-42f8-a538-2344f3690c7b.png";
import imgConvertibles from "../../imports/f30e9db3-87ac-4db2-903c-52e7c6caa6bf.png";
import imgPluginHybrids from "../../imports/6b769c27-9f55-415c-b85d-c7f1994a1920.png";
import imgMinivans from "../../imports/6d47f7c1-1a02-403d-8edf-fc3e22ebc5df.png";

const vehicleStyles = [
  { label: "SUVs", img: imgSUVs },
  { label: "Sedans", img: imgSedans },
  { label: "Trucks", img: imgTrucks },
  { label: "EVs", img: imgEVs },
  { label: "Hybrids", img: imgHybrids },
  { label: "Coupes", img: imgCoupes },
  { label: "Hatchbacks", img: imgHatchbacks },
  { label: "Wagons", img: imgWagons },
  { label: "Convertibles", img: imgConvertibles },
  { label: "Plug-in Hybrids", img: imgPluginHybrids },
  { label: "Minivans", img: imgMinivans },
];

const recommended = ["Shop Great Deals", "Price Drops", "Free Shipping", "Cars Under $20,000", "Soonest Availability"];

const trending = [
  "Rivian R1S/R1T", "Tesla Model 3", "Chevrolet Equinox", "Nissan Rogue",
  "Ford Escape", "Ford Explorer", "Toyota Camry", "Honda Civic",
  "Nissan Altima", "Jeep Grand Cherokee", "Ford F-150 SuperCrew",
];

export function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative bg-white border-b border-border overflow-visible">
      {open && (
        <div
          className="fixed inset-0 bg-black/40"
          style={{ zIndex: 400 }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile image with h1 overlaid */}
      <div className="relative block lg:hidden">
        <img
          src={heroImg}
          alt="Family with Subaru SUV in front of snowy mountains"
          className="w-full object-cover object-center"
          style={{ height: "200px" }}
        />
        <div className="absolute inset-0 flex items-start px-5 pt-5">
          <h1
            className="text-[#101820] leading-tight"
            style={{ fontSize: "32px", lineHeight: 1.15, fontWeight: 800 }}
          >
            Find Your Next<br />Car Fast
          </h1>
        </div>
      </div>

      {/* Desktop image — absolute right */}
      <img
        src={heroImg}
        alt="Family with Subaru SUV in front of snowy mountains"
        className="hidden lg:block absolute top-0 right-0 h-full object-cover object-right"
        style={{ width: "80%" }}
      />

      <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 items-stretch lg:min-h-[480px]">
        <div className="px-5 sm:px-10 lg:px-16 pt-6 pb-8 sm:py-12 lg:py-16">
          {/* h1 desktop only */}
          <h1
            className="hidden lg:block text-[#101820] leading-tight mb-4"
            style={{ fontSize: "64px", lineHeight: 1, fontWeight: 800 }}
          >
            Find Your Next<br />
            Car Fast
          </h1>
          {/* Paragraph desktop only */}
          <p className="hidden lg:block text-[#667481] mb-6 sm:mb-8" style={{ fontSize: "20px", lineHeight: "30px", fontWeight: 400 }}>
            Shop affordable used cars, premium vehicles, trucks, SUVs, and family-ready options across AutoNexus locations.
          </p>

          <div ref={containerRef} className="relative" style={{ zIndex: 500 }}>
            <div
              className={`flex items-center bg-white border-2 px-4 sm:px-5 py-3 gap-3 transition-all ${open ? "border-[#008FDB] rounded-t-2xl rounded-b-none" : "border-[#D9E2EC] rounded-2xl hover:border-[#008FDB]"}`}
            >
              <Search className="w-4 h-4 text-[#667481] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder="SUV under $500/mo, Toyota truck, EV..."
                className="flex-1 text-[#101820] placeholder:text-[#667481] focus:outline-none bg-transparent min-w-0"
                style={{ fontSize: 15, fontWeight: 400 }}
              />
              <button className="shrink-0 hover:opacity-70 transition-opacity">
                <Sparkles className="w-5 h-5 text-[#667481]" />
              </button>
            </div>

            {open && (
              <div className="absolute left-0 right-0 bg-white border-2 border-[#008FDB] border-t-0 rounded-b-2xl z-[9999] px-4 sm:px-5 py-4 flex flex-col gap-5">
                <div>
                  <p className="text-xs font-bold text-[#101820] uppercase tracking-widest mb-3">Vehicle Styles</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {vehicleStyles.map((v) => (
                      <button
                        key={v.label}
                        onClick={() => { setQuery(v.label); setOpen(false); }}
                        className="flex flex-col items-center gap-1 rounded-xl border border-[#D9E2EC] hover:border-[#008FDB] hover:bg-[#F5F7FA] transition-colors group overflow-hidden"
                      >
                        <img src={v.img} alt={v.label} className="w-full h-12 sm:h-16 object-cover object-center" />
                        <span className="text-[10px] font-semibold text-[#667481] group-hover:text-[#008FDB] leading-tight text-center pb-1.5">{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#101820] uppercase tracking-widest mb-2">Recommended</p>
                  <div className="flex flex-wrap gap-2">
                    {recommended.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setQuery(r); setOpen(false); }}
                        className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#D9E2EC] bg-[#F5F7FA] hover:border-[#008FDB] hover:text-[#008FDB] text-[#101820] transition-colors min-h-[36px]"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#101820] uppercase tracking-widest mb-2">Trending models</p>
                  <div className="flex flex-wrap gap-2">
                    {trending.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setQuery(t); setOpen(false); }}
                        className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#D9E2EC] bg-[#F5F7FA] hover:border-[#008FDB] hover:text-[#008FDB] text-[#101820] transition-colors min-h-[36px]"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button className="bg-[#008FDB] text-white font-bold px-6 py-3 rounded-xl border border-transparent hover:bg-[#00648F] transition-colors min-h-[44px] flex-1 sm:flex-none mt-2 sm:mt-0" style={{ fontSize: "15px" }}>
              View Inventory
            </button>
            <button onClick={() => navigate("/sell")} className="bg-[#F5F7FA] text-[#101820] font-bold px-6 py-3 rounded-xl border border-[#D9E2EC] hover:bg-[#D9E2EC] transition-colors min-h-[44px] flex-1 sm:flex-none mt-2 sm:mt-0" style={{ fontSize: "15px" }}>
              Sell My Car
            </button>
          </div>
        </div>

        <div className="hidden lg:block" />
      </div>
    </section>
  );
}
