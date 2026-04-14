import React, { useState } from 'react'
import Shell from './Shell.jsx'
import { order, methods } from './data.js'
import { Bolt, Card, Bank, Wallet, Calendar, ChevronRight, ChevronDown, Sparkle } from './icons.jsx'
import SpendContext from './SpendContext.jsx'

const iconMap = { bolt: Bolt, card: Card, bank: Bank, wallet: Wallet, calendar: Calendar }

export default function SummaryAndMethods({ onPick, onClose, lastUsed = 'upi' }) {
  const [open, setOpen] = useState(false)
  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`

  return (
    <Shell title="Choose how to pay" onBack={onClose} onClose={onClose}>
      {/* Spend context — awareness moment before method selection */}
      <SpendContext />

      {/* Itemized breakdown */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full mb-4 text-left rounded-2xl bg-canvas-subtle border border-ink-100/60 px-4 py-3 transition hover:border-brand-200"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-500 font-medium">Order summary</span>
          <span className="flex items-center gap-1 text-ink-500">
            <span className="tnum font-semibold text-ink-900">{fmt(order.total)}</span>
            <ChevronDown width={16} height={16} className={`transition ${open ? 'rotate-180' : ''}`} />
          </span>
        </div>
        {open && (
          <div className="mt-3 pt-3 border-t border-ink-100 space-y-2 text-sm animate-slide-up">
            {order.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-ink-700">
                <span className="truncate pr-3">{it.name} <span className="text-ink-300">× {it.qty}</span></span>
                <span className="tnum">{fmt(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-ink-100/60 space-y-1.5">
              <Row label="Subtotal" value={fmt(order.subtotal)} />
              <Row label="GST (18%)" value={fmt(order.gst)} />
              <Row label="Delivery" value={order.delivery === 0 ? 'Free' : fmt(order.delivery)} accent={order.delivery === 0} />
            </div>
          </div>
        )}
      </button>

      {/* Last used quick-pay */}
      {lastUsed && (
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-brand-50 to-canvas-card border border-brand-100 px-4 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
            <Sparkle width={18} height={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-brand-700 font-bold">Last used</div>
            <div className="text-ink-900 font-semibold text-sm">UPI · you@okhdfcbank</div>
          </div>
          <button
            onClick={() => onPick('upi')}
            className="rounded-xl bg-brand-600 text-white text-sm font-semibold px-3.5 py-2 shadow-pop hover:bg-brand-700 transition"
          >
            Pay now
          </button>
        </div>
      )}

      {/* Method list */}
      <div className="space-y-2">
        {methods.map(m => {
          const Icon = iconMap[m.icon]
          return (
            <button
              key={m.id}
              onClick={() => onPick(m.id)}
              className="group w-full flex items-center gap-3 rounded-2xl border border-ink-100 bg-canvas-card px-4 py-3.5 text-left transition hover:border-brand-400 hover:shadow-card hover:-translate-y-px"
            >
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition">
                <Icon width={20} height={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink-900">{m.title}</span>
                  {m.recommended && (
                    <span className="chip bg-success-50 text-success-500">Recommended</span>
                  )}
                </div>
                <div className="text-xs text-ink-500 truncate">{m.tagline}</div>
              </div>
              <ChevronRight className="text-ink-300 group-hover:text-brand-600 transition" />
            </button>
          )
        })}
      </div>
    </Shell>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className={`tnum ${accent ? 'text-success-500 font-semibold' : 'text-ink-700'}`}>{value}</span>
    </div>
  )
}
