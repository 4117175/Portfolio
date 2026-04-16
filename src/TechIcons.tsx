import { useEffect, useRef, useState } from 'react'
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript,
  SiReact, SiTailwindcss,
  SiNodedotjs, SiPhp, SiMongodb, SiMysql,
  SiKotlin, SiAndroidstudio,
  SiGit, SiDotnet,
} from 'react-icons/si'
import { TbApi } from 'react-icons/tb'

const TECHS = [
  { icon: SiHtml5,         name: 'HTML5',          color: '#e34f26' },
  { icon: SiCss,           name: 'CSS3',            color: '#1572b6' },
  { icon: SiJavascript,    name: 'JavaScript',      color: '#f7df1e' },
  { icon: SiTypescript,    name: 'TypeScript',      color: '#3178c6' },
  { icon: SiReact,         name: 'React.js',        color: '#61dafb' },
  { icon: SiTailwindcss,   name: 'Tailwind CSS',    color: '#06b6d4' },
  { icon: SiNodedotjs,     name: 'Node.js',         color: '#5fa04e' },
  { icon: TbApi,           name: 'REST API',        color: '#a78bfa' },
  { icon: SiPhp,           name: 'PHP',             color: '#8892be' },
  { icon: SiDotnet,        name: 'C# / .NET',       color: '#512bd4' },
  { icon: SiKotlin,        name: 'Kotlin',          color: '#7f52ff' },
  { icon: SiAndroidstudio, name: 'Android Studio',  color: '#3ddc84' },
  { icon: SiMysql,         name: 'MySQL',           color: '#4479a1' },
  { icon: SiMongodb,       name: 'MongoDB',         color: '#47a248' },
  { icon: SiGit,           name: 'Git',             color: '#f05032' },
] as const

export function TechIcons() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="tech-icons" aria-label="Technologies">
      {TECHS.map(({ icon: Icon, name, color }, i) => (
        <div
          key={name}
          className={`tech-icon-item${visible ? ' tech-icon-item--visible' : ''}`}
          style={{ '--delay': `${i * 45}ms`, '--color': color } as React.CSSProperties}
          title={name}
        >
          <span className="tech-icon-glyph">
            <Icon />
          </span>
          <span className="tech-icon-name">{name}</span>
        </div>
      ))}
    </div>
  )
}
