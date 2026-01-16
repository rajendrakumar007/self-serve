
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaShieldAlt, FaRupeeSign, FaInfoCircle } from "react-icons/fa";
import Navbar from "../../components/common/Navbar";

const INR = (n = 0) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function PaymentDetails() {
  const navigate = useNavigate();
  const location = useLocation(); // FIX: keep the full location object
  const { state } = location;

  // Expecting: { policy }
  const policy = state?.policy;

  if (!policy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10">
          <div className="bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-6">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Payment Details</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              No policy selected. Please go back and choose a policy.
            </p>
            <div className="mt-4">
              <Link to="/" className="text-primary underline">Browse Policies</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    policyId,
    title,
    type,
    perks = [],
    terms,
    sumInsured = 0,
    premium = 0,
    premiumByTenure = null, // preferred if present
  } = policy;

  // Allowed tenures and available tenures based on data
  const ALLOWED_TENURES = [3, 5, 10];
  const availableTenures = useMemo(() => {
    if (!premiumByTenure || typeof premiumByTenure !== "object") return [];
    return ALLOWED_TENURES.filter((t) => premiumByTenure[String(t)] != null);
  }, [premiumByTenure]);

  // Default tenure preference
  const defaultTenure = useMemo(() => {
    if (availableTenures.includes(5)) return 5;
    if (availableTenures.length > 0) return availableTenures[0];
    // Even if no data-driven tenures, allow user to pick any; prefer 5
    return 5;
  }, [availableTenures]);

  const [selectedTenure, setSelectedTenure] = useState(defaultTenure);

  // Keep selectedTenure valid when data changes
  useEffect(() => {
    setSelectedTenure((prev) => {
      if (availableTenures.length === 0) {
        // No precomputed premiums; keep a sensible default
        return 5;
      }
      if (prev && availableTenures.includes(prev)) return prev;
      return defaultTenure;
    });
  }, [availableTenures, defaultTenure]);

  // Compute premium based on tenure; fallback to flat premium if not available
  const selectedPremium = useMemo(() => {
    const key = String(selectedTenure);
    if (premiumByTenure && premiumByTenure[key] != null) {
      return Number(premiumByTenure[key]);
    }
    // No precomputed tenure pricing: use the base premium regardless of tenure
    return Number(premium || 0);
  }, [premiumByTenure, selectedTenure, premium]);

  const handleContinueToBuy = () => {
    navigate("/checkout", {
      state: {
        policy,                             // full object
        totalPayable: selectedPremium,      // uses chosen tenure
        selectedTenureYears: selectedTenure,
        fromPath: location.pathname + location.search + location.hash, // FIX: now defined
      },
    });
  };

  // Tenure selector UI (Never fully disabled; only disable individual buttons if missing)
  const TenureSelector = () => {
    return (
      <div className="mt-4">
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Tenure
        </label>

        <div className="grid grid-cols-3 gap-2">
          {ALLOWED_TENURES.map((years) => {
            const isAvailable = availableTenures.includes(years);
            const isActive = selectedTenure === years;

            const baseClasses =
              "w-full px-3 py-2 text-sm rounded-md border transition-colors text-center";
            const activeClasses =
              "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
            const inactiveClasses =
              "border-borderDefault dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700";
            const disabledClasses =
              "opacity-50 cursor-not-allowed border-dashed";

            const classes = [
              baseClasses,
              isAvailable ? (isActive ? activeClasses : inactiveClasses) : disabledClasses,
            ].join(" ");

            return (
              <button
                key={years}
                type="button"
                className={classes}
                onClick={() => {
                  // Even if not available in data, allow selection to change premium display (fallback to base)
                  setSelectedTenure(years);
                }}
                // Only visually mark as disabled if missing; still allow click to choose tenure for fallback display
                aria-pressed={isActive}
                aria-label={`${years} years`}
              >
                {years} Years
              </button>
            );
          })}
        </div>

        {/* Helper text */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          {availableTenures.length
            ? "Choose tenure (Premium is calculated per year for the selected tenure)."
            : "No tenure-specific pricing found. Selecting a tenure will show the base premium."}
        </p>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Header */}
          <header className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FaShieldAlt />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Payment Details
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Review the plan and proceed to payment.
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Policy Summary */}
            <section className="lg:col-span-7 bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {title}
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Policy ID</span>
                  <span className="font-mono text-slate-900 dark:text-white">{policyId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Type</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Sum Insured</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{INR(sumInsured)}</span>
                </div>
                {/* Premium (dynamic by tenure) */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Premium</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {INR(selectedPremium)}
                  </span>
                </div>
                {/* Tenure display */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Tenure</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedTenure ? `${selectedTenure} Years` : "—"}
                  </span>
                </div>
              </div>

              {/* Perks */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Perks</h3>
                {perks.length ? (
                  <ul className="mt-2 list-disc list-inside text-sm text-slate-700 dark:text-slate-300">
                    {perks.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">No perks listed.</p>
                )}
              </div>

              {/* Terms */}
              {terms && (
                <div className="mt-4 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <FaInfoCircle className="mt-0.5" />
                  <p>{terms}</p>
                </div>
              )}
            </section>

            {/* Pay Card */}
            <aside className="lg:col-span-5">
              <div className="bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Plan</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right ml-3 truncate">
                      {title}
                    </span>
                  </div>

                  {/* Tenure selector */}
                  <TenureSelector />

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Premium</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {INR(selectedPremium)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    onClick={() => window.history.back()}
                    className="px-3 py-2 text-sm rounded-md border border-borderDefault dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-center"
                  >
                    Back
                  </Link>
                  <button
                    onClick={handleContinueToBuy}
                    className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center justify-center gap-2"
                  >
                    <FaRupeeSign /> Continue to Buy
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Mobile Sticky Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bgCard dark:bg-slate-800 border-t border-borderDefault dark:border-slate-700 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Premium</p>
              <p className="text-base font-bold text-blue-600 dark:text-blue-400">{INR(selectedPremium)}</p>
            </div>
            <button
              onClick={handleContinueToBuy}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue to Buy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
