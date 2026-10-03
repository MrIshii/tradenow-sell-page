import img1 from "../../imports/c8709ed3-406c-4f62-a6bc-de56a7a2edfc.png";
import img2 from "../../imports/f10f57c8-101a-40d4-8357-f387a0a4051b.png";
import img3 from "../../imports/c475482a-4f69-4c3e-ba9d-619a4a827244.png";
import img4 from "../../imports/ed8d5e2e-0406-4574-a8e9-e3351555d007.png";

const cards = [
  { id: 1, img: img1, alt: "Go by Budget" },
  { id: 2, img: img2, alt: "No-Surprise Payment" },
  { id: 3, img: img3, alt: "Pre-Purchase Inspection" },
  { id: 4, img: img4, alt: "Shop By Trade" },
];

export function FeatureCards() {
  return (
    <section className="bg-white border-b border-border">
      <div className="w-full px-[64px] pt-[0px] pb-[64px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-[0px] my-[24px]">
          {cards.map((card) => (
            <img
              key={card.id}
              src={card.img}
              alt={card.alt}
              className="w-full rounded-xl object-cover cursor-pointer hover:opacity-95 transition-opacity"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
