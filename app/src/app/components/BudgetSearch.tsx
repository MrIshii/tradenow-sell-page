import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const creditOptions = [
  "Excellent (800+ FICO® Score)",
  "Very Good (740–799)",
  "Good (670–739)",
  "Fair (580–669)",
  "Poor (Below 580)",
];

const termOptions = ["24 months", "36 months", "48 months", "60 months", "72 months", "84 months"];

const APR_BY_CREDIT: Record<string, number> = {
  "Excellent (800+ FICO® Score)": 0.0549,
  "Very Good (740–799)": 0.0649,
  "Good (670–739)": 0.0849,
  "Fair (580–669)": 0.1249,
  "Poor (Below 580)": 0.1799,
};

function calcPrice(monthly: number, down: number, termMonths: number, apr: number) {
  if (apr === 0) return monthly * termMonths + down;
  const r = apr / 12;
  const pv = monthly * (1 - Math.pow(1 + r, -termMonths)) / r;
  return Math.round(pv + down);
}

export function BudgetSearch() {
  const [monthly, setMonthly] = useState("400");
  const [down, setDown] = useState("2500");
  const [credit, setCredit] = useState(creditOptions[0]);
  const [term, setTerm] = useState("72 months");

  const termMonths = parseInt(term);
  const apr = APR_BY_CREDIT[credit] ?? 0.0549;
  const estPrice = calcPrice(
    parseFloat(monthly) || 0,
    parseFloat(down) || 0,
    termMonths,
    apr
  );
  const aprDisplay = (apr * 100).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-[#D9E2EC] p-6 lg:p-8" style={{ boxShadow: "0 8px 24px rgba(16, 24, 32, 0.12)" }}>
      <h3 className="text-[#101820] font-bold mb-6" style={{ fontSize: "20px", fontFamily: "Inter, sans-serif" }}>
        See cars that fit your monthly budget
      </h3>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-[#667481] z-10">Monthly payment</label>
            <div className="flex items-center border border-[#D9E2EC] rounded-xl px-3 py-3 focus-within:border-[#008FDB] transition-colors min-h-[44px]">
              <span className="text-[#101820] text-sm mr-1">$</span>
              <input
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                className="flex-1 outline-none text-sm text-[#101820] bg-transparent"
                placeholder="400"
              />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-[#667481] z-10">Credit score</label>
            <div className="relative flex items-center border border-[#D9E2EC] rounded-xl px-3 py-3 focus-within:border-[#008FDB] transition-colors min-h-[44px]">
              <select
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                className="flex-1 outline-none text-sm text-[#101820] bg-transparent appearance-none cursor-pointer"
              >
                {creditOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-[#667481] shrink-0 pointer-events-none" />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-[#667481] z-10">Down payment</label>
            <div className="flex items-center border border-[#D9E2EC] rounded-xl px-3 py-3 focus-within:border-[#008FDB] transition-colors min-h-[44px]">
              <span className="text-[#101820] text-sm mr-1">$</span>
              <input
                type="number"
                value={down}
                onChange={(e) => setDown(e.target.value)}
                className="flex-1 outline-none text-sm text-[#101820] bg-transparent"
                placeholder="2500"
              />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-[#667481] z-10">Term length</label>
            <div className="relative flex items-center border border-[#D9E2EC] rounded-xl px-3 py-3 focus-within:border-[#008FDB] transition-colors min-h-[44px]">
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="flex-1 outline-none text-sm text-[#101820] bg-transparent appearance-none cursor-pointer"
              >
                {termOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-[#667481] shrink-0 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-56 flex flex-col gap-3">
          <div className="bg-[#F5F7FA] rounded-2xl px-5 py-4 border border-[#D9E2EC]">
            <div className="flex items-center gap-1 text-[#667481] mb-1" style={{ fontSize: "12px" }}>
              Est. car price
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <p className="text-[#101820] font-black" style={{ fontSize: "32px", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
              ${estPrice.toLocaleString()}
            </p>
            <span className="inline-flex items-center gap-1 mt-2 bg-[#2F6F3E] text-white rounded-full px-2.5 py-0.5" style={{ fontSize: "11px", fontWeight: 700 }}>
              APRs as low as {aprDisplay}%
              <HelpCircle className="w-3 h-3 opacity-70" />
            </span>
          </div>

          <button className="w-full bg-[#008FDB] text-white font-bold rounded-xl py-3 hover:bg-[#00648F] transition-colors min-h-[44px]" style={{ fontSize: "15px" }}>
            Get pre-qualified
          </button>
          <p className="text-center text-[#667481]" style={{ fontSize: "11px" }}>No impact to your credit score</p>
        </div>
      </div>
    </div>
  );
}
