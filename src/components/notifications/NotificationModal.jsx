import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function NotificationModal({
  isOpen,
  onClose,
  title,
  children,
  tabs = [],      // [{ key, label, count }]
  activeTab,      // string
  onTabChange,    // (key) => void
}) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKeyDown);
    const id = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  /**
   * 1. FILTER LOGIC:
   * Removes 'read' and 'unread' tabs.
   */
  const visibleTabs = tabs.filter(t => {
    const label = t.label?.toLowerCase().trim();
    return label !== 'unread' && label !== 'read';
  });

  const modal = (
    <div
      className="fixed inset-0 z-[1000]"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Centered container */}
      <div
        className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[min(90vw,40rem)]
          rounded-card border shadow-2xl
          bg-bgCard text-textPrimary dark:text-textInverted
          border-borderDefault dark:ring-[0.5px] dark:ring-borderStrong
          max-h-[85vh] overflow-hidden
          grid grid-rows-[auto_auto_1fr]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-borderDefault">
          <h3 className="text-lg font-semibold capitalize">
            {title ?? "notifications"}
          </h3>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-md bg-bgMuted hover:bg-primaryLight hover:text-textInverted transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs Section */}
        {visibleTabs.length > 0 ? (
          <div className="px-4 py-2 border-b border-borderDefault bg-bgMuted/40">
            <div className="flex flex-wrap items-center gap-2">
              {visibleTabs.map((t) => {
                const isActive = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => onTabChange?.(t.key)}
                    className={`
                      px-3 py-1 rounded-md border transition-colors text-sm
                      ${isActive
                        ? "bg-primaryLight text-textInverted border-primaryLight"
                        : "bg-bgCard text-textPrimary dark:text-textInverted border-borderDefault hover:bg-primaryLight hover:text-textInverted"}
                    `}
                  >
                    {/* FIX: Force lower case first, then use 'capitalize' 
                        This converts "PAYMENT" -> "payment" -> "Payment"
                    */}
                    <span className="capitalize">
                        {t.label?.toLowerCase()}
                    </span>
                    
                    {typeof t.count === "number" && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-bgMuted px-2 text-xs text-textPrimary dark:text-textInverted font-semibold">
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-0" />
        )}

        {/* Body */}
        <div className="px-4 py-4 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}