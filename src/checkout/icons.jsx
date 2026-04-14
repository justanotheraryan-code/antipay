import React from 'react'

const base = { width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Lock = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
export const ChevronLeft = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M15 18l-6-6 6-6" /></svg>
)
export const ChevronRight = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M9 18l6-6-6-6" /></svg>
)
export const ChevronDown = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>
)
export const Check = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 12l5 5L20 6" /></svg>
)
export const X = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const Bolt = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>
)
export const Card = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h3" />
  </svg>
)
export const Bank = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3 10l9-6 9 6" /><path d="M5 10v8M19 10v8M9 10v8M15 10v8M3 20h18" />
  </svg>
)
export const Wallet = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12.5h2" /><path d="M3 9h14" />
  </svg>
)
export const Calendar = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)
export const Copy = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
)
export const Download = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 4v12" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" />
  </svg>
)
export const Sparkle = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
  </svg>
)
export const Refresh = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" />
  </svg>
)
export const Info = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" />
  </svg>
)
export const ShieldCheck = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)
export const Sun = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
  </svg>
)
export const Moon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
  </svg>
)
export const Search = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
  </svg>
)
export const Eye = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
export const Settings = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
)
export const Percent = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 19L19 5" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" />
  </svg>
)
