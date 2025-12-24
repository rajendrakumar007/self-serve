import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPolicies } from '../store/policiesSlice.js';
import Loading from '../Components/policies/Loading.jsx';
import StatusBadge from '../Components/policies/StatusBadge.jsx';
import PolicyFilters from '../Components/policies/PolicyFilters.jsx';
import DownloadButton from '../Components/policies/DownloadButton.jsx';

export default function PolicyList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.policies);

  const [customerId] = useState('CUST-001');
  const [filters, setFilters] = useState({ q: '', status: 'ALL', type: 'ALL', sortBy: 'startDate', sortDir: 'desc' });

  useEffect(() => {
    dispatch(fetchPolicies({ customerId }));
  }, [dispatch, customerId]);

  const filtered = useMemo(() => {
    let list = [...items];
    const q = filters.q.trim().toLowerCase();

    if (filters.status !== 'ALL') list = list.filter(p => (p.status || '').toUpperCase() === filters.status);
    if (filters.type !== 'ALL') list = list.filter(p => (p.policyType || '') === filters.type);
    if (q) list = list.filter(p =>
      (p.policyId || '').toLowerCase().includes(q) ||
      (p.policyType || '').toLowerCase().includes(q)
    );

    const key = filters.sortBy;
    list.sort((a, b) => {
      let va = a[key]; let vb = b[key];
      if (key.includes('Date')) { va = new Date(va).getTime(); vb = new Date(vb).getTime(); }
      if (va < vb) return filters.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return filters.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [items, filters]);

  
return (
  <>
    <PolicyFilters onChange={setFilters} />

    {status === 'loading' && <Loading label="Fetching policies..." />}

    {/* Bootstrap: alert alert-danger -> Tailwind themed alert */}
    {status === 'failed' && (
      <div className="rounded-md border border-danger bg-dangerBg text-danger px-4 py-3">
        {error}
      </div>
    )}

    {status === 'succeeded' && (
      <div className="rounded-card border border-borderDefault bg-bgCard shadow-sm">
        {/* Header (card-header d-flex justify-content-between align-items-center) */}
        <div className="flex items-center justify-between border-b border-borderDefault px-4 py-2">
          <strong className="text-textPrimary">Policies ({filtered.length})</strong>
          <span className="text-textMuted">Customer: {customerId}</span>
        </div>

        {/* Table wrapper (table-responsive) */}
        <div className="overflow-x-auto">
          {/* Table (table table-hover align-middle mb-0) */}
          <table className="min-w-full text-sm">
            {/* Thead (table-light) */}
            <thead className="bg-bgMuted text-textSecondary">
              <tr>
                <th className="px-4 py-2 text-left">Policy ID</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Coverage</th>
                <th className="px-4 py-2 text-left">Start — End</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>

            {/* Body with row divider & hover (table-hover, align-middle) */}
            <tbody className="divide-y divide-borderDefault">
              {filtered.map((p) => (
                <tr key={p.policyId} className="hover:bg-bgHover/50">
                  <td className="px-4 py-2">
                    <Link
                      to={`/policies/${p.policyId}`}
                      className="text-primary hover:text-primaryLight"
                    >
                      {p.policyId}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{p.policyType}</td>
                  <td className="px-4 py-2">
                    ₹{Number(p.coverageAmount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(p.startDate).toLocaleDateString()} —{' '}
                    {new Date(p.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={p.status} />
                  </td>

                  {/* Actions (text-end, btn-group) */}
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/policies/${p.policyId}`}
                        className="
                          inline-flex items-center gap-1
                          rounded-md border border-borderDefault
                          px-3 py-1.5 text-sm text-textSecondary
                          hover:bg-bgHover
                          focus:outline-none focus:ring-2 focus:ring-primary/30
                          transition
                        "
                      >
                        {/* Keep Bootstrap Icon or swap to Heroicons/Lucide */}
                        <i className="bi bi-eye" aria-hidden="true" />
                        <span>View</span>
                      </Link>

                      <DownloadButton
                        policyId={p.policyId}
                        documentUrl={p.documentUrl}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-textMuted">
                    No policies match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </>
)

}
