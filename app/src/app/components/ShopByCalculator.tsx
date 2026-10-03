import { useState } from "react";
import { ChevronDown } from "lucide-react";

const CREDIT_BANDS = [
  { label: "Poor", range: "< 580", apr: 0.1799 },
  { label: "Fair", range: "580–669", apr: 0.1249 },
  { label: "Good", range: "670–739", apr: 0.0849 },
  { label: "Very Good", range: "740–799", apr: 0.0649 },
  { label: "Excellent", range: "800+", apr: 0.0549 },
];

const TERM_OPTIONS = [24, 36, 48, 60, 72, 84];

function calcPrice(monthly: number, down: number, termMonths: number, apr: number) {
  if (!monthly || !termMonths) return 0;
  const r = apr / 12;
  const pv = r === 0 ? monthly * termMonths : monthly * (1 - Math.pow(1 + r, -termMonths)) / r;
  return Math.round(pv + down);
}

export function ShopByCalculator() {
  const [monthly, setMonthly] = useState("450");
  const [down, setDown] = useState("3000");
  const [creditIndex, setCreditIndex] = useState(4);
  const [term, setTerm] = useState(72);

  const credit = CREDIT_BANDS[creditIndex];
  const estPrice = calcPrice(parseFloat(monthly) || 0, parseFloat(down) || 0, term, credit.apr);

  return (
    <section className="bg-[#F5F7FA] border-y border-[#D9E2EC] py-10 lg:py-12">
      <div className="w-full px-10 lg:px-16">
        <div
          className="bg-white rounded-2xl border border-[#D9E2EC] px-6 py-6"
          style={{ boxShadow: "0 8px 24px rgba(16,24,32,0.12)" }}
        >
          {/* Est. Car Price row */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[#008FDB] text-[10px] font-bold uppercase tracking-widest mb-0.5">Payment-First Shopping</p>
              <h2 className="text-[#101820] font-bold" style={{ fontSize: "18px" }}>Shop by monthly budget</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[#667481] text-[10px] font-bold uppercase tracking-wide">Est. Car Price</p>
                <p className="text-[#101820] font-black leading-none" style={{ fontSize: "28px", fontVariantNumeric: "tabular-nums" }}>
                  ${estPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#667481] text-[10px] font-bold uppercase tracking-wide">Lowest APR</p>
                <p className="font-black" style={{ fontSize: "22px", color: "#2F6F3E", fontVariantNumeric: "tabular-nums" }}>
                  {(credit.apr * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* 4-column inputs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {/* Monthly payment */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">Monthly Payment</label>
              <div className="flex items-center border border-[#D9E2EC] rounded-xl px-3 py-2.5 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-white">
                <span className="text-[#667481] text-sm mr-1">$</span>
                <input
                  type="number"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm"
                  placeholder="450"
                />
                <span className="text-[#667481] text-xs">/mo</span>
              </div>
            </div>

            {/* Down payment */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">Down Payment</label>
              <div className="flex items-center border border-[#D9E2EC] rounded-xl px-3 py-2.5 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-white">
                <span className="text-[#667481] text-sm mr-1">$</span>
                <input
                  type="number"
                  value={down}
                  onChange={(e) => setDown(e.target.value)}
                  className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm"
                  placeholder="3000"
                />
              </div>
            </div>

            {/* Loan term */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">Loan Term</label>
              <div className="relative flex items-center border border-[#D9E2EC] rounded-xl px-3 py-2.5 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-white">
                <select
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm appearance-none cursor-pointer"
                >
                  {TERM_OPTIONS.map((t) => <option key={t} value={t}>{t} months</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#667481] shrink-0 pointer-events-none" />
              </div>
            </div>

            {/* Credit score */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">Credit Score</label>
                <span className="text-[10px] font-bold text-[#008FDB]">{credit.label}</span>
              </div>
              <div className="flex flex-col justify-center border border-[#D9E2EC] rounded-xl px-3 py-2.5 min-h-[44px] bg-white gap-1.5">
                <input
                  type="range"
                  min={0}
                  max={4}
                  step={1}
                  value={creditIndex}
                  onChange={(e) => setCreditIndex(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none rounded-full cursor-pointer outline-none"
                  style={{
                    background: `linear-gradient(to right, #008FDB ${creditIndex * 25}%, #D9E2EC ${creditIndex * 25}%)`,
                    accentColor: "#008FDB",
                  }}
                />
                <div className="flex justify-between">
                  {CREDIT_BANDS.map((b, i) => (
                    <span key={b.label} className="text-[8px] font-bold" style={{ color: i === creditIndex ? "#008FDB" : "#D9E2EC" }}>
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-4">
            <button
              className="bg-[#008FDB] text-white font-bold rounded-xl px-6 py-2.5 hover:bg-[#00648F] transition-colors min-h-[44px]"
              style={{ fontSize: "14px" }}
            >
              Get Pre-Qualified
            </button>
            <span className="text-[#667481] text-xs">No impact to your credit score</span>
            <button
              className="ml-auto text-[#101820] font-bold text-sm border border-[#D9E2EC] bg-[#F5F7FA] rounded-xl px-4 py-2.5 hover:bg-[#D9E2EC] transition-colors min-h-[44px] hidden md:block"
              style={{ fontSize: "13px" }}
            >
              Browse Cars in My Budget →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
