import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import sellTradeImg from "@/imports/image.png";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

const OFFER_IMG = "https://images.unsplash.com/photo-1758521961632-24056f441db8?w=600&h=420&fit=crop&crop=faces&auto=format";

export function SellTrade() {
  const navigate = useNavigate();
  const [plate, setPlate] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("UT");

  return (
    <section className="bg-[#F5F6F9] border-b border-[#D9E2EC] py-12 lg:py-16">
      <div className="w-full px-10 lg:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left: image */}
          <div className="relative">
            <img
              src={sellTradeImg}
              alt="Man smiling at phone in car dealership"
              className="w-full rounded-2xl object-cover"
              style={{ height: 340, boxShadow: "0 8px 24px rgba(16, 24, 32, 0.12)" }}
            />
            <div
              className="absolute -bottom-4 -left-4 bg-[#028EDA] text-white rounded-2xl px-4 py-3"
              style={{ boxShadow: "0 10px 30px rgba(2, 142, 218, 0.28)" }}
            >
              <p className="text-2xl font-black" style={{ fontVariantNumeric: "tabular-nums" }}>15 min</p>
              <p className="text-xs opacity-90">Real offer, no haggling</p>
            </div>
          </div>

          {/* Right: copy + form */}
          <div>
            <p className="text-[#008FDB] text-xs font-bold uppercase tracking-widest mb-2">Sell or Trade</p>
            <h2 className="text-[#101820] font-bold mb-4" style={{ fontSize: "24px", lineHeight: 1.25 }}>
              Sell or trade your vehicle.<br />Real offers in minutes.
            </h2>
            <p className="text-[#667481] text-sm mb-6" style={{ lineHeight: "22px" }}>
              Enter your plate or VIN and we'll show you a real offer from our dealer network. No obligation, no pressure.
            </p>

            <div className="flex flex-col gap-4">
              {/* Plate / VIN */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">
                  License Plate or VIN
                </label>
                <div className="flex items-center border border-[#D9E2EC] rounded-xl px-4 py-2 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-[#F5F7FA]">
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC1234 or 1HGBH41JXMN109186"
                    className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm min-w-0 placeholder:font-normal placeholder:text-[#667481]"
                  />
                </div>
              </div>

              {/* ZIP + State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">
                    ZIP Code
                  </label>
                  <div className="flex items-center border border-[#D9E2EC] rounded-xl px-4 py-2 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-[#F5F7FA]">
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="84095"
                      maxLength={5}
                      className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm min-w-0 placeholder:font-normal placeholder:text-[#667481]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">
                    State
                  </label>
                  <div className="relative flex items-center border border-[#D9E2EC] rounded-xl px-4 py-2 focus-within:border-[#008FDB] transition-colors min-h-[44px] bg-[#F5F7FA]">
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm appearance-none cursor-pointer"
                    >
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#667481] shrink-0 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate("/sell")}
                className="flex items-center justify-center gap-2 bg-[#008FDB] text-white font-bold rounded-xl px-6 py-3 hover:bg-[#00648F] transition-colors min-h-[48px] mt-2"
                style={{ fontSize: "15px" }}
              >
                Sell My Car
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
