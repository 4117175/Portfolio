import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { accentPresets, type AccentPresetId } from './theme'

interface Props {
  value: AccentPresetId
  onChange: (id: AccentPresetId) => void
}

type Layout = { W: number; R: number; focal: number; pad: number; dotPx: number }

function getLayout(viewportW: number): Layout {
  if (viewportW < 400) {
    return { W: 128, R: 56, focal: 240, pad: 10, dotPx: 18 }
  }
  if (viewportW < 560) {
    return { W: 152, R: 66, focal: 300, pad: 12, dotPx: 20 }
  }
  return { W: 198, R: 86, focal: 342, pad: 16, dotPx: 24 }
}

function widgetStackHeight(W: number) {
  return W + 48
}

function fibonacciSphere(count: number, r: number) {
  const phi = (1 + Math.sqrt(5)) / 2
  return Array.from({ length: count }, (_, i) => {
    const theta = Math.acos(1 - 2 * (i + 0.5) / count)
    const az = (2 * Math.PI * i) / phi
    return {
      x: Math.sin(theta) * Math.cos(az) * r,
      y: Math.cos(theta) * r,
      z: Math.sin(theta) * Math.sin(az) * r,
    }
  })
}

function buildMesh(lat: number, lon: number, R: number) {
  const pts: { x: number; y: number; z: number }[] = []
  const segs: [number, number][] = []
  for (let la = 0; la <= lat; la++) {
    const phi = (la / lat) * Math.PI
    for (let lo = 0; lo < lon; lo++) {
      const theta = (lo / lon) * 2 * Math.PI
      pts.push({
        x: R * Math.sin(phi) * Math.cos(theta),
        y: R * Math.cos(phi),
        z: R * Math.sin(phi) * Math.sin(theta),
      })
      const idx = la * lon + lo
      segs.push([idx, la * lon + ((lo + 1) % lon)])
      if (la < lat) segs.push([idx, (la + 1) * lon + lo])
    }
  }
  return { pts, segs }
}

function rotP(x: number, y: number, z: number, rxDeg: number, ryDeg: number) {
  const ry = (ryDeg * Math.PI) / 180
  const rx = (rxDeg * Math.PI) / 180
  const x1 = x * Math.cos(ry) + z * Math.sin(ry)
  const z1 = -x * Math.sin(ry) + z * Math.cos(ry)
  const y2 = y * Math.cos(rx) - z1 * Math.sin(rx)
  const z2 = y * Math.sin(rx) + z1 * Math.cos(rx)
  return { x: x1, y: y2, z: z2 }
}

function proj(
  x: number, y: number, z: number,
  focal: number, R: number, cx: number, cy: number,
) {
  const s = focal / (focal + z + R * 0.4)
  return { sx: cx + x * s, sy: cy - y * s }
}

function snapX(currentX: number, winW: number, W: number, pad: number) {
  const leftX = pad
  const rightX = winW - W - pad
  return currentX + W / 2 < winW / 2 ? leftX : rightX
}

function clampY(y: number, winH: number, W: number, pad: number) {
  const h = widgetStackHeight(W)
  return Math.max(pad, Math.min(winH - h - pad, y))
}

const POS_KEY = 'tsphere-pos'

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

export function ThemeSphere({ value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rotX = useRef(15)
  const rotY = useRef(0)
  const draggingSphere = useRef(false)
  const draggingWidget = useRef(false)
  const lastClient = useRef({ x: 0, y: 0 })
  const widgetOffset = useRef({ x: 0, y: 0 })
  const posRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | undefined>(undefined)
  const clickGuard = useRef(false)
  const valueRef = useRef(value)
  const layoutRef = useRef<Layout>(getLayout(1024))

  const [layout, setLayout] = useState<Layout>(() => getLayout(1024))
  const [ready, setReady] = useState(false)

  useEffect(() => { valueRef.current = value }, [value])
  useEffect(() => { layoutRef.current = layout }, [layout])

  const mesh = useMemo(() => buildMesh(11, 18, layout.R), [layout.R])
  const dotPositions = useMemo(
    () => fibonacciSphere(accentPresets.length, layout.R * 0.86),
    [layout.R],
  )

  const applyPos = useCallback((x: number, y: number, animate: boolean) => {
    posRef.current = { x, y }
    const el = widgetRef.current
    if (!el) return
    el.style.transition = animate
      ? 'left 0.5s cubic-bezier(0.22,1,0.36,1), top 0.4s cubic-bezier(0.22,1,0.36,1)'
      : 'none'
    el.style.left = `${x}px`
    el.style.top = `${y}px`
  }, [])

  /** Prefer bottom corner on phones so it does not cover the profile photo */
  function defaultPosition(L: Layout, vw: number, vh: number, saved: { x: number; y: number } | null) {
    if (saved) {
      let x = snapX(saved.x, vw, L.W, L.pad)
      let y = clampY(saved.y, vh, L.W, L.pad)
      if (vw < 680) {
        const minY = vh - widgetStackHeight(L.W) - L.pad
        y = Math.max(y, minY)
      }
      return { x, y }
    }
    const x = snapX(vw - L.W - L.pad, vw, L.W, L.pad)
    const y =
      vw < 680
        ? vh - widgetStackHeight(L.W) - L.pad
        : clampY(vh / 2 - widgetStackHeight(L.W) / 2, vh, L.W, L.pad)
    return { x, y }
  }

  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const L = getLayout(vw)
    setLayout(L)
    const p = defaultPosition(L, vw, vh, loadPos())
    posRef.current = p
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) applyPos(posRef.current.x, posRef.current.y, false)
  }, [ready, applyPos])

  useEffect(() => {
    function onResize() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const L = getLayout(vw)
      setLayout(L)
      let x = snapX(posRef.current.x, vw, L.W, L.pad)
      let y = clampY(posRef.current.y, vh, L.W, L.pad)
      if (vw < 680) {
        y = Math.max(y, vh - widgetStackHeight(L.W) - L.pad)
      }
      posRef.current = { x, y }
      applyPos(x, y, false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [applyPos])

  const tick = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { W, R, focal } = layoutRef.current
    const cx = W / 2
    const cy = W / 2
    const rx = rotX.current
    const ry = rotY.current

    ctx.clearRect(0, 0, W, W)

    const bg = ctx.createRadialGradient(cx - 20, cy - 26, 4, cx, cy, R)
    bg.addColorStop(0, '#1e2a4a')
    bg.addColorStop(0.55, '#0d1225')
    bg.addColorStop(1, '#05080f')
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fillStyle = bg
    ctx.fill()

    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2)
    ctx.clip()

    const projected = mesh.pts.map((p) => {
      const r = rotP(p.x, p.y, p.z, rx, ry)
      return { ...proj(r.x, r.y, r.z, focal, R, cx, cy), z: r.z }
    })

    const NBUCKETS = 4
    type Line = { ax: number; ay: number; bx: number; by: number }
    const buckets: Line[][] = Array.from({ length: NBUCKETS }, () => [])

    for (const [a, b] of mesh.segs) {
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

    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(80,110,220,0.18)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    const dotPx = layoutRef.current.dotPx
    dotPositions.forEach((p, i) => {
      const btn = dotRefs.current[i]
      if (!btn) return
      const r = rotP(p.x, p.y, p.z, rx, ry)
      const { sx, sy } = proj(r.x, r.y, r.z, focal, R, cx, cy)
      const t = (r.z + R) / (2 * R)
      const visible = r.z > -R * 0.3
      const opacity = visible ? (0.35 + 0.65 * Math.max(0, t)).toFixed(3) : '0'
      const scale = visible ? (0.6 + 0.4 * Math.max(0, t)).toFixed(3) : '0.2'
      btn.style.width = `${dotPx}px`
      btn.style.height = `${dotPx}px`
      btn.style.margin = `${-dotPx / 2}px 0 0 ${-dotPx / 2}px`
      btn.style.left = `${sx.toFixed(1)}px`
      btn.style.top = `${sy.toFixed(1)}px`
      btn.style.opacity = opacity
      btn.style.transform = `translate(-50%,-50%) scale(${scale})`
      btn.style.pointerEvents = visible ? 'auto' : 'none'
      btn.style.zIndex = String(Math.round(r.z + R + 1))
      const preset = accentPresets[i]
      const isActive = preset.id === valueRef.current
      btn.style.boxShadow = isActive
        ? `0 0 0 3px rgba(255,255,255,0.92), 0 0 16px 4px ${preset.dark}`
        : `0 2px 8px rgba(0,0,0,0.55)`
    })
  }, [mesh, dotPositions])

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
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [tick])

  useEffect(() => {
    function clientXY(e: PointerEvent) {
      return { x: e.clientX, y: e.clientY }
    }

    function onMove(e: PointerEvent) {
      if (draggingSphere.current || draggingWidget.current) {
        e.preventDefault()
      }
      if (draggingSphere.current) {
        const { x, y } = clientXY(e)
        const dx = x - lastClient.current.x
        const dy = y - lastClient.current.y
        if (Math.abs(dx) + Math.abs(dy) > 2) clickGuard.current = true
        rotY.current += dx * 0.45
        rotX.current += dy * 0.45
        lastClient.current = { x, y }
      }
      if (draggingWidget.current) {
        const { x, y } = clientXY(e)
        const L = layoutRef.current
        applyPos(
          x - widgetOffset.current.x,
          clampY(y - widgetOffset.current.y, window.innerHeight, L.W, L.pad),
          false,
        )
      }
    }

    function onUp() {
      if (draggingWidget.current) {
        const L = layoutRef.current
        const vw = window.innerWidth
        const vh = window.innerHeight
        const sx = snapX(posRef.current.x, vw, L.W, L.pad)
        let sy = clampY(posRef.current.y, vh, L.W, L.pad)
        if (vw < 680) {
          sy = Math.max(sy, vh - widgetStackHeight(L.W) - L.pad)
        }
        applyPos(sx, sy, true)
        savePos(sx, sy)
      }
      draggingSphere.current = false
      draggingWidget.current = false
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [applyPos])

  function onCanvasPointerDown(e: React.PointerEvent) {
    e.preventDefault()
    draggingSphere.current = true
    clickGuard.current = false
    lastClient.current = { x: e.clientX, y: e.clientY }
  }

  function onHandlePointerDown(e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    draggingWidget.current = true
    lastClient.current = { x: e.clientX, y: e.clientY }
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
      <div
        className="tsphere-handle"
        onPointerDown={onHandlePointerDown}
        title="Drag to reposition"
      >
        <span className="tsphere-handle-grip">⠿</span>
        <span className="tsphere-handle-label">Theme</span>
      </div>

      <div className="tsphere-container" onPointerDown={onCanvasPointerDown}>
        <canvas ref={canvasRef} width={layout.W} height={layout.W} className="tsphere-canvas" />
        {accentPresets.map((preset, i) => (
          <button
            key={preset.id}
            type="button"
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
