import React, { useMemo, useState } from 'react'
import Shell from './Shell.jsx'
import { banks, order } from './data.js'
import { Search, Info } from './icons.jsx'
import BrandMark from './BrandMark.jsx'

export default function NetbankingFlow({ onBack, onClose, onPay }) {
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState(null)

  const popular = banks.slice(0, 6)
  const filtered = useMemo(() => {
    if (!q) return null
    const t = q.trim().toLowerCase()
    return banks.filter(b => b.name.toLowerCase().includes(t) || b.short.toLowerCase().includes(t))
  }, [q])

  const list = filtered || banks

  return (
    <Shell title="Pay with Netbanking" onBack={onBack} onClose={onClose}
      footer={
        <button
          className="btn-primary"
          disabled={!picked}
          onClick={() => onPay({ method: 'netbanking', bank: picked?.id })}
        >
          {picked ? `Continue to ${picked.short}` : 'Select a bank'}
        </button>
      }
      scrollable
    >
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
        <input
          className="field pl-10"
          placeholder="Search your bank"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {!q && (
        <>
          <div className="label-eyebrow mb-2">Popular banks</div>
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {popular.map(b => (
              <BankTile key={b.id} bank={b} active={picked?.id === b.id} onClick={() => setPicked(b)} />
            ))}
          </div>
          <div className="label-eyebrow mb-2">All banks</div>
        </>
      )}

      <div className="space-y-1.5">
        {list.map(b => (
          <button
            key={b.id}
            onClick={() => setPicked(b)}
            className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition border
              ${picked?.id === b.id
                ? 'bg-brand-50 border-brand-200'
                : 'bg-canvas-card border-ink-100 hover:border-brand-200 hover:bg-brand-50/40'}`}
          >
            <BankMark bank={b} size={36} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink-900 truncate">{b.name}</div>
              <div className="text-[11px] text-ink-500">Personal & Business banking</div>
            </div>
            <div className={`h-4 w-4 rounded-full border-2 ${picked?.id === b.id ? 'border-brand-600' : 'border-ink-100'} flex items-center justify-center`}>
              {picked?.id === b.id && <div className="h-2 w-2 rounded-full bg-brand-600" />}
            </div>
          </button>
        ))}
        {filtered && filtered.length === 0 && (
          <div className="text-center text-sm text-ink-500 py-8">No banks match "{q}"</div>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-ink-500 bg-canvas-subtle rounded-2xl px-3 py-2.5">
        <Info width={14} height={14} className="mt-0.5 shrink-0" />
        <span>You'll be redirected to your bank's secure login. We never see your banking credentials.</span>
      </div>
    </Shell>
  )
}

function BankTile({ bank, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-3xl border py-3 px-2 transition
        ${active ? 'border-brand-600 bg-brand-50 shadow-card -translate-y-0.5' : 'border-ink-100 bg-canvas-card hover:border-brand-200 hover:-translate-y-0.5'}`}
    >
      <BankMark bank={bank} size={40} />
      <div className="text-[10px] font-bold text-ink-700 leading-tight text-center">{bank.short}</div>
    </button>
  )
}

function BankMark({ bank, size = 36 }) {
  return <BrandMark kind="bank" id={bank.id} brand={bank} size={size} />
}
