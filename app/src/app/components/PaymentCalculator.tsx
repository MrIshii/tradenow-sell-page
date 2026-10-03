import { useState } from "react";

export function PaymentCalculator() {
  const [budget, setBudget] = useState(500);
  const [down, setDown] = useState(3000);
  const [term, setTerm] = useState(60);
  const [zip, setZip] = useState("84095");

  const estimatedPrice = Math.round((budget * term + down) * 0.92);

  return (
    <section className="bg-[#101820] py-14 lg:py-16">
      <div className="w-full px-10 lg:px-16">
        <div className="grid md:grid-cols-2 gap-10 items-center my-6">
          <div>
            <p className="text-[#008FDB] text-xs font-bold uppercase tracking-widest mb-2">Payment-First Shopping</p>
            <h2 className="text-white font-bold mb-4" style={{ fontSize: "24px", lineHeight: 1.2 }}>
              Shop by monthly payment,<br />not guesswork.
            </h2>
            <p className="text-[#D9E2EC] text-sm leading-relaxed mb-6" style={{ lineHeight: "22px" }}>
              Tell us what you can afford each month and we'll show you every vehicle that fits, with real financing numbers, not estimates.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Real pre-qualification in 2 minutes",
                "No impact to your credit score",
                "See actual dealer inventory",
                "Payments include taxes & fees",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#D9E2EC]">
                  <span className="w-5 h-5 rounded-full bg-[#2F6F3E] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 18px 48px rgba(16, 24, 32, 0.18)" }}>
            <p className="text-sm font-bold text-[#101820] mb-4">Your Monthly Budget</p>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-semibold text-[#667481]">Monthly Payment</span>
                <span className="text-sm font-black text-[#101820]" style={{ fontVariantNumeric: "tabular-nums" }}>${budget}/mo</span>
              </div>
              <input
                type="range"
                min={200}
                max={1500}
                step={25}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#008FDB]"
              />
              <div className="flex justify-between text-[10px] text-[#667481] mt-1">
                <span>$200</span><span>$1,500</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-[#667481] block mb-1.5">Down Payment</label>
                <input
                  type="number"
                  value={down}
                  onChange={(e) => setDown(Number(e.target.value))}
                  className="w-full border border-[#D9E2EC] rounded-xl px-2 py-2 text-sm text-center focus:outline-none focus:border-[#008FDB] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#667481] block mb-1.5">Loan Term</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="w-full border border-[#D9E2EC] rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-[#008FDB] transition-colors"
                >
                  <option value={36}>36 mo</option>
                  <option value={48}>48 mo</option>
                  <option value={60}>60 mo</option>
                  <option value={72}>72 mo</option>
                  <option value={84}>84 mo</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#667481] block mb-1.5">ZIP Code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full border border-[#D9E2EC] rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-[#008FDB] transition-colors"
                />
              </div>
            </div>

            <div className="bg-[#F5F7FA] rounded-xl p-4 mb-4 flex items-center justify-between border border-[#D9E2EC]">
              <span className="text-xs font-semibold text-[#667481]">Estimated vehicle budget</span>
              <span className="text-lg font-black text-[#101820]" style={{ fontVariantNumeric: "tabular-nums" }}>${estimatedPrice.toLocaleString()}</span>
            </div>

            <button className="w-full bg-[#008FDB] text-white font-bold py-3 rounded-xl hover:bg-[#00648F] transition-colors min-h-[44px]" style={{ fontSize: "15px" }}>
              Find Vehicles in My Budget →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
