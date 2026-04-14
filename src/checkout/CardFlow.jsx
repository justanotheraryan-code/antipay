import React, { useMemo, useState, useRef } from 'react'
import Shell from './Shell.jsx'
import { order, merchant, savedCards } from './data.js'
import { Lock, ShieldCheck, Check, ChevronRight } from './icons.jsx'

function detectNetwork(num) {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^(60|65|81|82|508|353|356)/.test(n)) return 'rupay'
  if (/^3[47]/.test(n)) return 'amex'
  return null
}

const NETWORK_META = {
  visa:       { label: 'VISA',  color: '#1A1F71', text: '#FFFFFF' },
  mastercard: { label: 'MC',    color: '#EB001B', text: '#FFFFFF' },
  rupay:      { label: 'RuPay', color: '#097969', text: '#FFFFFF' },
  amex:       { label: 'AMEX',  color: '#2E77BB', text: '#FFFFFF' }
}

function luhnValid(num) {
  const n = num.replace(/\s/g, '')
  if (n.length < 12) return false
  let sum = 0, alt = false
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10)
    if (alt) { d *= 2; if (d > 9) d -= 9 }
    sum += d; alt = !alt
  }
  return sum % 10 === 0
}

function formatCardNumber(v, network) {
  const digits = v.replace(/\D/g, '').slice(0, network === 'amex' ? 15 : 16)
  if (network === 'amex') {
    return digits.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '))
  }
  return digits.replace(/(\d{4})/g, '$1 ').trim()
}

function formatExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length < 3) return d
  return d.slice(0, 2) + '/' + d.slice(2)
}

export default function CardFlow({ onBack, onClose, onPay, onFail }) {
  const [view, setView] = useState(savedCards.length > 0 ? 'list' : 'new')
  const [activeCardId, setActiveCardId] = useState(null)

  const [num, setNum] = useState('')
  const [exp, setExp] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [save, setSave] = useState(true)
  const [show3ds, setShow3ds] = useState(false)

  const expRef = useRef(null)
  const cvvRef = useRef(null)

  const network = useMemo(() => detectNetwork(num), [num])
  const meta = network ? NETWORK_META[network] : null
  const numValid = luhnValid(num)
  const expValid = /^\d{2}\/\d{2}$/.test(exp) && (() => {
    const [mm, yy] = exp.split('/').map(Number)
    if (mm < 1 || mm > 12) return false
    const now = new Date()
    const exDate = new Date(2000 + yy, mm - 1, 1)
    return exDate >= new Date(now.getFullYear(), now.getMonth(), 1)
  })()
  const cvvLen = network === 'amex' ? 4 : 3
  const cvvValid = cvv.length === cvvLen
  const nameValid = name.trim().length >= 2
  const formValid = numValid && expValid && cvvValid && nameValid

  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`

  const handleNumChange = (e) => {
    const formatted = formatCardNumber(e.target.value, network)
    setNum(formatted)
    const digits = formatted.replace(/\s/g, '')
    if ((network === 'amex' && digits.length === 15) || (network !== 'amex' && digits.length === 16)) {
      expRef.current?.focus()
    }
  }
  const handleExpChange = (e) => {
    const f = formatExpiry(e.target.value)
    setExp(f)
    if (f.length === 5) cvvRef.current?.focus()
  }

  const submit = () => {
    if (!formValid) return
    setShow3ds(true)
  }

  // ── Saved cards (list view) ───────────────────────────────────
  if (view === 'list') {
    return (
      <Shell title="Pay with a card" onBack={onBack} onClose={onClose}>
        <div className="label-eyebrow mb-2">Saved cards</div>
        <div className="space-y-2">
          {savedCards.map(c => (
            <SavedCardRow
              key={c.id}
              card={c}
              onClick={() => { setActiveCardId(c.id); setView('quick') }}
            />
          ))}
        </div>
        <button
          onClick={() => setView('new')}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-100 py-3.5 text-sm font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700 transition"
        >
          + Add a new card
        </button>

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-ink-500">
          <ShieldCheck width={12} height={12} className="text-success-500" />
          Cards stored as RBI Network Tokens. CVV needed every time.
        </div>
      </Shell>
    )
  }

  if (view === 'quick') {
    const card = savedCards.find(c => c.id === activeCardId)
    return <QuickCvvPay
      card={card}
      onBack={() => setView('list')}
      onClose={onClose}
      onPay={() => setShow3ds(true)}
      show3ds={show3ds}
      onSuccess={() => { setShow3ds(false); onPay({ method: 'card', saved: true, network: card.network }) }}
      onCancel3ds={() => setShow3ds(false)}
      onFail={onFail}
    />
  }

  // ── New card (full form) ──────────────────────────────────────
  return (
    <Shell title="New card" onBack={() => savedCards.length ? setView('list') : onBack()} onClose={onClose}
      footer={
        <button className="btn-primary" disabled={!formValid} onClick={submit}>
          <Lock width={16} height={16} />
          Pay {fmt(order.total)} securely
        </button>
      }
    >
      <CardPreview num={num} exp={exp} name={name} network={network} meta={meta} />

      <div className="space-y-3">
        <div>
          <label className="label-eyebrow">Card number</label>
          <div className="mt-1.5 relative">
            <input
              className="field pr-16 tnum tracking-wider"
              placeholder="1234 5678 9012 3456"
              value={num}
              onChange={handleNumChange}
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={network === 'amex' ? 17 : 19}
            />
            {meta && (
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-[10px] font-bold animate-pop"
                style={{ background: meta.color, color: meta.text }}
              >
                {meta.label}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-eyebrow">Expiry</label>
            <input
              ref={expRef}
              className="field mt-1.5 tnum"
              placeholder="MM/YY"
              value={exp}
              onChange={handleExpChange}
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={5}
            />
          </div>
          <div>
            <label className="label-eyebrow">CVV</label>
            <input
              ref={cvvRef}
              className="field mt-1.5 tnum"
              placeholder={network === 'amex' ? '4 digits' : '3 digits'}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, cvvLen))}
              inputMode="numeric"
              autoComplete="cc-csc"
              type="password"
              maxLength={cvvLen}
            />
          </div>
        </div>

        <div>
          <label className="label-eyebrow">Name on card</label>
          <input
            className="field mt-1.5 uppercase tracking-wide"
            placeholder="ASHA SHARMA"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            autoComplete="cc-name"
          />
        </div>

        <label className="flex items-center gap-3 mt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={save}
            onChange={(e) => setSave(e.target.checked)}
            className="peer sr-only"
          />
          <span className="h-5 w-5 rounded-md border-2 border-ink-100 peer-checked:bg-brand-600 peer-checked:border-brand-600 flex items-center justify-center transition">
            {save && <Check width={14} height={14} className="text-white" strokeWidth={3} />}
          </span>
          <span className="text-xs text-ink-700">
            Save card securely for next time <span className="text-ink-300">(RBI Network Tokenization)</span>
          </span>
        </label>

        <div className="flex items-center gap-1.5 text-[11px] text-ink-500 mt-1">
          <ShieldCheck width={12} height={12} className="text-success-500" />
          We never store your CVV. Encrypted end-to-end.
        </div>
      </div>

      {show3ds && (
        <ThreeDSOverlay
          onSuccess={() => { setShow3ds(false); onPay({ method: 'card', network }) }}
          onCancel={() => setShow3ds(false)}
          onFail={onFail}
        />
      )}
    </Shell>
  )
}

function CardPreview({ num, exp, name, network, meta }) {
  const grouped = num || '•••• •••• •••• ••••'
  return (
    <div className="mb-5 relative">
      <div
        className="relative rounded-3xl p-5 text-white shadow-pop overflow-hidden h-44"
        style={{
          background: meta
            ? `linear-gradient(135deg, ${meta.color} 0%, ${shade(meta.color, -20)} 100%)`
            : 'linear-gradient(135deg, #0B5FFF 0%, #062B7A 100%)',
          transition: 'background 500ms ease'
        }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,.6) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'sheen 5s linear infinite'
          }}
        />
        <div className="flex items-start justify-between relative">
          <div className="flex items-center gap-2">
            <div className="h-7 w-9 rounded-md bg-yellow-300/90 shadow-inner" />
            <div className="text-[10px] uppercase tracking-wider opacity-80 font-semibold">Anti · Secure</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider opacity-80 font-semibold">{meta?.label || 'Card'}</div>
          </div>
        </div>

        <div className="mt-7 tnum text-xl font-semibold tracking-[0.18em]">{grouped}</div>

        <div className="mt-4 flex items-end justify-between text-[11px]">
          <div>
            <div className="opacity-70 uppercase tracking-wider text-[9px]">Cardholder</div>
            <div className="font-semibold tracking-wide truncate max-w-[200px]">{name || 'YOUR NAME'}</div>
          </div>
          <div>
            <div className="opacity-70 uppercase tracking-wider text-[9px]">Expires</div>
            <div className="font-semibold tnum">{exp || 'MM/YY'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SavedCardRow({ card, onClick }) {
  const meta = NETWORK_META[card.network]
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-2xl border border-ink-100 bg-canvas-card px-3 py-3 text-left transition hover:border-brand-400 hover:shadow-card hover:-translate-y-px"
    >
      <div
        className="h-11 w-14 rounded-xl flex items-end justify-end p-1.5 text-white shadow-card shrink-0 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${meta.color} 0%, ${shade(meta.color, -25)} 100%)` }}
      >
        <div className="absolute top-1 left-1 h-2 w-3 rounded-[2px] bg-yellow-300/80" />
        <div className="text-[8px] font-bold tracking-wider">{meta.label}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
          •••• {card.last4}
          <span className="chip bg-canvas-subtle text-ink-500 !py-0.5">{card.nickname}</span>
        </div>
        <div className="text-[11px] text-ink-500">{card.bank} · Exp {card.expiry}</div>
      </div>
      <ChevronRight className="text-ink-300" />
    </button>
  )
}

function QuickCvvPay({ card, onBack, onClose, onPay, show3ds, onSuccess, onCancel3ds, onFail }) {
  const [cvv, setCvv] = useState('')
  const cvvLen = card.network === 'amex' ? 4 : 3
  const valid = cvv.length === cvvLen
  const meta = NETWORK_META[card.network]
  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`

  return (
    <Shell title="Confirm payment" onBack={onBack} onClose={onClose}
      footer={
        <button className="btn-primary" disabled={!valid} onClick={onPay}>
          <Lock width={16} height={16} />
          Pay {fmt(order.total)}
        </button>
      }
    >
      <div
        className="relative rounded-3xl p-5 text-white shadow-pop overflow-hidden h-44 mb-5"
        style={{ background: `linear-gradient(135deg, ${meta.color} 0%, ${shade(meta.color, -25)} 100%)` }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,.6) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'sheen 5s linear infinite'
          }}
        />
        <div className="flex items-start justify-between relative">
          <div className="flex items-center gap-2">
            <div className="h-7 w-9 rounded-md bg-yellow-300/90 shadow-inner" />
            <div className="text-[10px] uppercase tracking-wider opacity-80 font-semibold">{card.bank}</div>
          </div>
          <div className="text-[10px] uppercase tracking-wider opacity-80 font-semibold">{meta.label}</div>
        </div>
        <div className="mt-7 tnum text-xl font-semibold tracking-[0.18em]">•••• •••• •••• {card.last4}</div>
        <div className="mt-4 flex items-end justify-between text-[11px]">
          <div>
            <div className="opacity-70 uppercase tracking-wider text-[9px]">Card</div>
            <div className="font-semibold">{card.nickname}</div>
          </div>
          <div>
            <div className="opacity-70 uppercase tracking-wider text-[9px]">Expires</div>
            <div className="font-semibold tnum">{card.expiry}</div>
          </div>
        </div>
      </div>

      <div>
        <label className="label-eyebrow">Enter CVV to confirm</label>
        <p className="text-xs text-ink-500 mt-1 mb-2">
          The {cvvLen}-digit code on the back of your card
        </p>
        <input
          autoFocus
          className="field tnum tracking-[0.6em] text-center text-xl"
          placeholder={cvvLen === 4 ? '••••' : '•••'}
          value={cvv}
          maxLength={cvvLen}
          inputMode="numeric"
          type="password"
          autoComplete="cc-csc"
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, cvvLen))}
        />
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-500">
          <ShieldCheck width={12} height={12} className="text-success-500" />
          We never store your CVV. End-to-end encrypted.
        </div>
      </div>

      {show3ds && (
        <ThreeDSOverlay
          onSuccess={onSuccess}
          onCancel={onCancel3ds}
          onFail={onFail}
        />
      )}
    </Shell>
  )
}

function shade(hex, percent) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16)
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (c * percent / 100))))
  return `rgb(${f(r)},${f(g)},${f(b)})`
}

function ThreeDSOverlay({ onSuccess, onCancel, onFail }) {
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('otp')
  const handleSubmit = () => {
    if (otp.length !== 6) return
    setStep('verifying')
    setTimeout(onSuccess, 1200)
  }
  const handleDemoFail = () => {
    setStep('verifying')
    // brief "verifying" flash, then jump to failure
    setTimeout(() => onFail?.('card_daily_limit'), 900)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm animate-slide-up">
      <div className="w-full max-w-[380px] surface p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">B</div>
            <div>
              <div className="text-[11px] text-ink-500">Verifying with</div>
              <div className="text-sm font-semibold text-ink-900">Your Bank · 3D Secure</div>
            </div>
          </div>
          <ShieldCheck className="text-success-500" />
        </div>

        <div className="rounded-2xl bg-canvas-subtle border border-ink-100 p-3 text-xs text-ink-700 mb-4">
          <div className="flex items-center justify-between">
            <span>Merchant</span><span className="font-semibold text-ink-900">{merchant.name}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Amount</span><span className="font-semibold text-ink-900 tnum">{order.currency}{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {step === 'otp' && (
          <>
            <label className="label-eyebrow">Enter OTP</label>
            <p className="text-xs text-ink-500 mt-1">We sent a 6-digit code to your registered mobile ending ••89</p>
            <input
              className="field mt-2 tnum tracking-[0.5em] text-center text-lg"
              placeholder="••••••"
              value={otp}
              maxLength={6}
              inputMode="numeric"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
            />
            <div className="mt-2 text-[11px] text-ink-300">Tip: enter any 6 digits (demo)</div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSubmit} disabled={otp.length !== 6} className="btn-primary flex-1">Verify</button>
            </div>

            {/* Demo-only: simulate a decline from the bank */}
            {onFail && (
              <button
                onClick={handleDemoFail}
                className="mt-3 w-full text-center text-[11px] font-semibold text-danger-500 hover:text-danger-500/80 transition"
              >
                (demo) simulate bank decline →
              </button>
            )}
          </>
        )}

        {step === 'verifying' && (
          <div className="py-6 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-ring-spin" />
            <div className="mt-3 text-sm font-semibold text-ink-900">Verifying with your bank…</div>
            <div className="text-xs text-ink-500 mt-1">Don't close this window</div>
          </div>
        )}
      </div>
    </div>
  )
}
