
export default function DownloadButton({ policyId, documentUrl }) {
  const docsOrigin = window.location.origin;
  const fullUrl = documentUrl.startsWith('http') ? documentUrl : `${docsOrigin}${documentUrl}`;

  return (
    <a className="btn btn-outline-primary btn-sm" href={fullUrl} download={`${policyId}.pdf`}>
      <i className="bi bi-download me-1"></i> Download
    </a>
  );
}
