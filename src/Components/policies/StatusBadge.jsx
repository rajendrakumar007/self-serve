import React from 'react';

export default function StatusBadge({ status }) {
  const s = (status || '').toUpperCase();
  const cls =
    s === 'ACTIVE'   ? 'bg-success text-textInverted' :
    s === 'EXPIRED'  ? 'bg-danger text-textInverted'  :
    s === 'PENDING'  ? 'bg-warning text-textInverted' :
    s === 'INFO'     ? 'bg-info text-textInverted'    :
                       'bg-secondary text-textInverted';

  return <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${cls}`}>{s}</span>;
}

