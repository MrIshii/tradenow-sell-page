import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

const footerLinks = {
  "Buy": ["Search Cars", "New Cars", "Used Cars", "Certified Pre-Owned", "Electric Vehicles", "Trucks & SUVs"],
  "Sell": ["Sell My Car", "Trade-In Value", "Instant Cash Offer", "Private Party Listing"],
  "Finance": ["Get Pre-Qualified", "Payment Calculator", "Refinance", "GAP Insurance", "Extended Warranty"],
  "Research": ["Car Reviews", "Compare Cars", "Car Rankings", "Best Cars by Category", "Car Buying Guides"],
  "About AutoNexus": ["About Us", "Press", "Careers", "Partner Dealers", "Advertise With Us", "Contact Us"],
};

export function Footer() {
  return (
    <>
      {/* CTA Banner */}
      <section className="bg-[#101820] py-14 lg:py-16">
        <div className="w-full px-10 lg:px-16 text-center">
          <h2 className="text-white font-bold mb-4" style={{ fontSize: "24px" }}>
            Ready to find your next vehicle?
          </h2>
          <p className="text-[#D9E2EC] text-sm mb-8 max-w-md mx-auto" style={{ lineHeight: "22px" }}>
            Join over 2.4 million shoppers who found their perfect car with AutoNexus.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-[#008FDB] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#00648F] transition-colors min-h-[44px]" style={{ fontSize: "15px" }}>
              View Inventory
            </button>
            <button className="bg-transparent text-white font-bold px-6 py-3 rounded-xl border-2 border-[#D9E2EC] hover:bg-white hover:text-[#101820] transition-colors min-h-[44px]" style={{ fontSize: "15px" }}>
              Get Approved
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101820] text-white border-t border-white/10">
        <div className="w-full px-10 lg:px-16 py-14 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 bg-white rounded-lg px-3 py-2 inline-block">
                <Logo variant="full" height={44} />
              </div>
              <p className="text-[#D9E2EC] text-xs leading-relaxed mb-4">
                The smarter way to buy, sell, and finance your next vehicle.
              </p>
              <div className="flex gap-2">
                {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#008FDB] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#667481] mb-4">{heading}</p>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link}>
                      <button className="text-xs text-[#D9E2EC] hover:text-white transition-colors text-left">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-[#667481]">© 2026 AutoNexus, Inc. All rights reserved.</p>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Use", "Do Not Sell My Info", "Accessibility"].map((item) => (
                <button key={item} className="text-[10px] text-[#667481] hover:text-white transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
