import React, { useEffect, useRef } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);

    // move focus to the close button
    const id = setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="mx-4 w-full max-w-2xl bg-bgCard/95 backdrop-blur-sm rounded-card shadow-xl border border-borderDefault">
        <div className="flex items-center justify-between px-4 py-3 border-b border-borderDefault">
          <h3 id="modal-title" className="text-lg font-semibold text-textPrimary">
            {title}
          </h3>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-md bg-bgMuted text-textPrimary hover:bg-primaryLight hover:text-textInverted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-4 py-4 text-textPrimary">
          {children}
        </div>

        <div className="px-4 py-3 border-t border-borderDefault flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-primary text-textInverted hover:bg-primaryDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
