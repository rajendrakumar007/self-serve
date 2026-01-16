import React, { useEffect, useMemo, useState, Fragment } from "react";
import axiosClient from "../../services/axiosClient.js";
import AdminNavbar from "./AdminNavbar.jsx";
import { IoClose } from "react-icons/io5";
import { Listbox, Transition } from "@headlessui/react";

//amount formatting
function formatINR(n) {
  const v = typeof n === "number" ? n : Number(n ?? 0);
  return v.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function fmtDate(d) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString();
}

export default function AdminClaims() {
  // Local filters (no dependency on any dashboard)
  const [filters, setFilters] = useState({
    q: "",
    status: "ALL",
    type: "ALL",
    sort: "NEWEST",
  });

  // Data state (independent)
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [modalErr, setModalErr] = useState(null);

  // Modal & form state
  const [action, setAction] = useState(null);
  const [form, setForm] = useState({ approvedAmount: "", rejectionReason: "" });

  // Load claims
  useEffect(() => {
    const loadClaims = async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await axiosClient.get("/claims");
        setClaims(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(
          e.response?.data?.message || e.message || "Failed to load claims"
        );
      } finally {
        setLoading(false);
      }
    };
    loadClaims();
  }, []);

  // currently display userId only
  const claimsJoined = useMemo(() => {
    const map = new Map(users.map((u) => [u.userId, u]));
    return claims.map((c) => ({ ...c, _user: map.get(c.userId) || null }));
  }, [claims, users]);

  // Filtering + Sorting (by Raised column)
  const filteredClaims = useMemo(() => {
    let list = [...claimsJoined];
    const q = filters.q.trim().toLowerCase();

    if (filters.status !== "ALL") {
      list = list.filter(
        (c) =>
          String(c.status ?? "").toUpperCase() === filters.status.toUpperCase()
      );
    }
    if (filters.type !== "ALL") {
      list = list.filter(
        (c) =>
          String(c.policyType ?? "").toLowerCase() ===
          filters.type.toLowerCase()
      );
    }
    if (q) {
      list = list.filter((c) => {
        return (
          String(c.claimId ?? "")
            .toLowerCase()
            .includes(q) ||
          String(c.policyId ?? "")
            .toLowerCase()
            .includes(q) ||
          String(c.userId ?? "")
            .toLowerCase()
            .includes(q)
        );
      });
    }

    // Sort: NEWEST / OLDEST based on Raised (raisedDate ?? submissionDate)
    const getSortKey = (c) => {
      const raised = c.raisedDate ?? c.submissionDate;
      const t = raised ? new Date(raised).getTime() : NaN;
      if (Number.isFinite(t)) return t;
      return Number(c.id) || 0;
    };

    if (filters.sort === "NEWEST") {
      list.sort((a, b) => getSortKey(b) - getSortKey(a));
    } else if (filters.sort === "OLDEST") {
      list.sort((a, b) => getSortKey(a) - getSortKey(b));
    }

    return list;
  }, [claimsJoined, filters]);

  // Modal control
  function closeModal() {
    setAction(null);
    setForm({ approvedAmount: "", rejectionReason: "" });
    setModalErr(null);
  }
  function openApprove(c) {
    setAction({ kind: "approve", claim: c });
    setForm((f) => ({ ...f, approvedAmount: c.approvedAmount ?? "" }));
    setModalErr(null);
  }
  function openReject(c) {
    setAction({ kind: "reject", claim: c });
    setForm((f) => ({ ...f, rejectionReason: c.rejectionReason ?? "" }));
    setModalErr(null);
  }
  function openUnderReview(c) {
    setAction({ kind: "underreview", claim: c });
    setModalErr(null);
  }

  // Allowed actions by status
  function getAllowedActions(status) {
    const s = String(status || "").toUpperCase();
    if (s === "UNDER REVIEW") return ["approve", "reject"];
    if (s === "APPROVED") return ["reject", "underreview"];
    if (s === "REJECTED") return ["underreview"];
    return ["underreview", "approve", "reject"];
  }

  // Available balance
  function getAvailable(c) {
    const bal = Number(c.availableClaim);
    if (Number.isFinite(bal) && bal >= 0) return bal;
    const sum = Number(c.sumInsured || 0);
    return sum;
  }
  function getMaxApprovable(c) {
    const requested = Number(c.claimAmount || 0);
    const available = getAvailable(c);
    return Math.max(0, Math.min(requested, available));
  }

  async function submitAction() {
    if (!action) return;
    const c = action.claim;
    const id = c.id;

    try {
      setLoading(true);
      setErr(null);

      if (action.kind === "approve") {
        const amt = Number(form.approvedAmount);
        const availableBefore = getAvailable(c);
        const requested = Number(c.claimAmount || 0);
        const hardMax = Math.min(requested, availableBefore);

        if (!Number.isFinite(amt) || amt <= 0) {
          setModalErr("Approved amount must be a positive number.");
          setLoading(false);
          return;
        }
        if (amt > hardMax) {
          setModalErr(
            `Approved amount cannot exceed ₹${formatINR(
              hardMax
            )} (min of Available and Requested).`
          );
          setLoading(false);
          return;
        }
        if (String(c.status).toUpperCase() === "REJECTED") {
          setModalErr("Move the claim to UNDER REVIEW before approving.");
          setLoading(false);
          return;
        }

        const newBalance = Math.max(0, availableBefore - amt);

        await axiosClient.patch(`/claims/${id}`, {
          approvedAmount: amt,
          availableClaim: newBalance,
          status: "APPROVED",
          rejectionReason: null,
          timeline: {
            ...(c.timeline || {}),
            approved: new Date().toISOString().slice(0, 10),
            settled: null,
          },
        });

        await axiosClient.post("/notifications", {
          notificationId: `NTF-${Date.now()}`,
          userId: c.userId,
          type: "CLAIM",
          message: `Your claim (${c.claimId}) has been approved`,
          read: false,
          date: new Date().toISOString().slice(0, 10),
        });
      }

      if (action.kind === "reject") {
        const reason = String(form.rejectionReason || "").trim();
        if (!reason) {
          setModalErr("Rejection reason is required.");
          setLoading(false);
          return;
        }

        await axiosClient.patch(`/claims/${id}`, {
          approvedAmount: null,
          status: "REJECTED",
          rejectionReason: reason,
          timeline: {
            ...(c.timeline || {}),
            approved: null,
            settled: null,
          },
        });

        await axiosClient.post("/notifications", {
          notificationId: `NTF-${Date.now()}`,
          userId: c.userId,
          type: "CLAIM",
          message: `Your claim (${c.claimId}) has been rejected`,
          read: false,
          date: new Date().toISOString().slice(0, 10),
        });
      }

      if (action.kind === "underreview") {
        await axiosClient.patch(`/claims/${id}`, {
          status: "UNDER REVIEW",
          rejectionReason: null,
          timeline: {
            ...(c.timeline || {}),
            approved: null,
            settled: null,
          },
        });

        await axiosClient.post("/notifications", {
          notificationId: `NTF-${Date.now()}`,
          userId: c.userId,
          type: "CLAIM",
          message: `Your claim (${c.claimId}) is under review`,
          read: false,
          date: new Date().toISOString().slice(0, 10),
        });
      }

      // Refresh list after action
      const res = await axiosClient.get("/claims");
      setClaims(Array.isArray(res.data) ? res.data : []);

      closeModal();
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }

  // Compute canSubmit (so button reflects validity before click)
  const canSubmit =
    !!action &&
    !loading &&
    (action.kind === "approve"
      ? Number(form.approvedAmount) > 0 && !modalErr
      : action.kind === "reject"
      ? String(form.rejectionReason || "").trim().length > 0 && !modalErr
      : true);

  const sortLabel = filters.sort === "NEWEST" ? "Newest First" : "Oldest First";

  const statusOptions = [
    { label: "All", value: "ALL" },
    { label: "Under Review", value: "UNDER REVIEW" },
    { label: "Submitted", value: "SUBMITTED" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];
  const statusLabel =
    statusOptions.find((o) => o.value === filters.status)?.label || "All";

  const typeOptions = [
    { label: "All Types", value: "ALL" },
    { label: "Car", value: "car" },
    { label: "Life", value: "life" },
    { label: "Travel", value: "travel" },
    { label: "Airpass", value: "airpass" },
    { label: "Health", value: "health" },
    { label: "Bike", value: "bike" },
  ];
  const typeLabel =
    typeOptions.find((o) => o.value === filters.type)?.label || "All Types";

  return (
    <>
      <AdminNavbar />

      <section className="w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-bgCard border border-borderStrong rounded-xl sm:rounded-2xl shadow-lg">
            <h2 className="text-base sm:text-lg font-semibold text-textPrimary">
              Claims Admin
            </h2>
          </div>

          {/* Global error */}
          {err && (
            <div className="mx-1 mt-3 rounded-md border border-danger bg-dangerBg text-danger px-3 py-2">
              {String(err)}
            </div>
          )}

          {/* Filters (local) */}
          <div className="mt-3 rounded-xl border border-borderDefault bg-bgCard shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-3">
              {/* Search */}
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Search (Claim ID / Policy ID / User)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CLM-2026 / POL-TRV-0002 / USR-0001"
                  value={filters.q}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, q: e.target.value }))
                  }
                  className="w-full rounded-md border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Status (Listbox) */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Status
                </label>
                <Listbox
                  value={filters.status}
                  onChange={(val) => setFilters((f) => ({ ...f, status: val }))}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full rounded-lg border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 pr-9 text-sm">
                      <span className="truncate">{statusLabel}</span>
                      <i className="bi bi-chevron-down text-base text-textSecondary" />
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-20 mt-1 w-full rounded-lg border border-borderDefault bg-bgBase shadow-lg overflow-hidden">
                        {statusOptions.map((opt) => (
                          <Listbox.Option
                            key={opt.value}
                            value={opt.value}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            {opt.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Type (Listbox) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Policy Type
                </label>
                <Listbox
                  value={filters.type}
                  onChange={(val) => setFilters((f) => ({ ...f, type: val }))}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full rounded-lg border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 pr-9 text-sm">
                      <span className="truncate">{typeLabel}</span>
                      <i className="bi bi-chevron-down text-base text-textSecondary" />
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-20 mt-1 w-full rounded-lg border border-borderDefault bg-bgBase shadow-lg overflow-hidden">
                        {typeOptions.map((opt) => (
                          <Listbox.Option
                            key={opt.value}
                            value={opt.value}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            {opt.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Sort By (Listbox) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Sort By
                </label>
                <Listbox
                  value={filters.sort}
                  onChange={(val) => setFilters((f) => ({ ...f, sort: val }))}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full rounded-lg border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 pr-9 text-sm">
                      <span className="truncate">{sortLabel}</span>
                      <i className="bi bi-chevron-down text-base text-textSecondary" />
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-20 mt-1 w-full rounded-lg border border-borderDefault bg-bgBase shadow-lg overflow-hidden">
                        {[
                          { label: "Newest First", value: "NEWEST" },
                          { label: "Oldest First", value: "OLDEST" },
                        ].map((opt) => (
                          <Listbox.Option
                            key={opt.value}
                            value={opt.value}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            {opt.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-3 rounded-xl border border-borderDefault bg-bgCard shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-bgBase/60">
                  <tr className="text-left">
                    <th className="px-4 py-2">Claim ID</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Policy</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Coverage Amount</th>
                    <th className="px-4 py-2">Available Claim Amount</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Approved</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Raised</th>
                    <th className="px-4 py-2">View Documents</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-borderDefault hover:bg-bgHover/40"
                    >
                      <td className="px-4 py-2 font-medium">{c.claimId}</td>
                      <td className="px-4 py-2">{c.userId}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col">
                          <span className="text-textPrimary">{c.policyId}</span>
                          <span className="text-xs text-textMuted">
                            {c.customerId || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">{c.policyType ?? "-"}</td>
                      <td className="px-4 py-2">
                        {c.sumInsured != null
                          ? `₹${formatINR(c.sumInsured)}`
                          : "-"}
                      </td>
                      <td className="px-4 py-2">{`₹${formatINR(
                        getAvailable(c)
                      )}`}</td>
                      <td className="px-4 py-2">₹{formatINR(c.claimAmount)}</td>
                      <td className="px-4 py-2">
                        {c.approvedAmount != null
                          ? `₹${formatINR(c.approvedAmount)}`
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                            String(c.status).toUpperCase() === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : String(c.status).toUpperCase() === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : String(c.status).toUpperCase() ===
                                "UNDER REVIEW"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {fmtDate(c.raisedDate ?? c.submissionDate)}
                      </td>

                      <td className="px-4 py-2">
                        {Array.isArray(c.documents) &&
                        c.documents.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {c.documents.map((doc, idx) => (
                              <a
                                key={idx}
                                href={String(doc.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primaryDark underline"
                              >
                                {doc.name || `Document ${idx + 1}`}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-textMuted">No documents</span>
                        )}
                      </td>

                      <td className="px-4 py-2">
                        {(() => {
                          const allowed = getAllowedActions(c.status);
                          return (
                            <select
                              defaultValue=""
                              className="rounded-md border border-borderDefault bg-bgBase text-textPrimary px-3 py-1.5 text-sm"
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "approve") openApprove(c);
                                else if (val === "reject") openReject(c);
                                else if (val === "underreview")
                                  openUnderReview(c);
                                e.target.value = "";
                              }}
                            >
                              <option value="" disabled>
                                Select action…
                              </option>
                              {allowed.includes("approve") && (
                                <option value="approve">Approve</option>
                              )}
                              {allowed.includes("reject") && (
                                <option value="reject">Reject</option>
                              )}
                              {allowed.includes("underreview") && (
                                <option value="underreview">
                                  Mark as Under Review
                                </option>
                              )}
                            </select>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}

                  {filteredClaims.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-textMuted"
                        colSpan={12}
                      >
                        No claims found with current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {action && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="w-full max-w-lg rounded-xl border border-borderStrong bg-bgCard shadow-xl">
                <div className="px-4 py-3 border-b border-borderDefault flex items-center justify-between">
                  <h3 className="text-base font-semibold text-textPrimary">
                    {action.kind === "approve"
                      ? "Approve Claim"
                      : action.kind === "reject"
                      ? "Reject Claim"
                      : "Mark as Under Review"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-textSecondary hover:text-textPrimary"
                  >
                    <IoClose size={24} />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {action.kind === "approve" && (
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-1">
                        Approved Amount (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={getMaxApprovable(action.claim)}
                        value={form.approvedAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((f) => ({ ...f, approvedAmount: val }));
                          const amt = Number(val);
                          const available = getAvailable(action.claim);
                          const requested = Number(
                            action.claim.claimAmount || 0
                          );
                          const hardMax = Math.min(available, requested);

                          if (!Number.isFinite(amt) || amt <= 0) {
                            setModalErr(
                              "Approved amount must be a positive number."
                            );
                          } else if (amt > hardMax) {
                            setModalErr(
                              `Approved amount cannot exceed ₹${formatINR(
                                hardMax
                              )} (min of Available and Requested).`
                            );
                          } else {
                            setModalErr(null);
                          }
                        }}
                        className={`w-full rounded-md border px-3 py-2 text-sm bg-bgBase text-textPrimary ${
                          modalErr ? "border-danger" : "border-borderDefault"
                        }`}
                      />

                      <p className="mt-2 text-xs text-textSecondary">
                        Coverage:{" "}
                        <strong>₹{formatINR(action.claim.sumInsured)}</strong>{" "}
                        &nbsp;•&nbsp; Available now:{" "}
                        <strong>
                          ₹{formatINR(getAvailable(action.claim))}
                        </strong>{" "}
                        &nbsp;•&nbsp; Requested:{" "}
                        <strong>₹{formatINR(action.claim.claimAmount)}</strong>
                      </p>
                      <p className="mt-1 text-[11px] text-textMuted">
                        Max allowed: ₹
                        {formatINR(getMaxApprovable(action.claim))}
                      </p>

                      {modalErr && (
                        <div className="mt-2 rounded-md border border-danger bg-dangerBg text-danger px-3 py-2 text-sm">
                          {modalErr}
                        </div>
                      )}
                    </div>
                  )}

                  {action.kind === "reject" && (
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-1">
                        Rejection Reason
                      </label>
                      <textarea
                        rows={3}
                        value={form.rejectionReason}
                        onChange={(e) => {
                          setForm((f) => ({
                            ...f,
                            rejectionReason: e.target.value,
                          }));
                          if (modalErr) setModalErr(null);
                        }}
                        className="w-full rounded-md border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 text-sm"
                        placeholder="Please explain why the claim was rejected..."
                      />
                      {/* Show modal error for reject as well */}
                      {modalErr && (
                        <div className="mt-2 rounded-md border border-danger bg-dangerBg text-danger px-3 py-2 text-sm">
                          {modalErr}
                        </div>
                      )}
                    </div>
                  )}

                  {action.kind === "underreview" && (
                    <div className="text-sm text-textSecondary">
                      Mark claim <strong>{action.claim.claimId}</strong> as{" "}
                      <strong>UNDER REVIEW</strong>. This will clear any
                      approval/settlement markers. You can approve or reject
                      later.
                    </div>
                  )}
                </div>

                <div className="px-4 py-3 border-t border-borderDefault flex items-center justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-3 py-1.5 rounded-md border bg-bgBase text-textPrimary hover:bg-bgHover"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitAction}
                    disabled={!canSubmit}
                    className={`px-3 py-1.5 rounded-md bg-primary text-textInverted hover:bg-primaryDark ${
                      !canSubmit ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
