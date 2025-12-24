
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
    if (idParam) dispatch(fetchPolicyById({ id }));
  }, [dispatch, id, idParam]);

  // Loading
  if (status === 'loading') return <Loading label="Loading policy..." />;

  // Failed
  if (status === 'failed')
    return (
      <div className="rounded-md border border-danger bg-dangerBg text-danger px-3 py-2">
        Failed to load policy. {error ?? ''}
        <div className="mt-2">
          <Link
            to="/policies"
            className="text-primary hover:text-primaryDark underline underline-offset-2"
          >
            Back to list
          </Link>
        </div>
      </div>
    );

  // Not found
  if (!selected)
    return (
      <div className="rounded-md border border-warning bg-warningBg text-warning px-3 py-2">
        Policy not found.
        <div className="mt-2">
          <Link
            to="/policies"
            className="text-primary hover:text-primaryDark underline underline-offset-2"
          >
            Back to list
          </Link>
        </div>
      </div>
    );

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
    <section className="w-full">
      {/* Header strip (subtle surface on top of app bg) */}
      <div className="px-4 py-3 flex items-center justify-between bg-bgCard border border-borderStrong rounded-card shadow-xs">
        <h2 className="text-base font-semibold text-textPrimary">Policy {p.policyId}</h2>
        <div className="flex items-center gap-2">
          <StatusBadge status={p.status} />
          <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
        </div>
      </div>

      {/* Details panel */}
      <div className="mt-3 rounded-card border border-borderDefault bg-bgCard shadow-xs p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left column */}
          <div>
            <dl className="grid grid-cols-5 gap-y-2">
              <dt className="col-span-2 text-textSecondary">Customer ID</dt>
              <dd className="col-span-3 text-textPrimary">{p.customerId ?? '-'}</dd>

              <dt className="col-span-2 text-textSecondary">Policy Type</dt>
              <dd className="col-span-3 text-textPrimary">{p.policyType ?? '-'}</dd>

              <dt className="col-span-2 text-textSecondary">Coverage</dt>
              <dd className="col-span-3 text-textPrimary">₹{formatINR(p.coverageAmount)}</dd>
            </dl>
          </div>

          {/* Right column */}
          <div>
            <dl className="grid grid-cols-5 gap-y-2">
              <dt className="col-span-2 text-textSecondary">Start</dt>
              <dd className="col-span-3 text-textPrimary">{formatDate(p.startDate)}</dd>

              <dt className="col-span-2 text-textSecondary">End</dt>
              <dd className="col-span-3 text-textPrimary">{formatDate(p.endDate)}</dd>

              <dt className="col-span-2 text-textSecondary">Status</dt>
              <dd className="col-span-3">
                <StatusBadge status={p.status} />
              </dd>
            </dl>
          </div>
        </div>

        <hr className="my-4 border-borderDefault" />

        <h6 className="text-xs font-semibold tracking-wide text-textMuted uppercase mb-2">
          Terms & Coverage Details
        </h6>
        <p className="mb-3 text-textSecondary">{p.terms ?? '—'}</p>

        <div className="flex items-center gap-2">
          <Link
            to="/policies"
            className="text-primary hover:text-primaryDark underline underline-offset-2"
          >
            Back to list
          </Link>
          <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
        </div>
      </div>
    </section>
  );
}
