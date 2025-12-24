
import React from 'react';


export default function DownloadButton({ policyId, documentUrl }) {
  if (!documentUrl)
    return (
      <button
        className="inline-flex items-center px-3 py-1.5 text-sm gap-1.5 rounded-md border border-borderDefault bg-bgCard text-textMuted shadow-xs opacity-70 cursor-not-allowed"
        disabled
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M12 3v10m0 0L8.5 9.5M12 13l3.5-3.5M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        No Document
      </button>
    );

  const fullUrl = documentUrl.startsWith("http") ? documentUrl : `${window.location.origin}${documentUrl}`;

  return (
    <a
      href={fullUrl}
      download={`${policyId}.pdf`}
      className="inline-flex items-center px-3 py-1.5 text-sm gap-1.5 rounded-md border border-primary text-primary bg-bgCard shadow-xs hover:bg-bgHover hover:text-primaryDark hover:border-primaryDark transition"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M12 3v10m0 0L8.5 9.5M12 13l3.5-3.5M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      Download
    </a>
  );
}
