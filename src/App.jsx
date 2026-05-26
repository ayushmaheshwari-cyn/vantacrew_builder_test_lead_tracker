import { useState } from 'react'
import { useLeads } from './useLeads'
import { useTheme } from './useTheme'
import { STAGES, STAGE_META } from './constants'
import StageFilter from './components/StageFilter'
import ProspectTable from './components/ProspectTable'
import ProspectForm from './components/ProspectForm'
import Modal from './components/Modal'
import PipelineChart from './components/PipelineChart'

export default function App() {
  const { isDark, toggleTheme } = useTheme()

  const {
    visible, stageCounts,
    filterStage, setFilterStage,
    search, setSearch,
    modal, setModal,
    addLead, editLead, deleteLead,
  } = useLeads()

  const [showChart, setShowChart] = useState(false)

  const totalLeads = stageCounts['All'] || 0
  const wonLeads = stageCounts['Won'] || 0
  const winRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

  function downloadCSV() {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Stage', 'Notes', 'Created']
    const rows = visible.map(p => [
      p.name,
      p.company || '',
      p.email || '',
      p.phone || '',
      p.stage,
      (p.notes || '').replace(/"/g, '""'),
      p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
    ].map(v => `"${v}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prospects-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Theme-aware style tokens
  const bg = isDark ? '#050814' : '#f0f4ff'
  const navBg = isDark ? 'rgba(5,8,20,0.85)' : 'rgba(255,255,255,0.9)'
  const navBorder = isDark ? 'rgba(255,255,255,0.05)' : '#e0e7ff'
  const logoText = isDark ? '#fff' : '#1e293b'
  const statsMuted = isDark ? '#475569' : '#94a3b8'
  const statsAccent = isDark ? '#e2e8f0' : '#1e293b'
  const winColor = isDark ? '#6ee7b7' : '#047857'
  const countColor = isDark ? '#6b7280' : '#94a3b8'
  const searchBg = isDark ? 'rgba(13,21,48,0.8)' : '#fff'
  const searchBorder = isDark ? 'rgba(255,255,255,0.07)' : '#e0e7ff'
  const searchColor = isDark ? '#e2e8f0' : '#1e293b'
  const resultColor = isDark ? '#475569' : '#94a3b8'
  const resultAccent = isDark ? '#818cf8' : '#6366f1'

  return (
    <div className="min-h-screen relative" style={{ background: bg, transition: 'background 0.3s ease' }}>
      {/* Grid background */}
      <div className={isDark ? 'grid-bg-dark' : 'grid-bg-light'} style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }} />

      {/* Ambient glow blobs — only in dark mode */}
      {isDark && <>
        <div className="fixed pointer-events-none" style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', top: '-200px', left: '-100px' }} />
        <div className="fixed pointer-events-none" style={{ width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.04) 0%, transparent 70%)', bottom: '-100px', right: '-100px' }} />
      </>}

      {/* Top Nav */}
      <header
        className="relative z-10 px-6 py-4"
        style={{ borderBottom: `1px solid ${navBorder}`, background: navBg, backdropFilter: 'blur(16px)', transition: 'all 0.3s ease' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-base font-display tracking-tight" style={{ color: logoText }}>Lead Tracker</span>
              <span className="ml-2 text-[10px] font-mono text-indigo-400/70 bg-indigo-500/10 px-1.5 py-0.5 rounded">v1.0</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 text-xs" style={{ color: statsMuted }}>
              <span className="font-mono">
                <span className="font-semibold" style={{ color: statsAccent }}>{totalLeads}</span> prospects
              </span>
              <span className="w-px h-3" style={{ background: navBorder }} />
              <span className="font-mono">
                <span className="font-semibold" style={{ color: winColor }}>{winRate}%</span> win rate
              </span>
            </div>

            {/* ── Theme Toggle ── */}
            <button
              onClick={toggleTheme}
              className={`theme-toggle ${isDark ? 'dark-mode' : 'light-mode'}`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              <div className="theme-toggle-thumb">
                {isDark ? '🌙' : '☀️'}
              </div>
            </button>

            {/* Add button */}
            <button
              onClick={() => setModal({ type: 'add' })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all active:scale-95 font-display"
              style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add prospect
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* Stage stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {STAGES.map(stage => {
            const meta = STAGE_META[stage]
            const count = stageCounts[stage] || 0
            const isActive = filterStage === stage

            const cardBg = isDark
              ? isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))' : 'rgba(13,21,48,0.6)'
              : isActive ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)' : '#fff'

            const cardShadow = isDark
              ? isActive ? '0 0 20px rgba(99,102,241,0.15), 0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.2)'
              : isActive ? '0 0 0 1.5px #a5b4fc, 0 4px 12px rgba(99,102,241,0.12)' : '0 2px 8px rgba(99,102,241,0.06), 0 0 0 1px #e0e7ff'

            const countColor2 = isDark ? (isActive ? '#fff' : '#e2e8f0') : (isActive ? '#3730a3' : '#1e293b')
            const labelColor2 = isDark ? (isActive ? meta.accent : '#475569') : (isActive ? '#6366f1' : '#94a3b8')

            return (
              <button
                key={stage}
                onClick={() => setFilterStage(filterStage === stage ? 'All' : stage)}
                className="stat-card text-left p-4 rounded-2xl transition-all duration-200"
                style={{ background: cardBg, boxShadow: cardShadow, border: isDark && !isActive ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <div className="text-xs mb-1">{meta.icon}</div>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: countColor2 }}>{count}</div>
                <div className="text-[10px] font-semibold tracking-widest font-display" style={{ color: labelColor2 }}>
                  {stage.toUpperCase()}
                </div>
                <div
                  className="pipeline-bar mt-2.5"
                  style={{
                    width: '100%',
                    opacity: isActive ? 1 : 0.25,
                    background: `linear-gradient(90deg, ${meta.accent}, transparent)`,
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center justify-between">
          <StageFilter active={filterStage} counts={stageCounts} onChange={setFilterStage} isDark={isDark} />

          <div className="flex items-center gap-2">
            {/* Pipeline Chart button */}
            <button
              onClick={() => setShowChart(true)}
              title="View pipeline breakdown"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 font-display"
              style={isDark
                ? { background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }
                : { background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
              </svg>
              Pipeline
            </button>

            {/* CSV Download button */}
            <button
              onClick={downloadCSV}
              title="Download prospects as CSV"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 font-display"
              style={isDark
                ? { background: 'rgba(52,211,153,0.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)' }
                : { background: '#f0fdf4', color: '#047857', border: '1px solid #a7f3d0' }
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>

            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: isDark ? '#475569' : '#94a3b8' }} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, company, email…"
                className="pl-9 pr-4 py-2 text-sm rounded-xl input-field transition-all w-64"
                style={{ background: searchBg, border: `1px solid ${searchBorder}`, color: searchColor }}
              />
            </div>
          </div>
        </div>

        {/* Result count */}
        <p className="text-[11px] mb-3 font-mono" style={{ color: resultColor }}>
          <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{visible.length}</span> prospect{visible.length !== 1 ? 's' : ''}
          {filterStage !== 'All' ? <span style={{ color: resultAccent }}> · {filterStage}</span> : ''}
          {search ? <span> · matching "{search}"</span> : ''}
        </p>

        {/* Table */}
        <ProspectTable
          prospects={visible}
          onEdit={lead => setModal({ type: 'edit', lead })}
          onDelete={lead => setModal({ type: 'delete', lead })}
          isDark={isDark}
        />
      </main>

      {/* ── Modals ── */}
      {modal?.type === 'add' && (
        <Modal title="Add prospect" onClose={() => setModal(null)} isDark={isDark}>
          <ProspectForm onSave={addLead} onCancel={() => setModal(null)} isDark={isDark} />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title="Edit prospect" onClose={() => setModal(null)} isDark={isDark}>
          <ProspectForm initial={modal.lead} onSave={editLead} onCancel={() => setModal(null)} isDark={isDark} />
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title="Delete prospect?" onClose={() => setModal(null)} size="sm" isDark={isDark}>
          <div className="flex items-center gap-3 mb-5 p-3 rounded-xl"
            style={{ background: isDark ? 'rgba(239,68,68,0.08)' : '#fff5f5', border: isDark ? '1px solid rgba(239,68,68,0.15)' : '1px solid #fca5a5' }}>
            <div className="text-xl">⚠️</div>
            <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              This will permanently remove{' '}
              <span className="font-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{modal.lead.name}</span>
              {modal.lead.company && ` from ${modal.lead.company}`}. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setModal(null)}
              className="px-4 py-2 text-sm rounded-xl font-medium transition-colors"
              style={isDark
                ? { border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }
                : { border: '1px solid #e2e8f0', color: '#64748b' }
              }
            >
              Cancel
            </button>
            <button
              onClick={deleteLead}
              className="px-4 py-2 text-sm rounded-xl font-semibold text-white transition-all active:scale-95 font-display"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 0 16px rgba(239,68,68,0.25)' }}
            >
              Delete prospect
            </button>
          </div>
        </Modal>
      )}
      {/* ── Pipeline Chart Modal ── */}
      {showChart && (
        <PipelineChart
          stageCounts={stageCounts}
          isDark={isDark}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  )
}
