import { useState } from "react";
import { Search, MapPin } from "lucide-react";

const makes = ["Any Make", "Toyota", "Ford", "Chevrolet", "Honda", "BMW", "Mercedes", "Jeep", "Ram", "Nissan"];
const models = ["Any Model", "Camry", "F-150", "Silverado", "Accord", "3 Series", "C-Class", "Wrangler", "1500", "Altima"];
const years = ["Any Year", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];
const prices = ["Any Price", "Under $10k", "$10k–$20k", "$20k–$30k", "$30k–$50k", "$50k+"];

export function VehicleSearch() {
  const [make, setMake] = useState("Any Make");
  const [model, setModel] = useState("Any Model");
  const [year, setYear] = useState("Any Year");
  const [price, setPrice] = useState("Any Price");
  const [zip, setZip] = useState("");

  return (
    <div className="bg-white rounded-lg shadow-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Make</label>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]"
          >
            {makes.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]"
          >
            {models.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]"
          >
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Price</label>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]"
          >
            {prices.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wide">ZIP Code</label>
          <div className="relative">
            <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="e.g. 90210"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full border border-border rounded pl-6 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--axio-navy)]"
            />
          </div>
        </div>
      </div>

      <button className="w-full bg-[var(--axio-navy)] text-white py-2.5 rounded flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors text-sm font-semibold">
        <Search className="w-4 h-4" />
        Search Vehicles
      </button>
    </div>
  );
}
