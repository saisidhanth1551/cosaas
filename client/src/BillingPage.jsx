import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, AlertTriangle, Search, Filter } from 'lucide-react'
import { useAuth } from './AuthContext'

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-034',
    client: 'Zepto Ops',
    tier: '120 Dedicated Desks',
    amount: 480000,
    branch: 'indiranagar',
    dueDate: '2026-06-18',
    status: 'Paid',
    billingCycle: 'Monthly Recurring'
  },
  {
    id: 'INV-2026-035',
    client: 'Ather Energy',
    tier: 'Private Executive Suite',
    amount: 820000,
    branch: 'indiranagar',
    dueDate: '2026-05-28', // due in 3 days
    status: 'Pending',
    billingCycle: 'Quarterly Recurring'
  },
  {
    id: 'INV-2026-036',
    client: 'Razorpay Integration',
    tier: '80 Dedicated Desks + Pods',
    amount: 640000,
    branch: 'indiranagar',
    dueDate: '2026-06-25',
    status: 'Paid',
    billingCycle: 'Monthly Recurring'
  },
  {
    id: 'INV-2026-037',
    client: 'Zoho Operations',
    tier: 'Custom Wing (150 seats)',
    amount: 1450000,
    branch: 'mumbai-bkc',
    dueDate: '2026-06-12',
    status: 'Paid',
    billingCycle: 'Monthly Recurring'
  },
  {
    id: 'INV-2026-038',
    client: 'Groww HQ',
    tier: 'Dedicated Desk Block',
    amount: 520000,
    branch: 'mumbai-bkc',
    dueDate: '2026-05-20', // overdue by 5 days
    status: 'Overdue',
    billingCycle: 'Monthly Recurring'
  },
  {
    id: 'INV-2026-039',
    client: 'Cred Ops',
    tier: 'Private Studio Wing',
    amount: 980000,
    branch: 'mumbai-bkc',
    dueDate: '2026-06-02',
    status: 'Paid',
    billingCycle: 'Monthly Recurring'
  },
  {
    id: 'INV-2026-040',
    client: 'BluSmart Ops',
    tier: '50 Seats + EV Charge Pack',
    amount: 380000,
    branch: 'gurugram-cyber-city',
    dueDate: '2026-06-10',
    status: 'Paid',
    billingCycle: 'Monthly Recurring'
  },
  {
    id: 'INV-2026-041',
    client: 'PhysicsWallah',
    tier: 'Recording Lab + 40 Seats',
    amount: 620000,
    branch: 'gurugram-cyber-city',
    dueDate: '2026-05-13', // overdue by 12 days
    status: 'Overdue',
    billingCycle: 'Monthly Recurring'
  }
]

const BRANCH_LABELS = {
  'all': 'All Branches',
  'indiranagar': 'Bengaluru Indiranagar',
  'mumbai-bkc': 'Mumbai BKC',
  'gurugram-cyber-city': 'Gurugram Cyber City',
  'hyderabad': 'Hyderabad HITEC',
  'bangalore': 'Bangalore Koramangala',
  'chennai': 'Chennai OMR'
}

export default function BillingPage() {
  const { user } = useAuth()
  
  // States
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState(null)

  // Hydrate branch locking based on active role context
  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      setSelectedBranch(user.branch)
    }
  }, [user])

  // Rupee currency formatter
  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Toast handler
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Filter listings
  const filteredInvoices = invoices.filter(inv => {
    const matchesBranch = selectedBranch === 'all' || inv.branch === selectedBranch
    const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesBranch && matchesSearch
  })

  // Calculations
  const totalOutstanding = filteredInvoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const totalMonthlyMRR = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  
  const paidRevenue = filteredInvoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const activeSubscriptions = filteredInvoices.length
  
  const collectionRate = totalMonthlyMRR > 0 
    ? Math.round((paidRevenue / totalMonthlyMRR) * 100) 
    : 100

  // Quick Action triggers
  const handleRecordPayment = (invoiceId, clientName) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv
    ))
    triggerToast(`Payment recorded successfully for ${clientName}`, 'success')
  }

  const handleSendReminder = (invoiceId, clientName) => {
    triggerToast(`Urgent outstanding reminder dispatched to ${clientName} finance team.`, 'info')
  }

  const handleSuspensionAlert = (invoiceId, clientName) => {
    triggerToast(`Access card suspension warning sent to ${clientName}. Staff badge locks scheduled in 48 hours.`, 'warning')
  }

  // Get active alerts (Pending due soon or Overdue)
  const alerts = filteredInvoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`fixed bottom-5 right-5 z-50 px-4 py-3.5 rounded-xl border shadow-xl flex items-center gap-3 backdrop-blur-xl max-w-sm ${
              toast.type === 'success' ? 'bg-[#0b1b14]/90 border-emerald-500/20 text-emerald-300' :
              toast.type === 'warning' ? 'bg-[#22100b]/90 border-rose-500/20 text-rose-300' :
              'bg-[#0c1822]/90 border-cyan-500/20 text-cyan-300'
            }`}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
          >
            <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <span className="text-xs font-semibold tracking-wide leading-relaxed">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar and branch selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Revenue & Billing</h2>
          <p className="text-xs text-slate-500 mt-1">Monitor recurring leases, invoice collections, and pending badge renewals.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">Branch Context</label>
          <select
            className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-xs font-bold text-white outline-none transition focus:border-cyan-400 focus:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={user?.role?.toLowerCase() !== 'admin'}
            onChange={(e) => setSelectedBranch(e.target.value)}
            value={selectedBranch}
          >
            {Object.entries(BRANCH_LABELS).map(([val, label]) => (
              <option className="bg-slate-950 text-xs text-slate-300" key={val} value={val}>
                {label} {user?.role?.toLowerCase() !== 'admin' && val === user?.branch ? ' (Locked)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics dashboard rows */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* MRR Card */}
        <motion.article
          className="rounded-xl border border-white/10 bg-[#0b0d12]/60 p-5 shadow-lg backdrop-blur-xl relative overflow-hidden"
          whileHover={{ y: -3, borderColor: 'rgba(34, 211, 238, 0.3)' }}
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly MRR Block</p>
          <h3 className="text-2xl font-extrabold text-white tracking-tight mt-2.5">{formatINR(totalMonthlyMRR)}</h3>
          <p className="text-[10px] text-slate-400 mt-2">Aggregate total billing pipeline</p>
        </motion.article>

        {/* Total Outstanding Invoices */}
        <motion.article
          className="rounded-xl border border-white/10 bg-[#0b0d12]/60 p-5 shadow-lg backdrop-blur-xl relative overflow-hidden"
          whileHover={{ y: -3, borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-rose-500/5 rounded-bl-full pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Outstanding</p>
          <h3 className="text-2xl font-extrabold text-rose-400 tracking-tight mt-2.5">{formatINR(totalOutstanding)}</h3>
          <p className="text-[10px] text-rose-300/60 mt-2">Sum of Pending + Overdue billing</p>
        </motion.article>

        {/* Collection Efficiency */}
        <motion.article
          className="rounded-xl border border-white/10 bg-[#0b0d12]/60 p-5 shadow-lg backdrop-blur-xl relative overflow-hidden"
          whileHover={{ y: -3, borderColor: 'rgba(16, 185, 129, 0.3)' }}
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collection Rate</p>
          <h3 className="text-2xl font-extrabold text-emerald-400 tracking-tight mt-2.5">{collectionRate}%</h3>
          <div className="mt-3.5 h-1 rounded-full bg-white/5">
            <motion.div
              animate={{ width: `${collectionRate}%` }}
              className="h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              initial={{ width: 0 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.article>

        {/* Active Corporate subscriptions */}
        <motion.article
          className="rounded-xl border border-white/10 bg-[#0b0d12]/60 p-5 shadow-lg backdrop-blur-xl relative overflow-hidden"
          whileHover={{ y: -3, borderColor: 'rgba(34, 211, 238, 0.3)' }}
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Corporate Leases</p>
          <h3 className="text-2xl font-extrabold text-white tracking-tight mt-2.5">{activeSubscriptions}</h3>
          <p className="text-[10px] text-slate-400 mt-2">Desk blocks & executive suites</p>
        </motion.article>
      </div>

      {/* Alerts and Management Table Layout split */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Main Invoices list panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Billing History & Invoices</h4>
            
            <div className="relative max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                className="min-h-9 w-full pl-8 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.05]"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Corporate or Invoice ID..."
                type="text"
                value={searchTerm}
              />
            </div>
          </div>

          {/* Invoices list container */}
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b0d12]/40 backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  <th className="px-4 py-3">Invoice Ref</th>
                  <th className="px-4 py-3">Coworking Client</th>
                  <th className="px-4 py-3">Space Package</th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                <AnimatePresence mode="wait">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => (
                      <motion.tr
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.01] transition duration-150"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        key={inv.id}
                      >
                        {/* ID */}
                        <td className="px-4 py-3 font-semibold text-slate-400 font-mono tracking-tight">{inv.id}</td>
                        {/* Client details */}
                        <td className="px-4 py-3">
                          <p className="font-bold text-white leading-relaxed">{inv.client}</p>
                          <p className="text-[10px] text-slate-500 capitalize">{BRANCH_LABELS[inv.branch]?.split(' ').pop()}</p>
                        </td>
                        {/* Space packages */}
                        <td className="px-4 py-3">
                          <p className="text-slate-300">{inv.tier}</p>
                          <p className="text-[9px] text-slate-500 tracking-wide font-medium">{inv.billingCycle}</p>
                        </td>
                        {/* Rupee Value */}
                        <td className="px-4 py-3 text-right font-extrabold text-white font-mono tracking-tight">
                          {formatINR(inv.amount)}
                        </td>
                        {/* Status glowing badges */}
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border shadow-[0_0_10px_rgba(0,0,0,0.15)] ${
                            inv.status === 'Paid' ? 'bg-[#0d2218] border-emerald-500/20 text-emerald-400' :
                            inv.status === 'Pending' ? 'bg-[#22170d] border-amber-500/20 text-amber-400' :
                            'bg-[#220d0d] border-rose-500/20 text-rose-400 animate-pulse'
                          }`}>
                            {inv.status === 'Paid' && <CheckCircle className="h-2.5 w-2.5" />}
                            {inv.status === 'Pending' && <Clock className="h-2.5 w-2.5" />}
                            {inv.status === 'Overdue' && <AlertTriangle className="h-2.5 w-2.5" />}
                            {inv.status}
                          </span>
                        </td>
                        {/* Quick actions panel */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {inv.status !== 'Paid' && (
                              <button
                                className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold cursor-pointer active:scale-95 transition"
                                onClick={() => handleRecordPayment(inv.id, inv.client)}
                                title="Mark Paid"
                              >
                                Record Pay
                              </button>
                            )}
                            <button
                              className="px-2 py-1 rounded bg-white/[0.04] border border-white/5 text-slate-300 hover:bg-white/[0.08] hover:text-white text-[10px] font-bold cursor-pointer active:scale-95 transition"
                              onClick={() => triggerToast(`Receipt INV PDF for ${inv.client} compiled & downloaded successfully.`)}
                              title="Download Receipt PDF"
                            >
                              Receipt
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500 text-xs italic" colSpan="6">
                        No coworking invoice matches found.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts and Suspensions Widget Side Panel */}
        <div className="space-y-4">
          <div className="border-b border-white/5 pb-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Renewals & Escalations</h4>
          </div>

          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <motion.div
                  className={`rounded-xl border p-4 shadow-lg backdrop-blur-xl space-y-3 relative overflow-hidden ${
                    alert.status === 'Overdue' 
                      ? 'bg-[#150a0a]/50 border-rose-500/20' 
                      : 'bg-[#15110a]/50 border-amber-500/20'
                  }`}
                  key={alert.id}
                  layoutId={`alert-${alert.id}`}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Warning banner stripe */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                    alert.status === 'Overdue' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />

                  {/* Header info */}
                  <div className="flex items-start justify-between pl-1">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{alert.id}</p>
                      <h5 className="font-bold text-white text-sm mt-0.5">{alert.client}</h5>
                      <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                        {BRANCH_LABELS[alert.branch]?.split(' ').pop()} · {alert.tier}
                      </p>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      alert.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {alert.status === 'Overdue' ? 'Overdue' : 'Due Soon'}
                    </span>
                  </div>

                  {/* Pricing and Due warning details */}
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-lg p-2.5 pl-3.5 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Outstanding Bill</span>
                      <strong className="text-white font-extrabold tracking-tight mt-0.5 block">{formatINR(alert.amount)}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Due Date</span>
                      <strong className={`font-extrabold tracking-tight mt-0.5 block ${
                        alert.status === 'Overdue' ? 'text-rose-400' : 'text-slate-300'
                      }`}>
                        {alert.dueDate}
                      </strong>
                    </div>
                  </div>

                  {/* Escalation quick action buttons */}
                  <div className="flex gap-2 pl-1.5 pt-1 text-[11px] font-bold">
                    <button
                      className="flex-1 py-2 rounded-lg bg-white/[0.04] border border-white/5 text-slate-300 hover:bg-white/[0.08] hover:text-white cursor-pointer active:scale-95 transition"
                      onClick={() => handleSendReminder(alert.id, alert.client)}
                    >
                      Remind Finance
                    </button>
                    {alert.status === 'Overdue' ? (
                      <button
                        className="flex-1 py-2 rounded-lg bg-rose-500/15 border border-rose-500/25 text-rose-400 hover:bg-rose-500/25 cursor-pointer active:scale-95 transition animate-pulse"
                        onClick={() => handleSuspensionAlert(alert.id, alert.client)}
                      >
                        Keycard Warning
                      </button>
                    ) : (
                      <button
                        className="flex-1 py-2 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 hover:bg-amber-500/25 cursor-pointer active:scale-95 transition"
                        onClick={() => handleRecordPayment(alert.id, alert.client)}
                      >
                        Mark Collected
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-[#0b0d12]/30 p-8 text-center text-slate-500 text-xs italic backdrop-blur-xl">
                No active outstanding alerts for this branch. Outstanding collections are fully cleared!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
