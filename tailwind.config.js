/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Brand */
        primary: "#2563EB",
        primaryDark: "#1E40AF",
        primaryLight: "#60A5FA",

        secondary: "#0F172A",
        accent: "#22C55E",

        /* Backgrounds */
        bgBase: "#F8FAFC",
        bgMuted: "#F1F5F9",
        bgCard: "#FFFFFF",
        bgHover: "#E2E8F0",

        /* Text */
        textPrimary: "#0F172A",
        textSecondary: "#334155",
        textMuted: "#64748B",
        textInverted: "#FFFFFF",

        /* Borders */
        borderDefault: "#E2E8F0",
        borderStrong: "#CBD5E1",

        /* Status */
        success: "#16A34A",
        successBg: "#DCFCE7",

        warning: "#F59E0B",
        warningBg: "#FEF3C7",

        danger: "#DC2626",
        dangerBg: "#FEE2E2",

        info: "#0EA5E9",
        infoBg: "#E0F2FE",
      },

      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        card: "16px",
        pill: "9999px",
      },

      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.04)",
        sm: "0 2px 8px rgba(0,0,0,0.06)",
        md: "0 6px 20px rgba(0,0,0,0.08)",
        lg: "0 12px 30px rgba(0,0,0,0.12)",
      },

      backgroundImage: {
        primaryGradient:
          "linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)",
        successGradient:
          "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
      },
    },
  },
  plugins: [],
}
