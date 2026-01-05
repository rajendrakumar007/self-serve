import React from "react";

/**
 * CoverageTermsCard Component
 *
 * Displays policy perks and coverage insights in a structured card format.
 * This component is used in the PolicyDetails page to show:
 * - Policy perks as a bulleted list
 * - Special insights for health policies (pre-existing disease coverage)
 * - Policy status indicators
 *
 * Features:
 * - Dynamically extracts waiting periods from policy terms for health insurance
 * - Calculates pre-existing disease (PED) effective dates
 * - Responsive design using Tailwind CSS
 * - Conditional rendering based on policy type and status
 *
 * @param {Object} policy - The policy object containing type, perks, status, startDate, etc.
 * @returns {JSX.Element|null} The coverage terms card or null if no policy provided
 */
export default function CoverageTermsCard({ policy }) {
  // Early return if no policy data is available
  if (!policy) return null;

  // Destructure policy properties for easier access
  const { type, startDate, perks, status } = policy;

  /**
   * Helper Functions
   * These are scoped to this component to avoid global pollution
   */

  // Parse ISO date string to Date object
  const parseISO = (iso) => new Date(iso);

  // Add months to a date
  const addMonths = (iso, months) => {
    const d = new Date(iso);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  // Format date for display (DD Mon YYYY format)
  const formatDate = (d) =>
    d?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  /**
   * Extract waiting period months from policy terms text
   * Looks for patterns like "24 months" in the terms string
   */
  const extractMonthsFromTerms = (text) => {
    if (!text) return null;
    const m = text.match(/(\d+)\s*months?/i);
    return m ? Number(m[1]) : null;
  };

  // Check if this is a health insurance policy
  const isHealth = type === "Health";

  // Extract waiting period for pre-existing diseases (health policies only)
  const pedMonths = isHealth ? extractMonthsFromTerms(perks) : null;

  // Calculate when PED coverage becomes effective
  const pedEffectiveDate =
    isHealth && pedMonths && startDate ? addMonths(startDate, pedMonths) : null;

  // Check if policy is currently active
  const isActive = (status || "").toUpperCase() === "ACTIVE";

  return (
    <div
      className="
        mt-4 rounded-card bg-bgCard shadow-md
        border border-borderDefault
      "
    >
      {/* Card Header - Shows title and status indicator */}
      <div className="px-4 py-3 border-b border-borderDefault flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-info" />
        <h4 className="text-textPrimary font-semibold">Perks Insights</h4>
        {/* Show inactive status badge if policy is not active */}
        {!isActive && (
          <span className="ml-auto inline-flex items-center gap-1 text-danger bg-dangerBg px-2 py-1 rounded-pill text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            {String(status || "INACTIVE")}
          </span>
        )}
      </div>

      {/* Card Body - Contains perks list and health-specific insights */}
      <div className="px-4 py-4 space-y-3">
        {/* Display policy perks as a bulleted list or plain text */}
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

        {/* Health Insurance Specific Section - Shows PED coverage details */}
        {isHealth && (
          <div
            className="
              mt-2 rounded-md bg-infoBg text-textPrimary
              px-3 py-2 flex items-start gap-2
            "
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-info shrink-0" />
            <div className="text-sm leading-6">
              {/* Display PED waiting period and effective date if available */}
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
                // Fallback message when waiting period cannot be extracted
                <>
                  No explicit waiting period found in terms. Please check the
                  policy PDF for details.
                </>
              )}
            </div>
          </div>
        )}

        {/* Additional tips for health insurance policies */}
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
