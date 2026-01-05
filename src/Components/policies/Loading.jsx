import React from "react";

/**
 * Loading Component
 *
 * A reusable loading indicator component used throughout the application
 * to show loading states during async operations like API calls.
 *
 * Features:
 * - Customizable loading text via label prop
 * - Accessible design with proper ARIA attributes
 * - Animated spinner using Tailwind CSS
 * - Consistent styling with the app's design system
 *
 * @param {string} label - The text to display next to the spinner (default: 'Loading...')
 * @returns {JSX.Element} Loading indicator with spinner and text
 */
export default function Loading({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 my-2">
      {/* Animated loading spinner */}
      <span
        role="status"
        aria-label="Loading"
        className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"
      />
      {/* Loading text */}
      <span className="text-textMuted">{label}</span>
    </div>
  );
}
