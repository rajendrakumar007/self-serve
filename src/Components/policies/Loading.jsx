import React from 'react';
export default function Loading({ label = 'Loading...' }) {
  
return (
  <div className="flex items-center gap-2 my-2">
    {/* Spinner: small circle with top border transparent to create the spin effect */}
    <span
      role="status"
      aria-label="Loading"
      className="
        inline-block h-4 w-4
        rounded-full
        border-2 border-primary border-t-transparent
        animate-spin
      "
    />
    <span className="text-textMuted">{label}</span>
  </div>
);

}
