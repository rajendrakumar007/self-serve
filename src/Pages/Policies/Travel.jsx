
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
  { id: "TRVL-5001", title: "Domestic Travel Basic", price: "₹799/trip", cover: "Trip cancellation & delay", perks: ["Baggage delay", "24x7 assistance"] },
  { id: "TRVL-5002", title: "International Comprehensive", price: "₹2,999/trip", cover: "Medical + travel emergencies", perks: ["Cashless overseas care", "Loss of passport"] },
  { id: "TRVL-5003", title: "Student Travel Plan", price: "₹1,999/trip", cover: "Medical & study interruption", perks: ["Sponsor protection", "Laptop cover"] },
  { id: "TRVL-5004", title: "Family Travel Plan", price: "₹3,499/trip", cover: "Family of up to 4", perks: ["Combined benefits", "Child care"] },
  { id: "TRVL-5005", title: "Senior Travel Care", price: "₹2,499/trip", cover: "Pre-existing emergency cover*", perks: ["Emergency evacuation", "Compassionate visit"] },
  { id: "TRVL-5006", title: "Multi-Trip Annual", price: "₹7,999/yr", cover: "Unlimited trips (limits apply)", perks: ["Frequent travelers", "Global coverage"] },
];

const TravelPolicies = () => {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Travel Insurance Plans</h1>
          <p className="text-textSecondary">Domestic & international trip protection with medical coverage.</p>
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

export default TravelPolicies;
