import { useEffect } from 'react'

export default function Modal({ title, onClose, children, size = 'md', isDark }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

  const cardStyle = isDark
    ? { background: 'linear-gradient(145deg, #0d1530, #0a1020)', boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.08)', border: '1px solid rgba(255,255,255,0.07)' }
    : { background: '#ffffff', boxShadow: '0 25px 60px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e0e7ff' }

  const headerBorder = isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9'
  const titleColor = isDark ? '#fff' : '#1e293b'
  const closeStyle = isDark
    ? { color: '#64748b' }
    : { color: '#94a3b8' }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: isDark ? 'rgba(5,8,20,0.85)' : 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className={`modal-card w-full ${widths[size]} rounded-2xl overflow-hidden`}
        style={cardStyle}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: headerBorder }}>
          <h2 className="text-base font-semibold font-display" style={{ color: titleColor }}>{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors text-lg leading-none hover:bg-white/5"
            style={closeStyle}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
