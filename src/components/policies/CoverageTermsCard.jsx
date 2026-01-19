import React from "react";

// Displays policy perks and coverage insights
export default function CoverageTermsCard({ policy }) {
  if (!policy) return null;

  const {perks } = policy;

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
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-3">
        {/* Display perks */}
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
      </div>
    </div>
  );
}
