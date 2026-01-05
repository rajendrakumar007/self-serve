import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient.js";
import { getCurrentUserId, isLoggedIn } from "../../utils/auth.js";
import Loading from "../../Components/policies/Loading.jsx";
import StatusBadge from "../../Components/policies/StatusBadge.jsx";
import PolicyFilters from "../../Components/policies/PolicyFilters.jsx";
import DownloadButton from "../../Components/policies/DownloadButton.jsx";
import Navbar from "../../Components/Navbar.jsx";

/**
 * Policy list page component
 */
export default function PolicyList() {
  // Local state for policies data
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  // Get current user ID from auth
  const userId = getCurrentUserId();

  // Filter state managed locally
  const [filters, setFilters] = useState({
    q: "", // Search query
    status: "ALL", // Status filter
    type: "ALL", // Type filter
  });

  // Fetch policies when component mounts
  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn() || !userId) {
      setStatus("failed");
      setError("Please log in to view your policies");
      return;
    }

    const fetchPolicies = async () => {
      try {
        setStatus("loading");
        setError(null);
        const response = await axiosClient.get(`/policies?userId=${userId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setItems(data);
        setStatus("succeeded");
      } catch (err) {
        setStatus("failed");
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch policies"
        );
      }
    };

    fetchPolicies();
  }, [userId]);

  /**
   * Filtered policies computation
   * Uses useMemo to optimize performance and prevent unnecessary recalculations
   */
  const filtered = useMemo(() => {
    let list = Array.isArray(items) ? [...items] : [];

    // Normalize search query
    const q = filters.q.trim().toLowerCase();

    // Filter by status if not "ALL"
    if (filters.status !== "ALL") {
      list = list.filter(
        (p) => (p.status ?? "").toUpperCase() === filters.status
      );
    }

    // Filter by type if not "ALL"
    if (filters.type !== "ALL") {
      list = list.filter((p) => (p.type ?? "") === filters.type);
    }

    // Filter by search query (policy ID or type)
    if (q) {
      list = list.filter(
        (p) =>
          (p.policyId ?? "").toLowerCase().includes(q) ||
          (p.type ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [items, filters]);

  /**
   * Utility Functions
   */

  // Format currency values in Indian Rupees format
  const formatINR = (v) =>
    typeof v === "number"
      ? v.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : Number(v ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  // Format dates for display
  const formatDate = (d) => {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString();
  };

  // Main render - Policy list page layout
  return (
    <>
      {/* Navigation bar */}
      <Navbar />

      {/* Loading state */}
      {status === "loading" && <Loading label="Loading policies..." />}

      {/* Error state */}
      {status === "failed" && (
        <div className="rounded-md border border-danger bg-dangerBg text-danger px-3 py-2">
          Failed to load policies. {error ?? ""}
        </div>
      )}

      {/* Success state - Main content */}
      {status === "succeeded" && (
        <section className="w-full">
          {/* Page header with title and customer info */}
          <div className="px-4 py-3 flex items-center justify-between bg-bgCard border border-borderStrong rounded-card shadow-xs">
            <h2 className="text-base font-semibold text-textPrimary">
              Policies ({filtered.length})
            </h2>
            <div className="text-textMuted">Customer: {userId}</div>
          </div>

          {/* Filters section */}
          <div className="mt-3 rounded-card border border-borderDefault bg-bgCard shadow-xs p-4">
            <PolicyFilters value={filters} onChange={setFilters} />
          </div>

          {/* Policies table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              {/* Table header */}
              <thead className="bg-bgMuted text-textSecondary">
                <tr>
                  <th className="text-left font-medium px-3 py-2">Policy ID</th>
                  <th className="text-left font-medium px-3 py-2">Type</th>
                  <th className="text-left font-medium px-3 py-2">Coverage</th>
                  <th className="text-left font-medium px-3 py-2">
                    Start — End
                  </th>
                  <th className="text-left font-medium px-3 py-2">Status</th>
                  <th className="text-right font-medium px-3 py-2">Actions</th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody className="divide-y divide-borderDefault">
                {/* Render each filtered policy as a table row */}
                {filtered.map((p) => (
                  <tr
                    key={p.policyId}
                    className="hover:bg-bgHover dark:hover:bg-gray-700"
                  >
                    {/* Policy ID - clickable link to details */}
                    <td className="px-3 py-2">
                      <Link
                        to={`/check-policy/${p.policyId}`}
                        className="text-textPrimary hover:text-primaryDark font-medium"
                      >
                        {p.policyId}
                      </Link>
                    </td>

                    {/* Policy type */}
                    <td className="px-3 py-2 text-textPrimary">
                      {p.type ?? "-"}
                    </td>

                    {/* Coverage amount */}
                    <td className="px-3 py-2 text-textPrimary">
                      ₹{formatINR(p.sumInsured)}
                    </td>

                    {/* Start and end dates */}
                    <td className="px-3 py-2 text-textPrimary">
                      {formatDate(p.startDate)} — {formatDate(p.endDate)}
                    </td>

                    {/* Status badge */}
                    <td className="px-3 py-2">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Action buttons */}
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View details button */}
                        <Link
                          to={`/check-policy/${p.policyId}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-primary text-textInverted hover:bg-primaryDark transition"
                        >
                          View
                        </Link>

                        {/* Separator */}
                        <div className="h-6 w-px bg-borderDefault mx-1"></div>

                        {/* Download document button */}
                        <DownloadButton
                          policyId={p.policyId}
                          documentUrl={p.documentUrl}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty state when no policies match filters */}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-6 text-center text-textMuted"
                    >
                      No policies match the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
