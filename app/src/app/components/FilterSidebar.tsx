import { useState } from "react";
import { Plus, Minus } from "lucide-react";

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-sm font-bold text-[#1a2332] hover:text-[var(--axio-navy)] transition-colors"
      >
        {title}
        {open
          ? <Minus className="w-4 h-4 shrink-0 text-muted-foreground" />
          : <Plus className="w-4 h-4 shrink-0 text-muted-foreground" />
        }
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function RadioOption({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 py-0.5 cursor-pointer group">
      <input type="radio" checked={checked} onChange={onChange} className="accent-[var(--axio-navy)] w-3.5 h-3.5 shrink-0" />
      <span className="text-xs text-[#1a2332] group-hover:text-[var(--axio-navy)] transition-colors flex-1">{label}</span>
      {count !== undefined && <span className="text-[10px] text-muted-foreground">{count.toLocaleString()}</span>}
    </label>
  );
}

function CheckOption({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 py-0.5 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-[var(--axio-navy)] w-3.5 h-3.5 shrink-0 rounded" />
      <span className="text-xs text-[#1a2332] group-hover:text-[var(--axio-navy)] transition-colors flex-1">{label}</span>
      {count !== undefined && <span className="text-[10px] text-muted-foreground">{count.toLocaleString()}</span>}
    </label>
  );
}

const colorDots: Record<string, string> = {
  Beige: "#d4c5a0", Black: "#111111", Blue: "#1e40af", Brown: "#7c4a2b",
  Gold: "#9a7c2f", Gray: "#888888", Green: "#166534", Orange: "#c2410c",
  Purple: "#6b21a8", Red: "#991b1b", Silver: "#a0a0a0", White: "#f0f0f0",
  Yellow: "#ca8a04",
};

const SECTIONS = [
  "Price", "Make", "Model", "Body Style", "Year", "Mileage",
  "Fuel Type", "Exterior Color", "Interior Color", "Transmission",
  "MPG / MPGe", "Electric Mile Range", "Location", "Features",
];

export function FilterSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggle = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  const [mileage, setMileage] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [exteriorColor, setExteriorColor] = useState("all");
  const [mpg, setMpg] = useState("all");
  const [electricRange, setElectricRange] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedBodyStyles, setSelectedBodyStyles] = useState<string[]>([]);
  const [yearMin, setYearMin] = useState("Any");
  const [yearMax, setYearMax] = useState("Any");
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);

  const toggleArr = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const years = ["Any", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];

  const isOpen = (t: string) => !!openSections[t];

  return (
    <aside className="bg-white rounded-lg border border-border p-4 sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-black text-[#1a2332]">Filters</p>
        <button className="text-xs text-[var(--axio-navy)] hover:underline">Clear all</button>
      </div>

      {/* Price */}
      <FilterSection title="Price" open={isOpen("Price")} onToggle={() => toggle("Price")}>
        <div className="flex gap-2 items-center">
          <input type="text" placeholder="Min $" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
            className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]" />
          <span className="text-muted-foreground text-xs shrink-0">–</span>
          <input type="text" placeholder="Max $" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]" />
        </div>
      </FilterSection>

      {/* Make */}
      <FilterSection title="Make" open={isOpen("Make")} onToggle={() => toggle("Make")}>
        <div className="flex flex-col gap-0.5">
          {[["Toyota", 312], ["Ford", 298], ["Chevrolet", 241], ["Honda", 205], ["Jeep", 187], ["RAM", 164], ["BMW", 143], ["Mercedes", 128], ["Nissan", 118]].map(([make, count]) => (
            <CheckOption key={make as string} label={make as string} count={count as number}
              checked={selectedMakes.includes(make as string)}
              onChange={() => toggleArr(selectedMakes, make as string, setSelectedMakes)} />
          ))}
        </div>
      </FilterSection>

      {/* Model */}
      <FilterSection title="Model" open={isOpen("Model")} onToggle={() => toggle("Model")}>
        <p className="text-xs text-muted-foreground">Select a make first to filter by model.</p>
      </FilterSection>

      {/* Body Style */}
      <FilterSection title="Body Style" open={isOpen("Body Style")} onToggle={() => toggle("Body Style")}>
        <div className="flex flex-col gap-0.5">
          {[["SUV / Crossover", 892], ["Pickup Truck", 543], ["Sedan", 421], ["Minivan / Van", 98], ["Coupe", 87], ["Convertible", 34], ["Wagon", 29], ["Hatchback", 156]].map(([style, count]) => (
            <CheckOption key={style as string} label={style as string} count={count as number}
              checked={selectedBodyStyles.includes(style as string)}
              onChange={() => toggleArr(selectedBodyStyles, style as string, setSelectedBodyStyles)} />
          ))}
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="Year" open={isOpen("Year")} onToggle={() => toggle("Year")}>
        <div className="flex gap-2 items-center">
          <select value={yearMin} onChange={(e) => setYearMin(e.target.value)}
            className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]">
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
          <span className="text-muted-foreground text-xs shrink-0">–</span>
          <select value={yearMax} onChange={(e) => setYearMax(e.target.value)}
            className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]">
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </FilterSection>

      {/* Mileage */}
      <FilterSection title="Mileage" open={isOpen("Mileage")} onToggle={() => toggle("Mileage")}>
        <div className="flex flex-col gap-0.5">
          {[["all","All Mileage"],["30k","30,000 or less",351],["40k","40,000 or less",445],["50k","50,000 or less",536],
            ["60k","60,000 or less",648],["70k","70,000 or less",758],["80k","80,000 or less",846],
            ["90k","90,000 or less",936],["100k","100,000 or less",1031],["100k+","100,000 or more",434]
          ].map(([val, label, count]) => (
            <RadioOption key={val as string} label={label as string} count={count as number | undefined}
              checked={mileage === val} onChange={() => setMileage(val as string)} />
          ))}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection title="Fuel Type" open={isOpen("Fuel Type")} onToggle={() => toggle("Fuel Type")}>
        <div className="flex flex-col gap-0.5">
          {[["Gasoline",1842],["Hybrid",312],["Electric",298],["Plug-in Hybrid",187],["Diesel",64],["Flex Fuel",43]].map(([fuel, count]) => (
            <CheckOption key={fuel as string} label={fuel as string} count={count as number}
              checked={fuelTypes.includes(fuel as string)}
              onChange={() => toggleArr(fuelTypes, fuel as string, setFuelTypes)} />
          ))}
        </div>
      </FilterSection>

      {/* Exterior Color */}
      <FilterSection title="Exterior Color" open={isOpen("Exterior Color")} onToggle={() => toggle("Exterior Color")}>
        <div className="flex flex-col gap-0.5">
          <RadioOption label="All" checked={exteriorColor === "all"} onChange={() => setExteriorColor("all")} />
          {[["Beige",7],["Black",281],["Blue",102],["Brown",16],["Gold",3],["Gray",269],
            ["Green",18],["Orange",5],["Purple",1],["Red",128],["Silver",176],["White",401],["Yellow",5],["Other",48]
          ].map(([color, count]) => (
            <label key={color as string} className="flex items-center gap-2 py-0.5 cursor-pointer group">
              <input type="radio" checked={exteriorColor === color} onChange={() => setExteriorColor(color as string)}
                className="accent-[var(--axio-navy)] w-3.5 h-3.5 shrink-0" />
              <span className="w-4 h-4 rounded-full border border-border shrink-0"
                style={{ background: color === "Other"
                  ? "repeating-linear-gradient(45deg,#ccc 0,#ccc 2px,#fff 2px,#fff 6px)"
                  : colorDots[color as string] }} />
              <span className="text-xs text-[#1a2332] group-hover:text-[var(--axio-navy)] flex-1">{color as string}</span>
              <span className="text-[10px] text-muted-foreground">{(count as number).toLocaleString()}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Interior Color */}
      <FilterSection title="Interior Color" open={isOpen("Interior Color")} onToggle={() => toggle("Interior Color")}>
        <div className="flex flex-col gap-0.5">
          {[["Beige / Tan",312],["Black",891],["Brown",64],["Gray",443],["Red",28],["White",87],["Other",112]].map(([color, count]) => (
            <CheckOption key={color as string} label={color as string} count={count as number} checked={false} onChange={() => {}} />
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission" open={isOpen("Transmission")} onToggle={() => toggle("Transmission")}>
        <div className="flex flex-col gap-0.5">
          {[["all","All Transmissions"],["automatic","Automatic",1085],["cvt","CVT",331],["manual","Manual",25],["other","Other",19]].map(([val, label, count]) => (
            <RadioOption key={val as string} label={label as string} count={count as number | undefined}
              checked={transmission === val} onChange={() => setTransmission(val as string)} />
          ))}
        </div>
      </FilterSection>

      {/* MPG */}
      <FilterSection title="MPG / MPGe" open={isOpen("MPG / MPGe")} onToggle={() => toggle("MPG / MPGe")}>
        <p className="text-xs text-muted-foreground mb-2">Highway Fuel Economy</p>
        <select value={mpg} onChange={(e) => setMpg(e.target.value)}
          className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]">
          <option value="all">All</option>
          <option value="25">25+ MPG</option>
          <option value="30">30+ MPG</option>
          <option value="35">35+ MPG</option>
          <option value="40">40+ MPG</option>
          <option value="45">45+ MPG</option>
        </select>
        <button className="text-xs text-[var(--axio-navy)] hover:underline mt-2 block">About MPG/MPGe</button>
      </FilterSection>

      {/* Electric Mile Range */}
      <FilterSection title="Electric Mile Range" open={isOpen("Electric Mile Range")} onToggle={() => toggle("Electric Mile Range")}>
        <div className="flex flex-col gap-0.5">
          {[["all","All"],["100","100+ miles",136],["150","150+ miles",136],["200","200+ miles",132],
            ["250","250+ miles",112],["300","300+ miles",92],["350","350+ miles",43]
          ].map(([val, label, count]) => (
            <RadioOption key={val as string} label={label as string} count={count as number | undefined}
              checked={electricRange === val} onChange={() => setElectricRange(val as string)} />
          ))}
        </div>
        <button className="text-xs text-[var(--axio-navy)] hover:underline mt-2 block">About Electric Range</button>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location" open={isOpen("Location")} onToggle={() => toggle("Location")}>
        <input type="text" placeholder="ZIP code or city"
          className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]" />
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features" open={isOpen("Features")} onToggle={() => toggle("Features")}>
        <div className="flex flex-col gap-0.5">
          {[["Apple CarPlay / Android Auto",1243],["Backup Camera",1891],["Blind Spot Monitoring",987],
            ["Heated Seats",1102],["Sunroof / Moonroof",743],["Navigation System",654],["4WD / AWD",1320]
          ].map(([feat, count]) => (
            <CheckOption key={feat as string} label={feat as string} count={count as number} checked={false} onChange={() => {}} />
          ))}
        </div>
      </FilterSection>

      <button className="mt-4 w-full bg-[var(--axio-navy)] text-white py-2.5 rounded text-xs font-semibold hover:bg-blue-900 transition-colors">
        Apply Filters
      </button>
    </aside>
  );
}
