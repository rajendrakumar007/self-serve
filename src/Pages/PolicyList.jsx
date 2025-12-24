
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPolicies } from '../store/policiesSlice.js';
import Loading from '../Components/policies/Loading.jsx';
import StatusBadge from '../Components/policies/StatusBadge.jsx';
import PolicyFilters from '../Components/policies/PolicyFilters.jsx';
import DownloadButton from '../Components/policies/DownloadButton.jsx';

export default function PolicyList() {
  const dispatch = useDispatch();
  const { items = [], status, error } = useSelector((s) => s.policies);

  const [customerId] = useState('CUST-001');

  const [filters, setFilters] = useState({
    q: '',
    status: 'ALL',
    type: 'ALL',
    sortBy: 'startDate',
    sortDir: 'desc',
  });

  useEffect(() => {
    dispatch(fetchPolicies({ customerId }));
  }, [dispatch, customerId]);

  const filtered = useMemo(() => {
    let list = Array.isArray(items) ? [...items] : [];

    const q = filters.q.trim().toLowerCase();

    if (filters.status !== 'ALL') {
      list = list.filter(
        (p) => (p.status ?? '').toUpperCase() === filters.status
      );
    }

    if (filters.type !== 'ALL') {
      list = list.filter((p) => (p.policyType ?? '') === filters.type);
    }

    if (q) {
      list = list.filter(
        (p) =>
          (p.policyId ?? '').toLowerCase().includes(q) ||
          (p.policyType ?? '').toLowerCase().includes(q)
      );
    }

    const key = filters.sortBy;
    list.sort((a, b) => {
      let va = a?.[key];
      let vb = b?.[key];

      if (String(key).includes('Date')) {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      }

      if (va < vb) return filters.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return filters.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [items, filters]);

  const formatINR = (v) =>
    typeof v === 'number'
      ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : Number(v ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const formatDate = (d) => {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? '-' : dt.toLocaleDateString();
  };

  return (

<>
  {status === 'loading' && <Loading label="Loading policies..." />}

  {status === 'failed' && (
    <div className="rounded-md border border-danger bg-dangerBg text-danger px-3 py-2">
      Failed to load policies. {error ?? ''}
    </div>
  )}

  {status === 'succeeded' && (
    <section className="w-full">
      {/* Header strip */}
      <div className="px-4 py-3 flex items-center justify-between bg-bgCard border border-borderStrong rounded-card shadow-xs">
        <h2 className="text-base font-semibold text-textPrimary">Policies ({filtered.length})</h2>
        <div className="text-textMuted">Customer: {customerId}</div>
      </div>

      {/* Filters card */}
      <div className="mt-3 rounded-card border border-borderDefault bg-bgCard shadow-xs p-4">
        <PolicyFilters value={filters} onChange={setFilters} />
      </div>

      {/* Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bgMuted text-textSecondary">
            <tr>
              <th className="text-left font-medium px-3 py-2">Policy ID</th>
              <th className="text-left font-medium px-3 py-2">Type</th>
              <th className="text-left font-medium px-3 py-2">Coverage</th>
              <th className="text-left font-medium px-3 py-2">Start — End</th>
              <th className="text-left font-medium px-3 py-2">Status</th>
              <th className="text-right font-medium px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-borderDefault">
            {filtered.map(p => (
              <tr key={p.policyId} className="hover:bg-bgHover">
                <td className="px-3 py-2">
                  <Link to={`/policies/${p.policyId}`} className="text-textPrimary hover:text-primaryDark font-medium">
                    {p.policyId}
                  </Link>
                </td>
                <td className="px-3 py-2 text-textPrimary">{p.policyType ?? '-'}</td>
                <td className="px-3 py-2 text-textPrimary">₹{formatINR(p.coverageAmount)}</td>
                <td className="px-3 py-2 text-textPrimary">
                  {formatDate(p.startDate)} — {formatDate(p.endDate)}
                </td>
                <td className="px-3 py-2"><StatusBadge status={p.status} /></td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/policies/${p.policyId}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-primary text-textInverted hover:bg-primaryDark transition"
                    >
                      View
                    </Link>
                    <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-textMuted">
                  No policies match the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )}
</>

  );
}
