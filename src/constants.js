export const STAGES = [
  'Lead',
  'Contacted',
  'Qualified',
  'Proposal',
  'Won',
  'Lost',
]

export const STAGE_META = {
  Lead:       { darkBg: 'rgba(51,65,85,0.6)',    lightBg: 'rgba(226,232,240,0.8)',   darkText: '#94a3b8', lightText: '#475569', dot: 'bg-slate-400',    accent: '#94a3b8', glow: 'rgba(148,163,184,0.2)', icon: '🎯' },
  Contacted:  { darkBg: 'rgba(30,58,138,0.45)',  lightBg: 'rgba(219,234,254,0.9)',   darkText: '#93c5fd', lightText: '#1d4ed8', dot: 'bg-blue-400',     accent: '#60a5fa', glow: 'rgba(96,165,250,0.2)',  icon: '📨' },
  Qualified:  { darkBg: 'rgba(120,53,15,0.4)',   lightBg: 'rgba(254,243,199,0.9)',   darkText: '#fcd34d', lightText: '#b45309', dot: 'bg-amber-400',    accent: '#fbbf24', glow: 'rgba(251,191,36,0.2)',  icon: '✅' },
  Proposal:   { darkBg: 'rgba(76,29,149,0.45)',  lightBg: 'rgba(237,233,254,0.9)',   darkText: '#c4b5fd', lightText: '#6d28d9', dot: 'bg-violet-400',   accent: '#a78bfa', glow: 'rgba(167,139,250,0.2)', icon: '📄' },
  Won:        { darkBg: 'rgba(6,78,59,0.45)',    lightBg: 'rgba(209,250,229,0.9)',   darkText: '#6ee7b7', lightText: '#047857', dot: 'bg-emerald-400',  accent: '#34d399', glow: 'rgba(52,211,153,0.2)',  icon: '🏆' },
  Lost:       { darkBg: 'rgba(127,29,29,0.4)',   lightBg: 'rgba(254,226,226,0.9)',   darkText: '#fca5a5', lightText: '#b91c1c', dot: 'bg-red-500',      accent: '#f87171', glow: 'rgba(248,113,113,0.2)', icon: '❌' },
}

export const EMPTY_FORM = {
  name: '',
  company: '',
  email: '',
  phone: '',
  stage: 'Lead',
  notes: '',
}
