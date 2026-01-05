
import React from "react";
import Navbar from "../../Components/Navbar";
import { FaCheck } from "react-icons/fa";

/** Inline card to avoid extra files */
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

const policies = [
  { id: "AIR-6001", title: "Air Passenger Basic", price: "₹299/trip", cover: "Flight delay & cancellation", perks: ["Rescheduling cover", "24x7 support"] },
  { id: "AIR-6002", title: "Baggage Loss & Delay", price: "₹399/trip", cover: "Checked-in baggage loss/delay", perks: ["Essential purchases", "Document assistance"] },
  { id: "AIR-6003", title: "Missed Connection Cover", price: "₹349/trip", cover: "Due to delay of feeder flight", perks: ["Alternative flight cost", "Hotel stipend"] },
  { id: "AIR-6004", title: "Premium Air Pass", price: "₹999/yr", cover: "Annual multi-trip benefits", perks: ["Priority support", "Higher limits"] },
];

const AirPassPolicies = () => {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Air Pass Insurance</h1>
          <p className="text-textSecondary">Focused protection for air travelers and frequent flyers.</p>
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

export default AirPassPolicies;
