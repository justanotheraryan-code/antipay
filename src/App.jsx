import React, { useState } from 'react'
import SummaryAndMethods from './checkout/SummaryAndMethods.jsx'
import UPIFlow from './checkout/UPIFlow.jsx'
import CardFlow from './checkout/CardFlow.jsx'
import NetbankingFlow from './checkout/NetbankingFlow.jsx'
import WalletsFlow from './checkout/WalletsFlow.jsx'
import EMIFlow from './checkout/EMIFlow.jsx'
import Waiting from './checkout/Waiting.jsx'
import { Success, Failure } from './checkout/Result.jsx'
import { Lock, ShieldCheck, Sun, Moon } from './checkout/icons.jsx'
import { merchant, order } from './checkout/data.js'
import { useTheme } from './checkout/useTheme.js'
import LiquidGlassDefs from './checkout/LiquidGlassDefs.jsx'

const STAGES = {
  MERCHANT: 'merchant',
  METHODS:  'methods',
  UPI:      'upi',
  CARD:     'card',
  NB:       'nb',
  WAL:      'wal',
  EMI:      'emi',
  WAITING:  'waiting',
  SUCCESS:  'success',
  FAILURE:  'failure'
}

const METHOD_TO_STAGE = {
  upi:  STAGES.UPI,
  card: STAGES.CARD,
  nb:   STAGES.NB,
  wal:  STAGES.WAL,
  emi:  STAGES.EMI
}

export default function App() {
  const [stage, setStage] = useState(STAGES.MERCHANT)
  const [payload, setPayload] = useState(null)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [failureReason, setFailureReason] = useState('card_daily_limit')

  const goMethods  = () => setStage(STAGES.METHODS)
  const goMerchant = () => setStage(STAGES.MERCHANT)
  const pickMethod = (id) => setStage(METHOD_TO_STAGE[id] || STAGES.UPI)

  const startPayment = (p) => {
    setPayload(p)
    // Card auth already happened via inline 3DS overlay — skip the waiting screen
    if (p.method === 'card') {
      setStage(STAGES.SUCCESS)
    } else {
      setStage(STAGES.WAITING)
    }
  }

  if (stage === STAGES.MERCHANT) return (
    <>
      <LiquidGlassDefs />
      <MerchantSite
        onPay={goMethods}
        isFirstTime={isFirstTime}
        setIsFirstTime={setIsFirstTime}
      />
    </>
  )

  return (
    <>
      <LiquidGlassDefs />
      {stage === STAGES.METHODS && (
        <SummaryAndMethods onPick={pickMethod} onClose={goMerchant} />
      )}
      {stage === STAGES.UPI && (
        <UPIFlow onBack={goMethods} onClose={goMerchant} onPay={startPayment} />
      )}
      {stage === STAGES.CARD && (
        <CardFlow
          onBack={goMethods}
          onClose={goMerchant}
          onPay={startPayment}
          onFail={(reasonKey) => {
            setFailureReason(reasonKey || 'card_daily_limit')
            setStage(STAGES.FAILURE)
          }}
        />
      )}
      {stage === STAGES.NB && (
        <NetbankingFlow onBack={goMethods} onClose={goMerchant} onPay={startPayment} />
      )}
      {stage === STAGES.WAL && (
        <WalletsFlow onBack={goMethods} onClose={goMerchant} onPay={startPayment} />
      )}
      {stage === STAGES.EMI && (
        <EMIFlow onBack={goMethods} onClose={goMerchant} onPay={startPayment} />
      )}
      {stage === STAGES.WAITING && (
        <Waiting
          payload={payload}
          onCancel={() => setStage(METHOD_TO_STAGE[payload?.method?.split('-')[0]] || STAGES.METHODS)}
          onSuccess={() => setStage(STAGES.SUCCESS)}
          onFailure={() => {
            // Pick a reason based on what was attempted (demo)
            const r = payload?.method === 'card' ? 'card_daily_limit'
              : payload?.method?.startsWith('upi') ? 'upi_timeout'
              : 'insufficient_funds'
            setFailureReason(r)
            setStage(STAGES.FAILURE)
          }}
        />
      )}
      {stage === STAGES.SUCCESS && (
        <Success
          onDone={goMerchant}
          onRestart={goMerchant}
          isFirstTime={isFirstTime}
          streak={3}
        />
      )}
      {stage === STAGES.FAILURE && (
        <Failure
          reasonKey={failureReason}
          onRetrySaved={(card) => {
            // Smart retry: jump back into CardFlow targeting the suggested saved card
            setPayload({ method: 'card', saved: true, network: card.network })
            setStage(STAGES.SUCCESS)
          }}
          onChangeMethod={goMethods}
          onClose={goMerchant}
        />
      )}
    </>
  )
}

function MerchantSite({ onPay, isFirstTime, setIsFirstTime }) {
  const { theme, toggle } = useTheme()
  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 gap-6">
      <div className="w-full max-w-[980px] grid lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Left: storefront mock */}
        <div className="surface p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: merchant.brandHex }}
              >{merchant.logoChar}</div>
              <span className="font-semibold text-ink-900">{merchant.name}</span>
              <span className="text-ink-300">/ Cart</span>
            </div>
            <button
              onClick={toggle}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-canvas-subtle text-ink-500 transition"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Review your order
          </h1>
          <p className="mt-1 text-sm text-ink-500">2 items · ships in 2-3 days</p>

          <div className="mt-6 divide-y divide-ink-100">
            {order.items.map((it, i) => (
              <div key={i} className="py-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-canvas-subtle border border-ink-100 flex items-center justify-center text-xl">💄</div>
                <div className="flex-1">
                  <div className="font-semibold text-ink-900 text-sm">{it.name}</div>
                  <div className="text-xs text-ink-500">Qty {it.qty}</div>
                </div>
                <div className="tnum font-semibold text-ink-900">{fmt(it.price * it.qty)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: order total + Pay Now */}
        <div className="surface p-6 sm:p-8 animate-slide-up">
          <div className="label-eyebrow">Order total</div>
          <div className="mt-1 tnum text-4xl font-bold text-ink-900">{fmt(order.total)}</div>

          <div className="mt-5 space-y-2 text-sm">
            <Row label="Subtotal" value={fmt(order.subtotal)} />
            <Row label="GST (18%)" value={fmt(order.gst)} />
            <Row label="Delivery" value="Free" accent />
          </div>

          <button onClick={onPay} className="btn-primary mt-6 text-base">
            <Lock width={16} height={16} /> Pay {fmt(order.total)}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px]">
            <span className="text-ink-500">Demo:</span>
            <button
              onClick={() => setIsFirstTime(false)}
              className={`px-2.5 py-1 rounded-full font-semibold transition ${!isFirstTime ? 'bg-brand-600 text-white' : 'bg-canvas-subtle text-ink-500'}`}
            >
              Returning
            </button>
            <button
              onClick={() => setIsFirstTime(true)}
              className={`px-2.5 py-1 rounded-full font-semibold transition ${isFirstTime ? 'bg-brand-600 text-white' : 'bg-canvas-subtle text-ink-500'}`}
            >
              First-time 🎉
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-ink-500">
            <ShieldCheck width={14} height={14} className="text-success-500" />
            Powered by <span className="font-semibold text-ink-700">Anti</span> · 100% secure checkout
          </div>
        </div>
      </div>

      <DeveloperFab />
    </div>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={`tnum ${accent ? 'text-success-500 font-semibold' : 'text-ink-700 font-medium'}`}>{value}</span>
    </div>
  )
}

function DeveloperFab() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="For developers — embed snippet"
        aria-label="Developer info"
        className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full bg-canvas-card border border-ink-100 shadow-card flex items-center justify-center text-ink-700 hover:text-brand-700 hover:border-brand-400 hover:shadow-pop hover:-translate-y-0.5 transition group"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-brand-600 ring-2 ring-canvas animate-pulse-soft" />
      </button>
      {open && <DeveloperDrawer onClose={() => setOpen(false)} />}
    </>
  )
}

function DeveloperDrawer({ onClose }) {
  const [tab, setTab] = useState('html')
  const [copied, setCopied] = useState(false)

  const snippets = {
    html: `<script
  src="https://cdn.anti.in/v1/anti.js"
  data-key="pk_live_xxxxxxxxxxxxxxxxxx"
  data-amount="2499"
  data-currency="INR"
  data-order-id="ORD-12345">
</script>`,
    react: `import { AntiPay } from '@anti/react'

<AntiPay
  publicKey="pk_live_xxxxxxxxxxxxxxxxxx"
  amount={2499}
  currency="INR"
  onSuccess={(txn) => router.push('/thank-you')}
/>`,
    rest: `curl https://api.anti.in/v1/orders \\
  -u sk_live_xxxxxxxxxxxxxxxxxx: \\
  -d amount=2499 \\
  -d currency=INR \\
  -d customer_email=asha@example.com`
  }

  const copy = () => {
    navigator.clipboard?.writeText(snippets[tab])
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const tabs = [
    { id: 'html',  label: 'HTML' },
    { id: 'react', label: 'React' },
    { id: 'rest',  label: 'REST API' }
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-ink-900/50 backdrop-blur-sm animate-slide-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] surface p-6 sm:p-8 max-h-[92vh] overflow-y-auto scroll-soft rounded-t-[28px] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="label-eyebrow">For developers</div>
            <h2 className="mt-1 text-xl font-bold text-ink-900 tracking-tight">
              Drop in checkout in 5 lines
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              UPI, cards, netbanking, wallets, EMI & BNPL — all in one snippet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 -mr-2 -mt-2 flex items-center justify-center rounded-full hover:bg-canvas-subtle text-ink-500 transition shrink-0"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-1 rounded-2xl bg-canvas-subtle p-1 w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${tab === t.id ? 'bg-canvas-card text-brand-700 shadow-card' : 'text-ink-500 hover:text-ink-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 relative rounded-2xl border border-ink-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-ink-100 bg-canvas-subtle">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-danger-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-warn-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-success-500/80" />
              <span className="ml-2 text-[11px] text-ink-500 font-semibold">
                {tab === 'html' ? 'index.html' : tab === 'react' ? 'Checkout.jsx' : 'terminal'}
              </span>
            </div>
            <button
              onClick={copy}
              className="text-[11px] font-semibold text-brand-700 hover:text-brand-900 transition"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <pre className="px-4 py-4 text-[12px] leading-relaxed overflow-x-auto bg-canvas-card text-ink-700 font-mono scroll-soft">
            <code dangerouslySetInnerHTML={{ __html: highlight(snippets[tab], tab) }} />
          </pre>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <FeaturePill title="2.0% + ₹2" sub="per transaction" />
          <FeaturePill title="< 5 mins" sub="to integrate" />
          <FeaturePill title="99.99%" sub="uptime SLA" />
          <FeaturePill title="T+1" sub="settlement" />
        </div>

        <a
          href="#"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
        >
          Read full docs →
        </a>
      </div>
    </div>
  )
}

function FeaturePill({ title, sub }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-canvas-card px-3 py-2.5">
      <div className="text-sm font-bold text-ink-900 tnum">{title}</div>
      <div className="text-[11px] text-ink-500">{sub}</div>
    </div>
  )
}

function highlight(code, lang) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let out = esc(code)
  if (lang === 'html') {
    out = out
      .replace(/(&lt;\/?[\w-]+)/g, '<span style="color:rgb(var(--brand-600))">$1</span>')
      .replace(/([\w-]+)=/g, '<span style="color:rgb(var(--warn-500))">$1</span>=')
      .replace(/("[^"]*")/g, '<span style="color:rgb(var(--success-500))">$1</span>')
  } else if (lang === 'react') {
    out = out
      .replace(/\b(import|from|const|let|var|function|return)\b/g, '<span style="color:rgb(var(--brand-600));font-weight:600">$1</span>')
      .replace(/(['"`][^'"`]*['"`])/g, '<span style="color:rgb(var(--success-500))">$1</span>')
      .replace(/(&lt;\/?[\w-]+)/g, '<span style="color:rgb(var(--danger-500))">$1</span>')
  } else {
    out = out
      .replace(/^(curl)/gm, '<span style="color:rgb(var(--brand-600));font-weight:600">$1</span>')
      .replace(/(-[a-zA-Z])/g, '<span style="color:rgb(var(--warn-500))">$1</span>')
  }
  return out
}
