import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Phone, FileText, CheckCircle, Plus, Search, Filter, Trash2, Edit, Save } from 'lucide-react'

const STAGES = [
  { id: 'lead', label: 'Lead', icon: Sparkles, color: 'border-cyan-400/40 bg-cyan-400/5 text-cyan-300 shadow-cyan-950/20 hover:border-cyan-400/60', hoverGlow: 'rgba(34,211,238,0.12)', borderActive: 'border-cyan-400', badgeColor: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20' },
  { id: 'contacted', label: 'Contacted', icon: Phone, color: 'border-amber-300/40 bg-amber-300/5 text-amber-200 shadow-amber-950/20 hover:border-amber-300/60', hoverGlow: 'rgba(252,211,77,0.12)', borderActive: 'border-amber-300', badgeColor: 'bg-amber-300/10 text-amber-200 border-amber-300/20' },
  { id: 'proposal', label: 'Proposal', icon: FileText, color: 'border-indigo-400/40 bg-indigo-400/5 text-indigo-300 shadow-indigo-950/20 hover:border-indigo-400/60', hoverGlow: 'rgba(129,140,248,0.12)', borderActive: 'border-indigo-400', badgeColor: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/20' },
  { id: 'converted', label: 'Converted', icon: CheckCircle, color: 'border-emerald-400/40 bg-emerald-400/5 text-emerald-200 shadow-emerald-950/20 hover:border-emerald-400/60', hoverGlow: 'rgba(52,211,153,0.12)', borderActive: 'border-emerald-400', badgeColor: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20' },
]

const BRANCHES = {
  'indiranagar': 'Bengaluru Indiranagar',
  'mumbai-bkc': 'Mumbai BKC',
  'gurugram-cyber-city': 'Gurugram Cyber City',
  'hyderabad': 'Hyderabad HITEC',
  'bangalore': 'Bangalore Koramangala',
  'chennai': 'Chennai OMR',
}

const initialLeads = [
  {
    id: 'LEAD-001',
    company: 'Zepto Ops',
    contactName: 'Aadit Palicha',
    contactTitle: 'Co-Founder & CEO',
    contactEmail: 'aadit@zepto.co',
    contactPhone: '+91 98234 56781',
    value: 120, // ₹1.2 Cr (in Lakhs)
    stage: 'lead',
    branch: 'mumbai-bkc',
    followUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // tomorrow
    notes: 'Needs a 200-seat private office wing with high-speed internet and dedicated meeting pods in BKC. Rapidly growing tech team.',
    activities: [
      { date: '2026-05-24', type: 'email', text: 'Received inbound inquiry from their admin operations manager.' }
    ]
  },
  {
    id: 'LEAD-002',
    company: 'KredX',
    contactName: 'Manish Kumar',
    contactTitle: 'Founder',
    contactEmail: 'manish@kredx.com',
    contactPhone: '+91 91102 34567',
    value: 45, // ₹45 Lakhs
    stage: 'lead',
    branch: 'indiranagar',
    followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    notes: 'Looking for 60 seats in Bengaluru Indiranagar. Transitioning from fully remote to hybrid workspace setup.',
    activities: [
      { date: '2026-05-23', type: 'note', text: 'Added KredX to lead list after cold email follow-up.' }
    ]
  },
  {
    id: 'LEAD-003',
    company: 'Ather Energy',
    contactName: 'Tarun Mehta',
    contactTitle: 'CEO',
    contactEmail: 'tarun@atherenergy.com',
    contactPhone: '+91 99001 12233',
    value: 85, // ₹85 Lakhs
    stage: 'contacted',
    branch: 'indiranagar',
    followUpDate: new Date(Date.now()).toISOString().slice(0, 10), // today
    notes: 'Initial pitch done. Tarun requested detailed floor plans of Indiranagar Focus Zone and custom private cabins with EV testing bench access.',
    activities: [
      { date: '2026-05-20', type: 'call', text: 'First call with Tarun. He is keen on Indiranagar for his design team.' },
      { date: '2026-05-22', type: 'meeting', text: 'Virtual meeting showing our 3D space layouts. Great feedback on ergonomics.' }
    ]
  },
  {
    id: 'LEAD-004',
    company: 'Groww Markets',
    contactName: 'Lalit Keshre',
    contactTitle: 'Founder',
    contactEmail: 'lalit@groww.in',
    contactPhone: '+91 98888 77777',
    value: 180, // ₹1.8 Cr
    stage: 'contacted',
    branch: 'indiranagar',
    followUpDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
    notes: 'Moving operations of their customer support division. Needs 300 hot-desks and an isolated training room with access controls.',
    activities: [
      { date: '2026-05-21', type: 'call', text: 'Introduced by HDFC Bank reference. Exploring flexible workspace options.' }
    ]
  },
  {
    id: 'LEAD-005',
    company: 'Razorpay Checkout',
    contactName: 'Harshil Mathur',
    contactTitle: 'Co-founder',
    contactEmail: 'harshil@razorpay.com',
    contactPhone: '+91 97777 66666',
    value: 240, // ₹2.4 Cr
    stage: 'proposal',
    branch: 'indiranagar',
    followUpDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    notes: 'Customized fit-out proposal sent for a 350-seat dedicated wing in Indiranagar. Discussing lock-in period and security deposits.',
    activities: [
      { date: '2026-05-15', type: 'call', text: 'Inbound request for expansion space due to new product launch.' },
      { date: '2026-05-18', type: 'meeting', text: 'Site visit completed. Harshil liked the cafeteria and community space.' },
      { date: '2026-05-22', type: 'email', text: 'Custom proposal with commercial terms and layouts shared.' }
    ]
  },
  {
    id: 'LEAD-006',
    company: 'Meesho Support',
    contactName: 'Sanjeev Barnwal',
    contactTitle: 'CTO & Co-Founder',
    contactEmail: 'sanjeev@meesho.com',
    contactPhone: '+91 96666 55555',
    value: 95, // ₹95 Lakhs
    stage: 'proposal',
    branch: 'gurugram-cyber-city',
    followUpDate: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
    notes: 'Negotiating desk rates for 120 support staff. Currently offering ₹9,200/desk against our standard rate of ₹11,800/mo.',
    activities: [
      { date: '2026-05-19', type: 'meeting', text: 'Discussed pricing and desk options with Meesho procurement team.' },
      { date: '2026-05-23', type: 'call', text: 'Sanjeev asked for custom SLA terms regarding backup power and high speed fiber routes.' }
    ]
  },
  {
    id: 'LEAD-007',
    company: 'Zoho Operations',
    contactName: 'Sridhar Vembu',
    contactTitle: 'Founder & CEO',
    contactEmail: 'svembu@zoho.com',
    contactPhone: '+91 95555 44444',
    value: 320, // ₹3.2 Cr
    stage: 'converted',
    branch: 'mumbai-bkc',
    followUpDate: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
    notes: 'Contract signed! Move-in scheduled for 250 enterprise seats in Mumbai BKC starting 1st of next month. Initial payment secured.',
    activities: [
      { date: '2026-05-10', type: 'meeting', text: 'Final contract negotiation in Zoho offices.' },
      { date: '2026-05-15', type: 'email', text: 'Received signed digital copy of the license agreement.' },
      { date: '2026-05-20', type: 'note', text: 'Advance billing processed and invoice raised. Payment credited.' }
    ]
  },
  {
    id: 'LEAD-008',
    company: 'Urban Company',
    contactName: 'Abhiraj Bhal',
    contactTitle: 'Co-founder',
    contactEmail: 'abhiraj@urbancompany.com',
    contactPhone: '+91 94444 33333',
    value: 150, // ₹1.5 Cr
    stage: 'converted',
    branch: 'gurugram-cyber-city',
    followUpDate: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10),
    notes: 'Agreement executed. 180 seats set up in Gurugram Cyber City Focus Zone. Move-in completed successfully last week.',
    activities: [
      { date: '2026-05-05', type: 'meeting', text: 'Final layout walk-through with their facilities manager.' },
      { date: '2026-05-12', type: 'note', text: 'Handed over desk keys and RFID access badges. Staff active.' }
    ]
  }
]

export default function CRMPage() {
  const [leads, setLeads] = useState(initialLeads)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [draggedLeadId, setDraggedLeadId] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)
  
  // Modals state
  const [selectedLead, setSelectedLead] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    company: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    value: '',
    stage: 'lead',
    branch: 'indiranagar',
    followUpDate: new Date().toISOString().slice(0, 10),
    notes: ''
  })

  // Edit Lead Form State (For drawer)
  const [newActivity, setNewActivity] = useState({ type: 'call', text: '' })

  // Trigger Toast auto-close
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(id)
  }, [toast])

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchSearch = `${lead.company} ${lead.contactName} ${lead.contactTitle} ${lead.notes}`.toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchBranch = selectedBranch === 'all' || lead.branch === selectedBranch
      return matchSearch && matchBranch
    })
  }, [leads, searchTerm, selectedBranch])

  // Pipeline Metrics
  const metrics = useMemo(() => {
    const activeStages = ['lead', 'contacted', 'proposal']
    const activeLeads = filteredLeads.filter(l => activeStages.includes(l.stage))
    const convertedLeads = filteredLeads.filter(l => l.stage === 'converted')
    
    const activeVal = activeLeads.reduce((sum, l) => sum + l.value, 0)
    const convertedVal = convertedLeads.reduce((sum, l) => sum + l.value, 0)
    
    // Follow-ups due today or overdue
    const todayStr = new Date().toISOString().slice(0, 10)
    const pendingFollowUps = activeLeads.filter(l => l.followUpDate <= todayStr).length

    return {
      activePipelineVal: activeVal / 100, // convert Lakhs to Crores
      convertedRevenueVal: convertedVal / 100,
      activeCount: activeLeads.length,
      pendingFollowUps
    }
  }, [filteredLeads])

  // Lead moving handler
  const handleMoveLead = (leadId, targetStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId && lead.stage !== targetStage) {
        // Log stage change as an activity
        const newAct = {
          date: new Date().toISOString().slice(0, 10),
          type: 'note',
          text: `Moved lead stage from "${STAGES.find(s => s.id === lead.stage)?.label}" to "${STAGES.find(s => s.id === targetStage)?.label}".`
        }
        
        // Show Toast
        setToast({
          title: 'Pipeline Updated',
          message: `${lead.company} advanced to ${STAGES.find(s => s.id === targetStage)?.label}`,
          type: 'success'
        })

        const updatedLead = {
          ...lead,
          stage: targetStage,
          activities: [newAct, ...lead.activities]
        }

        // If drawer is open, update selected lead details in real-time
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updatedLead)
        }

        return updatedLead
      }
      return lead
    }))
  }

  // Create New Lead
  const handleCreateLead = (e) => {
    e.preventDefault()
    if (!newLead.company.trim() || !newLead.contactName.trim() || !newLead.value) return

    const leadId = `LEAD-0${100 + leads.length + 1}`
    const leadVal = parseFloat(newLead.value)

    const created = {
      ...newLead,
      id: leadId,
      value: leadVal,
      activities: [
        {
          date: new Date().toISOString().slice(0, 10),
          type: 'note',
          text: `Lead created on pipeline in stage "${STAGES.find(s => s.id === newLead.stage)?.label}".`
        }
      ]
    }

    setLeads(prev => [created, ...prev])
    setIsAddModalOpen(false)
    setNewLead({
      company: '',
      contactName: '',
      contactTitle: '',
      contactEmail: '',
      contactPhone: '',
      value: '',
      stage: 'lead',
      branch: 'indiranagar',
      followUpDate: new Date().toISOString().slice(0, 10),
      notes: ''
    })

    setToast({
      title: 'Lead Added',
      message: `${created.company} successfully onboarded to the pipeline.`,
      type: 'success'
    })
  }

  // Delete Lead
  const handleDeleteLead = (leadId, companyName) => {
    setLeads(prev => prev.filter(l => l.id !== leadId))
    setSelectedLead(null)
    setToast({
      title: 'Lead Removed',
      message: `${companyName} has been deleted from CRM.`,
      type: 'warning'
    })
  }

  // Log Activity
  const handleLogActivity = (e) => {
    e.preventDefault()
    if (!newActivity.text.trim()) return

    const logged = {
      date: new Date().toISOString().slice(0, 10),
      type: newActivity.type,
      text: newActivity.text.trim()
    }

    setLeads(prev => prev.map(l => {
      if (l.id === selectedLead.id) {
        const updated = {
          ...l,
          activities: [logged, ...l.activities]
        }
        setSelectedLead(updated)
        return updated
      }
      return l
    }))

    setNewActivity(prev => ({ ...prev, text: '' }))
  }

  // Update Follow-up date
  const handleUpdateFollowUp = (date) => {
    setLeads(prev => prev.map(l => {
      if (l.id === selectedLead.id) {
        const updated = {
          ...l,
          followUpDate: date,
          activities: [
            {
              date: new Date().toISOString().slice(0, 10),
              type: 'note',
              text: `Follow-up date rescheduled to ${formatDate(date)}.`
            },
            ...l.activities
          ]
        }
        setSelectedLead(updated)
        return updated
      }
      return l
    }))
  }

  // Helpers
  const formatCurrency = (lakhs) => {
    if (lakhs >= 100) {
      return `₹${(lakhs / 100).toFixed(2)} Cr`
    }
    return `₹${lakhs} Lakhs`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '--'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getFollowUpStatus = (dateStr) => {
    const todayStr = new Date().toISOString().slice(0, 10)
    if (dateStr < todayStr) return 'overdue'
    if (dateStr === todayStr) return 'due-today'
    return 'scheduled'
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Real-time CRM Metrics Section */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Active Pipeline', value: `₹${metrics.activePipelineVal.toFixed(2)} Cr`, detail: `${metrics.activeCount} qualified leads`, accent: 'from-cyan-400 to-indigo-500' },
          { label: 'Revenue Converted', value: `₹${metrics.convertedRevenueVal.toFixed(2)} Cr`, detail: 'Across all branches', accent: 'from-emerald-400 to-teal-500' },
          { label: 'Lead Flow', value: filteredLeads.length.toString(), detail: 'Total active accounts', accent: 'from-purple-400 to-pink-500' },
          { 
            label: 'Pending Follow-ups', 
            value: metrics.pendingFollowUps.toString(), 
            detail: metrics.pendingFollowUps > 0 ? 'Urgent attention required' : 'All caught up!',
            accent: metrics.pendingFollowUps > 0 ? 'from-amber-300 to-red-500' : 'from-slate-400 to-slate-600'
          },
        ].map((stat) => (
          <article
            className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl transition duration-300 hover:y-[-4px] hover:scale-[1.01] hover:border-white/20 hover:bg-white/[0.06]"
            key={stat.label}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${stat.accent} opacity-90 shadow-md flex items-center justify-center`}>
                {stat.label.includes('Pipeline') && (
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                {stat.label.includes('Converted') && (
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {stat.label.includes('Flow') && (
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
                {stat.label.includes('Pending') && (
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="truncate text-slate-500 font-medium">{stat.detail}</span>
            </div>
          </article>
        ))}
      </section>

      {/* CRM Actions & Filters Toolbar */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/[0.02] border border-white/5 p-4 rounded-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              className="min-h-10 w-full pl-10 rounded-lg border border-white/10 bg-white/[0.04] pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.06]"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search startup leads, founders, contact details..."
              value={searchTerm}
            />
          </div>

          {/* Branch filter */}
          <div className="relative">
            <select
              className="min-h-10 w-full sm:w-48 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 pr-8 text-sm text-white outline-none transition focus:border-cyan-300/60 appearance-none [color-scheme:dark]"
              onChange={(e) => setSelectedBranch(e.target.value)}
              value={selectedBranch}
            >
              <option className="bg-slate-950" value="all">All Locations</option>
              {Object.entries(BRANCHES).map(([val, label]) => (
                <option className="bg-slate-950" key={val} value={val}>{label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Create Lead Button */}
        <button
          className="min-h-10 shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 cursor-pointer shadow-lg shadow-white/5 active:scale-95"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add New Lead
        </button>
      </section>

      {/* Kanban Pipeline Columns */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 items-start w-full">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id)
          const columnTotalValue = stageLeads.reduce((sum, l) => sum + l.value, 0)
          const isTargeted = dragOverColumn === stage.id

          return (
            <div
              className={`flex flex-col rounded-2xl border bg-[#0b0d12]/50 p-4 transition-all duration-300 shadow-xl shadow-black/20 ${
                isTargeted 
                  ? `${stage.borderActive} bg-white/[0.03] scale-[1.005] ring-2 ring-offset-2 ring-offset-[#08090d] ring-cyan-500/20` 
                  : 'border-white/5'
              }`}
              key={stage.id}
              onDragEnter={(e) => { e.preventDefault(); setDragOverColumn(stage.id); }}
              onDragLeave={() => setDragOverColumn(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const leadId = e.dataTransfer.getData('text/plain')
                handleMoveLead(leadId, stage.id)
                setDragOverColumn(null)
                setDraggedLeadId(null)
              }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  {stage.icon && <stage.icon className={`h-4 w-4 stroke-[2] ${stage.color.split(' ')[2]}`} />}
                  <h3 className="font-semibold text-white text-sm">{stage.label}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${stage.badgeColor}`}>
                    {stageLeads.length}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {formatCurrency(columnTotalValue)}
                </span>
              </div>

              {/* Draggable Cards area */}
              <div className="mt-4 flex flex-col gap-3 min-h-[350px] transition-colors duration-200">
                <AnimatePresence mode="popLayout">
                  {stageLeads.length > 0 ? (
                    stageLeads.map((lead) => {
                      const followUpStatus = getFollowUpStatus(lead.followUpDate)
                      const isDraggedCard = draggedLeadId === lead.id

                      return (
                        <motion.article
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className={`group relative rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-xl cursor-grab transition-all duration-200 hover:border-white/20 active:cursor-grabbing active:scale-98 ${
                            isDraggedCard ? 'opacity-30 border-dashed border-cyan-400' : ''
                          }`}
                          draggable
                          exit={{ opacity: 0, scale: 0.95, y: -8 }}
                          initial={{ opacity: 0, scale: 0.95, y: 8 }}
                          key={lead.id}
                          layout
                          onClick={() => setSelectedLead(lead)}
                          onDragEnd={() => { setDraggedLeadId(null); setDragOverColumn(null); }}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', lead.id)
                            e.dataTransfer.effectAllowed = 'move'
                            setDraggedLeadId(lead.id)
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                          whileHover={{ 
                            y: -2, 
                            borderColor: isDraggedCard ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.22)',
                            boxShadow: `0 12px 30px ${stage.hoverGlow}`
                          }}
                        >
                          {/* Card Content */}
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-semibold text-white text-base group-hover:text-cyan-300 transition-colors">
                              {lead.company}
                            </h4>
                            <span className="text-xs font-semibold bg-white/[0.06] rounded-md px-2 py-0.5 text-slate-300 border border-white/5">
                              {BRANCHES[lead.branch].split(' ').pop()}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-bold text-slate-200">
                            {formatCurrency(lead.value)}
                          </p>

                          <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-400 border-t border-white/5 pt-3">
                            <div className="flex items-center gap-1.5">
                              <svg className="h-3.5 w-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="truncate">{lead.contactName} ({lead.contactTitle.split(' & ')[0]})</span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1.5 gap-2">
                              {/* Follow Up Date Badge */}
                              <div className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 border text-[11px] font-medium ${
                                followUpStatus === 'overdue'
                                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                                  : followUpStatus === 'due-today'
                                  ? 'border-amber-400/40 bg-amber-400/15 text-amber-200 animate-pulse'
                                  : 'border-slate-500/20 bg-slate-500/10 text-slate-300'
                              }`}>
                                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatDate(lead.followUpDate)}</span>
                              </div>

                              <span className="text-[10px] text-slate-500 font-semibold uppercase">
                                {lead.id}
                              </span>
                            </div>
                          </div>
                        </motion.article>
                      )
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 py-10 px-4 rounded-xl border border-dashed border-white/5 bg-white/[0.01]">
                      <svg className="h-8 w-8 text-slate-600 mb-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-xs text-slate-500 font-medium text-center">No leads in {stage.label}</p>
                      {stage.id === 'lead' && (
                        <button
                          className="mt-3 text-xs text-cyan-400 font-bold hover:underline cursor-pointer"
                          onClick={() => setIsAddModalOpen(true)}
                        >
                          Create one now
                        </button>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </section>

      {/* Dynamic Slide-out Details Drawer (HubSpot/Linear style) */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-40 flex justify-end">
            {/* Modal Backdrop overlay */}
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
            />

            {/* Slide-out Panel */}
            <motion.div
              animate={{ x: 0 }}
              className="relative w-full max-w-xl h-full border-l border-white/10 bg-[#0c0e14] shadow-2xl flex flex-col z-10"
              exit={{ x: '100%' }}
              initial={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-5 shrink-0 bg-[#0d1017]">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">{selectedLead.id}</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{selectedLead.company}</h2>
                </div>
                <button
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                  onClick={() => setSelectedLead(null)}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content Area (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Status Progression Banner */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Lead Progression</span>
                    <span className="font-semibold text-white uppercase">{selectedLead.stage}</span>
                  </div>
                  <div className="flex items-center gap-1.5 h-1.5 w-full">
                    {STAGES.map((s, idx) => {
                      const currentIdx = STAGES.findIndex(item => item.id === selectedLead.stage)
                      const isComplete = idx <= currentIdx
                      return (
                        <div
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            isComplete ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-white/10'
                          }`}
                          key={s.id}
                        />
                      )
                    })}
                  </div>
                  <div className="flex gap-2 pt-2">
                    {STAGES.map(s => {
                      const isCurrent = s.id === selectedLead.stage
                      if (isCurrent) return null
                      return (
                        <button
                          className={`text-xs px-2.5 py-1 rounded-md border border-white/5 bg-white/[0.03] text-slate-300 hover:bg-white/15 cursor-pointer`}
                          key={s.id}
                          onClick={() => handleMoveLead(selectedLead.id, s.id)}
                        >
                          Move to {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Grid detailing lead properties */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-xs text-slate-500 font-semibold">Deal Value</p>
                    <p className="mt-1.5 text-lg font-bold text-white">{formatCurrency(selectedLead.value)}</p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-xs text-slate-500 font-semibold">Branch Location</p>
                    <p className="mt-1.5 text-sm font-semibold text-white">{BRANCHES[selectedLead.branch]}</p>
                  </div>
                </div>

                {/* Contact information details card */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Contact Details</h3>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300 shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{selectedLead.contactName}</p>
                        <p className="text-xs text-slate-400">{selectedLead.contactTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-400/10 text-indigo-300 shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <a className="text-slate-200 hover:text-cyan-300 hover:underline break-all" href={`mailto:${selectedLead.contactEmail}`}>
                        {selectedLead.contactEmail}
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300 shrink-0">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-slate-200">{selectedLead.contactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Follow up Scheduler */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Follow-up Schedule</h3>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <input
                        className="min-h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white outline-none transition focus:border-cyan-300/60 [color-scheme:dark]"
                        onChange={(e) => handleUpdateFollowUp(e.target.value)}
                        type="date"
                        value={selectedLead.followUpDate}
                      />
                    </div>
                    <span className="text-xs text-slate-500 text-center shrink-0">
                      Follow-up is scheduled for {formatDate(selectedLead.followUpDate)}
                    </span>
                  </div>
                </div>

                {/* General Notes details */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Requirements & General Notes</h3>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {selectedLead.notes || 'No notes currently recorded.'}
                  </div>
                </div>

                {/* Interactive Activity & Log Logger Form */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Log New Activity</h3>
                  <form className="space-y-3" onSubmit={handleLogActivity}>
                    <div className="flex gap-2">
                      {['call', 'email', 'meeting', 'note'].map(actType => (
                        <button
                          className={`text-xs px-3 py-1.5 rounded-lg border capitalize cursor-pointer transition ${
                            newActivity.type === actType
                              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                          }`}
                          key={actType}
                          onClick={() => setNewActivity(prev => ({ ...prev, type: actType }))}
                          type="button"
                        >
                          {actType}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.06] min-h-[80px]"
                      onChange={(e) => setNewActivity(prev => ({ ...prev, text: e.target.value }))}
                      placeholder={`Enter notes for logged ${newActivity.type}...`}
                      value={newActivity.text}
                    />
                    <div className="flex justify-end">
                      <button
                        className="min-h-9 px-4 rounded-lg bg-white text-slate-950 font-bold text-xs cursor-pointer hover:bg-slate-200 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={!newActivity.text.trim()}
                        type="submit"
                      >
                        Save Entry
                      </button>
                    </div>
                  </form>
                </div>

                {/* Activity & Audit log Timeline */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline / Activity Log</h3>
                  <div className="relative pl-5 border-l border-white/10 space-y-5 ml-2.5">
                    {selectedLead.activities.map((act, index) => (
                      <div className="relative" key={index}>
                        {/* Dot indicator */}
                        <span className={`absolute -left-[26px] top-1.5 h-3 w-3 rounded-full border bg-slate-900 flex items-center justify-center ${
                          act.type === 'call'
                            ? 'border-amber-400'
                            : act.type === 'email'
                            ? 'border-indigo-400'
                            : act.type === 'meeting'
                            ? 'border-cyan-400'
                            : 'border-emerald-400'
                        }`} />
                        
                        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3.5 space-y-1.5 shadow-sm">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-300 capitalize flex items-center gap-1.5">
                              {act.type === 'call' && (
                                <svg className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              )}
                              {act.type === 'email' && (
                                <svg className="h-3 w-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              )}
                              {act.type === 'meeting' && (
                                <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                              {act.type === 'note' && (
                                <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                              {act.type} Logged
                            </span>
                            <span className="text-slate-500 font-medium">{formatDate(act.date)}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{act.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Sticky Footer Actions */}
              <div className="border-t border-white/10 p-5 shrink-0 bg-[#0d1017] flex items-center justify-between">
                <button
                  className="min-h-10 inline-flex items-center gap-1.5 px-4 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition active:scale-95 cursor-pointer"
                  onClick={() => handleDeleteLead(selectedLead.id, selectedLead.company)}
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5 stroke-[2.2]" />
                  Delete Lead
                </button>
                <button
                  className="min-h-10 px-5 rounded-lg border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/[0.04] transition cursor-pointer"
                  onClick={() => setSelectedLead(null)}
                  type="button"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Creation Modal dialog */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
            />

            {/* Modal dialog panel */}
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-lg border border-white/10 bg-[#0c0e14] rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden max-h-[calc(100vh-32px)]"
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-white/10 p-5 shrink-0 bg-[#0d1017]">
                <h2 className="text-lg font-bold text-white">Create New Lead Card</h2>
                <button
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form body */}
              <form className="flex-1 overflow-y-auto p-6 space-y-4" onSubmit={handleCreateLead}>
                <div className="grid gap-4 sm:grid-cols-2">
                  
                  {/* Company Name */}
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400 sm:col-span-2">
                    Company / Startup Name *
                    <input
                      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60"
                      onChange={(e) => setNewLead(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Swiggy Support"
                      required
                      value={newLead.company}
                    />
                  </label>

                  {/* Primary Contact details */}
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                    Contact Person Name *
                    <input
                      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60"
                      onChange={(e) => setNewLead(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="e.g. Sriharsha Majety"
                      required
                      value={newLead.contactName}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                    Contact Role / Title
                    <input
                      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60"
                      onChange={(e) => setNewLead(prev => ({ ...prev, contactTitle: e.target.value }))}
                      placeholder="e.g. CEO & Co-founder"
                      value={newLead.contactTitle}
                    />
                  </label>

                  {/* Contact Methods */}
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                    Email Address
                    <input
                      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60"
                      onChange={(e) => setNewLead(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="harsha@swiggy.in"
                      type="email"
                      value={newLead.contactEmail}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                    Phone Number
                    <input
                      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60"
                      onChange={(e) => setNewLead(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+91 99999 88888"
                      value={newLead.contactPhone}
                    />
                  </label>

                  {/* Valuation Deal Value & Location */}
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                    Deal Value (in ₹ Lakhs) *
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                        ₹
                      </span>
                      <input
                        className="min-h-10 w-full pl-8 rounded-lg border border-white/10 bg-white/[0.04] pr-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60"
                        min="1"
                        onChange={(e) => setNewLead(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="e.g. 75 for ₹75 Lakhs"
                        required
                        type="number"
                        value={newLead.value}
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                    Branch Location
                    <select
                      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-cyan-300/60 [color-scheme:dark]"
                      onChange={(e) => setNewLead(prev => ({ ...prev, branch: e.target.value }))}
                      value={newLead.branch}
                    >
                      {Object.entries(BRANCHES).map(([val, label]) => (
                        <option className="bg-slate-950" key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </label>

                  {/* Initial Stage & Follow Up Date */}
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                    Initial Stage
                    <select
                      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-cyan-300/60 [color-scheme:dark]"
                      onChange={(e) => setNewLead(prev => ({ ...prev, stage: e.target.value }))}
                      value={newLead.stage}
                    >
                      {STAGES.map(s => (
                        <option className="bg-slate-950" key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                    First Follow-up Date
                    <input
                      className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white outline-none transition focus:border-cyan-300/60 [color-scheme:dark]"
                      onChange={(e) => setNewLead(prev => ({ ...prev, followUpDate: e.target.value }))}
                      type="date"
                      value={newLead.followUpDate}
                    />
                  </label>

                  {/* Requirements details notes */}
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400 sm:col-span-2">
                    Requirements Notes
                    <textarea
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60 min-h-[80px]"
                      onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g. Swiggy Support team expansion. Requires customized modular layout for their regional operations."
                      value={newLead.notes}
                    />
                  </label>
                </div>

                {/* Footer Modal Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    className="min-h-10 rounded-lg border border-white/10 px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.04] hover:text-white cursor-pointer"
                    onClick={() => setIsAddModalOpen(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="min-h-10 rounded-lg bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-slate-200 cursor-pointer flex items-center gap-1.5"
                    type="submit"
                  >
                    <Save className="h-4 w-4 stroke-[2]" />
                    Create Lead Card
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Interactive Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm rounded-xl border p-4 shadow-2xl backdrop-blur-2xl sm:w-full flex items-start gap-3.5 ${
              toast.type === 'warning'
                ? 'border-red-500/30 bg-[#160c0e]/95 text-red-200'
                : 'border-cyan-500/30 bg-[#0c1216]/95 text-cyan-200'
            }`}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            <span className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${
              toast.type === 'warning'
                ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
            }`} />
            <div>
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              <p className="mt-1 text-sm text-slate-300 leading-relaxed">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
