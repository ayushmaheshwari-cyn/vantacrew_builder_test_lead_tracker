import StageBadge from './StageBadge'

export default function ProspectTable({ prospects, onEdit, onDelete, isDark }) {
  const emptyStyle = isDark
    ? { borderRadius: '16px', background: 'rgba(13,21,48,0.6)', border: '1px solid rgba(255,255,255,0.05)' }
    : { borderRadius: '16px', background: '#fff', border: '1px solid #e0e7ff' }

  const tableStyle = isDark
    ? { background: 'rgba(13,21,48,0.7)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }
    : { background: '#fff', boxShadow: '0 4px 24px rgba(99,102,241,0.08)', border: '1px solid #e0e7ff' }

  const headerBorder = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9'
  const rowBorder = isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f8faff'
  const headerColor = isDark ? '#475569' : '#94a3b8'
  const nameColor = isDark ? '#e2e8f0' : '#1e293b'
  const companyColor = isDark ? '#64748b' : '#94a3b8'
  const emailColor = isDark ? '#818cf8' : '#4f46e5'
  const phoneColor = isDark ? '#94a3b8' : '#64748b'
  const notesColor = isDark ? '#64748b' : '#94a3b8'
  const emptyColor = isDark ? '#334155' : '#cbd5e1'

  if (prospects.length === 0) {
    return (
      <div className="text-center py-24" style={emptyStyle}>
        <div className="text-5xl mb-4 opacity-40">📋</div>
        <p className="text-sm font-semibold font-display" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>No prospects found</p>
        <p className="text-xs mt-1.5" style={{ color: isDark ? '#334155' : '#cbd5e1' }}>Try changing the filter or adding a new prospect</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl" style={tableStyle}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: headerBorder }}>
            <th className="text-left text-[10px] font-semibold tracking-widest px-5 py-3.5 font-display uppercase w-52" style={{ color: headerColor }}>Prospect</th>
            <th className="text-left text-[10px] font-semibold tracking-widest px-5 py-3.5 font-display uppercase" style={{ color: headerColor }}>Email</th>
            <th className="text-left text-[10px] font-semibold tracking-widest px-5 py-3.5 font-display uppercase" style={{ color: headerColor }}>Phone</th>
            <th className="text-left text-[10px] font-semibold tracking-widest px-5 py-3.5 font-display uppercase" style={{ color: headerColor }}>Stage</th>
            <th className="text-left text-[10px] font-semibold tracking-widest px-5 py-3.5 font-display uppercase" style={{ color: headerColor }}>Notes</th>
            <th className="px-5 py-3.5 w-20" />
          </tr>
        </thead>
        <tbody>
          {prospects.map((p, i) => (
            <tr
              key={p.id}
              className="prospect-row"
              style={{ borderBottom: i < prospects.length - 1 ? rowBorder : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.05)' : '#f5f7ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-display"
                    style={{
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(192,132,252,0.3))'
                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: isDark ? '1px solid rgba(99,102,241,0.2)' : 'none',
                    }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium font-display" style={{ color: nameColor }}>{p.name}</div>
                    {p.company && <div className="text-xs mt-0.5" style={{ color: companyColor }}>{p.company}</div>}
                  </div>
                </div>
              </td>

              <td className="px-5 py-3.5">
                {p.email
                  ? <a href={`mailto:${p.email}`} className="transition-colors text-xs truncate max-w-[160px] block hover:underline" style={{ color: emailColor }}>{p.email}</a>
                  : <span style={{ color: emptyColor }}>—</span>
                }
              </td>

              <td className="px-5 py-3.5 font-mono text-xs" style={{ color: phoneColor }}>
                {p.phone || <span style={{ color: emptyColor }}>—</span>}
              </td>

              <td className="px-5 py-3.5">
                <StageBadge stage={p.stage} isDark={isDark} />
              </td>

              <td className="px-5 py-3.5 max-w-[180px]">
                {p.notes
                  ? <span className="text-xs truncate block" title={p.notes} style={{ color: notesColor }}>{p.notes}</span>
                  : <span className="text-xs" style={{ color: emptyColor }}>—</span>
                }
              </td>

              <td className="px-5 py-3.5">
                <div className="flex gap-1 justify-end">
                  <button
                    onClick={() => onEdit(p)}
                    title="Edit prospect"
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: isDark ? '#475569' : '#94a3b8' }}
                    onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff'; e.currentTarget.style.color = '#6366f1' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#475569' : '#94a3b8' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    title="Delete prospect"
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: isDark ? '#475569' : '#94a3b8' }}
                    onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.1)' : '#fff5f5'; e.currentTarget.style.color = '#ef4444' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#475569' : '#94a3b8' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
