import React from 'react'
import { order, userHistory } from './data.js'
import { Sparkle } from './icons.jsx'

/**
 * A quiet, single-line awareness card shown right before the user pays.
 * Not judgy. Not cashback. Just a split-second of context.
 *
 * This is what makes our checkout feel *aware of the user* instead of transactional.
 */
export default function SpendContext({ merchantId = 'nykaa', category = 'beauty' }) {
  const stats = userHistory.merchantStats[merchantId]
  const cat = userHistory.monthlyCategory[category]

  // Decide which insight to surface — priority: anomaly > budget > category awareness
  const insight = pickInsight(stats, cat, order.total)
  if (!insight) return null

  return (
    <div className={`mb-4 rounded-2xl border px-4 py-3 flex items-center gap-3 animate-slide-up
      ${insight.tone === 'warn'
        ? 'bg-warn-50 border-warn-500/25'
        : 'bg-canvas-subtle border-ink-100/70'}`}
    >
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0
        ${insight.tone === 'warn' ? 'bg-warn-500/20 text-warn-500' : 'bg-brand-50 text-brand-600'}`}>
        <Sparkle width={14} height={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[10px] uppercase tracking-wider font-bold
          ${insight.tone === 'warn' ? 'text-warn-500' : 'text-brand-700'}`}>
          {insight.eyebrow}
        </div>
        <div className="text-[13px] font-semibold text-ink-900 leading-snug">
          {insight.title}
        </div>
      </div>
      {insight.bar && (
        <div className="w-14 shrink-0">
          <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
            <div
              className={`h-full ${insight.bar.color}`}
              style={{ width: `${Math.min(100, insight.bar.pct)}%` }}
            />
          </div>
          <div className="mt-1 text-[9px] text-right tnum text-ink-500 font-semibold">
            {insight.bar.label}
          </div>
        </div>
      )}
    </div>
  )
}

function pickInsight(stats, cat, total) {
  // 1. Anomaly — paying significantly more than historical average at this merchant
  if (stats && !stats.firstTimeHere) {
    const delta = (total - stats.avgAmount) / stats.avgAmount
    if (delta > 0.3) {
      const pct = Math.round(delta * 100)
      return {
        tone: 'warn',
        eyebrow: 'Heads up',
        title: `${pct}% higher than your usual ₹${stats.avgAmount.toLocaleString('en-IN')} here`
      }
    }
    // Within normal range — reassure
    return {
      tone: 'info',
      eyebrow: `${stats.payments}× before`,
      title: `Typical for you here (avg ₹${stats.avgAmount.toLocaleString('en-IN')})`
    }
  }

  // 2. First-time merchant — subtle reassurance
  if (stats?.firstTimeHere || !stats) {
    return {
      tone: 'info',
      eyebrow: 'First time here',
      title: 'We\'ll save this so it\'s faster next time'
    }
  }

  // 3. Category budget awareness
  if (cat?.budget) {
    const newTotal = cat.spent + total
    const pct = Math.round((newTotal / cat.budget) * 100)
    return {
      tone: pct > 100 ? 'warn' : 'info',
      eyebrow: cat.label,
      title: `₹${newTotal.toLocaleString('en-IN')} of ₹${cat.budget.toLocaleString('en-IN')} this month`,
      bar: {
        pct,
        color: pct > 100 ? 'bg-warn-500' : pct > 80 ? 'bg-warn-500' : 'bg-brand-500',
        label: `${pct}%`
      }
    }
  }

  return null
}
