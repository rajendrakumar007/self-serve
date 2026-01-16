import db from  "../../../db.json"

export function getPolicies(opts = {}) {
  const {
    policyId,
    type,
  } = opts;

  const all = Array.isArray(db.policiesCatalog) ? db.policiesCatalog : [];

  // Filter
  let out = all.filter(p => {
    if (policyId && p.policyId !== policyId) return false;
    if (type && p.type !== type) return false;
    return true;
  });
  return out;
}

export function getUserPolicies(opts = {}) {
  const {
    policyId,
    userId,
    type,
  } = opts;

  const all = Array.isArray(db.policies) ? db.policies : [];

  // Filter
  let out = all.filter(p => {
    if (policyId && p.policyId !== policyId) return false;
    if (userId && p.userId !== userId) return false;
    if (type && p.type !== type) return false;
    return true;
  });
  return out;
}




