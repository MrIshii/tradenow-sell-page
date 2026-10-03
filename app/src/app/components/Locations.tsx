import { MapPin, Phone, Clock } from "lucide-react";

const locations = [
  { id: 1, name: "AutoNexus Automall", city: "Murray, UT", phone: "(801) 555-0101", hours: "9am–8pm", img: "https://images.unsplash.com/photo-1574023278981-0b48ba10e9ba?w=320&h=180&fit=crop&auto=format", inventory: 203 },
  { id: 2, name: "AutoNexus Ogden", city: "Ogden, UT · Wall Ave", phone: "(801) 555-0202", hours: "9am–8pm", img: "https://images.unsplash.com/photo-1605152322258-210926fd2faf?w=320&h=180&fit=crop&auto=format", inventory: 142 },
  { id: 3, name: "AutoNexus Orem", city: "Orem, UT", phone: "(801) 555-0303", hours: "9am–7pm", img: "https://images.unsplash.com/photo-1574023196412-4d9387578fca?w=320&h=180&fit=crop&auto=format", inventory: 118 },
  { id: 4, name: "AutoNexus Sandy", city: "Sandy, UT", phone: "(801) 555-0404", hours: "9am–8pm", img: "https://images.unsplash.com/photo-1605152322270-89a9fcae206f?w=320&h=180&fit=crop&auto=format", inventory: 156 },
  { id: 5, name: "AutoNexus EV", city: "Salt Lake City, UT", phone: "(801) 555-0505", hours: "9am–7pm", img: "https://images.unsplash.com/photo-1574023278973-0ca611ecc4c1?w=320&h=180&fit=crop&auto=format", inventory: 87 },
  { id: 6, name: "Generous Auto", city: "Provo, UT", phone: "(801) 555-0606", hours: "9am–8pm", img: "https://images.unsplash.com/photo-1589536672563-7b508f98ecea?w=320&h=180&fit=crop&auto=format", inventory: 74 },
  { id: 7, name: "Riverdale Mitsubishi", city: "Riverdale, UT", phone: "(801) 555-0707", hours: "10am–7pm", img: "https://images.unsplash.com/photo-1605152276590-819c25679592?w=320&h=180&fit=crop&auto=format", inventory: 63 },
  { id: 8, name: "Salt Lake Mitsubishi", city: "Salt Lake City, UT", phone: "(801) 555-0808", hours: "9am–8pm", img: "https://images.unsplash.com/photo-1723065775998-af1c09fd6060?w=320&h=180&fit=crop&auto=format", inventory: 91 },
  { id: 9, name: "Southtowne Mitsubishi", city: "Sandy, UT", phone: "(801) 555-0909", hours: "9am–7pm", img: "https://images.unsplash.com/photo-1769546253924-9e23d794be53?w=320&h=180&fit=crop&auto=format", inventory: 78 },
];

export function Locations() {
  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="w-full px-10 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[#101820] font-bold" style={{ fontSize: "24px" }}>Shop 9 locations from one place</h2>
            <p className="text-xs font-semibold text-[#667481] mt-1">All inventory, one search. Find your car at any location.</p>
          </div>
          <button className="text-sm font-bold text-[#101820] border border-[#D9E2EC] bg-[#F5F7FA] px-4 py-2.5 rounded-xl hover:bg-[#D9E2EC] transition-colors hidden md:block min-h-[44px]">
            View All Locations
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {locations.map((loc) => (
            <div key={loc.id} className="rounded-2xl border border-[#D9E2EC] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group bg-white" style={{ boxShadow: "0 1px 2px rgba(16, 24, 32, 0.08)" }}>
              <div className="relative overflow-hidden">
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 bg-[#101820] text-white text-[10px] px-2 py-0.5 rounded-lg font-bold">
                  {loc.inventory} vehicles
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-[#101820] mb-2">{loc.name}</p>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#667481] mb-1">
                  <MapPin className="w-3 h-3 shrink-0" />{loc.city}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#667481] mb-1">
                  <Phone className="w-3 h-3 shrink-0" />{loc.phone}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#667481]">
                  <Clock className="w-3 h-3 shrink-0" />{loc.hours}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
