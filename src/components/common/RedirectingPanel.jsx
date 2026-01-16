import { FaShieldAlt, FaBullhorn, FaTools, FaFileAlt } from "react-icons/fa";

const RedirectingPanel = () => {

    return (

        <div
            className="flex flex-col items-center justify-center h-[360px] sm:h-[420px] rounded-xl bg-bgMuted/60 dark:bg-secondary/60 border border-borderDefault dark:border-borderStrong"
            role="status"
            aria-live="polite"
        >
            <div className="relative">
                {/* Spinner */}
                <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                {/* Brand mark inside spinner */}
                <FaShieldAlt className="absolute inset-0 m-auto text-primaryDark dark:text-primary opacity-80" />
            </div>

            <p className="mt-5 text-primaryDark dark:text-textInverted font-semibold">Redirecting…</p>
            <p className="text-xs text-textMuted dark:text-textSecondary">Taking you to home page</p>

            {/* Progress bar */}
            <div className="mt-4 h-2 w-48 bg-bgCard dark:bg-secondary border border-borderDefault dark:border-borderStrong rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-primary animate-[progress_1.6s_ease-in-out_infinite]" />
            </div>

            {/* Inline keyframes via Tailwind's arbitrary values */}
            <style>{`
    @keyframes progress {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(20%); }
      100% { transform: translateX(100%); }
    }
  `}</style>
        </div>)


}

export default RedirectingPanel;