import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient.js";
import { getCurrentUserId, isLoggedIn } from "../../utils/auth/auth.js";
import Loading from "../../Components/policies/Loading.jsx";
import StatusBadge from "../../Components/policies/StatusBadge.jsx";
import PolicyFilters from "../../components/policies/PolicyFilters.jsx";
import DownloadButton from "../../Components/policies/DownloadButton.jsx";
import Navbar from "../../components/common/Navbar.jsx";

//Policy list page component

export default function PolicyList() {
  // Single source of truth: policies from API (now complete objects)
  const [policies, setPolicies] = useState([]); // API user policies
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

        // Get user policies from API (now complete objects)
        const response = await axiosClient.get(`/policies?userId=${userId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setPolicies(data);

        setStatus("succeeded");
      } catch (err) {
        setStatus("failed");
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch policies",
        );
      }
    };

    fetchPolicies();
  }, [userId]);

  //Filtered policies computation
  const filtered = useMemo(() => {
    let list = Array.isArray(policies) ? [...policies] : [];

    // Normalize search query
    const q = filters.q.trim().toLowerCase();

    // Filter by search query (policy ID or type)
    if (q) {
      list = list.filter(
        (p) =>
          (p.title ?? "").toLowerCase().includes(q) ||
          (p.type ?? "").toLowerCase().includes(q),
      );
    }

    // Filter by status if not "ALL"
    if (filters.status !== "ALL") {
      const targetStatus = filters.status.toUpperCase();
      list = list.filter(
        (p) => (p.status ?? "").toUpperCase() === targetStatus,
      );
    }

    // Filter by type if not "ALL"
    if (filters.type !== "ALL") {
      const targetType = filters.type.toLowerCase();
      list = list.filter((p) => (p.type ?? "").toLowerCase() === targetType);
    }

    return list;
  }, [policies, filters]);

  //Utility Functions
  const formatINR = (v) =>
    typeof v === "number"
      ? v.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : Number(v ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const formatDate = (d) => {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString();
  };

  // Policy list page layout
  return (
    <>
      <Navbar />

      {/* Loading state */}
      {status === "loading" && <Loading label="Loading policies..." />}

      {/* Error state */}
      {status === "failed" && (
        <div className="mx-4 mt-3 rounded-md border border-danger bg-dangerBg text-danger px-3 py-2">
          Failed to load policies. {error ?? ""}
        </div>
      )}

      {/* Success state - Main content */}
      {status === "succeeded" && (
        <section className="w-full">
          {/* Page container (match SubmitClaimForm outer spacing) */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
            {/* Page header card (same radius/shadow style) */}
            <div className="px-4 py-3 flex items-center justify-between bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-lg">
              <h2 className="text-base sm:text-lg font-semibold text-textPrimary dark:text-textInverted">
                Policies ({filtered.length})
              </h2>
              <div className="text-textMuted dark:text-textInverted">
                Customer: {userId}
              </div>
            </div>

            {/* Filters card */}
            <div className="mt-3 rounded-xl sm:rounded-2xl border border-borderDefault dark:border-gray-700 bg-bgCard dark:bg-gray-800 shadow-lg p-4 sm:p-6 lg:p-8">
              <PolicyFilters value={filters} onChange={setFilters} />
            </div>

            {/* Cards grid */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => {
                // Values now come directly from `p` (API returns complete object)
                const start = formatDate(p.startDate ?? "-");
                const end = formatDate(p.endDate ?? "-");
                const statusText = p.status ?? "-";

                return (
                  <div
                    key={p.id || p.policyId}
                    className="group relative rounded-xl sm:rounded-2xl border border-borderDefault dark:border-gray-700 bg-bgCard dark:bg-gray-800 shadow-lg hover:shadow-md transition"
                  >
                    {/* Card header */}
                    <div className="px-4 pt-4 flex items-start justify-between">
                      <div>
                        <Link
                          to={`/check-policy/${p.id ?? p.title}`}
                          state={{ policy: p }}
                          className="inline-block font-semibold hover:text-primaryDark transition text-textPrimary dark:text-textInverted"
                          title="View details"
                        >
                          {p.title}
                        </Link>
                        <div className="mt-0.5 text-xs text-textMuted dark:text-textInverted">
                          Type:{" "}
                          <span className="font-medium text-textSecondary dark:text-textInverted">
                            {p.type ?? "-"}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={statusText} />
                    </div>

                    {/* Card body */}
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-textSecondary dark:text-textInverted">
                          Coverage
                        </span>
                        <span className="text-sm font-semibold text-textPrimary dark:text-textInverted">
                          ₹{formatINR(p.sumInsured)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-textSecondary dark:text-textInverted">
                          Start — End
                        </span>
                        <span className="text-sm font-medium text-textPrimary dark:text-textInverted">
                          {start} — {end}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-4 h-px bg-borderDefault dark:bg-gray-700" />

                    {/* Card footer: actions (match button style to page) */}
                    <div className="px-4 py-3 flex items-center justify-between">
                      <Link
                        to={`/check-policy/${p.id ?? p.policyId}`}
                        state={{ policy: p }}
                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-primary text-textInverted hover:bg-primaryDark transition"
                      >
                        View
                      </Link>

                      {/* Pass the API policy directly */}
                      <DownloadButton
                        policy={p}
                        fileName={`Policy_${p.policyId || "document"}.pdf`}
                      />
                    </div>

                    {/* Subtle hover outline */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-primary/20 transition pointer-events-none" />
                  </div>
                );
              })}

              {/* Empty state when no policies match filters */}
              {filtered.length === 0 && (
                <div className="col-span-full">
                  <div className="rounded-xl sm:rounded-2xl border border-borderDefault dark:border-gray-700 bg-bgCard dark:bg-gray-800 shadow-lg p-6 text-center">
                    <p className="text-textMuted dark:text-textInverted">
                      No policies match the filters.
                    </p>
                    <p className="mt-1 text-xs text-textSecondary dark:text-textInverted">
                      Try adjusting the search, status, or type filters.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
