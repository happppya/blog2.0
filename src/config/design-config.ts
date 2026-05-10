
export const TIER_CONFIG = {
  Regular: {
    color: "var(--color-secondary)",
    glow: "var(--color-secondary-glow, rgba(182, 207, 250, 0.4))",
  },
  Featured: {
    color: "var(--color-primary)",
    glow: "var(--color-primary-glow)",
  },
  Legendary: {
    color: "var(--color-legendary, #d946ef)", 
    glow: "var(--color-legendary-glow, rgba(217, 70, 239, 0.5))",
  },
} as const;

export type TierLevel = keyof typeof TIER_CONFIG;