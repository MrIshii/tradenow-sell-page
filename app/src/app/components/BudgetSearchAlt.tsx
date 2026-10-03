import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

export function BudgetSearchAlt() {
  const [monthly, setMonthly] = useState("550");
  const [down, setDown] = useState("5000");
  const [credit, setCredit] = useState(creditOptions[0]);
  const [term, setTerm] = useState("60 months");

  const termMonths = parseInt(term);
  const apr = APR_BY_CREDIT[credit] ?? 0.0549;
  const estPrice = calcPrice(parseFloat(monthly) || 0, parseFloat(down) || 0, termMonths, apr);
  const aprDisplay = (apr * 100).toFixed(2);

  return (
    <section className="bg-[#F5F7FA] border-b border-[#D9E2EC]">
      <div className="w-full px-10 lg:px-16 py-12 lg:py-16">
        <div
          className="bg-white rounded-2xl border border-[#D9E2EC] px-6 py-6"
          style={{ boxShadow: "0 8px 24px rgba(16,24,32,0.12)" }}
        >
          <div className="grid lg:grid-cols-[1fr_1fr_1fr_200px] gap-10 items-stretch">

            {/* Col 1: label + description */}
            <div className="flex flex-col gap-2 pt-4 pb-4 pl-4">
              <p className="text-[#008FDB] text-xs font-bold uppercase tracking-widest mb-2">Budget Calculator</p>
              <h2 className="text-[#101820] font-bold mb-4" style={{ fontSize: "24px" }}>What can you afford?</h2>
              <p className="text-[#667481] mt-2" style={{ fontSize: "14px", lineHeight: "22px" }}>
                Adjust your inputs and see your estimated purchase price instantly.
              </p>
            </div>

            {/* Col 2: Monthly + Credit */}
            <div className="flex flex-col gap-4 content-start py-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">Monthly Payment</label>
                <div className="flex items-center border border-[#D9E2EC] rounded-xl px-3 py-2 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-[#F5F7FA]">
                  <span className="text-[#667481] mr-1 font-semibold">$</span>
                  <input
                    type="number"
                    value={monthly}
                    onChange={(e) => setMonthly(e.target.value)}
                    className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm min-w-0"
                    placeholder="550"
                  />
                  <span className="text-[#667481] text-xs font-semibold">/mo</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">Credit Score</label>
                <div className="relative flex items-center border border-[#D9E2EC] rounded-xl px-3 py-2 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-[#F5F7FA]">
                  <select
                    value={credit}
                    onChange={(e) => setCredit(e.target.value)}
                    className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm appearance-none cursor-pointer"
                  >
                    {creditOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#667481] shrink-0 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Col 3: Down + Term */}
            <div className="flex flex-col gap-4 content-start py-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">Down Payment</label>
                <div className="flex items-center border border-[#D9E2EC] rounded-xl px-3 py-2 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-[#F5F7FA]">
                  <span className="text-[#667481] mr-1 font-semibold">$</span>
                  <input
                    type="number"
                    value={down}
                    onChange={(e) => setDown(e.target.value)}
                    className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm min-w-0"
                    placeholder="5000"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">Loan Term</label>
                <div className="relative flex items-center border border-[#D9E2EC] rounded-xl px-3 py-2 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-[#F5F7FA]">
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm appearance-none cursor-pointer"
                  >
                    {termOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#667481] shrink-0 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Col 4: Est. Car Price + CTA */}
            <div className="flex flex-col gap-4 h-full">
              <div className="rounded-2xl border border-[#D9E2EC] bg-[#F5F7FA] px-5 py-5 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-[#667481] text-[10px] font-bold uppercase tracking-wide mb-2">Est. Car Price</p>
                  <p className="text-[#101820] font-black leading-none mb-2" style={{ fontSize: "36px", fontVariantNumeric: "tabular-nums" }}>
                    ${estPrice.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[#667481] text-[10px] font-bold uppercase tracking-wide">APRs as low as:</p>
                  <span className="bg-[#2F6F3E] text-white font-black rounded-lg px-2.5 py-1" style={{ fontSize: "13px", fontVariantNumeric: "tabular-nums" }}>
                    {aprDisplay}%
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-[#008FDB] text-white font-bold rounded-xl py-3.5 hover:bg-[#00648F] transition-colors min-h-[48px]"
                style={{ fontSize: "15px" }}
              >
                Get Pre-Qualified
              </button>
              <p className="text-center text-[#667481] text-xs">No impact to your credit score</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
