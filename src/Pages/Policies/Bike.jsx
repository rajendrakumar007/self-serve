
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
  {
    id: "BIKE-2001",
    title: "Comprehensive Bike Plus",
    price: "₹2,499/yr",
    cover: "Up to ₹1,50,000",
    perks: ["Zero depreciation", "Roadside assistance", "Cashless garages"],
  },
  {
    id: "BIKE-2002",
    title: "Comprehensive Bike Standard",
    price: "₹1,899/yr",
    cover: "Up to ₹1,00,000",
    perks: ["Own damage + Third-party", "Quick claims"],
  },
  {
    id: "BIKE-2003",
    title: "Third-Party Basic 2W",
    price: "₹799/yr",
    cover: "Third-party liabilities",
    perks: ["Legal cover", "Affordable premium"],
  },
  {
    id: "BIKE-2004",
    title: "Zero Depreciation Rider 2W",
    price: "+₹499/yr",
    cover: "Applicable on fiber/plastic parts",
    perks: ["No depreciation on parts"],
  },
  {
    id: "BIKE-2005",
    title: "Personal Accident (Rider)",
    price: "+₹299/yr",
    cover: "₹1,00,000 per rider",
    perks: ["Medical expenses", "Accidental death benefit"],
  },
  {
    id: "BIKE-2006",
    title: "Roadside Assistance 2W",
    price: "+₹199/yr",
    cover: "Towing, battery jump-start",
    perks: ["Pan-India support", "On-site help"],
  },
  {
    id: "BIKE-2007",
    title: "Consumables Cover 2W",
    price: "+₹149/yr",
    cover: "Oil, nuts, bolts, coolant",
    perks: ["Consumables included"],
  },
  {
    id: "BIKE-2008",
    title: "Helmet & Accessories Cover",
    price: "+₹149/yr",
    cover: "Helmet & riding gear",
    perks: ["Gear protection", "Accidental damage"],
  },
];

const BikePolicies = () => {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Bike Insurance Plans</h1>
          <p className="text-textSecondary">
            Pick comprehensive or third-party two-wheeler cover with add-ons.
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

export default BikePolicies;
