import { STAGES, STAGE_META } from '../constants'

export default function StageFilter({ active, counts, onChange, isDark }) {
  const allStages = ['All', ...STAGES]

  return (
    <div className="flex flex-wrap gap-2">
      {allStages.map(stage => {
        const isActive = active === stage
        const count = counts[stage] || 0
        const meta = STAGE_META[stage]

        const activeStyle = isDark
          ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.5)', boxShadow: '0 0 12px rgba(99,102,241,0.15)' }
          : { background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }

        const inactiveStyle = isDark
          ? { background: 'rgba(13,21,48,0.6)', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }
          : { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }

        return (
          <button
            key={stage}
            onClick={() => onChange(stage)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 font-display tracking-wide"
            style={isActive ? activeStyle : inactiveStyle}
          >
            {stage !== 'All' && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${meta?.dot || 'bg-slate-400'}`}
                style={{ opacity: isActive ? 1 : 0.6 }}
              />
            )}
            {stage}
            <span className="font-mono text-[10px] ml-0.5" style={{ opacity: 0.6 }}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
