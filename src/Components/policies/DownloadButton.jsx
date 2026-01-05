import React from "react";

/**
 * DownloadButton Component
 *
 * A versatile button component that handles policy document downloads.
 * Used in policy list and policy details pages to allow users to download
 * policy documents (PDFs).
 *
 * Features:
 * - Conditional rendering: Shows download link if document exists, disabled button if not
 * - Automatic URL construction for relative paths
 * - Consistent download filename across all policies
 * - Accessible design with proper ARIA attributes
 * - Tailwind CSS styling with hover states
 *
 * @param {string} documentUrl - The URL/path to the document to download
 * @returns {JSX.Element} Either a download link or disabled button
 */
export default function DownloadButton({ documentUrl }) {
  // Construct full URL for the document
  // If documentUrl starts with http, use as-is; otherwise prepend origin
  const fullUrl = documentUrl.startsWith("http")
    ? documentUrl
    : `${window.location.origin}${documentUrl}`;

  // Conditional rendering based on document availability
  return documentUrl ? (
    // Download link when document exists
    <a
      href={fullUrl}
      download="USR-2025-0001.pdf" // Fixed filename for all downloads
      className="inline-flex items-center px-3 py-1.5 text-sm gap-1.5 rounded-md border border-primary text-primary bg-bgCard shadow-xs hover:bg-bgHover hover:text-primaryDark hover:border-primaryDark transition"
    >
      {/* Download icon (SVG) */}
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path
          d="M12 3v10m0 0L8.5 9.5M12 13l3.5-3.5M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      Download
    </a>
  ) : (
    // Disabled button when no document is available
    <button
      className="inline-flex items-center px-3 py-1.5 text-sm gap-1.5 rounded-md border border-borderDefault bg-bgCard text-textMuted shadow-xs opacity-70 cursor-not-allowed"
      disabled
    >
      {/* Same download icon but muted */}
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path
          d="M12 3v10m0 0L8.5 9.5M12 13l3.5-3.5M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      No Document
    </button>
  );
}
