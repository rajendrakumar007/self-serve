import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient.js";
import StatusBadge from "../../Components/policies/StatusBadge.jsx";
import DownloadButton from "../../Components/policies/DownloadButton.jsx";
import Loading from "../../Components/policies/Loading.jsx";
import Navbar from "../../components/common/Navbar.jsx";
import CoverageTermsCard from "../../Components/policies/CoverageTermsCard.jsx";

export default function PolicyDetails() {
  const { id: idParam } = useParams();

  const [policy, setPolicy] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!idParam) return;

      try {
        setStatus("loading");
        setError(null);

        const response = await axiosClient.get(`/policies`);
        const list = Array.isArray(response.data) ? response.data : [];

        // Try to match by id OR policyId. Support both numeric ids and string policyIds.
        const looksNumeric = !isNaN(Number(idParam));

        const found = list.find((p) => {
          const matchesById =
            p.id != null &&
            String(p.id).toLowerCase() === String(idParam).toLowerCase();

          const matchesByPolicyId =
            p.policyId != null &&
            String(p.policyId).toLowerCase() === String(idParam).toLowerCase();

          // Prefer matching route param to true id when numeric; otherwise policyId.
          return looksNumeric ? matchesById : matchesByPolicyId || matchesById;
        });

        setPolicy(found ?? null);
        setStatus("succeeded");
      } catch (err) {
        setStatus("failed");
        setError(
          err.response?.data?.message || err.message || "Failed to fetch policy"
        );
        setPolicy(null);
      }
    };

    fetchPolicy();
  }, [idParam]);

  if (status === "loading") return <Loading label="Loading policy..." />;

  if (status === "failed")
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="rounded-xl border border-danger bg-dangerBg text-danger px-4 py-3 shadow-lg">
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
      </div>
    );

  if (!policy)
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="rounded-xl border border-warning bg-warningBg text-warning px-4 py-3 shadow-lg">
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
      </div>
    );

  const p = policy;

  const formatINR = (v) =>
    typeof v === "number"
      ? v.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : Number(v ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const formatDate = (d) => {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString();
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Header */}
          <div className="px-4 py-4 flex items-center justify-between bg-bgCard border border-borderStrong rounded-xl sm:rounded-2xl shadow-lg">
            <div>
              <h2 className="text-lg font-semibold text-textPrimary">
                Policy Id: {p.policyId ?? "-"}
              </h2>
              <p className="text-xs text-textMuted">
                {p.title ? p.title : p.type ?? ""}
              </p>
            </div>
            <StatusBadge status={p.status ?? "-"} />
          </div>

          {/* Main details card */}
          <div className="mt-4 bg-bgCard border border-borderDefault rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            {/* Basic details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Customer ID</span>
                  <span className="font-semibold text-textPrimary">
                    {p.userId ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Policy Type</span>
                  <span className="font-semibold text-textPrimary">
                    {p.type ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Coverage</span>
                  <span className="font-semibold text-textPrimary">
                    ₹{formatINR(p.sumInsured)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Start</span>
                  <span className="font-semibold text-textPrimary">
                    {formatDate(p.startDate ?? "-")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">End</span>
                  <span className="font-semibold text-textPrimary">
                    {formatDate(p.endDate ?? "-")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Premium</span>
                  <span className="font-semibold text-textPrimary">
                    ₹{formatINR(p.premium ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Period</span>
                  <span className="font-semibold text-textPrimary">
                    {p.tenure ?? 0} Years
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-borderDefault" />

            {/* Terms */}
            <h6 className="text-xs font-semibold tracking-wide text-textMuted uppercase">
              Terms &amp; Coverage Details
            </h6>
            <p className="mt-2 text-sm text-textSecondary">
              {p.terms || "Policy details not available"}
            </p>

            {/* Coverage terms card */}
            <div className="mt-6">
              <CoverageTermsCard policy={p} />
            </div>

            {/* Footer actions */}
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/check-policy"
                className="px-6 py-3 text-sm font-medium text-primary hover:text-primaryDark hover:bg-primary/10 rounded-lg transition"
              >
                Back to list
              </Link>
              <DownloadButton policy={p} fileName={`Policy_${p.policyId}.pdf`} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}