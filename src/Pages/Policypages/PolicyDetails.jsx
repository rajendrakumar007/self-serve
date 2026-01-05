import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient.js";
import StatusBadge from "../../Components/policies/StatusBadge.jsx";
import DownloadButton from "../../Components/policies/DownloadButton.jsx";
import Loading from "../../Components/policies/Loading.jsx";
import Navbar from "../../Components/Navbar.jsx";
import CoverageTermsCard from "../../Components/policies/CoverageTermsCard.jsx";

/**
 * PolicyDetails Page Component
 */
export default function PolicyDetails() {
  // Extract policy ID from URL parameters
  const { id: idParam } = useParams();
  // Handle both string and numeric IDs
  const id = isNaN(Number(idParam)) ? idParam : Number(idParam);

  // Local state for policy data
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  // Fetch policy data when component mounts or ID changes
  useEffect(() => {
    const fetchPolicy = async () => {
      if (!idParam) return;

      try {
        setStatus("loading");
        setError(null);
        const response = await axiosClient.get(`/policies?policyId=${id}`);
        const data = Array.isArray(response.data) ? response.data[0] : null;
        setSelected(data);
        setStatus("succeeded");
      } catch (err) {
        setStatus("failed");
        setError(
          err.response?.data?.message || err.message || "Failed to fetch policy"
        );
        setSelected(null);
      }
    };

    fetchPolicy();
  }, [id, idParam]);

  // Loading state - show spinner while fetching data
  if (status === "loading") return <Loading label="Loading policy..." />;

  // Error state - show error message with back link
  if (status === "failed")
    return (
      <div className="rounded-md border border-danger bg-dangerBg text-danger px-3 py-2">
        Failed to load policy. {error ?? ""}
        <div className="mt-2">
          <Link
            to="/check-policy"
            className="text-primary hover:text-primaryDark underline underline-offset-2"
          >
            Back to list
          </Link>
        </div>
      </div>
    );

  // Not found state - show message when policy doesn't exist
  if (!selected)
    return (
      <div className="rounded-md border border-warning bg-warningBg text-warning px-3 py-2">
        Policy not found.
        <div className="mt-2">
          <Link
            to="/check-policy"
            className="text-primary hover:text-primaryDark underline underline-offset-2"
          >
            Back to list
          </Link>
        </div>
      </div>
    );

  // Policy data is available, destructure for easier access
  const p = selected;

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

  // Main render - Policy details page layout
  return (
    <>
      {/* Navigation bar */}
      <Navbar />

      {/* Main content section */}
      <section className="w-full">
        {/* Policy header with title, status, and download button */}
        <div className="px-4 py-3 flex items-center justify-between bg-bgCard border border-borderStrong rounded-card shadow-xs">
          <h2 className="text-base font-semibold text-textPrimary">
            Policy {p.policyId}
          </h2>
          <div className="flex items-center gap-2">
            <StatusBadge status={p.status} />
            <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
          </div>
        </div>

        {/* Main details panel */}
        <div className="mt-3 rounded-card border border-borderDefault bg-bgCard shadow-xs p-4">
          {/* Policy information grid - responsive 2-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left column - Basic policy info */}
            <div>
              <dl className="grid grid-cols-5 gap-y-2">
                <dt className="col-span-2 text-textSecondary">Customer ID</dt>
                <dd className="col-span-3 text-textPrimary">
                  {p.userId ?? "-"}
                </dd>

                <dt className="col-span-2 text-textSecondary">Policy Type</dt>
                <dd className="col-span-3 text-textPrimary">{p.type ?? "-"}</dd>

                <dt className="col-span-2 text-textSecondary">Coverage</dt>
                <dd className="col-span-3 text-textPrimary">
                  ₹{formatINR(p.sumInsured)}
                </dd>
              </dl>
            </div>

            {/* Right column - Dates and status */}
            <div>
              <dl className="grid grid-cols-5 gap-y-2">
                <dt className="col-span-2 text-textSecondary">Start</dt>
                <dd className="col-span-3 text-textPrimary">
                  {formatDate(p.startDate)}
                </dd>

                <dt className="col-span-2 text-textSecondary">End</dt>
                <dd className="col-span-3 text-textPrimary">
                  {formatDate(p.endDate)}
                </dd>

                <dt className="col-span-2 text-textSecondary">Status</dt>
                <dd className="col-span-3">
                  <StatusBadge status={p.status} />
                </dd>
              </dl>
            </div>
          </div>

          {/* Separator */}
          <hr className="my-4 border-borderDefault" />

          {/* Terms and coverage section */}
          <h6 className="text-xs font-semibold tracking-wide text-textMuted uppercase mb-2">
            Terms & Coverage Details
          </h6>
          <p className="mb-3 text-textSecondary">{p.terms ?? "—"}</p>

          {/* Coverage terms card with perks and insights */}
          <CoverageTermsCard policy={p} />

          {/* Footer with navigation and download links */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <Link
              to="/check-policy"
              className="px-4 py-2 text-primary hover:text-primaryDark hover:bg-primary/10 rounded-md transition font-medium"
            >
              ← Back to list
            </Link>
            <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
          </div>
        </div>
      </section>
    </>
  );
}
