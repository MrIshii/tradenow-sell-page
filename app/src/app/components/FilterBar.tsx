import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowRight, Check } from "lucide-react";

const filters: { label: string; options: string[] }[] = [
  {
    label: "Payment",
    options: ["Under $200/mo", "Under $300/mo", "Under $400/mo", "Under $500/mo", "Under $600/mo", "Under $750/mo", "$750/mo+"],
  },
  {
    label: "Budget",
    options: ["Under $10,000", "Under $15,000", "Under $20,000", "Under $25,000", "Under $30,000", "Under $40,000", "Under $50,000"],
  },
  {
    label: "Body Style",
    options: ["SUV", "Sedan", "Truck", "Coupe", "Hatchback", "Wagon", "Convertible", "Van / Minivan"],
  },
  {
    label: "Make / Model",
    options: ["Toyota", "Ford", "Honda", "Chevrolet", "RAM", "Jeep", "Tesla", "Subaru", "Nissan", "Hyundai", "Kia", "Mazda", "GMC"],
  },
  {
    label: "Location",
    options: ["Murray, UT", "Ogden, UT", "Orem, UT", "Sandy, UT", "Salt Lake City, UT", "Provo, UT", "Riverdale, UT"],
  },
  {
    label: "Year",
    options: ["2025", "2024", "2023", "2022", "2021", "2020", "2019 or Older"],
  },
  { label: "Under $500/mo", options: [] },
  { label: "Under $20K", options: [] },
];

export function FilterBar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleOption(label: string, option: string) {
    setSelected((prev) => {
      const current = prev[label] ?? [];
      return {
        ...prev,
        [label]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  }

  function getButtonLabel(label: string) {
    const picks = selected[label];
    if (!picks || picks.length === 0) return label;
    if (picks.length === 1) return picks[0];
    return `${label} (${picks.length})`;
  }

  const isActive = (label: string) => (selected[label]?.length ?? 0) > 0;

  return (
    <div ref={containerRef} className="flex w-full gap-2 flex-wrap relative mt-4 sm:mt-0">
      {filters.map(({ label, options }, i) => {
        const hasOptions = options.length > 0;
        const active = isActive(label);
        const open = openIndex === i;

        return (
          <div key={label} className="relative flex-1">
            <button
              onClick={() => hasOptions ? setOpenIndex(open ? null : i) : undefined}
              className={`w-full whitespace-nowrap flex items-center justify-between gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-colors min-h-[44px] ${
                active
                  ? "bg-[#008FDB] border-[#008FDB] text-white"
                  : open
                  ? "bg-white border-[#008FDB] text-[#008FDB]"
                  : "bg-white border-[#D9E2EC] text-[#101820] hover:border-[#008FDB] hover:text-[#008FDB]"
              }`}
            >
              <span className="truncate">{getButtonLabel(label)}</span>
              {hasOptions && (
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""} ${active ? "opacity-80" : "opacity-50"}`}
                />
              )}
            </button>

            {hasOptions && open && (
              <div
                className="absolute top-full left-0 mt-1.5 bg-white border border-[#D9E2EC] rounded-2xl z-50 py-1 min-w-[180px]"
                style={{ boxShadow: "0 8px 24px rgba(16,24,32,0.12)" }}
              >
                {options.map((option) => {
                  const checked = selected[label]?.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleOption(label, option)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left hover:bg-[#F5F7FA] transition-colors"
                    >
                      <span className={`font-semibold ${checked ? "text-[#008FDB]" : "text-[#101820]"}`}>
                        {option}
                      </span>
                      {checked && <Check className="w-3.5 h-3.5 text-[#008FDB] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <button className="flex-1 whitespace-nowrap flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-[#008FDB] border border-[#008FDB] rounded-xl hover:bg-[#00648F] hover:border-[#00648F] transition-colors min-h-[44px] mt-4 sm:mt-0 mb-4 sm:mb-0">
        Get Pre-Qualified
        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
      </button>
    </div>
  );
}
