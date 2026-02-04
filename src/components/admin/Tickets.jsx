import React, { useEffect, useMemo, useState, Fragment } from "react";
import axiosClient from "../../services/axiosClient.js";
import AdminNavbar from "./AdminNavbar.jsx";
import { IoClose } from "react-icons/io5";
import { Listbox, Transition } from "@headlessui/react";

function fmtDate(d) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString();
}

export default function AdminTickets() {
  // Local filters (no dependency on any dashboard)
  const [filters, setFilters] = useState({
    q: "",
    status: "ALL",
    sort: "NEWEST", // default
  });

  // Data
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Modal
  const [action, setAction] = useState(null);
  const [form, setForm] = useState({
    resolutionSolution: "",
  });

  // Load tickets
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await axiosClient.get("/tickets");
        setTickets(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(
          e.response?.data?.message || e.message || "Failed to load tickets"
        );
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  // Filtered + Sorted
  const filteredTickets = useMemo(() => {
    let list = [...tickets];
    const q = filters.q.trim().toLowerCase();

    // Status filter
    if (filters.status !== "ALL") {
      list = list.filter(
        (t) =>
          String(t.status ?? "").toUpperCase() === filters.status.toUpperCase()
      );
    }

    // Search filter

    if (q) {
      list = list.filter((t) => {
        return (
          String(t.ticketId ?? "")
            .toLowerCase()
            .includes(q) ||
          String(t.issueDescription ?? "")
            .toLowerCase()
            .includes(q)
        );
      });
    }

    // Sort: NEWEST / OLDEST
    const getSortKey = (t) => {
      // Prefer updatedDate → sentDate → numeric id as fallback
      const upd = t.updatedDate ? new Date(t.updatedDate).getTime() : NaN;
      const sent = t.sentDate ? new Date(t.sentDate).getTime() : NaN;
      if (Number.isFinite(upd)) return upd;
      if (Number.isFinite(sent)) return sent;
      return Number(t.id) || 0;
    };

    if (filters.sort === "NEWEST") {
      list.sort((a, b) => getSortKey(b) - getSortKey(a));
    } else if (filters.sort === "OLDEST") {
      list.sort((a, b) => getSortKey(a) - getSortKey(b));
    }

    return list;
  }, [tickets, filters]);

  // Modal control
  function closeModal() {
    setAction(null);
    setForm({ resolutionSolution: "" });
  }
  function openResolve(t) {
    setAction({ kind: "resolve", ticket: t });
    setForm({ resolutionSolution: "" });
  }

  const canSubmit =
    action?.kind === "resolve" && form.resolutionSolution.trim().length > 0;

  async function submitAction() {
    if (!action) return;
    const t = action.ticket;
    const id = t.id;

    try {
      setLoading(true);
      setErr(null);

      if (action.kind === "resolve") {
        const solution = String(form.resolutionSolution || "").trim();
        if (!solution) {
          throw new Error("Solution is required to resolve a ticket.");
        }

        await axiosClient.patch(`/tickets/${id}`, {
          status: "RESOLVED",
          adminResolution: {
            solution,
            closedDate: new Date().toISOString().slice(0, 10),
          },
          updatedDate: new Date().toISOString().slice(0, 10),
        });

        await axiosClient.post("/notifications", {
          notificationId: `NTF-${Date.now()}`,
          userId: t.userId || "-",
          type: "SYSTEM",
          message: `Your ticket (${t.ticketId}) has been resolved`,
          read: false,
          date: new Date().toISOString().slice(0, 10),
        });
      }

      // Refresh list
      const res = await axiosClient.get("/tickets");
      setTickets(Array.isArray(res.data) ? res.data : []);
      closeModal();
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Action failed");
      setLoading(false);
    }
  }

  // Labels for Listboxes
  const sortLabel = filters.sort === "NEWEST" ? "Newest First" : "Oldest First";
  const statusOptions = [
    { label: "All", value: "ALL" },
    { label: "Open", value: "OPEN" },
    { label: "Resolved", value: "RESOLVED" },
    // REOPENED intentionally removed as requested
  ];
  const statusLabel =
    statusOptions.find((o) => o.value === filters.status)?.label || "All";

  return (
    <>
      <AdminNavbar />

      <section className="w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-bgCard border border-borderStrong rounded-xl sm:rounded-2xl shadow-lg">
            <h2 className="text-base sm:text-lg font-semibold text-textPrimary">
              Tickets Admin
            </h2>
          </div>

          {/* Error */}
          {err && (
            <div className="mx-1 mt-3 rounded-md border border-danger bg-dangerBg text-danger px-3 py-2">
              {String(err)}
            </div>
          )}

          {/* Filters (local) */}
          <div className="mt-3 rounded-xl border border-borderDefault bg-bgCard shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-3">
              {/* Search */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Search (Ticket ID / Issue)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TKT-2026 / Issue"
                  value={filters.q}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, q: e.target.value }))
                  }
                  className="w-full rounded-md border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Status (Listbox) */}
              <div className="md:col-span-4">
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

              {/* Sort By (Listbox) */}
              <div className="md:col-span-4">
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
                    <th className="px-4 py-2">Ticket ID</th>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Issue</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Sent</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-borderDefault hover:bg-bgHover/40"
                    >
                      <td className="px-4 py-2 font-medium">{t.ticketId}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col">
                          <span className="text-textPrimary">
                            {t.userId || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">{t.issueDescription}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                            String(t.status).toUpperCase() === "RESOLVED"
                              ? "bg-green-100 text-green-700"
                              : String(t.status).toUpperCase() === "REOPENED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{fmtDate(t.sentDate)}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openResolve(t)}
                            className="px-3 py-1.5 rounded-md border bg-bgBase text-textPrimary hover:bg-bgHover"
                          >
                            Resolve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredTickets.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-textMuted"
                        colSpan={6}
                      >
                        No tickets found with current filters.
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
                    Resolve Ticket
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-textSecondary hover:text-textPrimary"
                  >
                    <IoClose size={24} />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      Solution *
                    </label>
                    <textarea
                      rows={3}
                      value={form.resolutionSolution}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          resolutionSolution: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 text-sm"
                      placeholder="Enter your solution"
                      maxLength={1000}
                      required
                    />
                    <div className="mt-1 text-[11px] text-textMuted">
                      {form.resolutionSolution.length}/1000
                    </div>
                  </div>
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
                    className={`px-3 py-1.5 rounded-md bg-primary text-textInverted hover:bg-primaryDark ${
                      !canSubmit ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    disabled={loading || !canSubmit}
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
