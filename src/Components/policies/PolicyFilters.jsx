import React from "react";
import { useReducer, useEffect } from "react";

/**
 * PolicyFilters Component
 *
 * A comprehensive filtering component for the policy list page.
 * Allows users to filter policies by search text, status, and type.
 * Uses useReducer for state management to handle complex filter state.
 *
 * Features:
 * - Text search by policy ID or type
 * - Status filtering (All, Active, Expired)
 * - Type filtering (All insurance types)
 * - Reset functionality to clear all filters
 * - Responsive grid layout
 * - Real-time filter updates via onChange callback
 *
 * @param {Function} onChange - Callback function called whenever filters change
 * @returns {JSX.Element} Filter form with search, dropdowns, and reset button
 */

// Initial filter state
const initial = {
  q: "", // Search query
  status: "ALL", // Status filter
  type: "ALL", // Type filter
};

/**
 * Reducer function for managing filter state
 * Handles different types of filter updates
 */
function reducer(state, action) {
  switch (action.type) {
    case "SET_Q":
      return { ...state, q: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "RESET":
      return initial;
    default:
      return state;
  }
}

export default function PolicyFilters({ onChange }) {
  // Use useReducer for complex state management
  const [state, dispatch] = useReducer(reducer, initial);

  // Notify parent component whenever filter state changes
  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  return (
    <div className="rounded-card border border-borderDefault bg-bgCard shadow-sm mb-3">
      <div className="px-4 py-3">
        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-2">
          {/* Search Input - Filter by policy ID or type */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-textSecondary mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Policy ID or Type"
              value={state.q}
              onChange={(e) =>
                dispatch({ type: "SET_Q", payload: e.target.value })
              }
              className="w-full rounded-md border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-textSecondary mb-1">
              Status
            </label>
            <select
              value={state.status}
              onChange={(e) =>
                dispatch({ type: "SET_STATUS", payload: e.target.value })
              }
              className="w-full rounded-md border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {/* Type Filter Dropdown */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-textSecondary mb-1">
              Type
            </label>
            <select
              value={state.type}
              onChange={(e) =>
                dispatch({ type: "SET_TYPE", payload: e.target.value })
              }
              className="w-full rounded-md border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="ALL">All</option>
              <option value="health">Health</option>
              <option value="life">Life</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="travel">Travel</option>
              <option value="airpass">Air Pass</option>
            </select>
          </div>

          {/* Reset Button - Clears all filters */}
          <div className="md:col-span-2">
            <button
              onClick={() => dispatch({ type: "RESET" })}
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-borderDefault px-3 py-2 text-sm text-textSecondary hover:bg-bgHover focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            >
              <i className="bi bi-arrow-counterclockwise" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
