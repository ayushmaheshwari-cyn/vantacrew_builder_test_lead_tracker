import { STAGE_META } from '../constants'

export default function StageBadge({ stage, isDark }) {
  const meta = STAGE_META[stage] || {}
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium tracking-wide"
      style={{
        background: isDark ? meta.darkBg : meta.lightBg,
        color: isDark ? meta.darkText : meta.lightText,
        boxShadow: isDark ? `0 0 8px ${meta.glow}` : 'none',
        border: isDark ? 'none' : `1px solid ${meta.accent}40`,
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}
        style={{ boxShadow: isDark ? `0 0 4px ${meta.accent}` : 'none' }}
      />
      {stage}
    </span>
  )
}
