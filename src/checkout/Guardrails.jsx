import React, { useMemo, useState } from 'react'
import { guardrails, order } from './data.js'
import { ShieldCheck, Check, X as XIcon, Info } from './icons.jsx'

/**
 * Guardrails — user-set rules, visibly enforced at checkout time.
 * Confidence = seeing your own rules fire in real time.
 */
export default function Guardrails({ compact = false, method = 'card', defaultOpen = false }) {
  const checks = useMemo(() => evaluateRules(order.total, method), [method])
  const [open, setOpen] = useState(defaultOpen)

  const allPass = checks.every(c => c.pass)
  const visible = compact ? checks.filter(c => c.highlight).slice(0, 2) : checks

  return (
    <div className="mt-3">
      {/* Summary bar */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 rounded-2xl border px-3 py-2 text-left transition
          ${allPass
            ? 'border-success-500/25 bg-success-50/60 hover:bg-success-50'
            : 'border-warn-500/35 bg-warn-50 hover:bg-warn-50/80'}`}
      >
        <div className={`h-7 w-7 rounded-lg flex items-center justify-center
          ${allPass ? 'bg-success-500 text-white' : 'bg-warn-500 text-white'}`}>
          <ShieldCheck width={14} height={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">Your guardrails</div>
          <div className="text-[12px] font-semibold text-ink-900 truncate">
            {allPass
              ? `${checks.length} rules passed · you're protected`
              : 'One rule needs your attention'}
          </div>
        </div>
        <span className={`text-[10px] font-bold tnum ${allPass ? 'text-success-500' : 'text-warn-500'}`}>
          {checks.filter(c => c.pass).length}/{checks.length}
        </span>
      </button>

      {/* Expanded view — each rule as a chip row */}
      {open && (
        <div className="mt-2 space-y-1.5 animate-slide-up">
          {visible.map((c, i) => (
            <RuleRow key={i} check={c} />
          ))}
          <a href="#" className="block text-[11px] text-brand-700 font-semibold hover:underline px-1 pt-1">
            Edit my rules →
          </a>
        </div>
      )}
    </div>
  )
}

function RuleRow({ check }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-[12px]
      ${check.pass
        ? 'border-ink-100 bg-canvas-card'
        : 'border-warn-500/30 bg-warn-50'}`}
    >
      <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0
        ${check.pass ? 'bg-success-500 text-white' : 'bg-warn-500 text-white'}`}>
        {check.pass ? <Check width={10} height={10} strokeWidth={3} /> : <XIcon width={10} height={10} strokeWidth={3} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink-900">{check.label}</div>
        <div className="text-[11px] text-ink-500">{check.detail}</div>
      </div>
    </div>
  )
}

function evaluateRules(amount, method) {
  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`
  const rules = []

  // Biometric threshold
  rules.push({
    label: `Amount ${amount >= guardrails.biometricAbove ? 'exceeds' : 'under'} ${fmt(guardrails.biometricAbove)} biometric line`,
    detail: amount >= guardrails.biometricAbove
      ? 'Windows Hello / Face ID will be required before approval'
      : 'No biometric step-up needed for this amount',
    pass: true,
    highlight: true
  })

  // Daily cap
  if (method === 'card') {
    const used = guardrails.usedToday.cards
    const remaining = guardrails.dailyCapCards - used - amount
    rules.push({
      label: remaining >= 0
        ? `Daily cards cap: ${fmt(remaining)} left after this`
        : `Daily cards cap exceeded by ${fmt(-remaining)}`,
      detail: `Your rule: max ${fmt(guardrails.dailyCapCards)} per day on cards`,
      pass: remaining >= 0,
      highlight: true
    })
  } else if (method === 'upi') {
    const used = guardrails.usedToday.upi
    const remaining = guardrails.dailyCapUpi - used - amount
    rules.push({
      label: remaining >= 0
        ? `Daily UPI cap: ${fmt(remaining)} left after this`
        : `Daily UPI cap exceeded by ${fmt(-remaining)}`,
      detail: `Your rule: max ${fmt(guardrails.dailyCapUpi)} per day on UPI`,
      pass: remaining >= 0,
      highlight: true
    })
  }

  // Time-of-day block for new merchants
  const isNewMerchant = !guardrails.merchantsWhitelisted.includes('nykaa')
  const hour = new Date().getHours()
  const blockHour = parseInt(guardrails.blockNewMerchantsAfter.split(':')[0], 10)
  if (isNewMerchant && hour >= blockHour) {
    rules.push({
      label: `New merchant blocked after ${guardrails.blockNewMerchantsAfter}`,
      detail: 'Your rule prevents payments to unfamiliar merchants late night',
      pass: false
    })
  } else {
    rules.push({
      label: 'Merchant is on your trusted list',
      detail: 'Nykaa · whitelisted · no late-night block applies',
      pass: true
    })
  }

  return rules
}
