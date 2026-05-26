import { useState, useMemo } from 'react'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('vanta_leads')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(leads) {
  localStorage.setItem('vanta_leads', JSON.stringify(leads))
}

export function useLeads() {
  const [leads, setLeads] = useState(loadFromStorage)
  const [filterStage, setFilterStage] = useState('All')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | {type:'add'|'edit'|'delete', lead?}

  function persist(next) {
    setLeads(next)
    saveToStorage(next)
  }

  function addLead(form) {
    const next = [{ ...form, id: crypto.randomUUID(), createdAt: Date.now() }, ...leads]
    persist(next)
    setModal(null)
  }

  function editLead(form) {
    const next = leads.map(l => l.id === modal.lead.id ? { ...l, ...form } : l)
    persist(next)
    setModal(null)
  }

  function deleteLead() {
    const next = leads.filter(l => l.id !== modal.lead.id)
    persist(next)
    setModal(null)
  }

  // Stage counts — always from full list, not filtered
  const stageCounts = useMemo(() => {
    const counts = { All: leads.length }
    for (const l of leads) {
      counts[l.stage] = (counts[l.stage] || 0) + 1
    }
    return counts
  }, [leads])

  // Filtered + searched list
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter(l => {
      if (filterStage !== 'All' && l.stage !== filterStage) return false
      if (!q) return true
      return (
        l.name.toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q)
      )
    })
  }, [leads, filterStage, search])

  return {
    leads,
    visible,
    stageCounts,
    filterStage, setFilterStage,
    search, setSearch,
    modal, setModal,
    addLead, editLead, deleteLead,
  }
}
