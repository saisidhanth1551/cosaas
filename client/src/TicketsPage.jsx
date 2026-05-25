import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './AuthContext'

const floorBranches = [
  { label: 'Bengaluru Indiranagar', value: 'indiranagar' },
  { label: 'Mumbai BKC', value: 'mumbai-bkc' },
  { label: 'Gurugram Cyber City', value: 'gurugram-cyber-city' },
  { label: 'Hyderabad HITEC', value: 'hyderabad' },
  { label: 'Bangalore Koramangala', value: 'bangalore' },
  { label: 'Chennai OMR', value: 'chennai' },
]

const priorities = ['low', 'medium', 'high', 'critical']
const statuses = ['open', 'in progress', 'resolved']

const staffMembers = [
  'Vikram Sharma (Maintenance)',
  'Pooja Hegde (IT Support)',
  'Amit Patel (Pantry Services)',
  'Sanjay Dutt (Carpentry)',
  'Rohan Das (Security & IT)',
  'Karan Johar (Admin Ops)'
]

const today = new Date().toISOString().split('T')[0]

// Spring animations
const springTransition = { type: 'spring', stiffness: 300, damping: 22 }

const pageVariants = {
  initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(8px)' },
}

export default function TicketsPage() {
  const { user, token } = useAuth()
  const [activeBranch, setActiveBranch] = useState(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      return user.branch.toLowerCase()
    }
    return 'indiranagar'
  })
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // Raise Ticket Form State
  const [showRaiseModal, setShowRaiseModal] = useState(false)
  const [ticketTitle, setTicketTitle] = useState('')
  const [ticketDesc, setTicketDesc] = useState('')
  const [ticketPriority, setTicketPriority] = useState('medium')
  const [ticketReportedBy, setTicketReportedBy] = useState('')

  // Resolve / Update Drawer State
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [updateStatus, setUpdateStatus] = useState('open')
  const [updatePriority, setUpdatePriority] = useState('medium')
  const [updateStaff, setUpdateStaff] = useState('Unassigned')
  const [updateNotes, setUpdateNotes] = useState('')

  // Toast State
  const [toast, setToast] = useState(null)

  // Sync active branch once user is hydrated
  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      setActiveBranch(user.branch.toLowerCase())
    }
  }, [user])

  // Fetch Tickets
  const fetchTickets = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tickets?branch=${activeBranch}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      } else {
        console.error('Failed to load support tickets')
      }
    } catch (err) {
      console.error('Tickets fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchTickets()
    }
  }, [activeBranch, token])

  // Toast Auto-Dismissal
  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timeout)
  }, [toast])

  const activeBranchData = floorBranches.find((branch) => branch.value === activeBranch)
  const branchLabel = activeBranchData?.label || 'Indiranagar'

  // Submit Raise Ticket Form
  const handleRaiseSubmit = async (e) => {
    e.preventDefault()
    if (!ticketTitle.trim() || !ticketDesc.trim() || !ticketReportedBy.trim()) return

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: ticketTitle.trim(),
          description: ticketDesc.trim(),
          priority: ticketPriority,
          reportedBy: ticketReportedBy.trim(),
          branch: activeBranch
        })
      })

      const data = await response.json()

      if (response.ok) {
        setTickets(prev => [data, ...prev])
        setShowRaiseModal(false)
        setTicketTitle('')
        setTicketDesc('')
        setTicketPriority('medium')
        setTicketReportedBy('')
        setToast({
          message: 'Ticket Submitted!',
          desc: `"${data.title}" raised successfully in ${branchLabel}.`,
          type: 'success'
        })
      } else {
        setToast({
          message: 'Failed to Submit Ticket',
          desc: data.error || 'Server rejected submission.',
          type: 'error'
        })
      }
    } catch (err) {
      console.error('Raise ticket error:', err)
    }
  }

  // Submit Quick Update / Resolve Form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/tickets/${selectedTicket._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: updateStatus,
          priority: updatePriority,
          assignedStaff: updateStaff,
          resolutionNotes: updateNotes.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        setTickets(prev => prev.map(t => t._id === data._id ? data : t))
        setSelectedTicket(null)
        setToast({
          message: 'Support Ticket Updated!',
          desc: `"${data.title}" status successfully set to "${data.status}".`,
          type: 'success'
        })
      } else {
        setToast({
          message: 'Update Failed',
          desc: data.error || 'Check authorization permissions.',
          type: 'error'
        })
      }
    } catch (err) {
      console.error('Update ticket error:', err)
    }
  }

  // Open Resolution Drawer
  const openUpdateDrawer = (ticket) => {
    setSelectedTicket(ticket)
    setUpdateStatus(ticket.status)
    setUpdatePriority(ticket.priority)
    setUpdateStaff(ticket.assignedStaff || 'Unassigned')
    setUpdateNotes(ticket.resolutionNotes || '')
  }

  // Dynamically Compute Support Metrics
  const totalActive = tickets.filter(t => t.status !== 'resolved').length
  const criticalOpen = tickets.filter(t => t.status !== 'resolved' && (t.priority === 'critical' || t.priority === 'high')).length
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length
  const resolvedRate = tickets.length > 0 ? Math.round((resolvedCount / tickets.length) * 100) : 0

  // Priority Styles Map
  const priorityStyles = {
    low: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    medium: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
    high: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    critical: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse'
  }

  // Status Styles Map
  const statusStyles = {
    open: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'in progress': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  }

  return (
    <>
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`fixed right-6 top-6 z-50 flex max-w-sm flex-col rounded-xl border p-4 shadow-2xl backdrop-blur-xl ${
              toast.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-950/90 text-white'
                : 'border-rose-500/20 bg-rose-950/90 text-white'
            }`}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            layout
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{toast.type === 'success' ? '✅' : '⚠️'}</span>
              <div>
                <h4 className="text-sm font-semibold">{toast.message}</h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">{toast.desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate="animate"
        className="flex flex-col gap-5"
        exit="exit"
        initial="initial"
        transition={{ duration: 0.28, ease: 'easeOut' }}
        variants={pageVariants}
      >
        {/* Support Header */}
        <motion.article
          className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5"
          transition={springTransition}
          whileHover={{ borderColor: 'rgba(34, 211, 238, 0.24)' }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Support tickets queue</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{branchLabel} Support</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Track coworking hardware, IT infrastructure, pantry services, and facility tickets.
                Update priority assignments or log resolution steps in real time.
              </p>
            </div>

            {/* Dropdown Branch Selection */}
            <div className="w-full sm:w-56">
              <label className="text-xs font-medium uppercase text-slate-500" htmlFor="ticket-branch">
                Active Location
              </label>
              <select
                className={`mt-2 min-h-10 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3 text-sm text-white outline-none transition focus:border-cyan-300 ${
                  user?.role?.toLowerCase() !== 'admin' ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                }`}
                id="ticket-branch"
                disabled={user?.role?.toLowerCase() !== 'admin'}
                onChange={(e) => setActiveBranch(e.target.value)}
                value={activeBranch}
              >
                {floorBranches.map((branch) => (
                  <option className="bg-slate-950" key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
              {user?.role?.toLowerCase() !== 'admin' && (
                <span className="mt-1.5 block text-right text-[10px] text-cyan-300 font-medium">
                  🔒 Profile Branch locked to {user?.branch}
                </span>
              )}
            </div>
          </div>
        </motion.article>

        {/* Dynamic Support Metrics Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
            whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <span className="text-xs font-medium uppercase text-slate-400">Support Backlog</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{totalActive}</span>
              <span className="text-xs font-medium text-slate-400">open tickets</span>
            </div>
          </motion.div>

          <motion.div
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
            whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <span className="text-xs font-medium uppercase text-slate-400">Critical & Urgent</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-rose-400">{criticalOpen}</span>
              <span className="text-xs font-medium text-slate-400">priority items</span>
            </div>
          </motion.div>

          <motion.div
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
            whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <span className="text-xs font-medium uppercase text-slate-400">Resolution Rate</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-400">{resolvedRate}%</span>
              <span className="text-xs font-medium text-slate-400">completed</span>
            </div>
          </motion.div>
        </div>

        {/* Support Queue Filters & Operations Board */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white">Tickets Backlog</h3>
            <button
              className="rounded-lg bg-cyan-400 px-4 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
              onClick={() => setShowRaiseModal(true)}
              type="button"
            >
              🎟️ Raise Ticket
            </button>
          </div>

          {/* Ticket Records Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-12 text-center text-slate-400">
                <span className="inline-block animate-spin text-2xl mr-2">🌀</span>
                Reading support desk queues...
              </div>
            ) : tickets.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-white/10 rounded-xl bg-black/20">
                ✨ Zero support tickets reported for {branchLabel}.
              </div>
            ) : (
              tickets.map((ticket) => (
                <motion.div
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11141c]/60 p-5 shadow-xl backdrop-blur-md"
                  key={ticket._id}
                  whileHover={{ y: -3, borderColor: 'rgba(34, 211, 238, 0.24)' }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        priorityStyles[ticket.priority]
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        statusStyles[ticket.status]
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="mt-4 font-bold text-white text-base leading-snug">{ticket.title}</h4>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">{ticket.description}</p>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>Reported by:</span>
                        <span className="font-semibold text-slate-300">{ticket.reportedBy}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Assignee:</span>
                        <span className="font-semibold text-cyan-300 flex items-center gap-1">
                          🛠️ {ticket.assignedStaff || 'Unassigned'}
                        </span>
                      </div>
                      {ticket.resolutionNotes && (
                        <div className="mt-3 rounded bg-black/30 p-2.5 border border-white/5">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resolution Notes</p>
                          <p className="mt-1 text-[11px] text-emerald-300 leading-relaxed">{ticket.resolutionNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Resolution Action */}
                    {ticket.status !== 'resolved' && (
                      <button
                        className="mt-5 w-full rounded-lg bg-white/5 border border-white/10 py-2 text-center text-xs font-semibold text-white transition hover:bg-white/10 hover:border-cyan-300/35"
                        onClick={() => openUpdateDrawer(ticket)}
                        type="button"
                      >
                        ⚙️ Update / Resolve
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Raise Ticket Dialog Modal */}
      <AnimatePresence>
        {showRaiseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setShowRaiseModal(false)}
            />

            {/* Modal Body */}
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#161a24] p-6 shadow-2xl text-white"
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Support Ticketing</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">Raise Support Ticket</h3>
                </div>
                <button
                  className="rounded-full bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setShowRaiseModal(false)}
                  type="button"
                >
                  ✖
                </button>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleRaiseSubmit}>
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="ticket-title">
                    Issue Title
                  </label>
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-300"
                    id="ticket-title"
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="e.g. Kaveri pod AC not cooling"
                    required
                    type="text"
                    value={ticketTitle}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="ticket-desc">
                    Describe the Issue
                  </label>
                  <textarea
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-300 min-h-[90px] resize-none"
                    id="ticket-desc"
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Please specify unit details, location or specific behaviors"
                    required
                    value={ticketDesc}
                  />
                </div>

                {/* Reporter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="ticket-rep">
                    Reported By (Client/Staff)
                  </label>
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-300"
                    id="ticket-rep"
                    onChange={(e) => setTicketReportedBy(e.target.value)}
                    placeholder="e.g. Swiggy Growth ops"
                    required
                    type="text"
                    value={ticketReportedBy}
                  />
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="ticket-priority">
                    Priority Level
                  </label>
                  <select
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300 cursor-pointer"
                    id="ticket-priority"
                    onChange={(e) => setTicketPriority(e.target.value)}
                    value={ticketPriority}
                  >
                    {priorities.map(p => (
                      <option className="bg-slate-950" key={p} value={p}>
                        {p.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="mt-6 w-full rounded-lg bg-cyan-400 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
                  type="submit"
                >
                  File Support Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resolution Update Sidebar Drawer */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
            />

            {/* Drawer Body */}
            <motion.div
              animate={{ x: 0 }}
              className="relative h-full w-full max-w-md border-l border-white/10 bg-[#161a24] p-6 shadow-2xl text-white flex flex-col justify-between overflow-y-auto"
              exit={{ x: '100%' }}
              initial={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Resolution Drawer</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Manage Ticket</h3>
                  </div>
                  <button
                    className="rounded-full bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setSelectedTicket(null)}
                    type="button"
                  >
                    ✖
                  </button>
                </div>

                {/* Ticket Details Panel */}
                <div className="mt-5 rounded-lg bg-black/35 p-4 border border-white/5">
                  <h4 className="font-bold text-sm text-white">{selectedRoom => selectedTicket.title}</h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{selectedTicket.description}</p>
                  <p className="mt-3 text-[10px] text-slate-500">Reported by {selectedTicket.reportedBy} inside {branchLabel}</p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleUpdateSubmit}>
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="up-status">
                      Status Queue
                    </label>
                    <select
                      className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300 cursor-pointer"
                      id="up-status"
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      value={updateStatus}
                    >
                      {statuses.map(s => (
                        <option className="bg-slate-950" key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="up-pri">
                      Update Priority
                    </label>
                    <select
                      className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300 cursor-pointer"
                      id="up-pri"
                      onChange={(e) => setUpdatePriority(e.target.value)}
                      value={updatePriority}
                    >
                      {priorities.map(p => (
                        <option className="bg-slate-950" key={p} value={p}>
                          {p.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Staff Assignment Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="up-staff">
                      Assigned Specialist
                    </label>
                    <select
                      className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300 cursor-pointer"
                      id="up-staff"
                      onChange={(e) => setUpdateStaff(e.target.value)}
                      value={updateStaff}
                    >
                      <option className="bg-slate-950" value="Unassigned">Unassigned</option>
                      {staffMembers.map(member => (
                        <option className="bg-slate-950" key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resolution Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="up-notes">
                      Resolution Logs / Notes
                    </label>
                    <textarea
                      className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-300 min-h-[90px] resize-none"
                      id="up-notes"
                      onChange={(e) => setUpdateNotes(e.target.value)}
                      placeholder="Add details about checks performed, fix applied, or replacement parts..."
                      value={updateNotes}
                    />
                  </div>

                  <button
                    className="mt-5 w-full rounded-lg bg-cyan-400 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
                    type="submit"
                  >
                    Save Changes & Update Backlog
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
