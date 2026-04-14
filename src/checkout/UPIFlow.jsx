import React, { useMemo, useState } from 'react'
import Shell from './Shell.jsx'
import { upiApps, order, buildUpiUrl } from './data.js'
import { Check, Refresh, Info } from './icons.jsx'
import BrandMark from './BrandMark.jsx'

const TABS = [
  { id: 'apps', label: 'UPI Apps' },
  { id: 'id',   label: 'UPI ID' },
  { id: 'qr',   label: 'QR Code' }
]

export default function UPIFlow({ onBack, onClose, onPay }) {
  const [tab, setTab] = useState('apps')
  const [vpa, setVpa] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(null)
  const [launching, setLaunching] = useState(null)

  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`
  const looksLikeVpa = useMemo(() => /^[\w.\-]{3,}@[\w]{2,}$/.test(vpa), [vpa])

  const handleVerify = () => {
    if (!looksLikeVpa) return
    setVerifying(true); setVerified(null)
    setTimeout(() => {
      setVerifying(false)
      setVerified({ name: vpa.split('@')[0].replace(/\b\w/g, c => c.toUpperCase()) })
    }, 700)
  }

  const launchUpiApp = (app) => {
    setLaunching(app.id)
    const url = buildUpiUrl(app)
    try {
      const f = document.createElement('iframe')
      f.style.display = 'none'
      f.src = url
      document.body.appendChild(f)
      setTimeout(() => f.remove(), 1500)
    } catch {}
    try { window.location.href = url } catch {}
    setTimeout(() => {
      setLaunching(null)
      onPay({ method: 'upi-intent', app: app.id })
    }, 350)
  }

  const footer =
    tab === 'id' ? (
      <button
        className="btn-primary"
        disabled={!verified}
        onClick={() => onPay({ method: 'upi-collect', vpa })}
      >
        Pay {fmt(order.total)}
      </button>
    ) : tab === 'qr' ? (
      <div className="text-center text-xs text-ink-500">Scan with any UPI app to pay</div>
    ) : null

  return (
    <Shell title="Pay using UPI" onBack={onBack} onClose={onClose} footer={footer}>
      <Tabs tab={tab} setTab={setTab} />

      {tab === 'apps' && (
        <div className="animate-slide-up">
          <p className="text-sm text-ink-500 mb-3">Tap an app — we'll open it for you</p>
          <div className="grid grid-cols-3 gap-2.5">
            {upiApps.map(app => {
              const isLaunching = launching === app.id
              return (
                <button
                  key={app.id}
                  onClick={() => launchUpiApp(app)}
                  disabled={isLaunching}
                  className="group relative flex flex-col items-center gap-2 rounded-3xl border border-ink-100 bg-canvas-card py-4 px-2 transition hover:border-brand-400 hover:shadow-card hover:-translate-y-0.5 disabled:opacity-70"
                >
                  <div className={isLaunching ? 'animate-pulse-soft' : ''}>
                    <BrandMark kind="upi" id={app.id} size={48} />
                  </div>
                  <div className="text-[11px] font-semibold text-ink-700 text-center leading-tight">{app.name}</div>
                  {isLaunching && (
                    <div className="absolute inset-x-0 -bottom-1 text-[10px] text-brand-700 font-semibold">opening…</div>
                  )}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex items-start gap-2 text-xs text-ink-500 bg-canvas-subtle rounded-2xl px-3 py-2.5">
            <Info width={14} height={14} className="mt-0.5 shrink-0" />
            <span>On mobile, your chosen UPI app opens automatically. We'll wait here for the confirmation.</span>
          </div>
        </div>
      )}

      {tab === 'id' && (
        <div className="animate-slide-up">
          <label className="label-eyebrow">Enter your UPI ID</label>
          <div className="mt-2 relative">
            <input
              className="field pr-24"
              placeholder="yourname@okhdfcbank"
              value={vpa}
              onChange={(e) => { setVpa(e.target.value); setVerified(null) }}
              autoComplete="off"
              spellCheck={false}
              inputMode="email"
            />
            <button
              onClick={handleVerify}
              disabled={!looksLikeVpa || verifying}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-2 text-xs font-semibold rounded-xl bg-brand-50 text-brand-700 disabled:opacity-50 hover:bg-brand-100 transition"
            >
              {verifying ? 'Verifying…' : verified ? 'Verified' : 'Verify'}
            </button>
          </div>

          {verified && (
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-success-50 border border-success-500/20 px-3 py-2.5 animate-slide-up">
              <div className="h-7 w-7 rounded-full bg-success-500 text-white flex items-center justify-center">
                <Check width={16} height={16} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-ink-500">Payee verified</div>
                <div className="text-sm font-semibold text-ink-900">{verified.name}</div>
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-ink-500">
            We verify your UPI ID before sending the request, so you never wait for an "invalid VPA" error.
          </div>
        </div>
      )}

      {tab === 'qr' && (
        <div className="animate-slide-up flex flex-col items-center">
          <div className="relative p-4 rounded-3xl bg-canvas-card border border-ink-100 shadow-card">
            <QRPlaceholder />
            <button
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-canvas-card border border-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-card hover:bg-canvas-subtle"
              title="Refresh QR"
            >
              <Refresh width={14} height={14} /> Refresh
            </button>
          </div>
          <div className="mt-6 text-center">
            <div className="text-sm font-semibold text-ink-900">Scan & pay {fmt(order.total)}</div>
            <div className="text-xs text-ink-500 mt-1">Open any UPI app, tap scan, and confirm the payment</div>
          </div>
          <button
            onClick={() => onPay({ method: 'upi-qr' })}
            className="mt-5 text-xs font-semibold text-brand-700 hover:underline"
          >
            I've completed the payment →
          </button>
        </div>
      )}
    </Shell>
  )
}

function Tabs({ tab, setTab }) {
  return (
    <div className="relative mb-5 rounded-2xl bg-canvas-subtle p-1 grid grid-cols-3 text-sm font-semibold">
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
  )
}

function QRPlaceholder() {
  const cells = []
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const corner =
        (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)
      const inCornerBox =
        ((x < 7 && y < 7) && !(x === 0 || x === 6 || y === 0 || y === 6) && !(x >= 2 && x <= 4 && y >= 2 && y <= 4)) ||
        ((x > 13 && y < 7) && !(x === 14 || x === 20 || y === 0 || y === 6) && !(x >= 16 && x <= 18 && y >= 2 && y <= 4)) ||
        ((x < 7 && y > 13) && !(x === 0 || x === 6 || y === 14 || y === 20) && !(x >= 2 && x <= 4 && y >= 16 && y <= 18))
      const fill = corner ? !inCornerBox : ((x * 31 + y * 17 + x * y) % 3 === 0)
      cells.push(
        <rect key={`${x}-${y}`} x={x * 8} y={y * 8} width="8" height="8" fill={fill ? 'currentColor' : 'transparent'} rx="1" />
      )
    }
  }
  return (
    <svg width="180" height="180" viewBox="0 0 168 168" className="block text-ink-900">
      {cells}
    </svg>
  )
}
