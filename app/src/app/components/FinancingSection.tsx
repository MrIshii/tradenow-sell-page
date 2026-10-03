import { CheckCircle, Star, Award, Users, TrendingUp } from "lucide-react";

const COUPLE_IMG = "https://images.unsplash.com/photo-1613799604496-90c66af2b53b?w=600&h=420&fit=crop&auto=format";

const stats = [
  { icon: Users, value: "2.4M+", label: "Happy Customers", color: "text-[#008FDB]" },
  { icon: Star, value: "4.8★", label: "Average Rating", color: "text-[#C58B2A]" },
  { icon: Award, value: "#1", label: "Ranked Marketplace", color: "text-[#2F6F3E]" },
  { icon: TrendingUp, value: "8 Hrs", label: "Avg. Time to Deal", color: "text-[#101820]" },
];

export function FinancingSection() {
  return (
    <>
      {/* Financing */}
      <section className="bg-[#F5F7FA] px-[0px] pt-[64px] pb-[32px]">
        <div className="w-full px-10 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={COUPLE_IMG}
                alt="Couple reviewing car financing options"
                className="w-full rounded-2xl object-cover"
                style={{ height: 340, boxShadow: "0 8px 24px rgba(16, 24, 32, 0.12)" }}
              />
              <div className="absolute -bottom-4 -right-4 bg-[#008FDB] text-white rounded-2xl px-4 py-3" style={{ boxShadow: "0 10px 30px rgba(0, 143, 219, 0.25)" }}>
                <p className="text-2xl font-black" style={{ fontVariantNumeric: "tabular-nums" }}>6.9%</p>
                <p className="text-xs opacity-90">APR as low as</p>
              </div>
            </div>

            <div>
              <p className="text-[#008FDB] text-xs font-bold uppercase tracking-widest mb-2">Flexible Financing</p>
              <h2 className="text-[#101820] font-bold mb-4" style={{ fontSize: "24px", lineHeight: 1.25 }}>
                Financing built<br />around your life.
              </h2>
              <p className="text-[#667481] text-sm leading-relaxed mb-6" style={{ lineHeight: "22px" }}>
                Whether you have great credit or are rebuilding, AutoNexus connects you with lenders competing for your business. You always get the best rate available to you.
              </p>
              <ul className="flex flex-col gap-3 mb-6">
                {[
                  "Pre-qualify with 300+ lenders in minutes",
                  "Soft credit pull, no score impact",
                  "Bring your own financing or use ours",
                  "Trade-in value applied instantly",
                  "Extended warranty options available",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#101820]">
                    <CheckCircle className="w-4 h-4 text-[#2F6F3E] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="bg-[#008FDB] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#00648F] transition-colors min-h-[44px]" style={{ fontSize: "15px" }}>
                Check My Rate →
              </button>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
