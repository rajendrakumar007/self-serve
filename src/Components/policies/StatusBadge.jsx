import React from 'react';
export default function StatusBadge({ status }) {
  const s = (status || '').toUpperCase();
  const cls = s === 'ACTIVE' ? 'bg-success' : s === 'EXPIRED' ? 'bg-danger' : 'bg-dark';
  return <span className={`badge ${cls}`}>{s}</span>;
}
