
import React from "react";
import Navbar from "../../Components/Navbar";
import { FaCheck } from "react-icons/fa";

const policies = [
  { id: "CAR-1001", title: "Comprehensive Plus", price: "₹6,499/yr", cover: "Up to ₹5,00,000", perks: ["Zero depreciation", "Roadside assistance", "Cashless network"] },
  { id: "CAR-1002", title: "Comprehensive Standard", price: "₹4,199/yr", cover: "Up to ₹3,00,000", perks: ["Third-party liability", "Accidental cover", "Fast claims"] },
  { id: "CAR-1003", title: "Third-Party Basic", price: "₹1,299/yr", cover: "Third-party liabilities", perks: ["Legal cover", "Affordable premium"] },
  { id: "CAR-1004", title: "Zero Depreciation Rider", price: "+₹1,200/yr", cover: "Applies to selected comprehensive plans", perks: ["No depreciation on parts"] },
  { id: "CAR-1005", title: "Personal Accident Cover", price: "+₹499/yr", cover: "₹2,00,000 per person", perks: ["Medical expenses", "Accidental death benefit"] },
  { id: "CAR-1006", title: "Own Damage Waiver", price: "+₹999/yr", cover: "Covers own damage excess", perks: ["Reduce excess", "Peace of mind"] },
  { id: "CAR-1007", title: "Roadside Assistance Pack", price: "+₹299/yr", cover: "Towing & on-site minor repairs", perks: ["Towing", "On-site help"] },
  { id: "CAR-1008", title: "Family Add-on", price: "+₹699/yr", cover: "Covers additional drivers", perks: ["Multiple driver cover", "Shared benefits"] },
];

const PolicyCard = ({ p }) => (
  <div className="bg-bgCard rounded-lg p-5 shadow-sm flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{p.title}</h4>
        <div className="text-sm text-textSecondary">{p.id}</div>
      </div>

      <div className="text-lg font-bold mb-2">{p.price}</div>
      <div className="text-textSecondary text-sm mb-3">{p.cover}</div>

      <ul className="text-sm text-textSecondary space-y-1 mb-3">
        {p.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2">
            <FaCheck className="text-primary" /> {perk}
          </li>
        ))}
      </ul>
    </div>

    <div className="flex items-center justify-between mt-4">
      <button className="px-3 py-2 rounded-md bg-primary text-textInverted">Buy Now</button>
    </div>
  </div>
);

const CarPolicies = () => {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Car Insurance Plans</h1>
          <p className="text-textSecondary">Choose from our curated list of car insurance plans and add-ons.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((p) => (
            <PolicyCard key={p.id} p={p} />
          ))}
        </section>
      </main>

    </>
  );
};

export default CarPolicies;
