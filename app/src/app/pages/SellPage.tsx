import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, Camera, DollarSign, Clock, CheckCircle } from "lucide-react";
import sellTradeImg from "@/imports/image.png";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

const steps = [
  { icon: Camera, title: "Tell us about your car", desc: "Enter your plate or VIN to pull vehicle details instantly." },
  { icon: DollarSign, title: "Get a real offer", desc: "No algorithms — a real number from our dealer network within minutes." },
  { icon: Clock, title: "Choose how to proceed", desc: "Sell outright or apply it as trade-in credit toward your next vehicle." },
  { icon: CheckCircle, title: "Get paid fast", desc: "Pick up a check at any AutoNexus location or we'll arrange pickup." },
];

interface SellPageProps {
  onBack: () => void;
}

export function SellPage({ onBack }: SellPageProps) {
  const [plate, setPlate] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("UT");

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-28">

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#D9E2EC] flex items-center gap-3 px-4 h-12">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#008FDB] font-semibold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-[#101820] font-bold text-sm flex-1 text-center pr-10">Sell or Trade</span>
      </div>

      {/* Hero image */}
      <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
        <img
          src={sellTradeImg}
          alt="Sell your vehicle"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(16,24,32,0.1) 0%, rgba(16,24,32,0.55) 100%)" }}
        />
        <div className="absolute bottom-0 left-0 px-5 pb-5">
          <p className="text-[#008FDB] text-[10px] font-bold uppercase tracking-widest mb-1">Sell or Trade</p>
          <h1 className="text-white font-black text-2xl leading-tight">
            Real offers.<br />No hassle.
          </h1>
        </div>
        <div
          className="absolute bottom-4 right-5 bg-[#028EDA] text-white rounded-xl px-3 py-2"
          style={{ boxShadow: "0 6px 20px rgba(2,142,218,0.35)" }}
        >
          <p className="text-xl font-black leading-none">15 min</p>
          <p className="text-[10px] opacity-90">Real offer</p>
        </div>
      </div>

      {/* Form card */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 4px 20px rgba(16,24,32,0.08)" }}>
          <h2 className="text-[#101820] font-bold text-base mb-4">Get your offer</h2>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">
                License Plate or VIN
              </label>
              <div className="flex items-center border border-[#D9E2EC] rounded-xl px-4 py-2.5 focus-within:border-[#008FDB] transition-colors bg-[#F5F7FA]">
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC1234 or VIN"
                  className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm placeholder:font-normal placeholder:text-[#667481]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">ZIP Code</label>
                <div className="flex items-center border border-[#D9E2EC] rounded-xl px-4 py-2.5 focus-within:border-[#008FDB] transition-colors bg-[#F5F7FA]">
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    placeholder="84095"
                    maxLength={5}
                    className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm placeholder:font-normal placeholder:text-[#667481]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#667481] uppercase tracking-wide">State</label>
                <div className="relative flex items-center border border-[#D9E2EC] rounded-xl px-4 py-2.5 focus-within:border-[#008FDB] transition-colors bg-[#F5F7FA]">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex-1 outline-none text-[#101820] font-bold bg-transparent text-sm appearance-none cursor-pointer"
                  >
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#667481] shrink-0 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              className="flex items-center justify-center gap-2 bg-[#008FDB] text-white font-bold rounded-xl px-6 py-3.5 hover:bg-[#00648F] transition-colors"
              style={{ fontSize: "15px" }}
            >
              Get my offer
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 mt-6">
        <p className="text-[#667481] text-[10px] font-bold uppercase tracking-widest mb-3">How it works</p>
        <div className="flex flex-col gap-3">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(16,24,32,0.05)" }}>
              <div className="w-9 h-9 rounded-xl bg-[#EBF6FE] flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-[#008FDB]" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-[#101820] font-bold text-sm">{title}</p>
                <p className="text-[#667481] text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust line */}
      <p className="text-center text-[#667481] text-xs mt-6 px-8 leading-relaxed">
        No obligation. No hard sell. Offers valid for 7 days at any AutoNexus location.
      </p>
    </div>
  );
}
