
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
  { id: "LIFE-4001", title: "Term Life Secure", price: "₹7,499/yr", cover: "Up to ₹1 Cr", perks: ["Level sum assured", "Accident rider option"] },
  { id: "LIFE-4002", title: "Term Life Elite (ROP)", price: "₹12,999/yr", cover: "Up to ₹75 L", perks: ["Return of premium", "Critical illness add-on"] },
  { id: "LIFE-4003", title: "Whole Life Protection", price: "₹18,999/yr", cover: "Lifetime cover", perks: ["Cash value build-up", "Loan facility"] },
  { id: "LIFE-4004", title: "Endowment Savings Plan", price: "₹10,499/yr", cover: "Savings + protection", perks: ["Guaranteed maturity", "Bonuses"] },
  { id: "LIFE-4005", title: "Child Education Plan", price: "₹8,999/yr", cover: "Goal-based", perks: ["Milestone payouts", "Waiver of premium"] },
  { id: "LIFE-4006", title: "Retirement Pension Plan", price: "₹11,999/yr", cover: "Annuity income", perks: ["Deferred annuity", "Joint life option"] },
  { id: "LIFE-4007", title: "Money-Back Plan", price: "₹9,499/yr", cover: "Periodical survival benefits", perks: ["Guaranteed cashbacks"] },
  { id: "LIFE-4008", title: "ULIP Growth", price: "₹15,999/yr", cover: "Market-linked", perks: ["Fund switches", "Partial withdrawals"] },
  { id: "LIFE-4009", title: "Income Shield", price: "₹8,499/yr", cover: "Monthly income on claim", perks: ["Family income benefit"] },
  { id: "LIFE-4010", title: "Accident & Disability Rider", price: "+₹1,499/yr", cover: "Add-on rider", perks: ["AD&D cover", "Premium waiver"] },
];

const LifePolicies = () => {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Life Insurance Plans</h1>
          <p className="text-textSecondary">Protect your family with term, savings, ULIP, and rider options.</p>
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

export default LifePolicies;
