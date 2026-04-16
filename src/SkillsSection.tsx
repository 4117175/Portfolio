import { useEffect, useRef, useState } from 'react'
import { skills } from './content'

function levelLabel(n: number): string {
  if (n >= 90) return 'Expert'
  if (n >= 80) return 'Advanced'
  if (n >= 70) return 'Intermediate'
  return 'Familiar'
}

interface BarProps {
  name: string
  level: number
  visible: boolean
  delay: number
}

function SkillBar({ name, level, visible, delay }: BarProps) {
  return (
    <div className="skill-bar" style={{ '--delay': `${delay}ms` } as React.CSSProperties}>
      <div className="skill-bar-header">
        <span className="skill-name">{name}</span>
        <span className="skill-meta">
          <span className="skill-label">{levelLabel(level)}</span>
          <span className="skill-pct">{level}%</span>
        </span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{
            '--target': `${level}%`,
            width: visible ? `${level}%` : '0%',
          } as React.CSSProperties}
        />
      </div>
    </div>
  )
}

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="skills-section" ref={ref}>
      {skills.map((group, gi) => (
        <div key={group.category} className="skills-group">
          <p className="skills-category">{group.category}</p>
          <div className="skills-group-bars">
            {group.items.map((item, ii) => (
              <SkillBar
                key={item.name}
                name={item.name}
                level={item.level}
                visible={visible}
                delay={gi * 80 + ii * 60}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
