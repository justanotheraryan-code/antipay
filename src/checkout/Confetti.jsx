import React, { useMemo } from 'react'

const COLORS = ['#0B5FFF', '#5C8FFF', '#0BB37A', '#FC2779', '#F5A524', '#9333EA']

export default function Confetti({ count = 36 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6
      const distance = 120 + Math.random() * 140
      const tx = Math.cos(angle) * distance
      const ty = Math.sin(angle) * distance - 40
      const rot = (Math.random() * 720 - 360).toFixed(0)
      const delay = (Math.random() * 0.15).toFixed(2)
      const duration = (1.1 + Math.random() * 0.6).toFixed(2)
      const size = 6 + Math.random() * 6
      const color = COLORS[i % COLORS.length]
      const shape = i % 3
      return { id: i, tx, ty, rot, delay, duration, size, color, shape }
    })
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible flex items-center justify-center">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute"
          style={{
            width: p.shape === 2 ? p.size * 1.6 : p.size,
            height: p.shape === 2 ? p.size * 0.5 : p.size,
            background: p.color,
            borderRadius: p.shape === 1 ? '999px' : '2px',
            ['--tx']: `${p.tx}px`,
            ['--ty']: `${p.ty}px`,
            ['--rot']: `${p.rot}deg`,
            animation: `confettiBurst ${p.duration}s cubic-bezier(.15,.7,.3,1) ${p.delay}s forwards`,
            opacity: 0
          }}
        />
      ))}
      <style>{`
        @keyframes confettiBurst {
          0%   { transform: translate(0,0) rotate(0deg) scale(.6); opacity: 0; }
          15%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
