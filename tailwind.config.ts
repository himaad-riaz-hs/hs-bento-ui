import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["var(--hs-typeface-base-font-family)", "Source Sans 3", "Source Sans Pro", "sans-serif"],
    },
    extend: {
      colors: {
        hs: {
          fill: {
            app: "var(--hs-color-fill-app)",
            base: "var(--hs-color-fill-base)",
            subtle: "var(--hs-color-fill-subtle)",
            inverse: "var(--hs-color-fill-inverse)",
            disabled: "var(--hs-color-fill-disabled)",
            brand: "var(--hs-color-fill-brand)",
            "brand-hover": "var(--hs-color-fill-brand-hover)",
            "brand-active": "var(--hs-color-fill-brand-active)",
            positive: "var(--hs-color-fill-positive)",
            critical: "var(--hs-color-fill-critical)",
            warning: "var(--hs-color-fill-warning)",
            info: "var(--hs-color-fill-info)",
            discovery: "var(--hs-color-fill-discovery)",
          },
          text: {
            base: "var(--hs-color-text-base)",
            subtle: "var(--hs-color-text-subtle)",
            muted: "var(--hs-color-text-muted)",
            inverse: "var(--hs-color-text-inverse)",
            "on-filled": "var(--hs-color-text-on-filled)",
            disabled: "var(--hs-color-text-disabled)",
            link: "var(--hs-color-text-link)",
            "link-hover": "var(--hs-color-text-link-hover)",
            brand: "var(--hs-color-text-brand)",
            positive: "var(--hs-color-text-positive)",
            critical: "var(--hs-color-text-critical)",
            warning: "var(--hs-color-text-warning)",
            info: "var(--hs-color-text-info)",
            discovery: "var(--hs-color-text-discovery)",
          },
          icon: {
            base: "var(--hs-color-icon-base)",
            subtle: "var(--hs-color-icon-subtle)",
            inverse: "var(--hs-color-icon-inverse)",
            disabled: "var(--hs-color-icon-disabled)",
            link: "var(--hs-color-icon-link)",
            brand: "var(--hs-color-icon-brand)",
            positive: "var(--hs-color-icon-positive)",
            critical: "var(--hs-color-icon-critical)",
            warning: "var(--hs-color-icon-warning)",
            info: "var(--hs-color-icon-info)",
            discovery: "var(--hs-color-icon-discovery)",
          },
          border: {
            base: "var(--hs-color-border-base)",
            subtle: "var(--hs-color-border-subtle)",
            strong: "var(--hs-color-border-strong)",
            disabled: "var(--hs-color-border-disabled)",
            focus: "var(--hs-color-border-focus)",
            brand: "var(--hs-color-border-brand)",
            positive: "var(--hs-color-border-positive)",
            critical: "var(--hs-color-border-critical)",
            warning: "var(--hs-color-border-warning)",
            info: "var(--hs-color-border-info)",
            discovery: "var(--hs-color-border-discovery)",
          },
          chart: {
            neutral: {
              base: "var(--hs-color-chart-neutral-base)",
              shade: "var(--hs-color-chart-neutral-shade)",
            },
            positive: {
              base: "var(--hs-color-chart-positive-base)",
              shade: "var(--hs-color-chart-positive-shade)",
            },
            critical: {
              base: "var(--hs-color-chart-critical-base)",
              shade: "var(--hs-color-chart-critical-shade)",
            },
          },
          overlay: {
            scrim: "var(--hs-color-overlay-scrim)",
          },
          comp: {
            button: {
              filled: {
                bg: "var(--hs-comp-button-filled-bg)",
                "bg-hover": "var(--hs-comp-button-filled-bg-hover)",
                "bg-active": "var(--hs-comp-button-filled-bg-active)",
                text: "var(--hs-comp-button-filled-text)",
              },
              outlined: {
                bg: "var(--hs-comp-button-outlined-bg)",
                "bg-hover": "var(--hs-comp-button-outlined-bg-hover)",
                border: "var(--hs-comp-button-outlined-border)",
                text: "var(--hs-comp-button-outlined-text)",
              },
              text: {
                bg: "var(--hs-comp-button-text-bg)",
                "bg-hover": "var(--hs-comp-button-text-bg-hover)",
                label: "var(--hs-comp-button-text-label)",
              },
              tonal: {
                bg: "var(--hs-comp-button-tonal-bg)",
                "bg-hover": "var(--hs-comp-button-tonal-bg-hover)",
                text: "var(--hs-comp-button-tonal-text)",
              },
            },
            input: {
              bg: "var(--hs-comp-input-bg)",
              border: "var(--hs-comp-input-border)",
              "border-hover": "var(--hs-comp-input-border-hover)",
              "border-focus": "var(--hs-comp-input-border-focus)",
              "border-error": "var(--hs-comp-input-border-error)",
              text: "var(--hs-comp-input-text)",
              placeholder: "var(--hs-comp-input-placeholder)",
              label: "var(--hs-comp-input-label)",
              helper: "var(--hs-comp-input-helper)",
            },
            tag: {
              bg: "var(--hs-comp-tag-bg)",
              text: "var(--hs-comp-tag-text)",
              "surface-positive": "var(--hs-comp-tag-surface-positive)",
              "surface-critical": "var(--hs-comp-tag-surface-critical)",
              "surface-warning": "var(--hs-comp-tag-surface-warning)",
              "surface-info": "var(--hs-comp-tag-surface-info)",
              "surface-discovery": "var(--hs-comp-tag-surface-discovery)",
            },
            combobox: {
              bg: "var(--hs-comp-combobox-bg)",
              border: "var(--hs-comp-combobox-border)",
            },
          },
        },
      },
      spacing: {
        "hs-1": "var(--hs-spacing-1)",
        "hs-2": "var(--hs-spacing-2)",
        "hs-3": "var(--hs-spacing-3)",
        "hs-4": "var(--hs-spacing-4)",
        "hs-5": "var(--hs-spacing-5)",
        "hs-6": "var(--hs-spacing-6)",
        "hs-8": "var(--hs-spacing-8)",
        "hs-10": "var(--hs-spacing-10)",
        "hs-12": "var(--hs-spacing-12)",
        "hs-16": "var(--hs-spacing-16)",
        "hs-content-to-button": "var(--hs-spacing-content-to-button)",
      },
      borderRadius: {
        "hs-1": "var(--hs-radii-1)",
        "hs-2": "var(--hs-radii-2)",
        "hs-3": "var(--hs-radii-3)",
        "hs-4": "var(--hs-radii-4)",
        "hs-6": "var(--hs-radii-6)",
        "hs-full": "9999px",
        "hs-button": "var(--hs-comp-button-border-radii)",
        "hs-input": "var(--hs-comp-input-border-radii)",
        "hs-icon-button": "var(--hs-comp-icon-button-border-radii)",
        "hs-card": "var(--hs-comp-card-radius)",
      },
      fontSize: {
        "hs-display-1": [
          "var(--hs-font-size-display-1)",
          {
            lineHeight: "var(--hs-line-height-display-1)",
            letterSpacing: "var(--hs-letter-spacing-display-1)",
            fontWeight: "var(--hs-font-weight-display-1)",
          },
        ],
        "hs-display-2": [
          "var(--hs-font-size-display-2)",
          {
            lineHeight: "var(--hs-line-height-display-2)",
            letterSpacing: "var(--hs-letter-spacing-display-2)",
            fontWeight: "var(--hs-font-weight-display-2)",
          },
        ],
        "hs-display-3": [
          "var(--hs-font-size-display-3)",
          {
            lineHeight: "var(--hs-line-height-display-3)",
            letterSpacing: "var(--hs-letter-spacing-display-3)",
            fontWeight: "var(--hs-font-weight-display-3)",
          },
        ],
        "hs-base-small": [
          "var(--hs-font-size-base-small)",
          {
            lineHeight: "var(--hs-line-height-base-small)",
            letterSpacing: "var(--hs-letter-spacing-base-small)",
            fontWeight: "var(--hs-font-weight-base-small)",
          },
        ],
        "hs-base-medium": [
          "var(--hs-font-size-base-medium)",
          {
            lineHeight: "var(--hs-line-height-base-medium)",
            letterSpacing: "var(--hs-letter-spacing-base-medium)",
            fontWeight: "var(--hs-font-weight-base-medium)",
          },
        ],
        "hs-strong-medium": [
          "var(--hs-font-size-strong-medium)",
          {
            lineHeight: "var(--hs-line-height-strong-medium)",
            letterSpacing: "var(--hs-letter-spacing-strong-medium)",
            fontWeight: "var(--hs-font-weight-strong-medium)",
          },
        ],
        "hs-button-small": [
          "var(--hs-font-size-button-small)",
          {
            lineHeight: "var(--hs-line-height-button-small)",
            letterSpacing: "var(--hs-letter-spacing-button-small)",
            fontWeight: "var(--hs-font-weight-button-small)",
          },
        ],
        "hs-button-medium": [
          "var(--hs-font-size-button-medium)",
          {
            lineHeight: "var(--hs-line-height-button-medium)",
            letterSpacing: "var(--hs-letter-spacing-button-medium)",
            fontWeight: "var(--hs-font-weight-button-medium)",
          },
        ],
        "hs-link-small": [
          "var(--hs-font-size-link-small)",
          {
            lineHeight: "var(--hs-line-height-link-small)",
            letterSpacing: "var(--hs-letter-spacing-link-small)",
            fontWeight: "var(--hs-font-weight-link-small)",
          },
        ],
        "hs-link-medium": [
          "var(--hs-font-size-link-medium)",
          {
            lineHeight: "var(--hs-line-height-link-medium)",
            letterSpacing: "var(--hs-letter-spacing-link-medium)",
            fontWeight: "var(--hs-font-weight-link-medium)",
          },
        ],
        "hs-label-medium": [
          "var(--hs-font-size-label-medium)",
          {
            lineHeight: "var(--hs-line-height-label-medium)",
            letterSpacing: "var(--hs-letter-spacing-label-medium)",
            fontWeight: "var(--hs-font-weight-label-medium)",
          },
        ],
        "hs-others-label": [
          "var(--hs-font-size-others-label)",
          {
            lineHeight: "var(--hs-line-height-others-label)",
            letterSpacing: "var(--hs-letter-spacing-others-label)",
            fontWeight: "var(--hs-font-weight-others-label)",
          },
        ],
        "hs-timestamp": [
          "var(--hs-font-size-others-timestamp)",
          {
            lineHeight: "var(--hs-line-height-others-timestamp)",
            letterSpacing: "var(--hs-letter-spacing-others-timestamp)",
            fontWeight: "var(--hs-font-weight-others-timestamp)",
          },
        ],
      },
      boxShadow: {
        "hs-raised":
          "var(--hs-shadow-raised)",
        "hs-overlay-top":
          "var(--hs-shadow-overlay-top)",
        "hs-overlay-bottom":
          "var(--hs-shadow-overlay-bottom)",
        "hs-menu":
          "var(--hs-comp-menu-shadow)",
        "hs-overlay-left":
          "var(--hs-shadow-overlay-left)",
        "hs-overlay-right":
          "var(--hs-shadow-overlay-right)",
        "hs-modal": "var(--hs-shadow-modal)",
      },
      width: {
        "hs-2": "var(--hs-size-2)",
        "hs-3": "var(--hs-size-3)",
        "hs-4": "var(--hs-size-4)",
        "hs-6": "var(--hs-size-6)",
        "hs-8": "var(--hs-size-8)",
        "hs-10": "var(--hs-size-10)",
        "hs-12": "var(--hs-size-12)",
        "hs-14": "var(--hs-size-14)",
        "hs-16": "var(--hs-size-16)",
        "hs-18": "var(--hs-size-18)",
      },
      height: {
        "hs-2": "var(--hs-size-2)",
        "hs-3": "var(--hs-size-3)",
        "hs-4": "var(--hs-size-4)",
        "hs-6": "var(--hs-size-6)",
        "hs-8": "var(--hs-size-8)",
        "hs-10": "var(--hs-size-10)",
        "hs-12": "var(--hs-size-12)",
        "hs-14": "var(--hs-size-14)",
        "hs-16": "var(--hs-size-16)",
        "hs-18": "var(--hs-size-18)",
      },
    },
  },
  plugins: [],
};

export default config;
