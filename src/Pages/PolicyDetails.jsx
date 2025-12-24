
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchPolicyById } from '../store/policiesSlice.js';
import StatusBadge from '../Components/policies/StatusBadge.jsx';
import DownloadButton from '../Components/policies/DownloadButton.jsx';
import Loading from '../Components/policies/Loading.jsx';

export default function PolicyDetails() {
  const { id: idParam } = useParams();
  const id = isNaN(Number(idParam)) ? idParam : Number(idParam);

  const dispatch = useDispatch();
  const { selected, status, error } = useSelector((s) => s.policies);

  useEffect(() => {
    if (idParam) {
      dispatch(fetchPolicyById({ id }));
    }
  }, [dispatch, id, idParam]);

  if (status === 'loading') return <Loading label="Loading policy..." />;

  if (status === 'failed') {
    return (
      <div className="alert alert-danger">
        Failed to load policy. {error ?? ''}
        <div className="mt-2"><Link to="/policies" className="btn btn-link">Back to list</Link></div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="alert alert-warning">
        Policy not found.
        <div className="mt-2"><Link to="/policies" className="btn btn-link">Back to list</Link></div>
      </div>
    );
  }

  const p = selected;

  const formatINR = (v) =>
    typeof v === 'number'
      ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : Number(v ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const formatDate = (d) => {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? '-' : dt.toLocaleDateString();
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Policy {p.policyId}</h2>
        <div className="d-flex align-items-center gap-2">
          <StatusBadge status={p.status} />
          <DownloadButton policy={p} />
        </div>
      </div>


      <div className="card-body">
        <div className="row g-3">

          <div className="col-md-6">
            <dl className="row mb-0">
              <dt className="col-5">Customer ID</dt>
              <dd className="col-7">{p.customerId ?? '-'}</dd>

              <dt className="col-5">Policy Type</dt>
              <dd className="col-7">{p.policyType ?? '-'}</dd>

              <dt className="col-5">Coverage</dt>
              <dd className="col-7">₹{formatINR(p.coverageAmount)}</dd>
            </dl>
          </div>

          {/* Right column */}
          <div className="col-md-6">
            <dl className="row mb-0">
              <dt className="col-5">Start</dt>
              <dd className="col-7">{formatDate(p.startDate)}</dd>

              <dt className="col-5">End</dt>
              <dd className="col-7">{formatDate(p.endDate)}</dd>

              <dt className="col-5">Status</dt>
              <dd className="col-7"><StatusBadge status={p.status} /></dd>
            </dl>
          </div>
        </div>

        <hr className="my-4" />

        <h6 className="text-uppercase text-muted mb-2">Terms & Coverage Details</h6>
        <p className="mb-3">{p.terms ?? '—'}</p>

        <div className="d-flex align-items-center gap-2">
          <Link to="/policies" className="btn btn-link">Back to list</Link>
          <DownloadButton policy={p} />
        </div>
      </div>
    </div>
  );
}
