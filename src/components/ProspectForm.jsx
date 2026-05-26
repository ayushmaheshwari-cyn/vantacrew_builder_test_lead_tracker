import { useState } from 'react'
import { STAGES, EMPTY_FORM } from '../constants'

export default function ProspectForm({ initial, onSave, onCancel, isDark }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function set(key) {
    return e => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email'
    }
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  const baseStyle = isDark
    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }
    : { background: '#f8faff', border: '1px solid #e0e7ff', color: '#1e293b' }

  const errorStyle = isDark
    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239,68,68,0.4)', color: '#e2e8f0' }
    : { background: '#fff5f5', border: '1px solid #fca5a5', color: '#1e293b' }

  const labelColor = isDark ? '#94a3b8' : '#475569'
  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'

  const inputStyle = (field) => errors[field] ? errorStyle : baseStyle

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-2 gap-3 mb-4">

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold mb-1.5 font-display tracking-wide uppercase" style={{ color: labelColor }}>
            Name <span style={{ color: '#818cf8' }}>*</span>
          </label>
          <input
            className="w-full px-3 py-2.5 text-sm rounded-lg input-field transition-all placeholder:opacity-30"
            style={inputStyle('name')}
            value={form.name}
            onChange={set('name')}
            placeholder="Jane Doe"
            autoFocus
          />
          {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold mb-1.5 font-display tracking-wide uppercase" style={{ color: labelColor }}>Company</label>
          <input
            className="w-full px-3 py-2.5 text-sm rounded-lg input-field transition-all placeholder:opacity-30"
            style={inputStyle('company')}
            value={form.company}
            onChange={set('company')}
            placeholder="Acme Corp"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold mb-1.5 font-display tracking-wide uppercase" style={{ color: labelColor }}>Email</label>
          <input
            type="email"
            className="w-full px-3 py-2.5 text-sm rounded-lg input-field transition-all placeholder:opacity-30"
            style={inputStyle('email')}
            value={form.email}
            onChange={set('email')}
            placeholder="jane@acme.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold mb-1.5 font-display tracking-wide uppercase" style={{ color: labelColor }}>Phone</label>
          <input
            className="w-full px-3 py-2.5 text-sm rounded-lg input-field transition-all placeholder:opacity-30"
            style={inputStyle('phone')}
            value={form.phone}
            onChange={set('phone')}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-1.5 font-display tracking-wide uppercase" style={{ color: labelColor }}>Stage</label>
          <select
            className="w-full px-3 py-2.5 text-sm rounded-lg input-field cursor-pointer transition-all"
            style={{ ...baseStyle, background: isDark ? '#0d1530' : '#f8faff' }}
            value={form.stage}
            onChange={set('stage')}
          >
            {STAGES.map(s => <option key={s} value={s} style={{ background: isDark ? '#0d1530' : '#fff' }}>{s}</option>)}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-1.5 font-display tracking-wide uppercase" style={{ color: labelColor }}>Notes</label>
          <textarea
            className="w-full px-3 py-2.5 text-sm rounded-lg input-field resize-none transition-all placeholder:opacity-30"
            style={baseStyle}
            rows={3}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Context, next steps, key contacts…"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4" style={{ borderTop: `1px solid ${dividerColor}` }}>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-xl font-medium transition-colors"
          style={isDark
            ? { border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', background: 'transparent' }
            : { border: '1px solid #e2e8f0', color: '#64748b', background: 'transparent' }
          }
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm rounded-xl font-semibold text-white transition-all active:scale-95 font-display"
          style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
        >
          Save prospect
        </button>
      </div>
    </form>
  )
}
