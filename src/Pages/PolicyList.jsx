
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
        <div className="alert alert-danger">Failed to load policies. {error ?? ''}</div>
      )}


      {status === 'succeeded' && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2 className="h5 mb-0">Policies ({filtered.length})</h2>
            <div className="text-muted">Customer: {customerId}</div>
          </div>

          <div className="card-body">
            <PolicyFilters value={filters} onChange={setFilters} />


            <div className="table-responsive mt-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Policy ID</th>
                    <th>Type</th>
                    <th>Coverage</th>
                    <th>Start — End</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.policyId}>
                      <td>
                        <Link to={`/policies/${p.policyId}`} className="fw-medium">
                          {p.policyId}
                        </Link>
                      </td>
                      <td>{p.policyType ?? '-'}</td>
                      <td>₹{formatINR(p.coverageAmount)}</td>
                      <td>
                        {formatDate(p.startDate)} — {formatDate(p.endDate)}
                      </td>
                      <td>
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="text-end">
                        <div className="btn-group">
                          <Link to={`/policies/${p.policyId}`} className="btn btn-sm btn-primary">
                            View
                          </Link>
                          <DownloadButton policy={p} size="sm" />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        No policies match the filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
