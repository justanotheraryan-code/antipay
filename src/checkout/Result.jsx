import React, { useEffect, useState, useMemo } from 'react'
import Shell from './Shell.jsx'
import { order, merchant, savedCards, failureReasons } from './data.js'
import { Check, X, Copy, Download, Sparkle, ShieldCheck, ChevronRight, Lock } from './icons.jsx'
import Confetti from './Confetti.jsx'

// ──────────────────────────────────────────────────────────────
//  SUCCESS — Ownable Receipt
//  A designed, shareable payment card. Not a disappearing modal.
// ──────────────────────────────────────────────────────────────
export function Success({ onDone, onRestart, isFirstTime = false, streak = 3 }) {
  const [count, setCount] = useState(8)
  useEffect(() => {
    const t = setInterval(() => setCount(c => (c > 0 ? c - 1 : 0)), 1000)
    const r = setTimeout(() => onDone?.(), 8200)
    return () => { clearInterval(t); clearTimeout(r) }
  }, [onDone])

  const txnId = 'T2026041412345'
  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`
  const verifyUrl = `anti.in/v/${txnId}`

  return (
    <Shell title={null} onBack={onRestart} onClose={onRestart} showAmount={false}>
      <div className="flex flex-col items-center text-center pt-1 pb-2 relative">
        {isFirstTime && (
          <div className="absolute left-1/2 top-14 -translate-x-1/2 pointer-events-none">
            <Confetti count={46} />
          </div>
        )}

        {/* ── THE RECEIPT CARD — the thing you save/share ── */}
        <div className="w-full relative z-10 rounded-[28px] overflow-hidden shadow-pop border border-white/30 animate-pop"
          style={{
            background: `linear-gradient(155deg, ${merchant.brandHex} 0%, #1a0e2e 60%, #0b1240 100%)`
          }}
        >
          {/* Animated sheen */}
          <div className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,.55) 50%, transparent 65%)',
              backgroundSize: '220% 100%',
              animation: 'sheen 6s linear infinite'
            }}
          />
          {/* Corner ornament */}
          <div className="absolute top-0 right-0 h-24 w-24 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at top right, rgba(255,255,255,.3) 0%, transparent 60%)'
            }}
          />

          <div className="relative p-5 text-white">
            {/* Top row: verified badge + check */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                  <span className="font-bold text-sm">{merchant.logoChar}</span>
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-[0.12em] font-bold opacity-75">Paid to</div>
                  <div className="text-sm font-bold">{merchant.name}</div>
                </div>
              </div>
              <div className="h-11 w-11 rounded-full bg-success-500 flex items-center justify-center shadow-pop ring-4 ring-white/15">
                <Check width={22} height={22} strokeWidth={3} />
              </div>
            </div>

            {/* Big amount — the hero */}
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-70 font-bold">Amount paid</div>
              <div className="tnum text-[44px] font-black leading-none mt-0.5 drop-shadow-sm">
                {fmt(order.total)}
              </div>
              <div className="mt-1 text-[11px] opacity-80">14 Apr 2026 · 4:32 PM IST</div>
            </div>

            {/* Bottom verification row */}
            <div className="mt-6 pt-4 border-t border-white/20 flex items-end justify-between">
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider opacity-70 font-bold">Txn ID</div>
                <div className="tnum text-[11px] font-semibold font-mono">{txnId}</div>
                <div className="text-[9px] uppercase tracking-wider opacity-70 font-bold mt-2">Verify at</div>
                <div className="tnum text-[10px] font-mono opacity-90">{verifyUrl}</div>
              </div>
              <VerifyMark />
            </div>

            {/* Anti watermark */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] opacity-60">
              <Lock width={9} height={9} />
              <span className="font-semibold tracking-wide uppercase">Signed by Anti · Tamper-proof</span>
            </div>
          </div>
        </div>

        {/* Success blurb — smaller, below the receipt */}
        <div className="mt-4 text-base font-bold text-ink-900">Payment successful</div>
        {isFirstTime ? (
          <div className="text-xs text-ink-500 mt-0.5">👋 Welcome to {merchant.name} · receipt saved to your wallet</div>
        ) : (
          <div className="text-xs text-ink-500 mt-0.5 flex items-center gap-1.5 justify-center">
            <span>{ordinal(streak)} order here · on a streak 🔥</span>
          </div>
        )}

        {/* Ownership actions */}
        <div className="mt-4 w-full grid grid-cols-3 gap-2">
          <ActionButton icon={<Download width={14} height={14} />} label="Save" />
          <ActionButton icon={<ShareIcon />} label="Share" />
          <ActionButton icon={<Copy width={14} height={14} />} label="Copy ID" />
        </div>

        <div className="mt-3 w-full rounded-xl bg-canvas-subtle px-3 py-2 text-[11px] text-ink-500 flex items-center gap-1.5 justify-center">
          <ShieldCheck width={12} height={12} className="text-success-500" />
          This receipt is cryptographically signed. You own it.
        </div>

        <div className="mt-3 text-[11px] text-ink-500">
          Returning to {merchant.name} in <span className="tnum font-semibold text-ink-900">{count}s</span>
        </div>
      </div>
    </Shell>
  )
}

function VerifyMark() {
  // A decorative "verification QR" — purely visual
  const cells = []
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const edge = (x === 0 || x === 8 || y === 0 || y === 8)
      const on = edge || ((x * 13 + y * 7 + x * y) % 3 === 0)
      cells.push(
        <rect key={`${x}-${y}`} x={x * 6} y={y * 6} width="6" height="6" fill={on ? 'white' : 'transparent'} rx="1" />
      )
    }
  }
  return (
    <div className="h-[54px] w-[54px] rounded-xl bg-white/10 backdrop-blur border border-white/25 p-1.5">
      <svg viewBox="0 0 54 54" width="42" height="42">{cells}</svg>
    </div>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  )
}

function ActionButton({ icon, label }) {
  return (
    <button className="flex items-center justify-center gap-1.5 rounded-xl border border-ink-100 bg-canvas-card py-2.5 text-[12px] font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700 transition">
      {icon}
      {label}
    </button>
  )
}

// ──────────────────────────────────────────────────────────────
//  FAILURE — Smart Retry
//  Knows what failed, knows what's available, suggests the fix.
// ──────────────────────────────────────────────────────────────
export function Failure({ reasonKey = 'card_daily_limit', onRetrySaved, onChangeMethod, onClose }) {
  const reason = failureReasons[reasonKey] || failureReasons.card_daily_limit
  // Smart suggestion: pick a different saved card than the one that failed
  const suggestion = useMemo(() => {
    // Mock: suggest the 2nd saved card (ICICI) if reason is card-related
    if (reasonKey.startsWith('card') || reasonKey.startsWith('insufficient')) {
      return savedCards.find(c => c.id === 'sc2') || savedCards[0]
    }
    return null
  }, [reasonKey])

  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`

  return (
    <Shell title={null} onBack={onClose} onClose={onClose} showAmount={false}>
      <div className="flex flex-col items-center text-center pt-2 pb-2">
        {/* Soft failure icon — not scary */}
        <div className="relative h-20 w-20 mb-3">
          <div className="absolute inset-0 rounded-full bg-warn-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-warn-500 text-white flex items-center justify-center animate-pop shadow-pop">
              <X width={26} height={26} strokeWidth={3} />
            </div>
          </div>
        </div>

        <div className="text-xl font-bold text-ink-900">{reason.title}</div>
        <div className="mt-1 text-sm text-ink-500 max-w-[320px]">
          {reason.plain}
        </div>

        {/* Reassurance strip */}
        <div className="mt-4 w-full rounded-xl bg-canvas-subtle border border-ink-100 px-3 py-2 text-[11px] text-ink-700 flex items-center gap-2">
          <ShieldCheck width={14} height={14} className="text-success-500 shrink-0" />
          <span>No money was deducted. Any pending debit auto-reverses within 24h.</span>
        </div>

        {/* ── SMART SUGGESTION — the differentiator ── */}
        {suggestion && (
          <div className="mt-4 w-full rounded-3xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-canvas-card p-4 animate-slide-up relative overflow-hidden">
            <div className="absolute top-3 right-3 chip bg-brand-600 text-white !text-[9px]">SUGGESTED</div>
            <div className="label-eyebrow text-brand-700 flex items-center gap-1">
              <Sparkle width={10} height={10} /> Try this instead
            </div>
            <div className="mt-2 flex items-center gap-3">
              <MiniCard card={suggestion} />
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-ink-900">
                  {suggestion.bank} ·••• {suggestion.last4}
                </div>
                <div className="text-[11px] text-ink-500">
                  {suggestion.nickname} · has {fmt(47200)} available
                </div>
              </div>
            </div>
            <button
              onClick={() => onRetrySaved?.(suggestion)}
              className="btn-primary mt-4"
            >
              <Lock width={14} height={14} />
              Retry with {suggestion.nickname} · one tap
            </button>
            <div className="mt-2 text-[10px] text-ink-500 text-center">
              Uses biometric + saved CVV-less token. No re-entry needed.
            </div>
          </div>
        )}

        <button onClick={onChangeMethod} className="btn-ghost w-full mt-3">
          Choose a different method
        </button>
        <button onClick={onClose} className="mt-2 text-[11px] text-ink-500 hover:text-ink-700">
          Cancel payment
        </button>

        <div className="mt-3 text-[9px] text-ink-300 font-mono">Error code: {reason.code}</div>
      </div>
    </Shell>
  )
}

function MiniCard({ card }) {
  const bg = card.network === 'visa' ? '#1A1F71'
    : card.network === 'mastercard' ? '#EB001B'
    : card.network === 'rupay' ? '#097969'
    : '#2E77BB'
  return (
    <div
      className="h-12 w-16 rounded-xl flex items-end justify-end p-1.5 text-white shadow-card shrink-0 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${bg} 0%, #000 160%)` }}
    >
      <div className="absolute top-1 left-1 h-2 w-3 rounded-[2px] bg-yellow-300/85" />
      <div className="text-[8px] font-bold tracking-wider uppercase">{card.network}</div>
    </div>
  )
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
