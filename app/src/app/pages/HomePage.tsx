import { FilterBar } from "../components/FilterBar";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { FeatureCards } from "../components/FeatureCards";
import { PopularVehicles } from "../components/PopularVehicles";
import { ShopByBodyStyle } from "../components/ShopByBodyStyle";
import { SellTrade } from "../components/SellTrade";
import { PaymentCalculator } from "../components/PaymentCalculator";
import { BudgetSearchAlt } from "../components/BudgetSearchAlt";
import { FinancingSection } from "../components/FinancingSection";
import { Locations } from "../components/Locations";
import { WhyAxio } from "../components/WhyAxio";
import { Reviews } from "../components/Reviews";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />
      <Hero />

      <section className="bg-[#F5F7FA] border-b border-[#D9E2EC]">
        <div className="w-full px-10 lg:px-16 py-12 lg:py-16 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-[#101820] font-bold" style={{ fontSize: "24px" }}>
              Search by vehicle, payment, budget, or need.
            </h2>
            <FilterBar />
          </div>
          <ShopByBodyStyle />
        </div>
      </section>

      <div className="w-full px-10 lg:px-16 py-12 lg:py-16">
        <PopularVehicles />
      </div>

      <FeatureCards />
      <SellTrade />
      <PaymentCalculator />
      <FinancingSection />
      <BudgetSearchAlt />
      <Locations />
      <WhyAxio />
      <Reviews />
      <Footer />
    </div>
  );
}
