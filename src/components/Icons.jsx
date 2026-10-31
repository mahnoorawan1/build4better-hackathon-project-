import React from 'react'

const PATHS = {
  atm: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <rect x="8" y="5" width="8" height="5" rx="1" />
      <path d="M9 13h6M9 16h4" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 9a2 2 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 0 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
      <path d="M13 7v10" />
    </>
  ),
  food: (
    <>
      <path d="M4 12h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z" />
      <path d="M5 12c0-4 3-7 7-7s7 3 7 7" />
      <path d="M9 5V3M12 5V2M15 5V3" />
    </>
  ),
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
  listen: (
    <>
      <path d="M4 10v4h3l5 4V6L7 10H4z" />
      <path d="M16 9a3 3 0 0 1 0 6" />
      <path d="M17.5 7a5.5 5.5 0 0 1 0 10" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.7.4-1.4 1-1.4 2.2" />
      <path d="M12 17h.01" />
    </>
  ),
  textSize: (
    <>
      <path d="M5 18V7h5M7.5 18h0" />
      <path d="M12 18V9h7M15.5 18h0" />
      <path d="M5 10h5M12 12h7" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7 9v6M17 9v6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 16V10M12 16V7M16 16v-4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v5h-5" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.8 2.8L16.5 9" />
    </>
  ),
  back: (
    <>
      <path d="M15 6 9 12l6 6" />
    </>
  ),
  cancel: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  keypad: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h.01M12 7h.01M16 7h.01M8 12h.01M12 12h.01M16 12h.01M8 17h.01M12 17h.01M16 17h.01" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L18 10l-4-4L4 16v4z" />
      <path d="m12 8 4 4" />
    </>
  ),
  station: (
    <>
      <path d="M6 20V8a6 6 0 0 1 12 0v12" />
      <path d="M4 20h16" />
      <path d="M9 12h6M9 16h6" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="15" cy="20" r="1.5" />
    </>
  ),
  destination: (
    <>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3 22 20H2L12 3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  oneWay: (
    <>
      <path d="M4 12h14" />
      <path d="m14 7 5 5-5 5" />
    </>
  ),
  roundTrip: (
    <>
      <path d="M4 9h13l-3-3" />
      <path d="M20 15H7l3 3" />
    </>
  ),
  seat: (
    <>
      <path d="M6 10V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" />
      <path d="M4 14h16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M8 19v2M16 19v2" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </>
  ),
  idCard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2.5" />
      <path d="M14 10h5M14 14h4" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  minus: (
    <>
      <path d="M5 12h14" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 11h11.2L21 8H7" />
    </>
  ),
  dine: (
    <>
      <path d="M7 3v8a2 2 0 0 0 2 2v8" />
      <path d="M5 3v4M9 3v4" />
      <path d="M15 3c2 2 2 5 2 8v10M15 3v8h4" />
    </>
  ),
  takeaway: (
    <>
      <path d="M6 9h12l-1 11H7L6 9z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </>
  ),
  burger: (
    <>
      <path d="M5 11h14" />
      <path d="M5 14h14" />
      <path d="M6 11a6 4 0 0 1 12 0" />
      <path d="M6 14v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
    </>
  ),
  fries: (
    <>
      <path d="M7 10h10l-1.5 11h-7z" />
      <path d="M9 10V5M12 10V4M15 10V6" />
    </>
  ),
  drink: (
    <>
      <path d="M8 8h8l-1.2 12H9.2z" />
      <path d="M9 4h6l1 4H8z" />
      <path d="M12 2v2" />
    </>
  ),
  dessert: (
    <>
      <path d="M6 14c0 4 2.7 6 6 6s6-2 6-6" />
      <path d="M5 14h14" />
      <path d="M8 14c1-4 2-7 4-9 2 2 3 5 4 9" />
    </>
  ),
  star: (
    <>
      <path d="m12 3 2.4 5.4 5.8.6-4.4 3.8 1.3 5.7L12 15.8 6.9 18.5l1.3-5.7L3.8 9l5.8-.6z" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M6 3v16" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.8 2.8L16.5 9" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
}

export default function Icon({ name, className = '', size = 22, label }) {
  const content = PATHS[name]
  if (!content) return null

  return (
    <svg
      className={`ui-icon ui-icon-${name} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {content}
    </svg>
  )
}
