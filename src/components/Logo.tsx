export function Logo() {
  return (
    <div className="logo-mark" aria-label="CAVVE" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22M12 2L22 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
        <text x="32" y="19" fill="currentColor" style={{ font: '800 20px var(--font-main)', letterSpacing: '-0.04em' }}>CAVVE</text>
      </svg>
    </div>
  )
}

