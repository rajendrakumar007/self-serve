/**
 * Claims Statistics Utilities
 * Centralized calculations for dashboard and tracking statistics
 */

// Status groups for filtering and calculations
export const CLAIM_STATUS_GROUPS = {
  ACTIVE: [
    "Pending",
    "Document Verification",
    "Under Review",
    "Investigation",
    "Approved",
  ],
  SETTLED: ["Settled"],
  REJECTED: ["Rejected"],
};

/**
 * Calculate active claims count
 */
export const getActiveClaims = (claims) => {
  return claims.filter((c) => CLAIM_STATUS_GROUPS.ACTIVE.includes(c.status))
    .length;
};

/**
 * Calculate total claim amount
 */
export const getTotalClaimAmount = (claims) => {
  return claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0);
};

/**
 * Calculate settled amount
 */
export const getSettledAmount = (claims) => {
  return claims
    .filter((c) => c.status === "Settled")
    .reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
};

/**
 * Calculate detailed claim statistics
 */
export const getClaimsStatistics = (claims) => {
  return {
    total: claims.length,
    pending: claims.filter((c) => c.status === "SUBMITTED" || c.status === "UNDER_REVIEW").length,
    approved: claims.filter((c) => c.status === "APPROVED").length,
    settled: claims.filter((c) => c.status === "SETTLED").length,
    rejected: claims.filter((c) => c.status === "REJECTED").length,
  };
};

/**
 * Filter claims based on multiple criteria
 */
export const filterClaims = (
  claims,
  { searchQuery, policyFilter, statusFilter }
) => {
  return claims.filter((claim) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesId = claim.id.toLowerCase().includes(query);
      const matchesType = claim.claimType.toLowerCase().includes(query);
      const matchesDesc = claim.description?.toLowerCase().includes(query);
      if (!matchesId && !matchesType && !matchesDesc) return false;
    }

    // Policy filter
    if (
      policyFilter &&
      policyFilter !== "all" &&
      claim.policyType !== policyFilter
    ) {
      return false;
    }

    // Status filter
    if (
      statusFilter &&
      statusFilter !== "all" &&
      claim.status !== statusFilter
    ) {
      return false;
    }

    return true;
  });
};

/**
 * Combine submitted claims from localStorage with static claims data
 */
export const getCombinedClaims = (staticClaimsData) => {
  const submittedClaims = JSON.parse(
    localStorage.getItem("submittedClaims") || "[]"
  );
  return [...submittedClaims, ...staticClaimsData];
};
