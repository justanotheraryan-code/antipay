import React, { useMemo, useState } from 'react'
import Shell from './Shell.jsx'
import { emiBanks, bnplProviders, order } from './data.js'
import { Info, Percent, Sparkle } from './icons.jsx'
import BrandMark from './BrandMark.jsx'

const TABS = [
  { id: 'card', label: 'Card EMI' },
  { id: 'bnpl', label: 'Pay Later' }
]

function calcEmi(principal, monthlyRate, months) {
  const r = monthlyRate / 100 / 12
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export default function EMIFlow({ onBack, onClose, onPay }) {
  const [tab, setTab] = useState('card')
  const [bankId, setBankId] = useState(emiBanks[0].id)
  const [months, setMonths] = useState(6)
  const [bnplId, setBnplId] = useState(null)

  const bank = emiBanks.find(b => b.id === bankId)
  const fmt = (n) => `${order.currency}${Math.round(n).toLocaleString('en-IN')}`

  const monthly = useMemo(() => calcEmi(order.total, bank.rate, months), [bank, months])
  const totalPayable = monthly * months
  const interest = totalPayable - order.total

  return (
    <Shell title="EMI & Pay Later" onBack={onBack} onClose={onClose}
      footer={
        tab === 'card' ? (
          <button className="btn-primary" onClick={() => onPay({ method: 'emi', bank: bankId, months })}>
            Continue · {fmt(monthly)}/mo × {months}
          </button>
        ) : (
          <button className="btn-primary" disabled={!bnplId} onClick={() => onPay({ method: 'bnpl', provider: bnplId })}>
            {bnplId ? `Continue with ${bnplProviders.find(b => b.id === bnplId).name}` : 'Select a provider'}
          </button>
        )
      }
      scrollable
    >
      <div className="relative mb-5 rounded-2xl bg-canvas-subtle p-1 grid grid-cols-2 text-sm font-semibold">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative z-10 py-2.5 rounded-xl transition ${tab === t.id ? 'text-brand-700' : 'text-ink-500 hover:text-ink-700'}`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-0 -z-10 rounded-xl bg-canvas-card shadow-card border border-ink-100/60" />
            )}
          </button>
        ))}
      </div>

      {tab === 'card' && (
        <div className="animate-slide-up">
          <div className="label-eyebrow mb-2">Choose your bank</div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scroll-soft">
            {emiBanks.map(b => (
              <button
                key={b.id}
                onClick={() => { setBankId(b.id); if (!b.months.includes(months)) setMonths(b.months[0]) }}
                className={`shrink-0 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition
                  ${bankId === b.id ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-100 bg-canvas-card text-ink-700 hover:border-brand-200'}`}
              >
                {b.name}
              </button>
            ))}
          </div>

          <div className="label-eyebrow mt-4 mb-2">Tenure</div>
          <div className="grid grid-cols-3 gap-2">
            {bank.months.map(m => {
              const emi = calcEmi(order.total, bank.rate, m)
              return (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`rounded-2xl border px-2 py-2.5 text-center transition
                    ${months === m ? 'border-brand-600 bg-brand-50 -translate-y-0.5 shadow-card' : 'border-ink-100 bg-canvas-card hover:border-brand-200'}`}
                >
                  <div className="text-xs font-bold text-ink-900">{m} mo</div>
                  <div className="text-[10px] text-ink-500 tnum mt-0.5">{fmt(emi)}/mo</div>
                </button>
              )
            })}
          </div>

          <div className="mt-5 rounded-3xl border border-ink-100 bg-gradient-to-br from-brand-50 to-canvas-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-ink-500 font-semibold uppercase tracking-wider">Monthly EMI</div>
                <div className="tnum text-2xl font-bold text-ink-900">{fmt(monthly)}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-ink-500 font-semibold uppercase tracking-wider">Tenure</div>
                <div className="tnum text-lg font-bold text-ink-900">{months} months</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-ink-100/60 grid grid-cols-3 gap-2 text-xs">
              <Mini label="Principal" value={fmt(order.total)} />
              <Mini label="Interest" value={fmt(interest)} accent />
              <Mini label="Total" value={fmt(totalPayable)} bold />
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 chip bg-success-50 text-success-500">
              <Percent width={12} height={12} /> {bank.rate}% p.a. interest
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 text-xs text-ink-500 bg-canvas-subtle rounded-2xl px-3 py-2.5">
            <Info width={14} height={14} className="mt-0.5 shrink-0" />
            <span>EMI is charged by your bank. We confirm eligibility from your card BIN before proceeding.</span>
          </div>
        </div>
      )}

      {tab === 'bnpl' && (
        <div className="animate-slide-up space-y-2.5">
          {bnplProviders.map(p => {
            const active = bnplId === p.id
            return (
              <button
                key={p.id}
                onClick={() => setBnplId(p.id)}
                className={`w-full flex items-center gap-3 rounded-3xl px-4 py-3.5 text-left transition border
                  ${active ? 'border-brand-600 bg-brand-50 shadow-card -translate-y-0.5' : 'border-ink-100 bg-canvas-card hover:border-brand-200 hover:-translate-y-0.5'}`}
              >
                <BrandMark kind="bnpl" id={p.id} brand={p} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink-900">{p.name}</div>
                  <div className="text-[11px] text-ink-500">{p.tagline}</div>
                </div>
                {p.id === 'simpl' && (
                  <span className="chip bg-success-50 text-success-500">
                    <Sparkle width={10} height={10} /> Popular
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </Shell>
  )
}

function Mini({ label, value, accent, bold }) {
  return (
    <div>
      <div className="text-[10px] text-ink-500 uppercase tracking-wider font-semibold">{label}</div>
      <div className={`tnum ${bold ? 'font-bold text-ink-900' : 'font-semibold'} ${accent ? 'text-warn-500' : 'text-ink-700'}`}>
        {value}
      </div>
    </div>
  )
}
