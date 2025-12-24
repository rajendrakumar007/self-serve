import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchPolicyById } from '../store/policiesSlice.js';
import StatusBadge from '../Components/policies/StatusBadge.jsx';
import DownloadButton from '../Components/policies/DownloadButton.jsx';
import Loading from '../Components/policies/Loading.jsx';

export default function PolicyDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, status } = useSelector(s => s.policies);

  useEffect(() => {
    dispatch(fetchPolicyById({ id }));
  }, [dispatch, id]);

  if (status === 'loading') return <Loading label="Loading policy..." />;

  
if (!selected) {
    return (
      <div className="rounded-md border border-warning bg-warningBg text-warning px-4 py-3">
        <span className="font-medium">Policy not found.</span>{' '}
        <Link to="/policies" className="underline hover:text-warning">
          Back to list
        </Link>
      </div>
    )
  }

  const p = selected

  return (
    <div className="rounded-card border border-borderDefault bg-bgCard shadow-md">
      {/* Header (Bootstrap: card-header d-flex justify-content-between) */}
      <div className="flex items-center justify-between border-b border-borderDefault px-4 py-2">
        <strong className="text-textPrimary">Policy {p.policyId}</strong>
        <StatusBadge status={p.status} />
      </div>

      {/* Body (Bootstrap: card-body) */}
      <div className="px-4 py-3">
        {/* Two-column details grid (Bootstrap: row g-3 / col-md-6) */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Left column */}
          <dl className="grid grid-cols-4 gap-x-4 gap-y-2">
            <dt className="col-span-1 text-textMuted">Customer ID</dt>
            <dd className="col-span-3">{p.customerId}</dd>

            <dt className="col-span-1 text-textMuted">Policy Type</dt>
            <dd className="col-span-3">{p.policyType}</dd>

            <dt className="col-span-1 text-textMuted">Coverage</dt>
            <dd className="col-span-3">
              ₹{Number(p.coverageAmount).toLocaleString('en-IN')}
            </dd>
          </dl>

          {/* Right column */}
          <dl className="grid grid-cols-4 gap-x-4 gap-y-2">
            <dt className="col-span-1 text-textMuted">Start</dt>
            <dd className="col-span-3">
              {new Date(p.startDate).toLocaleDateString()}
            </dd>

            <dt className="col-span-1 text-textMuted">End</dt>
            <dd className="col-span-3">
              {new Date(p.endDate).toLocaleDateString()}
            </dd>

            <dt className="col-span-1 text-textMuted">Status</dt>
            <dd className="col-span-3">
              <StatusBadge status={p.status} />
            </dd>
          </dl>
        </div>

        {/* Terms & actions */}
        <div className="mt-3">
          <h6 className="text-sm font-semibold text-textSecondary">
            Terms &amp; Coverage Details
          </h6>
          <p className="mt-1 text-textPrimary">{p.terms || '—'}</p>

          {/* Actions row (Bootstrap: d-flex align-items-center gap-2) */}
          <div className="mt-2 flex items-center gap-2">
            <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />

            {/* Bootstrap: btn btn-link → Tailwind link styled with brand color */}
            <Link
              to="/policies"
              className="text-primary hover:text-primaryLight underline underline-offset-2"
            >
              Back to list
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
