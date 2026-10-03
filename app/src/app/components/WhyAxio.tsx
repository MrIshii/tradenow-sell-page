import { Star, Award, Users, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, value: "2.4M+", label: "Happy Customers", color: "text-[#008FDB]" },
  { icon: Star, value: "4.8★", label: "Average Rating", color: "text-[#C58B2A]" },
  { icon: Award, value: "#1", label: "Ranked Marketplace", color: "text-[#2F6F3E]" },
  { icon: TrendingUp, value: "8 Hrs", label: "Avg. Time to Deal", color: "text-[#101820]" },
];

export function WhyAxio() {
  return (
    <section className="bg-[#F5F7FA] py-14 lg:py-16 border-t border-[#D9E2EC]">
      <div className="w-full px-10 lg:px-16">
        <h2 className="text-[#101820] font-bold text-center mb-10" style={{ fontSize: "24px" }}>
          Why shoppers choose AutoNexus
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-2">
              <div className={`w-12 h-12 rounded-2xl bg-white border border-[#D9E2EC] flex items-center justify-center ${s.color}`} style={{ boxShadow: "0 1px 2px rgba(16, 24, 32, 0.08)" }}>
                <s.icon className="w-6 h-6" />
              </div>
              <p className={`text-2xl font-black ${s.color}`} style={{ fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
              <p className="text-xs text-[#667481] font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
