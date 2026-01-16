import React, { useEffect, useMemo, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../common/Navbar.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaShieldAlt,
} from "react-icons/fa";

const INR = (n = 0) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

const daysBetween = (d1, d2) => {
  const one = new Date(d1);
  const two = new Date(d2);
  return Math.ceil((two - one) / (1000 * 60 * 60 * 24));
};

const addDays = (date, days) => {
  const dt = new Date(date);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().split("T")[0];
};

const guessExpiry = (policy) => {
  // Try common keys if API shape varies
  const raw =
    policy?.expiryDate ||
    policy?.validTill ||
    policy?.endDate ||
    (policy?.startDate ? addDays(policy.startDate, 365) : null);

  // Fallback: treat as expiring in 15 days (for demo-safe default)
  return raw || addDays(new Date().toISOString().split("T")[0], 15);
};

const baseRateByType = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("car") || t.includes("motor")) return 0.018; // 1.8%
  if (t.includes("bike") || t.includes("two")) return 0.012; // 1.2%
  if (t.includes("health")) return 0.015; // 1.5%
  if (t.includes("life")) return 0.004; // 0.4%
  if (t.includes("travel")) return 0.006; // 0.6%
  return 0.01; // default 1%
};

export const contextualAddOns = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("car") || t.includes("motor")) {
    return [
      { key: "zero_dep", label: "Zero Depreciation", calc: (base) => base * 0.18 },
      { key: "engine_protect", label: "Engine Protect", calc: () => 1200 },
      { key: "rsa", label: "Roadside Assistance", calc: () => 499 },
      { key: "ncb_protect", label: "NCB Protector", calc: () => 899 },
      { key: "pa_cover", label: "Personal Accident Cover", calc: () => 250 },
    ];
  }
  if (t.includes("bike") || t.includes("two")) {
    return [
      { key: "zero_dep", label: "Zero Depreciation", calc: (base) => base * 0.12 },
      { key: "rsa", label: "Roadside Assistance", calc: () => 299 },
      { key: "helmet_cover", label: "Helmet Cover", calc: () => 99 },
    ];
  }
  if (t.includes("health")) {
    return [
      { key: "room_rent_waiver", label: "Room Rent Waiver", calc: (base) => base * 0.1 },
      { key: "opd_cover", label: "OPD Cover", calc: () => 1500 },
      { key: "critical_illness", label: "Critical Illness Add-on", calc: (base) => base * 0.15 },
      { key: "maternity_cover", label: "Maternity Cover", calc: () => 2000 },
    ];
  }
  if (t.includes("life")) {
    return [
      { key: "accidental_death", label: "Accidental Death Benefit", calc: (base) => base * 0.08 },
      { key: "waiver_premium", label: "Waiver of Premium", calc: () => 1000 },
      { key: "critical_illness", label: "Critical Illness Rider", calc: (base) => base * 0.12 },
    ];
  }
  if (t.includes("travel")) {
    return [
      { key: "baggage_loss", label: "Baggage Loss Cover", calc: () => 350 },
      { key: "trip_delay", label: "Trip Delay & Cancellation", calc: () => 400 },
      { key: "medical_topup", label: "Medical Top-up", calc: (base) => base * 0.05 },
    ];
  }
  return [{ key: "priority_service", label: "Priority Service", calc: () => 199 }];
};

// Page
const RenewalDetails = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  console.log(user)

  const [policies, setPolicies] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  // Minimal editable details (optional fields)
  const [details, setDetails] = useState({
    nomineeName: "",
    addressLine: "",
  });

  // Add-ons selection
  const [selectedAddOns, setSelectedAddOns] = useState({}); // { addonKey: boolean }
const {id : policyId} = useParams();
console.log(policyId)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      
      console.log(user.userId)
      try {
        const res = await fetch(`http://localhost:4000/policies/?userId=${user.userId}`);
        const data = await res.json();

        
      const uniqueByPolicyId = Array.from(
       new Map(
            (Array.isArray(data) ? data : []).map(p => [String(p.policyId), p])
          ).values()
        );

      setPolicies(uniqueByPolicyId);
      if (uniqueByPolicyId.length) setSelectedId(String(policyId));
      } catch {
        // Fallback demo data (if API down)
        const demo = [
          {
            id: "P-1001",
            userId,
            policyId: "CAR-001",
            name: "Comprehensive Car Shield",
            type: "Car",
            sumInsured: 500000,
            expiryDate: addDays(new Date(), 12),
          },
        ];
        setPolicies(demo);
        setSelectedId(String(demo[0].id));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.userId]);

 

const selectedPolicy = (() => {
  if (!policies || selectedId == null) return null;
  return policies.find(p => String(p.policyId) === String(selectedId)) || null;
})();


  console.log(selectedPolicy)
  console.log(user.userId)
    
  const expiryDate = useMemo(() => (selectedPolicy ? guessExpiry(selectedPolicy) : null), [selectedPolicy]);
  const daysLeft = useMemo(() => {
    if (!expiryDate) return null;
    return daysBetween(new Date().toISOString().split("T")[0], expiryDate);
  }, [expiryDate]);

  // Base premium: prefer policy.premium, else compute from sumInsured * baseRate
  const basePremium = useMemo(() => {
    if (!selectedPolicy) return 0;
    const explicit = Number(selectedPolicy.premium || 0);
    if (explicit > 0) return explicit;
    const rate = baseRateByType(selectedPolicy.type);
    return Math.round((Number(selectedPolicy.sumInsured || 0) * rate) / 12); // monthly-ish factor, keeps numbers sane
  }, [selectedPolicy]);

  const addOnCatalog = useMemo(
    () => contextualAddOns(selectedPolicy?.type),
    [selectedPolicy?.type]
  );

  const addOnsTotal = useMemo(() => {
    return addOnCatalog.reduce((sum, a) => {
      if (!selectedAddOns[a.key]) return sum;
      const inc = a.calc(basePremium);
      return sum + Number(inc || 0);
    }, 0);
  }, [addOnCatalog, selectedAddOns, basePremium]);

  // NCB: use policy.ncbPercent if present, else estimate from claim-free years
  const ncbPercent = useMemo(() => {
    const pct =
      selectedPolicy?.ncbPercent ??
      (selectedPolicy?.claimFreeYears ? selectedPolicy.claimFreeYears * 10 : 0);
    return clamp(Number(pct || 0), 0, 50);
  }, [selectedPolicy]);

  const ncbDiscount = useMemo(() => Math.round((basePremium * ncbPercent) / 100), [basePremium, ncbPercent]);

  // Early-bird: renew > 10 days before expiry => 5% off base
  const earlyBirdPercent = useMemo(() => (daysLeft !== null && daysLeft > 10 ? 5 : 0), [daysLeft]);
  const earlyBirdDiscount = useMemo(
    () => Math.round((basePremium * earlyBirdPercent) / 100),
    [basePremium, earlyBirdPercent]
  );

  const totalPayable = useMemo(() => Math.max(0, basePremium + addOnsTotal - ncbDiscount - earlyBirdDiscount), [
    basePremium,
    addOnsTotal,
    ncbDiscount,
    earlyBirdDiscount,
  ]);

  const expChip = useMemo(() => {
    if (daysLeft === null) return { tone: "bg-slate-200 text-slate-700", label: "Unknown Expiry" };
    if (daysLeft < 0) return { tone: "bg-red-100 text-red-700", label: `Expired ${Math.abs(daysLeft)}d ago` };
    if (daysLeft === 0) return { tone: "bg-red-100 text-red-700", label: "Expires Today" };
    if (daysLeft <= 7) return { tone: "bg-orange-100 text-orange-700", label: `Expiring in ${daysLeft}d` };
    return { tone: "bg-green-100 text-green-700", label: `Renew in ${daysLeft}d` };
  }, [daysLeft]);

  const toggleAddOn = (key) => {
    setSelectedAddOns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onChangeDetails = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleRenew = () => {
    // if (!isAuthenticated) {
      navigate("/checkout", {
        state: {
          selectedAddOns : selectedAddOns,
          policy : selectedPolicy,                 
          totalPayable: totalPayable,
          // premium  : subTotal  ,
          fromPath: location.pathname + location.search + location.hash,
        },
      });
 
  };

  return (
    <>
    <Navbar />
   
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Page Header */}
        <header className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FaShieldAlt />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Renew Your Policy</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Review add-ons, verify details, and complete renewal securely.
              </p>
            </div>
          </div>
          {selectedPolicy && (
            <span className={`text-xs px-2.5 py-1 rounded-full border ${expChip.tone} border-transparent`}>
              <FaCalendarAlt className="inline mr-1" /> {expChip.label}
            </span>
          )}
        </header>

        {/* Policy Selector */}
        <section className="bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Select Policy to Renew</h2>

          {loading ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">Loading your policies…</p>
          ) : policies.length === 0 ? (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              No policies found. <Link to="/" className="text-primary">Explore Policies</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {policies.map((p) => {
                const isActive = String(p.id) === String(selectedId);
                const exp = guessExpiry(p);
                const dLeft = daysBetween(new Date().toISOString().split("T")[0], exp);
                const chip =
                  dLeft < 0
                    ? "bg-red-100 text-red-700"
                    : dLeft <= 7
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700";

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(String(p.policyId))}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      isActive
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{p.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{p.type}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${chip}`}>
                        <FaCalendarAlt className="inline mr-1" />
                        {dLeft < 0 ? `Expired ${Math.abs(dLeft)}d` : dLeft === 0 ? "Today" : `in ${dLeft}d`}
                      </span>
                    </div>
                    <div className="text-xs flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Sum:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ₹{Number(p.sumInsured || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {isActive && <div className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">✓ Selected</div>}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Left: Add-ons & Details | Right: Premium Summary */}
        {selectedPolicy && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Add-ons */}
              <section className="bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recommended Add-ons</h3>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Tailored for <strong>{selectedPolicy.type}</strong>
                  </span>
                </div>

                <div className="space-y-2">
                  {addOnCatalog.map((a) => {
                    const estimated = a.calc(basePremium);
                    const active = !!selectedAddOns[a.key];
                    return (
                      <label
                        key={a.key}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          active
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                            : "bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-blue-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleAddOn(a.key)}
                            className="accent-blue-600 h-4 w-4"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{a.label}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Adds {INR(estimated)} 
                            </p>
                          </div>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400">
                          {active ? <FaMinusCircle /> : <FaPlusCircle />}
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <FaInfoCircle className="mt-0.5" />
                  <p>
                    Add-on pricing is indicative. Final premium may vary based on underwriting checks.
                  </p>
                </div>
              </section>

              {/* Details (minimal) */}
              <section className="bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Verify / Update Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Nominee Name</label>
                    <input
                      type="text"
                      name="nomineeName"
                      value={details.nomineeName}
                      onChange={onChangeDetails}
                      placeholder="Enter nominee full name"
                      className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 px-3 py-2 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Communication Address</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={details.addressLine}
                      onChange={onChangeDetails}
                      placeholder="Flat, Street, City, PIN"
                      className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 px-3 py-2 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Changes (if any) will be reflected in your renewed policy document.
                </p>
              </section>
            </div>

            {/* Right column: Premium Summary */}
            <aside className="lg:col-span-4">
              <div className="bg-bgCard dark:bg-slate-800 border border-borderDefault dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Premium Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Base Premium</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{INR(basePremium)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Add-ons</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{INR(addOnsTotal)}</span>
                  </div>

                  

                  {earlyBirdPercent > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        Early bird ({earlyBirdPercent}%)
                      </span>
                      <span className="font-semibold text-green-600">- {INR(earlyBirdDiscount)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-300 dark:border-slate-600" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Total Payable</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {INR(totalPayable)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={()=>window.history.back()}
                    className="px-3 py-2 text-sm rounded-md border border-borderDefault dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                  Back 
                  </button>
                  <button
                    onClick={handleRenew}
                    className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Renew Now
                  </button>
                </div>

                {daysLeft !== null && daysLeft <= 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
                    <FaExclamationCircle className="mt-0.5" />
                    <p>Your policy is expired. Renew now to avoid break-in inspection and loss of NCB.</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}

        {/* Sticky Bottom Bar (mobile) */}
        {selectedPolicy && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bgCard dark:bg-slate-800 border-t border-borderDefault dark:border-slate-700 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total Payable</p>
              <p className="text-base font-bold text-blue-600 dark:text-blue-400">{INR(totalPayable)}</p>
            </div>
            <button
              onClick={handleRenew}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Renew Now
            </button>
          </div>
        )}
      </div>
    </div>
     </>
  );
};

export default RenewalDetails;

