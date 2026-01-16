import axios from "axios";

const API_URL = "http://localhost:4000";

export const claimsApi = {
  // Get user's purchased policies
  getUserPolicies: async (userId) => {
    try {
      console.log("Fetching policies for userId:", userId);

      // Fetch user's policies from the /policies endpoint
      const policiesRes = await axios.get(
        `${API_URL}/policies?userId=${userId}`
      );
      const userPolicies = Array.isArray(policiesRes.data)
        ? policiesRes.data
        : [];

      console.log("User policies from /policies endpoint:", userPolicies);

      if (!userPolicies || userPolicies.length === 0) {
        console.log("User has no policies");
        return [];
      }

      // Get the policy catalog
      const catalogRes = await axios.get(`${API_URL}/policiesCatalog`);
      const catalog = Array.isArray(catalogRes.data) ? catalogRes.data : [];

      // Get all claims to calculate available balance
      const claimsRes = await axios.get(`${API_URL}/claims`);
      const allClaims = Array.isArray(claimsRes.data) ? claimsRes.data : [];

      // Get policy IDs from user's policies and match with catalog
      const policyIds = userPolicies.map((p) => p.policyId);
      const filteredPolicies = catalog.filter((p) =>
        policyIds.includes(p.policyId)
      );

      // Enhance policies with available balance considering approved claims
      const enhancedPolicies = filteredPolicies.map((policy) => {
        // Calculate total approved amount for this policy
        const approvedClaimsForPolicy = allClaims.filter(
          (claim) =>
            claim.policyId === policy.policyId &&
            claim.status === "APPROVED" &&
            claim.approvedAmount
        );

        const totalApprovedAmount = approvedClaimsForPolicy.reduce(
          (sum, claim) => sum + (Number(claim.approvedAmount) || 0),
          0
        );

        const availableBalance = Math.max(
          0,
          policy.sumInsured - totalApprovedAmount
        );

        return {
          ...policy,
          availableBalance: availableBalance,
          originalSumInsured: policy.sumInsured,
        };
      });

      console.log("Filtered policies with details:", enhancedPolicies);
      return enhancedPolicies;
    } catch (err) {
      console.error("Error fetching policies:", err);
      return [];
    }
  },

  // Get all claims for a user
  getUserClaims: async (userId) => {
    const res = await axios.get(`${API_URL}/claims?userId=${userId}`);
    return res.data;
  },

  // Get claim by ID
  getClaimById: async (claimId) => {
    const res = await axios.get(`${API_URL}/claims?claimId=${claimId}`);
    return res.data[0];
  },

  // Submit a new claim
  submitClaim: async (claimData) => {
    const res = await axios.post(`${API_URL}/claims`, claimData);
    return res.data;
  },

  // Create notification
  createNotification: async (notificationData) => {
    const notificationsRes = await axios.get(`${API_URL}/notifications`);
    const count = notificationsRes.data.length + 1;
    const year = new Date().getFullYear();
    const notification = {
      ...notificationData,
      notificationId: `NTF-${year}-${String(count).padStart(4, "0")}`,
      read: false,
      date: new Date().toISOString().split("T")[0],
    };
    return axios.post(`${API_URL}/notifications`, notification);
  },

  // Get notifications count
  getNotificationsCount: async () => {
    const res = await axios.get(`${API_URL}/notifications`);
    return res.data.length;
  },

  // Get all claims
  getAllClaims: async () => {
    try {
      const res = await axios.get(`${API_URL}/claims`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Error fetching all claims:", err);
      return [];
    }
  },

  // Update claim status
  updateClaimStatus: async (claimId, statusData) => {
    try {
      // Get the claim to find its ID
      const claimsRes = await axios.get(`${API_URL}/claims?claimId=${claimId}`);
      if (claimsRes.data.length === 0) {
        throw new Error("Claim not found");
      }

      const claim = claimsRes.data[0];

      // If claim is being approved, reduce the availableClaim from the policy
      if (
        statusData.status === "Approved" &&
        claim.status !== "Approved" &&
        claim.claimAmount
      ) {
        try {
          // Get the policy and reduce availableClaim
          const policiesRes = await axios.get(
            `${API_URL}/policies?id=${claim.policyId}`
          );
          if (policiesRes.data.length > 0) {
            const policy = policiesRes.data[0];
            const currentAvailable = policy.availableClaim || policy.sumInsured;
            const newAvailable = Math.max(
              0,
              currentAvailable - claim.claimAmount
            );

            // Update the policy's availableClaim
            await axios.patch(`${API_URL}/policies/${policy.id}`, {
              availableClaim: newAvailable,
            });
            console.log(
              `Policy ${claim.policyId} availableClaim reduced from ${currentAvailable} to ${newAvailable}`
            );
          }
        } catch (policyError) {
          console.warn(
            "Warning: Could not update policy availableClaim:",
            policyError
          );
          // Continue with claim approval even if policy update fails
        }
      }

      // Update the claim
      const res = await axios.patch(
        `${API_URL}/claims/${claim.id}`,
        statusData
      );
      return res.data;
    } catch (err) {
      console.error("Error updating claim status:", err);
      throw err;
    }
  },

  // Get claims count
  getClaimsCount: async () => {
    const res = await axios.get(`${API_URL}/claims`);
    return res.data.length;
  },

  // Get all policies
  getAllPolicies: async () => {
    try {
      const res = await axios.get(`${API_URL}/policies`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Error fetching all policies:", err);
      return [];
    }
  },

  // Update policy sum insured
  updatePolicySumInsured: async (policyId, newSumInsured) => {
    try {
      const res = await axios.patch(`${API_URL}/policies/${policyId}`, {
        sumInsured: newSumInsured,
      });
      return res.data;
    } catch (err) {
      console.error("Error updating policy sum insured:", err);
      throw err;
    }
  },
};
