import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { policyFilters } from "../../store/claimsConstants";
import {
  getCombinedClaims,
  filterClaims,
  getClaimsStatistics,
} from "../../store/claimsStatistics";
import FilterBar from "../common/FilterBar";
import StatCard from "../common/StatCard";
import ClaimCard from "./ClaimCard";
import ClaimDetailModal from "./ClaimDetailModal";
import claimsDataFile from "../../data/claims.json";

export default function TrackCliams() {
  const [searchQuery, setSearchQuery] = useState("");
  const [policyFilter, setPolicyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allClaims, setAllClaims] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Combine static claims data with submitted claims from localStorage
  useEffect(() => {
    const combined = getCombinedClaims(claimsDataFile.claims);
    setAllClaims(combined);
  }, []);

  const filteredClaims = useMemo(() => {
    return filterClaims(allClaims, { searchQuery, policyFilter, statusFilter });
  }, [searchQuery, policyFilter, statusFilter, allClaims]);

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPolicyFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const stats = useMemo(() => getClaimsStatistics(allClaims), [allClaims]);

  return (
    <div className="space-y-6">
      {/* Statistics Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold text-sm text-gray-900 dark:text-white transition-colors">
          Total Claims: {stats.total}
        </button>
        <button className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded-lg font-semibold text-sm text-yellow-900 dark:text-yellow-300 transition-colors">
          In Progress: {stats.pending}
        </button>
        <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg font-semibold text-sm text-blue-900 dark:text-blue-300 transition-colors">
          Approved: {stats.approved}
        </button>
        <button className="px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg font-semibold text-sm text-green-900 dark:text-green-300 transition-colors">
          Settled: {stats.settled}
        </button>
        <button className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg font-semibold text-sm text-red-900 dark:text-red-300 transition-colors">
          Rejected: {stats.rejected}
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        policyFilter={policyFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onPolicyFilterChange={setPolicyFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={clearFilters}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.min((currentPage - 1) * itemsPerPage + 1, filteredClaims.length)}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.min(currentPage * itemsPerPage, filteredClaims.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {filteredClaims.length}
          </span>{" "}
          claim{filteredClaims.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Claims Grid or Empty State */}
      {filteredClaims.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClaims
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  onViewDetails={handleViewDetails}
                />
              ))}
          </div>
          {filteredClaims.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-4 pt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Page {currentPage} of {Math.ceil(filteredClaims.length / itemsPerPage)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      Math.ceil(filteredClaims.length / itemsPerPage),
                      currentPage + 1
                    )
                  )
                }
                disabled={currentPage === Math.ceil(filteredClaims.length / itemsPerPage)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No claims found
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      <ClaimDetailModal
        claim={selectedClaim}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClaim(null);
        }}
      />
    </div>
  );
}
