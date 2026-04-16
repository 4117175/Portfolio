import { useEffect, useRef, useState } from 'react'
import { stats } from './content'

function useCountUp(target: number, duration = 1400, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])

  return count
}

function StatCard({
  value,
  suffix,
  label,
  index,
  active,
}: {
  value: number
  suffix: string
  label: string
  index: number
  active: boolean
}) {
  const count = useCountUp(value, 1200 + index * 150, active)

  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span className="stat-value">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export function StatsGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`stats-grid ${visible ? 'stats-grid--visible' : ''}`}>
      {stats.map((s, i) => (
        <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} index={i} active={visible} />
      ))}
    </div>
  )
}
