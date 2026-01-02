import React from "react";

/**
 * CoverageTermsCard (Tailwind-based)
 * - Non-invasive card that derives extra insights from `policy.terms`, especially for Health.
 * - Computes PED effective date: startDate + N months (extracted from terms text).
 * - Uses your Tailwind theme tokens (bgCard, borderDefault, textPrimary, info, success, etc.).
 */
export default function CoverageTermsCard({ policy }) {
  if (!policy) return null;

  const { type, startDate, perks, status } = policy;

  // Scoped helpers (avoids touching global files)
  const parseISO = (iso) => new Date(iso);
  const addMonths = (iso, months) => {
    const d = new Date(iso);
    d.setMonth(d.getMonth() + months);
    return d;
  };
  const formatDate = (d) =>
    d?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Extract "24" from "Pre-existing conditions covered after 24 months."
  const extractMonthsFromTerms = (text) => {
    if (!text) return null;
    const m = text.match(/(\d+)\s*months?/i);
    return m ? Number(m[1]) : null;
  };

  const isHealth = type === "Health";
  const pedMonths = isHealth ? extractMonthsFromTerms(perks) : null;
  const pedEffectiveDate =
    isHealth && pedMonths && startDate ? addMonths(startDate, pedMonths) : null;

  const isActive = (status || "").toUpperCase() === "ACTIVE";

  return (
    <div
      className="
        mt-4 rounded-card bg-bgCard shadow-md
        border border-borderDefault
      "
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-borderDefault flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-info" />
        <h4 className="text-textPrimary font-semibold">Perks Insights</h4>
        {!isActive && (
          <span className="ml-auto inline-flex items-center gap-1 text-danger bg-dangerBg px-2 py-1 rounded-pill text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            {String(status || "INACTIVE")}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-3">
        {/* Always show your raw terms (current behavior) */}
        <div className="text-textSecondary">
          {Array.isArray(perks) ? (
            <ul className="list-disc pl-5 space-y-1">
              {perks.map((perk, idx) => (
                <li key={idx}>{perk}</li>
              ))}
            </ul>
          ) : (
            perks || "No specific terms provided."
          )}
        </div>

        {/* Health-only derived details */}
        {isHealth && (
          <div
            className="
              mt-2 rounded-md bg-infoBg text-textPrimary
              px-3 py-2 flex items-start gap-2
            "
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-info shrink-0" />
            <div className="text-sm leading-6">
              {pedMonths ? (
                <>
                  <span className="font-semibold">
                    Pre-existing diseases coverage:
                  </span>{" "}
                  After{" "}
                  <span className="font-semibold">{pedMonths} months</span>
                  {pedEffectiveDate && (
                    <>
                      {" "}
                      — effective from{" "}
                      <span className="font-semibold">
                        {formatDate(parseISO(pedEffectiveDate))}
                      </span>
                    </>
                  )}
                  .
                </>
              ) : (
                <>
                  No explicit waiting period found in terms. Please check the
                  policy PDF for details.
                </>
              )}
            </div>
          </div>
        )}

        {/* Optional: subtle tips list (kept generic to avoid backend changes) */}
        {isHealth && (
          <ul className="list-disc pl-5 text-textMuted text-sm">
            <li>
              Pre-/Post-hospitalization coverage durations vary by insurer
              wording.
            </li>
            <li>
              Daycare, ambulance, and cashless availability are defined in the
              policy PDF.
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
