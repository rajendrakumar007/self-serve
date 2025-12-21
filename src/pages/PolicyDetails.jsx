
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchPolicyById } from '../store/policiesSlice.js';
import StatusBadge from '../components/StatusBadge.jsx';
import DownloadButton from '../components/DownloadButton.jsx';
import Loading from '../components/Loading.jsx';

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
      <div className="alert alert-warning">
        Policy not found. <Link to="/policies" className="alert-link">Back to list</Link>
      </div>
    );
  }

  const p = selected;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <strong>Policy {p.policyId}</strong>
        <StatusBadge status={p.status} />
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <dl className="row">
              <dt className="col-sm-4">Customer ID</dt><dd className="col-sm-8">{p.customerId}</dd>
              <dt className="col-sm-4">Policy Type</dt><dd className="col-sm-8">{p.policyType}</dd>
              <dt className="col-sm-4">Coverage</dt><dd className="col-sm-8">₹{Number(p.coverageAmount).toLocaleString('en-IN')}</dd>
            </dl>
          </div>
          <div className="col-md-6">
            <dl className="row">
              <dt className="col-sm-4">Start</dt><dd className="col-sm-8">{new Date(p.startDate).toLocaleDateString()}</dd>
              <dt className="col-sm-4">End</dt><dd className="col-sm-8">{new Date(p.endDate).toLocaleDateString()}</dd>
              <dt className="col-sm-4">Status</dt><dd className="col-sm-8"><StatusBadge status={p.status} /></dd>
            </dl>
          </div>
        </div>

        <div className="mt-3">
          <h6>Terms & Coverage Details</h6>
          <p>{p.terms || '—'}</p>

          <div className="d-flex align-items-center gap-2">
            <DownloadButton policyId={p.policyId} documentUrl={p.documentUrl} />
            <Link to="/policies" className="btn btn-link">Back to list</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
