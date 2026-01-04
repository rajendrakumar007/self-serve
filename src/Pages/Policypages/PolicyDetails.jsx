import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchPolicyById } from "../../store/policiesSlice.js";
import StatusBadge from "../../Components/policies/StatusBadge.jsx";
import DownloadButton from "../../Components/policies/DownloadButton.jsx";
import Loading from "../../Components/policies/Loading.jsx";
import Navbar from "../../Components/Navbar.jsx";
import CoverageTermsCard from "../../Components/policies/CoverageTermsCard.jsx";

/**
 * PolicyDetails Page Component
 *
 * Displays detailed information about a specific insurance policy.
 * This page shows comprehensive policy data including coverage, dates,
 * status, terms, and perks. Users can download policy documents from here.
 *
 * Features:
 * - Fetches policy data by ID from Redux store
 * - Handles loading, error, and not-found states
 * - Displays policy information in organized sections
 * - Shows coverage terms and perks with special insights for health policies
 * - Provides download functionality for policy documents
 * - Responsive design with proper navigation
 *
 * Route: /check-policy/:id
 * @returns {JSX.Element} Complete policy details page
 */
export default function PolicyDetails() {
  // Extract policy ID from URL parameters
  const { id: idParam } = useParams();
  // Handle both string and numeric IDs
  const id = isNaN(Number(idParam)) ? idParam : Number(idParam);

  // Redux hooks for state management
  const dispatch = useDispatch();
  const { selected, status, error } = useSelector((s) => s.policies);

  // Fetch policy data when component mounts or ID changes
  useEffect(() => {
    if (idParam) dispatch(fetchPolicyById({ id }));
  }, [dispatch, id, idParam]);

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
          <div className="flex items-center gap-2">
            <Link
              to="/check-policy"
              className="text-primary hover:text-primaryDark underline underline-offset-2"
            >
              Back to list
            </Link>
            <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
          </div>
        </div>
      </section>
    </>
  );


  return (
    <>
      <Navbar />
      <section className="w-full">
        {/* Header strip (subtle surface on top of app bg) */}
        <div className="px-4 py-3 flex items-center justify-between bg-bgCard border border-borderStrong rounded-card shadow-xs">
          <h2 className="text-base font-semibold text-textPrimary">
            Policy {p.policyId}
          </h2>
          <div className="flex items-center gap-2">
            <StatusBadge status={p.status} />
            <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
          </div>
        </div>

        {/* Details panel */}
        <div className="mt-3 rounded-card border border-borderDefault bg-bgCard shadow-xs p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left column */}
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

            {/* Right column */}
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

          <hr className="my-4 border-borderDefault" />

          <h6 className="text-xs font-semibold tracking-wide text-textMuted uppercase mb-2">
            Terms & Coverage Details
          </h6>
          <p className="mb-3 text-textSecondary">{p.terms ?? "—"}</p>
          <CoverageTermsCard policy={p} />

          <div className="flex items-center gap-2">
            <Link
              to="/check-policy"
              className="text-primary hover:text-primaryDark underline underline-offset-2"
            >
              Back to list
            </Link>
            <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
          </div>
        </div>
      </section>
    </>
  );

}
