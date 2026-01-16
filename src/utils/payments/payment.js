import db from  "../../../db.json"

export function   getPayments(opts = {}) {
  const {
    userId,
    status,
    startDate,
    endDate,
    sortBy = "paymentDate",
    sortOrder = "desc",
  } = opts;

  const all = Array.isArray(db.payments) ? db.payments : [];

  // Filter
  let out = all.filter(p => {
    if (userId && p.userId !== userId) return false;
    if (status && p.status !== status) return false;
    if (startDate && new Date(p.paymentDate) < new Date(startDate)) return false;
    if (endDate && new Date(p.paymentDate) > new Date(endDate)) return false;
    return true;
  });

  // Sort
  const dir = sortOrder === "asc" ? 1 : -1;
  out.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    const an = sortBy.toLowerCase().includes("date") ? new Date(av).getTime() : Number(av);
    const bn = sortBy.toLowerCase().includes("date") ? new Date(bv).getTime() : Number(bv);
    return (an - bn) * dir;
  });

  return out;
}

export function  getRenewals(opts = {}) {
  const {
    userId,
    renewalId,
    renewalDate,
    sortBy = "renewalDate",
    sortOrder = "desc",
  } = opts;

  const all = Array.isArray(db.renewals) ? db.renewals : [];

  // Filter
  let out = all.filter(r => {
    if (userId && r.userId !== userId) return false;
    if (renewalId && r.renewalId !== renewalId) return false;
    if (renewalDate && new Date(r.renewalDate) < new Date(renewalDate)) return false;
    return true;
  });

  // Sort
  const dir = sortOrder === "asc" ? 1 : -1;
  out.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    const an = sortBy.toLowerCase().includes("date") ? new Date(av).getTime() : Number(av);
    const bn = sortBy.toLowerCase().includes("date") ? new Date(bv).getTime() : Number(bv);
    return (an - bn) * dir;
  });

  return out;
}
