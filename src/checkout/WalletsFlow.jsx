import React, { useState } from 'react'
import Shell from './Shell.jsx'
import { wallets, order } from './data.js'
import { Info } from './icons.jsx'
import BrandMark from './BrandMark.jsx'

export default function WalletsFlow({ onBack, onClose, onPay }) {
  const [picked, setPicked] = useState(null)
  const fmt = (n) => `${order.currency}${n.toLocaleString('en-IN')}`

  return (
    <Shell title="Pay using a wallet" onBack={onBack} onClose={onClose}
      footer={
        <button
          className="btn-primary"
          disabled={!picked}
          onClick={() => onPay({ method: 'wallet', wallet: picked?.id })}
        >
          {picked ? `Pay ${fmt(order.total)}` : 'Select a wallet'}
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-2.5">
        {wallets.map(w => {
          const active = picked?.id === w.id
          return (
            <button
              key={w.id}
              onClick={() => setPicked(w)}
              className={`group relative flex items-center gap-3 rounded-3xl px-3.5 py-3.5 text-left transition border
                ${active ? 'border-brand-600 bg-brand-50 shadow-card -translate-y-0.5' : 'border-ink-100 bg-canvas-card hover:border-brand-200 hover:-translate-y-0.5'}`}
            >
              <BrandMark kind="wallet" id={w.id} brand={w} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink-900 truncate">{w.name}</div>
                {w.balance != null ? (
                  <div className="text-[11px] text-success-500 font-semibold tnum">Bal: ₹{w.balance.toLocaleString('en-IN')}</div>
                ) : (
                  <div className="text-[11px] text-ink-500">Link & pay</div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex items-start gap-2 text-xs text-ink-500 bg-canvas-subtle rounded-2xl px-3 py-2.5">
        <Info width={14} height={14} className="mt-0.5 shrink-0" />
        <span>You'll receive an OTP on the mobile number linked to the wallet.</span>
      </div>
    </Shell>
  )
}
