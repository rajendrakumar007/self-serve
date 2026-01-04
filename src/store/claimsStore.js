import policiesData from "../data/policies.json";
import claimTypesData from "../data/claimsType.json";

/**
 * Global Claims Data Store
 * Manages all policies and claim types data
 */

// Policies Store
export const policiesStore = {
  // Get all policies
  getAllPolicies: () => policiesData,

  // Get policy by ID
  getPolicyById: (policyId) => {
    return policiesData.find((p) => p.id === policyId);
  },

  // Get policies by type
  getPoliciesByType: (type) => {
    return policiesData.filter((p) => p.type === type);
  },
};

// Claim Types Store
export const claimTypesStore = {
  // Get all claim types
  getAllClaimTypes: () => claimTypesData,

  // Get claim types by policy type
  getClaimTypesByPolicyType: (policyType) => {
    return claimTypesData[policyType]?.types || [];
  },

  // Get required documents for a policy type
  getRequiredDocuments: (policyType) => {
    return claimTypesData[policyType]?.requiredDocs || [];
  },

  // Get specific claim type
  getClaimType: (policyType, claimTypeId) => {
    const types = claimTypesData[policyType]?.types || [];
    return types.find((t) => t.id === claimTypeId);
  },
};

/**
 * Combined Claims Store
 * Utility methods for common operations
 */
export const claimsStore = {
  // Get policy with its claim types
  getPolicyWithClaimTypes: (policyId) => {
    const policy = policiesStore.getPolicyById(policyId);
    if (!policy) return null;

    return {
      ...policy,
      claimTypes: claimTypesStore.getClaimTypesByPolicyType(policy.type),
      requiredDocs: claimTypesStore.getRequiredDocuments(policy.type),
    };
  },

  // Validate claim amount against policy
  validateClaimAmount: (policyId, claimAmount) => {
    const policy = policiesStore.getPolicyById(policyId);
    if (!policy) return { valid: false, message: "Policy not found" };

    const amount = parseFloat(claimAmount);
    if (amount <= 0) {
      return { valid: false, message: "Claim amount must be greater than 0" };
    }

    if (amount > policy.sumInsured) {
      return {
        valid: false,
        message: `Claim amount cannot exceed sum insured (Rs ${policy.sumInsured.toLocaleString(
          "en-IN"
        )})`,
      };
    }

    return { valid: true, percentage: (amount / policy.sumInsured) * 100 };
  },

  // Get claim percentage
  getClaimPercentage: (policyId, claimAmount) => {
    const policy = policiesStore.getPolicyById(policyId);
    if (!policy || !claimAmount) return 0;
    return ((parseFloat(claimAmount) / policy.sumInsured) * 100).toFixed(2);
  },

  // Generate claim ID
  generateClaimId: () => {
    return `CLM-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 10000)
    ).padStart(4, "0")}`;
  },

  // Create submission data object
  createSubmissionData: (formData, selectedPolicyId, selectedClaimType) => {
    const policy = policiesStore.getPolicyById(selectedPolicyId);
    if (!policy) return null;

    const submissionDate = new Date().toISOString().split("T")[0];
    const claimAmount = parseFloat(formData.claimAmount);

    return {
      id: claimsStore.generateClaimId(),
      policyId: selectedPolicyId,
      policyType: policy.type,
      claimType: selectedClaimType,
      claimAmount: claimAmount,
      sumInsured: policy.sumInsured,
      description: formData.description,
      location: formData.location,
      incidentDate: formData.incidentDate,
      submissionDate: submissionDate,
      documents: formData.documents || [],
      status: "Pending",
      approvedAmount: null,
      rejectionReason: null,
      timeline: {
        submitted: submissionDate,
      },
    };
  },
};
