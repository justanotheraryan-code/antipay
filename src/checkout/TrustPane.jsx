import React, { useState } from 'react'
import { merchant, merchantTrust, sessionTrust } from './data.js'
import { X, ShieldCheck, Check, Info, Lock, Eye, ChevronDown } from './icons.jsx'

/**
 * The Trust Pane — our answer to generic "256-bit secured" badges.
 * A live dashboard with actual verifiable data about who you're paying
 * and what protections are active for THIS transaction.
 */
export default function TrustPane({ open, onClose }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-ink-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] glass sheet sm:rounded-[32px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />

        {/* Header */}
        <div className="px-5 pt-3 sm:pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-success-500 to-brand-600 text-white flex items-center justify-center shadow-pop">
              <ShieldCheck width={18} height={18} />
            </div>
            <div>
              <div className="text-[11px] text-ink-500 font-semibold uppercase tracking-wider">Trust Pane</div>
              <div className="text-sm font-bold text-ink-900">Live verification</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-canvas-subtle text-ink-500 transition"
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        <div className="px-5 pb-5 max-h-[72vh] overflow-y-auto scroll-soft space-y-4">
          {/* Risk score strip */}
          <div className="rounded-2xl bg-gradient-to-br from-success-50 to-canvas-card border border-success-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="label-eyebrow">Risk for this transaction</div>
                <div className="mt-0.5 text-lg font-bold text-success-500 flex items-center gap-2">
                  Low
                  <span className="inline-flex gap-0.5">
                    <Bar fill /><Bar /><Bar /><Bar /><Bar />
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-ink-500">Computed from</div>
                <div className="text-[11px] text-ink-700 font-semibold">14 signals</div>
              </div>
            </div>
          </div>

          {/* Merchant card */}
          <Section title="Who you're paying">
            <MerchantHeader />
            <Row
              label="Legal entity"
              value={merchantTrust.legalName}
              detail={`CIN ${merchantTrust.cin}`}
              verified
            />
            <Row
              label="GST verified"
              value={merchantTrust.gstin}
              detail="Cross-verified with GSTN registry · last checked today"
              verified
            />
            <Row
              label="Incorporated"
              value={`${merchantTrust.yearsActive} years ago (${merchantTrust.incorporated})`}
              detail="Long-standing business reduces fraud risk"
            />
            <Row
              label="Processed last 30 days"
              value={merchantTrust.processed30d}
              detail={`${merchantTrust.orders30d} successful orders`}
            />
            <Row
              label="Dispute rate"
              value={`${merchantTrust.disputeRate}%`}
              detail="Well below industry avg of 0.9%"
              verified
            />
            <Row
              label="Customer rating"
              value={`★ ${merchantTrust.rating}`}
              detail={`${merchantTrust.ratingCount} ratings · ${merchantTrust.categoryRank}`}
            />
          </Section>

          {/* Session card */}
          <Section title="Protecting this transaction">
            <Row
              label="Device"
              value={sessionTrust.device.name}
              detail={`Trusted since ${sessionTrust.device.trustedSince} · fingerprint ${sessionTrust.device.fingerprint}`}
              icon={<CheckIcon />}
            />
            <Row
              label="Network"
              value={`${sessionTrust.network.label} · ${sessionTrust.network.city}`}
              detail={`IP ${sessionTrust.network.ip} · ${sessionTrust.network.vpn ? 'VPN detected' : 'No VPN · matches your usual network'}`}
              icon={<CheckIcon />}
            />
            <Row
              label="Card storage"
              value={sessionTrust.card.provider}
              detail={`Card number replaced with a token. Actual PAN never touches our servers.`}
              icon={<CheckIcon />}
            />
            <Row
              label="Biometric"
              value={`${sessionTrust.biometric.method} available`}
              detail="Required if the amount exceeds your guardrail threshold"
              icon={<CheckIcon />}
            />
            <Row
              label="Transit"
              value={sessionTrust.transit.tls}
              detail={`Encrypted end-to-end · certified by ${sessionTrust.transit.cert}`}
              icon={<CheckIcon />}
            />
          </Section>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-ink-500">
            <span className="flex items-center gap-1">
              <Lock width={12} height={12} />
              Data refreshed 2 seconds ago
            </span>
            <a href="#" className="font-semibold text-brand-700 hover:underline">How we verify →</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function MerchantHeader() {
  return (
    <div className="flex items-center gap-3 pb-3 mb-2 border-b border-ink-100/70">
      <div
        className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-card"
        style={{ background: merchant.brandHex }}
      >
        {merchant.logoChar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold text-ink-900 truncate">{merchant.name}</span>
          <span className="inline-flex items-center gap-1 chip bg-success-50 text-success-500 !py-0.5">
            <ShieldCheck width={10} height={10} /> Verified
          </span>
        </div>
        <div className="text-[11px] text-ink-500">{merchantTrust.verifiedBadge} · {merchantTrust.categoryRank}</div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-3xl bg-canvas-card border border-ink-100/60 p-4 shadow-card">
      <div className="label-eyebrow mb-3">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Row({ label, value, detail, verified, icon }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full text-left py-2.5 border-b border-ink-100/60 last:border-0 group"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-ink-500 font-semibold uppercase tracking-wider">{label}</div>
          <div className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
            {value}
            {verified && <ShieldCheck width={12} height={12} className="text-success-500" />}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-ink-300">
          {icon || <Info width={14} height={14} />}
          <ChevronDown width={14} height={14} className={`transition ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {open && detail && (
        <div className="mt-2 rounded-xl bg-canvas-subtle border border-ink-100 px-3 py-2 text-[11px] text-ink-700 animate-slide-up">
          {detail}
        </div>
      )}
    </button>
  )
}

function CheckIcon() {
  return (
    <span className="h-4 w-4 rounded-full bg-success-500/15 text-success-500 flex items-center justify-center">
      <Check width={10} height={10} strokeWidth={3} />
    </span>
  )
}

function Bar({ fill }) {
  return (
    <span className={`h-3 w-1 rounded-full ${fill ? 'bg-success-500' : 'bg-ink-100'}`} />
  )
}
