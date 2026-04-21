/**
 * Price ON logo — inline SVG component.
 * variant="light"  → white "Price" + amber "ON"  (for dark backgrounds)
 * variant="dark"   → slate "Price" + amber "ON"   (for light backgrounds)
 */
interface LogoProps {
  variant?: 'light' | 'dark'
  height?: number
  className?: string
}

export function Logo({ variant = 'light', height = 36, className }: LogoProps) {
  const priceColor = variant === 'light' ? '#F8FAFC' : '#64748B'
  const width = Math.round(height * (400 / 120))

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 120"
      width={width}
      height={height}
      aria-label="Price ON"
      className={className}
    >
      <text
        x="10"
        y="85"
        style={{
          fontFamily: "var(--font-syne), 'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: 72,
        }}
        fill={priceColor}
      >
        Price
      </text>

      {/* Power button "O" */}
      <g transform="translate(210, 30)">
        <path
          d="M 12.5 14.5 A 32 32 0 1 0 51.5 14.5"
          fill="none"
          stroke="#F6A822"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="32" y1="-2" x2="32" y2="28"
          stroke="#F6A822"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      <text
        x="290"
        y="85"
        style={{
          fontFamily: "var(--font-syne), 'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: 72,
        }}
        fill="#F6A822"
      >
        N
      </text>
    </svg>
  )
}
