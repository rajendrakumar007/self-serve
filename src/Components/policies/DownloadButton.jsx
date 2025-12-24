
import React from 'react';

export default function DownloadButton({ policyId, documentUrl }) {
  if (!documentUrl) {
    return (
      <button className="btn btn-outline-secondary btn-sm" disabled>
        <i className="bi bi-download me-1"></i> No Document
      </button>
    );
  }

  const docsOrigin = window.location.origin;

  const fullUrl = documentUrl.startsWith('http')
    ? documentUrl
    : `${docsOrigin}${documentUrl}`;

  return (
    <a className="btn btn-outline-primary btn-sm" href={fullUrl} download={`${policyId}.pdf`}>
      <i className="bi bi-download me-1"></i> Download
    </a>
  );
}
