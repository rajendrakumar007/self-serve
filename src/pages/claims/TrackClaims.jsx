import React, { useState, useEffect, useMemo, Fragment } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Zap,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import Navbar from "../../components/common/Navbar";
import { claimsApi } from "../../utils/claims/apiClaim";
import ClaimDetailModal from "../../components/claims/ClaimDetailModal";
import { expectedTimelines } from "../../utils/claims/expectedTimelines";
import StatusBadge from "../../Components/policies/StatusBadge";
import { getCurrentUserId } from "../../utils/auth/auth";

// Helper to calculate remaining time for health claims
const getRemainingTime = (submissionDate, policyType) => {
  if (policyType !== "health") return null;

  const timeline = expectedTimelines[policyType];
  if (!timeline?.isHourly) return null;

  const now = new Date();
  const submission = new Date(submissionDate);
  const hoursPassed = Math.floor((now - submission) / (1000 * 60 * 60));
  const hoursRemaining = Math.max(0, timeline.expectedHours - hoursPassed);

  return hoursRemaining;
};

const StatCard = ({ icon: Icon, label, count, color }) => (
  <div className="bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
    >
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-textPrimary dark:text-white">
        {count}
      </p>
      <p className="text-sm text-textMuted dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const TrackClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPolicyType, setFilterPolicyType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const CLAIMS_PER_PAGE = 5;

  const userId = getCurrentUserId();

  // Fetch claims from server
  const fetchClaims = async () => {
    try {
      const data = await claimsApi.getUserClaims(userId);
      setClaims(data);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique policy types from claims
  const policyTypes = useMemo(() => {
    const types = new Set(claims.map((c) => c.policyType).filter(Boolean));
    return Array.from(types).sort();
  }, [claims]);

  // Get unique statuses from claims
  const statuses = useMemo(() => {
    const stats = new Set(claims.map((c) => c.status).filter(Boolean));
    return Array.from(stats).sort();
  }, [claims]);

  // Fetch immediately on mount and set up polling
  useEffect(() => {
    fetchClaims();

    // Poll for claim status updates every 5 seconds to reflect approval/rejection changes
    const pollInterval = setInterval(fetchClaims, 5000);

    return () => clearInterval(pollInterval);
  }, [userId]);

  const stats = useMemo(() => {
    const submitted = claims.length; // Total claims submitted (includes all statuses)
    const underReview = claims.filter(
      (c) => c.status === "UNDER REVIEW"
    ).length;
    const approved = claims.filter((c) => c.status === "APPROVED").length;
    const rejected = claims.filter((c) => c.status === "REJECTED").length;
    return { submitted, underReview, approved, rejected };
  }, [claims]);

  // Filter claims by search query, policy type, and status
  const filteredClaims = useMemo(() => {
    let filtered = claims;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((claim) =>
        (claim.claimId || claim.id)
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Apply policy type filter
    if (filterPolicyType) {
      filtered = filtered.filter(
        (claim) => claim.policyType === filterPolicyType
      );
    }

    // Apply status filter
    if (filterStatus) {
      if (filterStatus === "APPROVED") {
        filtered = filtered.filter((claim) => claim.status === "APPROVED");
      } else if (filterStatus === "UNDER REVIEW") {
        filtered = filtered.filter((claim) => claim.status === "UNDER REVIEW");
      } else {
        filtered = filtered.filter((claim) => claim.status === filterStatus);
      }
    }

    return filtered;
  }, [claims, searchQuery, filterPolicyType, filterStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredClaims.length / CLAIMS_PER_PAGE);
  const startIndex = (currentPage - 1) * CLAIMS_PER_PAGE;
  const endIndex = startIndex + CLAIMS_PER_PAGE;
  const paginatedClaims = filteredClaims.slice(startIndex, endIndex);

  // Reset to first page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterPolicyType, filterStatus]);

  const handleViewDetails = (claim) => {
    console.log("Opening claim details:", claim);
    setSelectedClaim(claim);
    setShowModal(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen p-8 bg-bgPrimary dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bgPrimary dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-textPrimary dark:text-white mb-2">
              Track Your Claims
            </h1>
            <p className="text-textSecondary dark:text-gray-400">
              Monitor the status and progress of your insurance claims
            </p>
          </div>

          {/* Stats Grid - Icons First */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={FileText}
              label="Submitted"
              count={stats.submitted}
              color="bg-primary"
            />
            <StatCard
              icon={Clock}
              label="Under Review"
              count={stats.underReview}
              color="bg-warning"
            />
            <StatCard
              icon={CheckCircle}
              label="APPROVED"
              count={stats.approved}
              color="bg-success"
            />
            <StatCard
              icon={XCircle}
              label="REJECTED"
              count={stats.rejected}
              color="bg-danger"
            />
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted dark:text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by Claim ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-lg text-textPrimary dark:text-white placeholder-textMuted dark:placeholder-gray-500 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Filters Card */}
          <div className="rounded-lg border border-borderDefault bg-bgCard shadow-sm mb-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-4 py-3">
              <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-2">
                {/* Policy Type Filter (Listbox) */}
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Policy Type
                  </label>
                  <Listbox
                    value={filterPolicyType}
                    onChange={setFilterPolicyType}
                  >
                    <div className="relative">
                      <Listbox.Button className="w-full rounded-lg border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 pr-9 text-sm transition-all duration-200 ease-out hover:bg-bgHover/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary dark:bg-gray-800 dark:text-white dark:border-gray-600 flex items-center justify-between">
                        <span className="truncate">
                          {filterPolicyType
                            ? filterPolicyType.charAt(0).toUpperCase() +
                              filterPolicyType.slice(1).replace("-", " ")
                            : "All Policy Types"}
                        </span>
                        <i className="bi bi-chevron-down text-base text-textSecondary dark:text-gray-300" />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-20 mt-1 w-full rounded-lg border border-borderDefault bg-bgBase shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-600 focus:outline-none">
                          <Listbox.Option
                            value=""
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60 dark:bg-gray-700" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            All Policy Types
                          </Listbox.Option>
                          {policyTypes.map((type) => (
                            <Listbox.Option
                              key={type}
                              value={type}
                              className={({ active, selected }) =>
                                `cursor-pointer select-none px-3 py-2 text-sm ${
                                  active ? "bg-bgHover/60 dark:bg-gray-700" : ""
                                } ${
                                  selected
                                    ? "bg-primary/10 text-primary"
                                    : "text-textPrimary"
                                }`
                              }
                            >
                              {type.charAt(0).toUpperCase() +
                                type.slice(1).replace("-", " ")}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                {/* Status Filter (Listbox) */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-textSecondary mb-1">
                    Status
                  </label>
                  <Listbox value={filterStatus} onChange={setFilterStatus}>
                    <div className="relative">
                      <Listbox.Button className="w-full rounded-lg border border-borderDefault bg-bgBase text-textPrimary px-3 py-2 pr-9 text-sm transition-all duration-200 ease-out hover:bg-bgHover/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary dark:bg-gray-800 dark:text-white dark:border-gray-600 flex items-center justify-between">
                        <span className="truncate">
                          {filterStatus === ""
                            ? "All Status"
                            : filterStatus === "UNDER REVIEW"
                            ? "UNDER REVIEW"
                            : filterStatus}
                        </span>
                        <i className="bi bi-chevron-down text-base text-textSecondary dark:text-gray-300" />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-20 mt-1 w-full rounded-lg border border-borderDefault bg-bgBase shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-600 focus:outline-none">
                          <Listbox.Option
                            value=""
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60 dark:bg-gray-700" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            All Status
                          </Listbox.Option>
                          <Listbox.Option
                            value="SUBMITTED"
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60 dark:bg-gray-700" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            Submitted
                          </Listbox.Option>
                          <Listbox.Option
                            value="UNDER REVIEW"
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60 dark:bg-gray-700" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            Under Review
                          </Listbox.Option>
                          <Listbox.Option
                            value="APPROVED"
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60 dark:bg-gray-700" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            Approved
                          </Listbox.Option>
                          <Listbox.Option
                            value="REJECTED"
                            className={({ active, selected }) =>
                              `cursor-pointer select-none px-3 py-2 text-sm ${
                                active ? "bg-bgHover/60 dark:bg-gray-700" : ""
                              } ${
                                selected
                                  ? "bg-primary/10 text-primary"
                                  : "text-textPrimary"
                              }`
                            }
                          >
                            Rejected
                          </Listbox.Option>
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                {/* Reset Button */}
                <div className="md:col-span-2">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterPolicyType("");
                      setFilterStatus("");
                    }}
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-borderDefault px-3 py-2 text-sm text-textSecondary hover:bg-bgHover focus:outline-none focus:ring-2 focus:ring-primary/30 transition dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <i className="bi bi-arrow-counterclockwise" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Claims List */}
          {claims.length === 0 ? (
            <div className="bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-xl p-12 text-center">
              <AlertCircle
                className="mx-auto text-textSecondary dark:text-gray-400 mb-4"
                size={48}
              />
              <h3 className="text-lg font-semibold text-textPrimary dark:text-white mb-2">
                No Claims Yet
              </h3>
              <p className="text-textSecondary dark:text-gray-400">
                You haven't submitted any insurance claims yet.
              </p>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-xl p-12 text-center">
              <AlertCircle
                className="mx-auto text-textSecondary dark:text-gray-400 mb-4"
                size={48}
              />
              <h3 className="text-lg font-semibold text-textPrimary dark:text-white mb-2">
                No Claims Found
              </h3>
              <p className="text-textSecondary dark:text-gray-400">
                No claims match your search for "{searchQuery}".
              </p>
            </div>
          ) : (
            <div className="bg-bgCard dark:bg-gray-800 rounded-xl border border-borderDefault dark:border-gray-700 overflow-hidden">
              <div className="space-y-4 p-6">
                {paginatedClaims.map((claim) => (
                  <div
                    key={claim.id || claim.claimId}
                    className="bg-bgCard dark:bg-gray-800 border border-borderDefault dark:border-gray-700 rounded-xl p-5 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-medium text-primary">
                            {claim.claimId || claim.id}
                          </span>
                          <StatusBadge status={claim.status} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-textMuted dark:text-gray-400">
                              Policy ID
                            </p>
                            <p className="text-textPrimary dark:text-white font-medium">
                              {claim.policyId}
                            </p>
                          </div>
                          <div>
                            <p className="text-textMuted dark:text-gray-400">
                              Claim Amount
                            </p>
                            <p className="text-textPrimary dark:text-white font-medium">
                              ₹{claim.claimAmount?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          {claim.approvedAmount &&
                            !["SUBMITTED", "Pending", "In Progress"].includes(
                              claim.status
                            ) && (
                              <div>
                                <p className="text-textMuted dark:text-gray-400">
                                  Approved Amount
                                </p>
                                <p className="text-success font-medium">
                                  ₹
                                  {claim.approvedAmount?.toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              </div>
                            )}
                          <div>
                            <p className="text-textMuted dark:text-gray-400">
                              Submitted
                            </p>
                            <p className="text-textPrimary dark:text-white">
                              {new Date(
                                claim.submissionDate || claim.raisedDate
                              ).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(claim)}
                        className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <Eye size={18} /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="border-t border-borderDefault dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-textMuted dark:text-gray-400">
                    Page {currentPage} of {totalPages} ({filteredClaims.length}{" "}
                    claims)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-borderDefault dark:border-gray-700 text-textMuted dark:text-gray-400 hover:bg-bgMuted dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-primary text-white"
                              : "border border-borderDefault dark:border-gray-700 text-textMuted dark:text-gray-400 hover:bg-bgMuted dark:hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-borderDefault dark:border-gray-700 text-textMuted dark:text-gray-400 hover:bg-bgMuted dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {showModal && selectedClaim && (
            <ClaimDetailModal
              claim={selectedClaim}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TrackClaims;
