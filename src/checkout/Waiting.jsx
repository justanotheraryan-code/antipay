import React, { useEffect, useState } from 'react'
import Shell from './Shell.jsx'
import { upiApps, banks, wallets, bnplProviders, order } from './data.js'
import BrandMark from './BrandMark.jsx'

const TOTAL_SECS = 4 * 60 + 30

function describePayment(payload) {
  const m = payload?.method
  if (m === 'upi-intent') {
    const app = upiApps.find(a => a.id === payload?.app)
    return {
      title: `Waiting for you in ${app?.name || 'your UPI app'}`,
      subtitle: 'Approve the request in the app',
      brand: app ? { kind: 'upi', id: app.id } : null,
      showCountdown: true
    }
  }
  if (m === 'upi-collect') {
    return { title: 'Collect request sent', subtitle: 'Approve the payment in your UPI app', showCountdown: true }
  }
  if (m === 'upi-qr') {
    return { title: 'Confirming your payment', subtitle: 'Verifying the QR transaction', showCountdown: false }
  }
  if (m === 'netbanking') {
    const bank = banks.find(b => b.id === payload?.bank)
    return {
      title: `Redirecting to ${bank?.name || 'your bank'}`,
      subtitle: "You'll login on your bank's secure page",
      brand: bank ? { kind: 'bank', id: bank.id, data: bank } : null,
      showCountdown: false
    }
  }
  if (m === 'wallet') {
    const w = wallets.find(x => x.id === payload?.wallet)
    return {
      title: `Confirming with ${w?.name || 'your wallet'}`,
      subtitle: 'Enter the OTP we sent to your registered mobile',
      brand: w ? { kind: 'wallet', id: w.id, data: w } : null,
      showCountdown: false
    }
  }
  if (m === 'emi') {
    return { title: 'Setting up your EMI', subtitle: 'Confirming eligibility with your bank', showCountdown: false }
  }
  if (m === 'bnpl') {
    const p = bnplProviders.find(x => x.id === payload?.provider)
    return {
      title: `Authorizing with ${p?.name || 'your provider'}`,
      subtitle: 'Verifying your account',
      brand: p ? { kind: 'bnpl', id: p.id, data: p } : null,
      showCountdown: false
    }
  }
  return { title: 'Processing your payment', subtitle: 'This will only take a moment', showCountdown: false }
}

export default function Waiting({ payload, onCancel, onSuccess, onFailure }) {
  const [secs, setSecs] = useState(TOTAL_SECS)
  const info = describePayment(payload)

  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000)
    const r = setTimeout(() => onSuccess(), info.showCountdown ? 6000 : 2400)
    return () => { clearInterval(t); clearTimeout(r) }
  }, [onSuccess, info.showCountdown])

  const mm = String(Math.floor(secs / 60))
  const ss = String(secs % 60).padStart(2, '0')
  const pct = secs / TOTAL_SECS
  const ringSize = 140
  const stroke = 8
  const radius = (ringSize - stroke) / 2
  const circ = 2 * Math.PI * radius
  const dash = circ * pct

  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`

  return (
    <Shell title={null} onBack={onCancel} onClose={onCancel}>
      <div className="flex flex-col items-center text-center pt-2 pb-4 animate-slide-up">
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            <circle
              cx={ringSize/2} cy={ringSize/2} r={radius}
              stroke="rgb(var(--ink-100))" strokeWidth={stroke} fill="none"
            />
            {info.showCountdown ? (
              <circle
                cx={ringSize/2} cy={ringSize/2} r={radius}
                stroke="url(#ringGrad)" strokeWidth={stroke} fill="none"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                style={{ transition: 'stroke-dasharray 1s linear' }}
              />
            ) : (
              <circle
                cx={ringSize/2} cy={ringSize/2} r={radius}
                stroke="url(#ringGrad)" strokeWidth={stroke} fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circ * 0.25} ${circ}`}
                className="animate-ring-spin"
                style={{ transformOrigin: '50% 50%' }}
              />
            )}
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(var(--brand-400))" />
                <stop offset="100%" stopColor="rgb(var(--brand-600))" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse-soft">
              {info.brand ? (
                <BrandMark kind={info.brand.kind} id={info.brand.id} brand={info.brand.data} size={64} />
              ) : (
                <div className="h-16 w-16 rounded-full flex items-center justify-center text-white shadow-pop bg-brand-600">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 text-ink-900 font-semibold text-lg">{info.title}</div>
        <div className="mt-1 text-sm text-ink-500 max-w-[280px]">
          {info.subtitle}
        </div>

        {info.showCountdown && (
          <div className="mt-4 inline-flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-soft" />
            <span className="text-ink-500">Time left</span>
            <span className="tnum font-semibold text-ink-900">{mm}:{ss}</span>
          </div>
        )}

        <div className="mt-3 text-xs text-ink-500 tnum">
          Amount: <span className="font-semibold text-ink-900">{fmt(order.total)}</span>
        </div>

        <div className="mt-6 w-full flex items-center justify-between text-[11px] font-semibold">
          <Step label="Sent" done />
          <Line done />
          <Step label={info.showCountdown ? 'Awaiting you' : 'Verifying'} active />
          <Line />
          <Step label="Confirming" />
        </div>

        <div className="mt-6 flex items-center gap-2 w-full">
          <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
          {info.showCountdown && (
            <button className="btn-ghost flex-1">Resend request</button>
          )}
        </div>

        <button
          onClick={onFailure}
          className="mt-4 text-[11px] text-ink-300 hover:text-ink-500"
        >
          (demo) simulate failure
        </button>
      </div>
    </Shell>
  )
}

function Step({ label, active, done }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px]
        ${done ? 'bg-success-500 text-white' :
          active ? 'bg-brand-600 text-white animate-pulse-soft' :
          'bg-canvas-subtle text-ink-300 border border-ink-100'}`}>
        {done ? '✓' : active ? '•' : ''}
      </div>
      <span className={`${active ? 'text-brand-700' : done ? 'text-success-500' : 'text-ink-300'}`}>{label}</span>
    </div>
  )
}
function Line({ done }) {
  return <div className={`flex-1 h-px mx-2 ${done ? 'bg-success-500' : 'bg-ink-100'}`} />
}
