
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
  { id: "HLT-3001", title: "Family Floater Classic", price: "₹12,999/yr", cover: "Up to ₹10,00,000", perks: ["Cashless hospitals", "No-claim bonus", "Ambulance cover"] },
  { id: "HLT-3002", title: "Individual Health Standard", price: "₹8,499/yr", cover: "Up to ₹5,00,000", perks: ["Pre & post hospitalization", "Day care procedures"] },
  { id: "HLT-3003", title: "Senior Citizen Care", price: "₹18,999/yr", cover: "Up to ₹8,00,000", perks: ["No pre-acceptance medicals", "Domiciliary treatment"] },
  { id: "HLT-3004", title: "Top-up / Super Top-up", price: "₹4,499/yr", cover: "Up to ₹20,00,000 (deductible applies)", perks: ["High sum insured", "Affordable premium"] },
  { id: "HLT-3005", title: "Critical Illness Shield", price: "₹6,999/yr", cover: "Lump-sum on diagnosis", perks: ["Cancer, heart, neuro", "Tax benefits"] },
  { id: "HLT-3006", title: "OPD & Pharmacy Cover", price: "₹2,999/yr", cover: "OPD consultations & medicines", perks: ["Annual wellness", "Teleconsults"] },
];

const HealthPolicies = () => {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Health Insurance Plans</h1>
          <p className="text-textSecondary">
            Comprehensive health coverage with wellness and OPD options.
          </p>
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

export default HealthPolicies;
