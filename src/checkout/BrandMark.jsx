import React from 'react'

/**
 * BrandMark — real(ish) brand tile icons for Indian payment services.
 * Each mark is hand-crafted inline SVG/CSS, sized consistently, brand-accurate
 * enough to be instantly recognizable at small sizes.
 *
 * Usage: <BrandMark kind="upi" id="gpay" size={44} />
 */

// ── Shared tile wrapper ─────────────────────────────────────────
function Tile({ size = 44, bg, border = false, children, ring, overflow = 'hidden' }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 relative"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: bg,
        overflow,
        boxShadow: border
          ? '0 1px 2px rgba(10,19,48,.1), inset 0 0 0 1px rgba(10,19,48,.1)'
          : '0 2px 10px rgba(10,19,48,.15), inset 0 1px 0 rgba(255,255,255,.15)',
        outline: ring ? `2px solid ${ring}` : 'none'
      }}
    >
      {children}
    </div>
  )
}

// ── UPI APPS ────────────────────────────────────────────────────
function GPay({ size }) {
  return (
    <Tile size={size} bg="#fff" border>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 48 48">
        <path fill="#4285F4" d="M45.1 24.5c0-1.5-.1-2.9-.4-4.3H24v8.1h11.8c-.5 2.7-2 5-4.3 6.6v5.5h7c4.1-3.8 6.6-9.3 6.6-15.9z" />
        <path fill="#34A853" d="M24 46c5.8 0 10.6-1.9 14.2-5.2l-7-5.5c-1.9 1.3-4.4 2.1-7.2 2.1-5.5 0-10.2-3.7-11.9-8.7H4.9v5.5C8.5 41.4 15.7 46 24 46z" />
        <path fill="#FBBC05" d="M12.1 28.7c-.5-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.5H4.9C3.3 17.8 2.4 20.8 2.4 24.5s.9 6.7 2.5 9.7l7.2-5.5z" />
        <path fill="#EA4335" d="M24 11.6c3.2 0 6 1.1 8.2 3.2l6.1-6.1C34.6 5.1 29.8 3 24 3 15.7 3 8.5 7.6 4.9 14.8l7.2 5.5c1.7-5 6.4-8.7 11.9-8.7z" />
      </svg>
    </Tile>
  )
}

function PhonePe({ size }) {
  return (
    <Tile size={size} bg="#5F259F">
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62}>
        <circle cx="12" cy="12" r="11" fill="#5F259F" />
        <path
          fill="#fff"
          d="M16.4 9.5h-2.6V8.4c0-.5.4-.7.7-.7h1V5.8h-1.4c-1.3 0-2.2.9-2.2 2.2v1.5H9.1v1.9h2.8v5.3c0 .5-.3.7-.7.7-.7 0-1.7-.4-2.3-.9v2c.6.4 1.6.7 2.6.7 1.6 0 2.6-.8 2.6-2.5v-5.3h1.7l.6-1.9z"
        />
      </svg>
    </Tile>
  )
}

function Paytm({ size }) {
  return (
    <Tile size={size} bg="#fff" border>
      <div className="flex flex-col items-center justify-center leading-none">
        <div style={{ fontSize: size * 0.24, fontWeight: 900, color: '#002E6E', letterSpacing: -0.5, lineHeight: 1 }}>pay</div>
        <div style={{ fontSize: size * 0.24, fontWeight: 900, color: '#00BAF2', letterSpacing: -0.5, marginTop: 1, lineHeight: 1 }}>tm</div>
      </div>
    </Tile>
  )
}

function BHIM({ size }) {
  return (
    <Tile size={size} bg="#fff" border>
      <svg viewBox="0 0 40 40" width={size * 0.72} height={size * 0.72}>
        <circle cx="20" cy="20" r="16" fill="#00747D" />
        <text x="20" y="25" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900" fontFamily="system-ui">BHIM</text>
      </svg>
    </Tile>
  )
}

function CRED({ size }) {
  return (
    <Tile size={size} bg="#0A0A0A">
      <svg viewBox="0 0 40 40" width={size * 0.62} height={size * 0.62}>
        <path
          fill="#D4AF37"
          d="M20 6l12 8-12 20L8 14 20 6zm0 3.5L11.5 15 20 28l8.5-13L20 9.5z"
        />
      </svg>
    </Tile>
  )
}

function AmazonPay({ size }) {
  return (
    <Tile size={size} bg="#232F3E">
      <div className="flex flex-col items-center leading-none">
        <div style={{ fontSize: size * 0.22, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>amazon</div>
        <svg width={size * 0.52} height={size * 0.12} viewBox="0 0 40 8" style={{ marginTop: 1 }}>
          <path d="M2 3c4 4 12 4 18 2s14-2 18 0" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M34 2l4 1.5-3 2.5" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div style={{ fontSize: size * 0.16, fontWeight: 700, color: '#FF9900', letterSpacing: 0.2, marginTop: 1 }}>pay</div>
      </div>
    </Tile>
  )
}

// ── WALLETS (some reuse UPI marks) ──────────────────────────────
function MobiKwik({ size }) {
  return (
    <Tile size={size} bg="#1B3A8B">
      <svg viewBox="0 0 40 40" width={size * 0.62} height={size * 0.62}>
        <circle cx="20" cy="20" r="14" fill="#fff" />
        <text x="20" y="25" textAnchor="middle" fill="#1B3A8B" fontSize="14" fontWeight="900" fontFamily="system-ui">Mk</text>
      </svg>
    </Tile>
  )
}

function Freecharge({ size }) {
  return (
    <Tile size={size} bg="#fff" border>
      <svg viewBox="0 0 40 40" width={size * 0.72} height={size * 0.72}>
        <circle cx="20" cy="20" r="14" fill="#EE2A37" />
        <path d="M13 27l7-14 1.5 6 4-1.5L21 27" fill="#fff" />
      </svg>
    </Tile>
  )
}

function AirtelMoney({ size }) {
  return (
    <Tile size={size} bg="#E40000">
      <div style={{ color: 'white', fontSize: size * 0.48, fontWeight: 900, fontStyle: 'italic', letterSpacing: -1 }}>a!</div>
    </Tile>
  )
}

// ── BNPL ────────────────────────────────────────────────────────
function Simpl({ size }) {
  return (
    <Tile size={size} bg="#1B47E5">
      <div style={{ color: 'white', fontSize: size * 0.32, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1 }}>
        simpl
      </div>
    </Tile>
  )
}

function LazyPay({ size }) {
  return (
    <Tile size={size} bg="#7A29A1">
      <div className="flex flex-col items-center leading-none">
        <div style={{ color: 'white', fontSize: size * 0.22, fontWeight: 900, letterSpacing: -0.3 }}>LAZY</div>
        <div style={{ color: '#FFD166', fontSize: size * 0.22, fontWeight: 900, letterSpacing: -0.3, marginTop: 1 }}>PAY</div>
      </div>
    </Tile>
  )
}

function Zest({ size }) {
  return (
    <Tile size={size} bg="#EF4135">
      <svg viewBox="0 0 40 40" width={size * 0.65} height={size * 0.65}>
        <path fill="#fff" d="M14 8h14l-10 14h10l-14 10 10-14H14l10-14z" />
      </svg>
    </Tile>
  )
}

function Snapmint({ size }) {
  return (
    <Tile size={size} bg="#0EA5E9">
      <div style={{ color: 'white', fontSize: size * 0.4, fontWeight: 900, letterSpacing: -1 }}>S</div>
    </Tile>
  )
}

// ── CARD NETWORKS ───────────────────────────────────────────────
function Visa({ size }) {
  return (
    <Tile size={size} bg="#fff" border>
      <div style={{
        color: '#1A1F71',
        fontSize: size * 0.3,
        fontWeight: 900,
        fontStyle: 'italic',
        letterSpacing: -0.5,
        fontFamily: 'system-ui, sans-serif'
      }}>VISA</div>
    </Tile>
  )
}

function MC({ size }) {
  return (
    <Tile size={size} bg="#fff" border>
      <svg viewBox="0 0 40 28" width={size * 0.75} height={size * 0.53}>
        <circle cx="15" cy="14" r="10" fill="#EB001B" />
        <circle cx="25" cy="14" r="10" fill="#F79E1B" />
        <path
          fill="#FF5F00"
          d="M20 6.5a10 10 0 0 1 0 15 10 10 0 0 1 0-15z"
        />
      </svg>
    </Tile>
  )
}

function RuPay({ size }) {
  return (
    <Tile size={size} bg="#fff" border>
      <div className="flex items-baseline leading-none">
        <span style={{ color: '#097969', fontSize: size * 0.26, fontWeight: 900, letterSpacing: -0.3 }}>Ru</span>
        <span style={{ color: '#F47216', fontSize: size * 0.26, fontWeight: 900, letterSpacing: -0.3 }}>Pay»</span>
      </div>
    </Tile>
  )
}

function Amex({ size }) {
  return (
    <Tile size={size} bg="#2E77BB">
      <div style={{
        color: '#fff',
        fontSize: size * 0.2,
        fontWeight: 900,
        letterSpacing: 0.2,
        lineHeight: 1,
        textAlign: 'center'
      }}>
        AMERICAN<br/>EXPRESS
      </div>
    </Tile>
  )
}

// ── BANKS — consistent monogram tile with brand color ───────────
function BankTile({ size, color, short }) {
  return (
    <Tile size={size} bg={color}>
      <div
        className="text-white font-black"
        style={{
          fontSize: size * (short.length > 4 ? 0.22 : short.length > 3 ? 0.26 : 0.3),
          letterSpacing: -0.3,
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        {short}
      </div>
    </Tile>
  )
}

// ── Dispatcher ──────────────────────────────────────────────────
const UPI_MARKS = {
  gpay: GPay,
  phonepe: PhonePe,
  paytm: Paytm,
  bhim: BHIM,
  cred: CRED,
  amazon: AmazonPay
}

const WALLET_MARKS = {
  paytm: Paytm,
  phonepe: PhonePe,
  amazon: AmazonPay,
  mobikwik: MobiKwik,
  freecharge: Freecharge,
  airtel: AirtelMoney
}

const BNPL_MARKS = {
  simpl: Simpl,
  lazypay: LazyPay,
  zest: Zest,
  snapmint: Snapmint
}

const NETWORK_MARKS = {
  visa: Visa,
  mastercard: MC,
  rupay: RuPay,
  amex: Amex
}

export default function BrandMark({ kind, id, brand, size = 44 }) {
  let Mark = null
  if (kind === 'upi')     Mark = UPI_MARKS[id]
  if (kind === 'wallet')  Mark = WALLET_MARKS[id]
  if (kind === 'bnpl')    Mark = BNPL_MARKS[id]
  if (kind === 'network') Mark = NETWORK_MARKS[id]

  if (Mark) return <Mark size={size} />

  // Bank fallback — consistent monogram tile
  if (kind === 'bank' && brand) {
    return <BankTile size={size} color={brand.color} short={brand.short} />
  }

  // Generic fallback (shouldn't usually trigger)
  return (
    <Tile size={size} bg={brand?.color || '#0B5FFF'}>
      <div className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
        {brand?.mark || '?'}
      </div>
    </Tile>
  )
}
