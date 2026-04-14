import React, { useState } from 'react'
import { ChevronLeft, Lock, X, Sun, Moon, ShieldCheck, ChevronRight, Settings } from './icons.jsx'
import { merchant, order } from './data.js'
import { useTheme } from './useTheme.js'
import TrustPane from './TrustPane.jsx'
import Guardrails from './Guardrails.jsx'

export default function Shell({ title, onBack, onClose, showAmount = true, children, footer, scrollable = false, method = 'card' }) {
  const { theme, toggle } = useTheme()
  const [trustOpen, setTrustOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  return (
    <div className="sheet-wrap">
      <div className="sheet glass overflow-hidden">
        <div className="sheet-handle" />
        {/* Header */}
        <div className="px-5 pt-3 sm:pt-5 pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="h-9 w-9 -ml-2 flex items-center justify-center rounded-full hover:bg-canvas-subtle text-ink-500 transition"
              aria-label="Back"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => setTrustOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-success-500 px-2.5 py-1 rounded-full bg-success-50 border border-success-500/25 hover:bg-success-500/15 transition"
              title="Open Trust Pane"
            >
              <ShieldCheck width={12} height={12} />
              <span>Trust Pane</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setRulesOpen(true)}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-canvas-subtle text-ink-500 transition"
                aria-label="Guardrails"
                title="Your guardrails"
              >
                <Settings />
              </button>
              <button
                onClick={toggle}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-canvas-subtle text-ink-500 transition"
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
              >
                {theme === 'dark' ? <Sun /> : <Moon />}
              </button>
              <button
                onClick={onClose}
                className="h-9 w-9 -mr-2 flex items-center justify-center rounded-full hover:bg-canvas-subtle text-ink-500 transition"
                aria-label="Close"
              >
                <X />
              </button>
            </div>
          </div>

          {showAmount && (
            <button
              onClick={() => setTrustOpen(true)}
              className="mt-4 w-full flex items-center gap-3 text-left group"
              title="See who you're paying"
            >
              <div
                className="h-11 w-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-card relative"
                style={{ background: merchant.brandHex }}
              >
                {merchant.logoChar}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success-500 text-white flex items-center justify-center ring-2 ring-canvas-card">
                  <ShieldCheck width={9} height={9} strokeWidth={3} />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="label-eyebrow">Paying to</div>
                <div className="text-ink-900 font-semibold truncate flex items-center gap-1">
                  {merchant.name}
                  <ChevronRight width={13} height={13} className="text-ink-300 group-hover:text-brand-600 transition" />
                </div>
              </div>
              <div className="text-right">
                <div className="label-eyebrow">Amount</div>
                <div className="tnum text-ink-900 font-bold text-lg">
                  {order.currency}{order.total.toLocaleString('en-IN')}
                </div>
              </div>
            </button>
          )}

          {title && (
            <div className="mt-5 text-ink-900 font-semibold text-[15px]">{title}</div>
          )}
        </div>

        {/* Body */}
        <div className={`px-5 pb-3 ${scrollable ? 'max-h-[60vh] overflow-y-auto scroll-soft' : ''}`}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 pb-5 pt-2">{footer}</div>
        )}

        {/* Trust strip */}
        <button
          onClick={() => setTrustOpen(true)}
          className="w-full px-5 pb-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-300 font-medium hover:text-ink-500 transition"
        >
          <Lock width={12} height={12} />
          <span>TLS 1.3 · RBI Tokenized · <span className="underline">See how we protect this payment</span></span>
        </button>
      </div>

      <TrustPane open={trustOpen} onClose={() => setTrustOpen(false)} />
      {rulesOpen && <GuardrailsDrawer onClose={() => setRulesOpen(false)} method={method} />}
    </div>
  )
}

function GuardrailsDrawer({ onClose, method }) {
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
        <div className="px-5 pt-3 sm:pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 text-white flex items-center justify-center shadow-pop">
              <Settings width={18} height={18} />
            </div>
            <div>
              <div className="text-[11px] text-ink-500 font-semibold uppercase tracking-wider">Your rules</div>
              <div className="text-sm font-bold text-ink-900">Guardrails for this payment</div>
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
        <div className="px-5 pb-5 max-h-[72vh] overflow-y-auto scroll-soft">
          <p className="text-xs text-ink-500 mb-3">
            These are the rules you've set for yourself. You'll see them fire live on every payment.
          </p>
          <Guardrails method={method} defaultOpen />
        </div>
      </div>
    </div>
  )
}
