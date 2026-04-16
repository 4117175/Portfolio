import { useRef, useEffect, useState, useCallback } from 'react'
import { accentPresets, type AccentPresetId } from './theme'

interface Props {
  value: AccentPresetId
  onChange: (id: AccentPresetId) => void
}

// ── Constants ──────────────────────────────────────────────────
const W    = 198
const CX   = W / 2
const CY   = W / 2
const R    = 86
const FOCAL = 342
const PAD  = 16        // minimum gap from screen edge
const POS_KEY = 'tsphere-pos'

// ── Fibonacci sphere dot positions ────────────────────────────
const DOT_POS = (() => {
  const phi = (1 + Math.sqrt(5)) / 2
  const r = R * 0.86
  return accentPresets.map((_, i) => {
    const theta = Math.acos(1 - 2 * (i + 0.5) / accentPresets.length)
    const az = (2 * Math.PI * i) / phi
    return {
      x: Math.sin(theta) * Math.cos(az) * r,
      y: Math.cos(theta) * r,
      z: Math.sin(theta) * Math.sin(az) * r,
    }
  })
})()

// ── Sphere wireframe mesh ──────────────────────────────────────
const MESH = (() => {
  const LAT = 11, LON = 18
  const pts: { x: number; y: number; z: number }[] = []
  const segs: [number, number][] = []
  for (let la = 0; la <= LAT; la++) {
    const phi = (la / LAT) * Math.PI
    for (let lo = 0; lo < LON; lo++) {
      const theta = (lo / LON) * 2 * Math.PI
      pts.push({
        x: R * Math.sin(phi) * Math.cos(theta),
        y: R * Math.cos(phi),
        z: R * Math.sin(phi) * Math.sin(theta),
      })
      const idx = la * LON + lo
      segs.push([idx, la * LON + ((lo + 1) % LON)])
      if (la < LAT) segs.push([idx, (la + 1) * LON + lo])
    }
  }
  return { pts, segs }
})()

// ── Math helpers ───────────────────────────────────────────────
function rotP(x: number, y: number, z: number, rxDeg: number, ryDeg: number) {
  const ry = (ryDeg * Math.PI) / 180
  const rx = (rxDeg * Math.PI) / 180
  const x1 = x * Math.cos(ry) + z * Math.sin(ry)
  const z1 = -x * Math.sin(ry) + z * Math.cos(ry)
  const y2 = y * Math.cos(rx) - z1 * Math.sin(rx)
  const z2 = y * Math.sin(rx) + z1 * Math.cos(rx)
  return { x: x1, y: y2, z: z2 }
}

function proj(x: number, y: number, z: number) {
  const s = FOCAL / (FOCAL + z + R * 0.4)
  return { sx: CX + x * s, sy: CY - y * s }
}

// ── Position helpers ───────────────────────────────────────────
// Returns the snapped X for the nearest left or right edge
function snapX(currentX: number): number {
  const leftX  = PAD
  const rightX = window.innerWidth - W - PAD
  return currentX + W / 2 < window.innerWidth / 2 ? leftX : rightX
}

function clampY(y: number): number {
  return Math.max(PAD, Math.min(window.innerHeight - W - PAD - 30, y))
}

function savePos(x: number, y: number) {
  try { localStorage.setItem(POS_KEY, JSON.stringify({ x, y })) } catch { /* */ }
}

function loadPos(): { x: number; y: number } | null {
  try {
    const raw = localStorage.getItem(POS_KEY)
    if (raw) {
      const p = JSON.parse(raw) as { x: number; y: number }
      if (typeof p.x === 'number' && typeof p.y === 'number') return p
    }
  } catch { /* */ }
  return null
}

// ── Component ──────────────────────────────────────────────────
export function ThemeSphere({ value, onChange }: Props) {
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const widgetRef      = useRef<HTMLDivElement>(null)
  const dotRefs        = useRef<(HTMLButtonElement | null)[]>([])
  const rotX           = useRef(15)
  const rotY           = useRef(0)
  const draggingSphere = useRef(false)
  const draggingWidget = useRef(false)
  const lastMouse      = useRef({ x: 0, y: 0 })
  const widgetOffset   = useRef({ x: 0, y: 0 })
  const posRef         = useRef({ x: 0, y: 0 })
  const rafRef         = useRef<number | undefined>(undefined)
  const clickGuard     = useRef(false)
  const valueRef       = useRef(value)

  const [ready, setReady] = useState(false)

  useEffect(() => { valueRef.current = value }, [value])

  // ── Apply position directly to DOM (zero React re-renders) ──
  const applyPos = useCallback((x: number, y: number, animate: boolean) => {
    posRef.current = { x, y }
    const el = widgetRef.current
    if (!el) return
    el.style.transition = animate
      ? 'left 0.5s cubic-bezier(0.22,1,0.36,1), top 0.4s cubic-bezier(0.22,1,0.36,1)'
      : 'none'
    el.style.left = `${x}px`
    el.style.top  = `${y}px`
  }, [])

  // ── Init: load saved position or default to right edge ──────
  useEffect(() => {
    const saved = loadPos()
    if (saved) {
      // Re-snap saved position to the correct edge (in case window resized)
      posRef.current = {
        x: snapX(saved.x),
        y: clampY(saved.y),
      }
    } else {
      posRef.current = {
        x: window.innerWidth - W - PAD,
        y: clampY(window.innerHeight / 2 - W / 2),
      }
    }
    setReady(true)
  }, [])

  // After mount, apply the initial position to the DOM
  useEffect(() => {
    if (ready) applyPos(posRef.current.x, posRef.current.y, false)
  }, [ready, applyPos])

  // ── Canvas render tick ──────────────────────────────────────
  const tick = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rx = rotX.current
    const ry = rotY.current

    ctx.clearRect(0, 0, W, W)

    // Sphere background
    const bg = ctx.createRadialGradient(CX - 20, CY - 26, 4, CX, CY, R)
    bg.addColorStop(0,    '#1e2a4a')
    bg.addColorStop(0.55, '#0d1225')
    bg.addColorStop(1,    '#05080f')
    ctx.beginPath()
    ctx.arc(CX, CY, R, 0, Math.PI * 2)
    ctx.fillStyle = bg
    ctx.fill()

    // Clip to sphere circle
    ctx.save()
    ctx.beginPath()
    ctx.arc(CX, CY, R - 0.5, 0, Math.PI * 2)
    ctx.clip()

    // Project all mesh vertices once
    const projected = MESH.pts.map((p) => {
      const r = rotP(p.x, p.y, p.z, rx, ry)
      return { ...proj(r.x, r.y, r.z), z: r.z }
    })

    // ── Batch segments into 4 depth buckets → only 4 stroke calls ──
    // (previously ~350 individual stroke() calls per frame)
    const NBUCKETS = 4
    type Line = { ax: number; ay: number; bx: number; by: number }
    const buckets: Line[][] = Array.from({ length: NBUCKETS }, () => [])

    for (const [a, b] of MESH.segs) {
      const pa = projected[a]
      const pb = projected[b]
      const t = ((pa.z + pb.z) / 2 + R) / (2 * R)
      if (t < 0.03) continue
      buckets[Math.min(NBUCKETS - 1, Math.floor(t * NBUCKETS))].push({
        ax: pa.sx, ay: pa.sy, bx: pb.sx, by: pb.sy,
      })
    }

    ctx.lineWidth = 0.65
    buckets.forEach((bucket, i) => {
      if (!bucket.length) return
      const t = (i + 0.5) / NBUCKETS
      ctx.beginPath()
      for (const ln of bucket) {
        ctx.moveTo(ln.ax, ln.ay)
        ctx.lineTo(ln.bx, ln.by)
      }
      ctx.strokeStyle = `rgba(110,140,230,${(0.06 + 0.22 * t).toFixed(3)})`
      ctx.stroke()
    })

    ctx.restore()

    // Outer glow ring
    ctx.beginPath()
    ctx.arc(CX, CY, R, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(80,110,220,0.18)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    // ── Update color-dot buttons via direct DOM ─────────────────
    DOT_POS.forEach((p, i) => {
      const btn = dotRefs.current[i]
      if (!btn) return
      const r = rotP(p.x, p.y, p.z, rx, ry)
      const { sx, sy } = proj(r.x, r.y, r.z)
      const t = (r.z + R) / (2 * R)
      const visible = r.z > -R * 0.3
      const opacity = visible ? (0.35 + 0.65 * Math.max(0, t)).toFixed(3) : '0'
      const scale   = visible ? (0.6  + 0.4  * Math.max(0, t)).toFixed(3) : '0.2'
      btn.style.left         = `${sx.toFixed(1)}px`
      btn.style.top          = `${sy.toFixed(1)}px`
      btn.style.opacity      = opacity
      btn.style.transform    = `translate(-50%,-50%) scale(${scale})`
      btn.style.pointerEvents = visible ? 'auto' : 'none'
      btn.style.zIndex       = String(Math.round(r.z + R + 1))
      const preset   = accentPresets[i]
      const isActive = preset.id === valueRef.current
      btn.style.boxShadow = isActive
        ? `0 0 0 3px rgba(255,255,255,0.92), 0 0 16px 4px ${preset.dark}`
        : `0 2px 8px rgba(0,0,0,0.55)`
    })
  }, [])

  // ── Animation loop ──────────────────────────────────────────
  useEffect(() => {
    let last = performance.now()
    function frame(now: number) {
      const dt = Math.min(now - last, 50)
      last = now
      if (!draggingSphere.current) rotY.current += dt * 0.022
      tick()
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [tick])

  // ── Global pointer events ───────────────────────────────────
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (draggingSphere.current) {
        const dx = e.clientX - lastMouse.current.x
        const dy = e.clientY - lastMouse.current.y
        if (Math.abs(dx) + Math.abs(dy) > 2) clickGuard.current = true
        rotY.current += dx * 0.45
        rotX.current += dy * 0.45
        lastMouse.current = { x: e.clientX, y: e.clientY }
      }
      if (draggingWidget.current) {
        // Move freely while dragging — no snapping yet
        applyPos(
          e.clientX - widgetOffset.current.x,
          clampY(e.clientY - widgetOffset.current.y),
          false,
        )
      }
    }

    function onUp() {
      if (draggingWidget.current) {
        // Snap to the nearest left or right edge with animation
        const sx = snapX(posRef.current.x)
        const sy = clampY(posRef.current.y)
        applyPos(sx, sy, true)
        savePos(sx, sy)
      }
      draggingSphere.current = false
      draggingWidget.current = false
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [applyPos])

  function onCanvasDown(e: React.MouseEvent) {
    e.preventDefault()
    draggingSphere.current = true
    clickGuard.current = false
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }

  function onHandleDown(e: React.MouseEvent) {
    e.preventDefault()
    draggingWidget.current = true
    widgetOffset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    }
  }

  if (!ready) return null

  return (
    <div
      ref={widgetRef}
      className="tsphere-widget"
      style={{ left: posRef.current.x, top: posRef.current.y }}
    >
      <div className="tsphere-handle" onMouseDown={onHandleDown} title="Drag to reposition">
        <span className="tsphere-handle-grip">⠿</span>
        <span className="tsphere-handle-label">Theme</span>
      </div>

      <div className="tsphere-container" onMouseDown={onCanvasDown}>
        <canvas ref={canvasRef} width={W} height={W} className="tsphere-canvas" />
        {accentPresets.map((preset, i) => (
          <button
            key={preset.id}
            ref={(el) => { dotRefs.current[i] = el }}
            className="tsphere-dot"
            style={{ backgroundColor: preset.dark }}
            onClick={() => { if (!clickGuard.current) onChange(preset.id) }}
            aria-label={`${preset.label} theme`}
            title={preset.label}
          />
        ))}
      </div>

      <p className="tsphere-active-label">
        {accentPresets.find((p) => p.id === value)?.label ?? ''}
      </p>
    </div>
  )
}
