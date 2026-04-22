/**
 * Price ON logo — HTML/CSS + inline SVG power-button icon.
 * No SVG text → no font-rendering issues across environments.
 *
 * variant="light"  → white "Price" + amber "ON"  (dark backgrounds)
 * variant="dark"   → slate  "Price" + amber "ON"  (light backgrounds)
 */
interface LogoProps {
  variant?: 'light' | 'dark'
  height?: number
  className?: string
}

export function Logo({ variant = 'light', height = 36, className }: LogoProps) {
  const priceColor = variant === 'light' ? '#F8FAFC' : '#64748B'
  const fs = Math.round(height * 0.8)          // font-size
  const iconSize = Math.round(height * 0.68)   // power button svg size
  const gap = Math.round(height * 0.06)        // gap between elements

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${gap}px`,
        lineHeight: 1,
      }}
    >
      {/* "Price" */}
      <span
        style={{
          color: priceColor,
          fontWeight: 800,
          fontSize: `${fs}px`,
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        Price
      </span>

      {/* Power-button "O" — inline SVG, no text */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0, display: 'block' }}
      >
        {/* Arc: horseshoe opening at top */}
        <path
          d="M 15 17 A 23 23 0 1 0 49 17"
          stroke="#F6A822"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Vertical stem */}
        <line
          x1="32" y1="3"
          x2="32" y2="27"
          stroke="#F6A822"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>

      {/* "N" */}
      <span
        style={{
          color: '#F6A822',
          fontWeight: 800,
          fontSize: `${fs}px`,
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        N
      </span>
    </span>
  )
}
