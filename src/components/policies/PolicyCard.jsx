import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { getUserPolicies } from "../../utils/policies/policies";
import { getCurrentUserId } from "../../utils/auth/auth";

// Helper: format INR nicely
const formatINR = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : n;

const PolicyCard = ({ p }) => {
  const navigate = useNavigate();

  // Safely map premiums by tenure into a sorted array [{tenure, total, perYear}]
  const tenureOptions = useMemo(() => {
    if (!p?.premiumByTenure) return [];
    return Object.entries(p.premiumByTenure)
      .map(([tenureStr, premium]) => {
        const tenure = Number(tenureStr);
        const perYear = premium > 0 ? premium : 0;
        const total = tenure * premium;
        return { tenure, total, perYear };
      })
      .sort((a, b) => a.tenure - b.tenure);
  }, [p]);

  // Pick a default selected tenure (longest usually offers best per-year value)
  const defaultIdx =
    tenureOptions.length > 0
      ? tenureOptions.reduce(
          (bestIdx, cur, idx, arr) =>
            cur.perYear < arr[bestIdx].perYear ? idx : bestIdx,
          0,
        )
      : -1;

  const [selectedIdx, setSelectedIdx] = useState(defaultIdx);

  // Derive “best value” index for highlighting
  const bestValueIdx =
    tenureOptions.length > 0
      ? tenureOptions.reduce(
          (bestIdx, cur, idx, arr) =>
            cur.perYear < arr[bestIdx].perYear ? idx : bestIdx,
          0,
        )
      : -1;

  const selectedOption = selectedIdx >= 0 ? tenureOptions[selectedIdx] : null;

  const policies = getUserPolicies();
  const userId = getCurrentUserId();
  const alreadyPurchased = policies.some(
    (pol) => pol.userId === userId && pol.policyId === p.policyId,
  );
  const handleBuy = () => {
    // Pass selected tenure info along with policy

    const payload = {
      ...p,
      selectedTenure: selectedOption?.tenure ?? 1,
      selectedPremiumTotal: selectedOption?.total ?? p.premium,
    };
    navigate("/payments", { state: { policy: payload } });
  };

  return (
    <>
      <div className="bg-bgCard dark:bg-gray-800 rounded-lg p-5 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 border border-transparent dark:border-gray-700">
        <div>
          {/* Title & Policy ID */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-lg text-textPrimary dark:text-textInverted">
                {p.title}
              </h4>
              {p.policyId ? (
                <p className="text-xs text-textPrimary dark:text-textInverted mt-0.5">
                  Policy ID: {p.policyId}
                </p>
              ) : null}
            </div>
          </div>

          {/* Coverage (Sum Insured) */}
          <div className="mb-3">
            <div className="text-xs uppercase tracking-wide text-textPrimary dark:text-textInverted mb-1">
              Coverage
            </div>
            <div className="text-base font-semibold text-textPrimary dark:text-textInverted">
              ₹{formatINR(p.sumInsured)}
            </div>
          </div>

          {/* Terms / Description */}
          {p.terms ? (
            <div className="text-textPrimary dark:text-textInverted text-sm mb-4 italic">
              {p.terms}
            </div>
          ) : null}

          {/* Perks */}
          {Array.isArray(p.perks) && p.perks.length > 0 ? (
            <ul className="text-sm text-textPrimary dark:text-textInverted space-y-2 mb-4">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <FaCheck className="text-primary shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Premium by Tenure */}
          {tenureOptions.length > 0 ? (
            <div className="mb-2">
              <div className="text-xs uppercase tracking-wide text-textPrimary dark:text-textInverted mb-2">
                Premium by Tenure
              </div>

              {/* Tenure options as selectable chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {tenureOptions.map((opt, idx) => {
                  const isSelected = idx === selectedIdx;
                  const isBest = idx === bestValueIdx;
                  return (
                    <button
                      key={opt.tenure}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className={[
                        "px-3 py-1.5 rounded-full border text-sm transition",
                        isSelected
                          ? "bg-success text-textInverted border-primary"
                          : "border-gray-300 dark:border-gray-700 text-textPrimary dark:text-textInverted hover:bg-gray-50 dark:hover:bg-gray-800",
                      ].join(" ")}
                      title={`Total: ₹${formatINR(opt.total)} • ~₹${formatINR(
                        Math.round(opt.perYear),
                      )}/year`}
                    >
                      {opt.tenure} yrs
                      {isBest ? (
                        <span className="ml-2 text-[10px] font-semibold uppercase">
                          Best Value
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Selected tenure's pricing breakdown */}
              {selectedOption ? (
                <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm text-textPrimary dark:text-textInverted">
                      Approx. per year
                    </div>
                    <div className="text-sm text-textPrimary dark:text-textInverted">
                      ₹{formatINR(Math.round(selectedOption.perYear))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-textPrimary dark:text-textInverted">
                      Total premium ({selectedOption.tenure} yrs)
                    </div>
                    <div className="text-xs text-textPrimary dark:text-textInverted">
                      ₹{formatINR(selectedOption.total)}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            // Fallback to single-year premium if tenure premiums are not present
            <div className="mb-2">
              <div className="text-xs uppercase tracking-wide text-textPrimary dark:text-textInverted mb-1">
                Premium
              </div>
              <div className="text-base font-semibold text-textPrimary dark:text-textInverted">
                ₹{formatINR(p.premium)}
                <span className="text-xs text-textPrimary dark:text-textInverted ml-1">
                  / year
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* If tenure selected, show that price; else show base premium */}
          <span className="text-base font-semibold text-textPrimary dark:text-textInverted">
            {selectedOption ? (
              <>
                ₹{formatINR(selectedOption.perYear)}
                <span className="text-xs text-textPrimary dark:text-textInverted ml-1">
                  /yr
                </span>
              </>
            ) : (
              <>
                ₹{formatINR(p.premium)}
                <span className="text-xs text-textPrimary dark:text-textInverted ml-1">
                  / year
                </span>
              </>
            )}
          </span>

          <button
            disabled={alreadyPurchased}
            title={alreadyPurchased ? "You already purchased this policy" : ""}
            className={`px-3 py-2 text-sm rounded-md transition
                            ${
                              alreadyPurchased
                                ? "bg-gray-400 dark:bg-gray-600 text-textInverted cursor-not-allowed"
                                : "bg-primary dark:bg-blue-600 hover:bg-primaryDark dark:hover:bg-blue-700 text-white"
                            }`}
            onClick={!alreadyPurchased ? handleBuy : undefined}
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
};

export default PolicyCard;
