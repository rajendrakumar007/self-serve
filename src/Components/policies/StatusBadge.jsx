import React from "react";

/**
 * StatusBadge Component
 *
 * A small badge component that displays policy status with appropriate colors.
 * Used throughout the application to show policy status in a visually distinct way.
 *
 * Features:
 * - Color-coded status indicators (Active=green, Expired=red, Pending=yellow, etc.)
 * - Consistent styling with the app's design system
 * - Handles various status values with fallback to secondary color
 * - Compact design suitable for tables and cards
 *
 * Status Colors:
 * - ACTIVE: Green (success)
 * - EXPIRED: Red (danger)
 * - PENDING: Yellow (warning)
 * - INFO: Blue (info)
 * - Default: Gray (secondary)
 *
 * @param {string} status - The status string to display
 * @returns {JSX.Element} Colored status badge
 */
export default function StatusBadge({ status }) {
  // Normalize status to uppercase for consistent comparison
  const s = (status || "").toUpperCase();

  // Determine CSS classes based on status value
  const cls =
    s === "ACTIVE"
      ? "bg-success text-textInverted" // Green for active policies
      : s === "EXPIRED"
      ? "bg-danger text-textInverted" // Red for expired policies
      : s === "PENDING"
      ? "bg-warning text-textInverted" // Yellow for pending policies
      : s === "INFO"
      ? "bg-info text-textInverted" // Blue for info status
      : "bg-secondary text-textInverted"; // Gray fallback for unknown status

  // Render the badge with appropriate styling
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${cls}`}>
      {s}
    </span>
  );
}
