
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPolicies } from '../store/policiesSlice.js';
import Loading from '../components/Loading.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PolicyFilters from '../components/PolicyFilters.jsx';
import DownloadButton from '../components/DownloadButton.jsx';

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
      {status === 'failed' && <div className="alert alert-danger">{error}</div>}

      {status === 'succeeded' && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Policies ({filtered.length})</strong>
            <span className="text-muted">Customer: {customerId}</span>
          </div>
          <div className="table-responsive">
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
                    <td><Link to={`/policies/${p.policyId}`}>{p.policyId}</Link></td>
                    <td>{p.policyType}</td>
                    <td>₹{Number(p.coverageAmount).toLocaleString('en-IN')}</td>
                    <td>{new Date(p.startDate).toLocaleDateString()} — {new Date(p.endDate).toLocaleDateString()}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="text-end">
                      <div className="btn-group">
                        <Link to={`/policies/${p.policyId}`} className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-eye me-1"></i> View
                        </Link>
                        <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-muted py-4">No policies match the filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
