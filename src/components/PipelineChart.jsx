import { useEffect, useRef, useState } from 'react'
import { STAGES, STAGE_META } from '../constants'

export default function PipelineChart({ stageCounts, isDark, onClose }) {
  const total = stageCounts['All'] || 0
  const canvasRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const [animPct, setAnimPct] = useState(0)

  // Build slices
  const slices = STAGES.map(stage => ({
    stage,
    count: stageCounts[stage] || 0,
    pct: total > 0 ? ((stageCounts[stage] || 0) / total) * 100 : 0,
    accent: STAGE_META[stage].accent,
    icon: STAGE_META[stage].icon,
  })).filter(s => s.count > 0)

  // Animate in
  useEffect(() => {
    let start = null
    const dur = 900
    function frame(ts) {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      // ease out cubic
      setAnimPct(1 - Math.pow(1 - p, 3))
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [])

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const size = 240
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = size + 'px'
    canvas.style.height = size + 'px'
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, size, size)
    const cx = size / 2, cy = size / 2
    const outerR = 100, innerR = 58

    if (slices.length === 0) {
      // Empty state ring
      ctx.beginPath()
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true)
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.08)'
      ctx.fill()
      return
    }

    let startAngle = -Math.PI / 2
    const gap = 0.025

    slices.forEach((s, i) => {
      const sweep = (s.pct / 100) * Math.PI * 2 * animPct
      const endAngle = startAngle + sweep - (sweep > 0.1 ? gap : 0)
      const isHov = hovered === s.stage

      ctx.beginPath()
      ctx.arc(cx, cy, isHov ? outerR + 5 : outerR, startAngle, endAngle)
      ctx.arc(cx, cy, isHov ? innerR - 3 : innerR, endAngle, startAngle, true)
      ctx.closePath()

      // Gradient fill
      const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR + (isHov ? 5 : 0))
      grad.addColorStop(0, s.accent + '99')
      grad.addColorStop(1, s.accent + 'dd')
      ctx.fillStyle = grad

      if (isHov) {
        ctx.shadowColor = s.accent
        ctx.shadowBlur = 16
      } else {
        ctx.shadowBlur = 0
      }
      ctx.fill()
      ctx.shadowBlur = 0

      startAngle += sweep
    })

    // Center hole overlay
    ctx.beginPath()
    ctx.arc(cx, cy, innerR - 1, 0, Math.PI * 2)
    ctx.fillStyle = isDark ? '#0d1530' : '#ffffff'
    ctx.fill()

  }, [slices, hovered, animPct, isDark])

  // Hit test
  function handleMouseMove(e) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - 120
    const y = e.clientY - rect.top - 120
    const dist = Math.sqrt(x * x + y * y)
    if (dist < 58 || dist > 105) { setHovered(null); return }
    let angle = Math.atan2(y, x) + Math.PI / 2
    if (angle < 0) angle += Math.PI * 2
    let cum = 0
    for (const s of slices) {
      const sweep = (s.pct / 100) * Math.PI * 2
      if (angle >= cum && angle < cum + sweep) { setHovered(s.stage); return }
      cum += sweep
    }
    setHovered(null)
  }

  const bg = isDark ? 'rgba(13,21,48,0.95)' : '#fff'
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#e0e7ff'
  const titleColor = isDark ? '#fff' : '#1e293b'
  const mutedColor = isDark ? '#475569' : '#94a3b8'
  const rowHover = isDark ? 'rgba(255,255,255,0.04)' : '#f5f7ff'
  const labelColor = isDark ? '#e2e8f0' : '#1e293b'
  const subColor = isDark ? '#64748b' : '#94a3b8'

  const hovSlice = slices.find(s => s.stage === hovered)

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: isDark ? 'rgba(5,8,20,0.88)' : 'rgba(15,23,42,0.4)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="modal-card w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: bg, border: `1px solid ${border}`, boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(99,102,241,0.08)' : '0 30px 80px rgba(99,102,241,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div>
            <h2 className="text-base font-bold font-display" style={{ color: titleColor }}>Pipeline Breakdown</h2>
            <p className="text-xs mt-0.5" style={{ color: mutedColor }}>{total} total prospects across {slices.length} stages</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-xl"
            style={{ color: mutedColor, background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' }}
          >×</button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col sm:flex-row gap-8 items-center">

          {/* Donut chart */}
          <div className="flex-shrink-0 relative" style={{ width: 240, height: 240 }}>
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'crosshair' }}
            />
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {hovSlice ? (
                <>
                  <div className="text-2xl">{STAGE_META[hovSlice.stage].icon}</div>
                  <div className="text-xl font-bold font-mono mt-0.5" style={{ color: hovSlice.accent }}>{hovSlice.pct.toFixed(1)}%</div>
                  <div className="text-xs font-display font-semibold mt-0.5" style={{ color: mutedColor }}>{hovSlice.stage}</div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono" style={{ color: titleColor }}>{total}</div>
                  <div className="text-xs font-display" style={{ color: mutedColor }}>prospects</div>
                </>
              )}
            </div>
          </div>

          {/* Legend table */}
          <div className="flex-1 w-full">
            <div className="space-y-1">
              {STAGES.map(stage => {
                const meta = STAGE_META[stage]
                const count = stageCounts[stage] || 0
                const pct = total > 0 ? (count / total) * 100 : 0
                const isHov = hovered === stage
                return (
                  <div
                    key={stage}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-default"
                    style={{ background: isHov ? rowHover : 'transparent', border: isHov ? `1px solid ${meta.accent}30` : '1px solid transparent' }}
                    onMouseEnter={() => setHovered(stage)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Color dot */}
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: meta.accent, boxShadow: isHov ? `0 0 8px ${meta.accent}` : 'none' }} />

                    {/* Stage name + icon */}
                    <div className="flex items-center gap-1.5 w-28 flex-shrink-0">
                      <span className="text-sm">{meta.icon}</span>
                      <span className="text-xs font-semibold font-display" style={{ color: isHov ? meta.accent : labelColor }}>{stage}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct * animPct}%`,
                          background: `linear-gradient(90deg, ${meta.accent}, ${meta.accent}99)`,
                          boxShadow: isHov ? `0 0 6px ${meta.accent}` : 'none',
                        }}
                      />
                    </div>

                    {/* Count + pct */}
                    <div className="text-right flex-shrink-0 w-20">
                      <span className="text-xs font-mono font-bold" style={{ color: isHov ? meta.accent : labelColor }}>{pct.toFixed(1)}%</span>
                      <span className="text-xs font-mono ml-1.5" style={{ color: subColor }}>({count})</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
