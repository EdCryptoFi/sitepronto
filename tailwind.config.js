/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        "surface-lowest": "var(--surface-container-lowest)",
        "surface-low": "var(--surface-container-low)",
        "surface-med": "var(--surface-container)",
        "surface-high": "var(--surface-container-high)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",

        primary: "var(--primary)",
        "primary-container": "var(--primary-container)",
        "primary-fixed-dim": "var(--primary-fixed-dim)",
        "on-primary": "var(--on-primary)",

        tertiary: "var(--tertiary)",
        "tertiary-container": "var(--tertiary-container)",
        "on-tertiary": "var(--on-tertiary)",

        background: "var(--surface)",
        foreground: "var(--on-surface)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-lg": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["3.5rem", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-md": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "title-lg": ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.005em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-sm": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "600" }],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        architectural: "0 12px 40px rgba(15, 23, 42, 0.06)",
        "architectural-lg": "0 24px 60px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
        "gradient-tertiary": "linear-gradient(135deg, var(--tertiary-container) 0%, var(--tertiary) 100%)",
      },
      transitionTimingFunction: {
        architect: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
