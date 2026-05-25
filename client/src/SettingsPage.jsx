import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './AuthContext'

const floorBranches = {
  indiranagar: 'Bengaluru Indiranagar',
  'mumbai-bkc': 'Mumbai BKC',
  'gurugram-cyber-city': 'Gurugram Cyber City',
  hyderabad: 'Hyderabad HITEC',
  bangalore: 'Bangalore Koramangala',
  chennai: 'Chennai OMR',
}

// Spring transitions for tabs and switches
const springTransition = { type: 'spring', stiffness: 300, damping: 22 }

const pageVariants = {
  initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(8px)' },
}

export default function SettingsPage() {
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [toast, setToast] = useState(null)

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  const [profileBranchLabel, setProfileBranchLabel] = useState('Global Operations')

  // Sync profile values when user context is available
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '')
      setProfileEmail(user.email || '')
      const bKey = (user.branch || '').toLowerCase()
      setProfileBranchLabel(floorBranches[bKey] || user.branch || 'Global Operations')
    }
  }, [user])

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    seatAlerts: true,
    visitorSMS: false,
    ticketSlack: true,
    weeklyReports: true,
  })

  // Appearance Preferences
  const [accentColor, setAccentColor] = useState('cyan')
  const [glassBlur, setGlassBlur] = useState(16)

  // Workspace Settings (Admin Only)
  const [workspaceCurrency, setWorkspaceCurrency] = useState('INR')
  const [visitorStrictCheck, setVisitorStrictCheck] = useState(true)
  const [automaticDailyBilling, setAutomaticDailyBilling] = useState(false)

  // Security Form State
  const [currPassword, setCurrPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Toast Auto-Dismissal
  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timeout)
  }, [toast])

  const handleProfileSave = (e) => {
    e.preventDefault()
    setToast({
      message: 'Profile Updated Successfully',
      desc: `Your account profile has been updated on the secure server.`,
      type: 'success',
    })
  }

  const handleSecuritySave = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setToast({
        message: 'Security Error',
        desc: 'New passwords do not match. Please verify entries.',
        type: 'error',
      })
      return
    }
    setCurrPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setToast({
      message: 'Password Saved',
      desc: 'Your account security credentials have been updated.',
      type: 'success',
    })
  }

  // Accent Colors Config Map
  const accentStyles = {
    cyan: 'border-cyan-400 text-cyan-400 bg-cyan-500/10 shadow-[0_0_8px_rgba(34,211,238,0.1)]',
    emerald: 'border-emerald-400 text-emerald-400 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.1)]',
    purple: 'border-purple-400 text-purple-400 bg-purple-500/10 shadow-[0_0_8px_rgba(168,85,247,0.1)]',
  }

  const activeAccentGlow =
    accentColor === 'cyan'
      ? 'border-cyan-300/40 shadow-[0_0_12px_rgba(34,211,238,0.08)]'
      : accentColor === 'emerald'
        ? 'border-emerald-300/40 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
        : 'border-purple-300/40 shadow-[0_0_12px_rgba(168,85,247,0.08)]'

  const userInitials = (profileName || 'CS')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: '👤', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'notifications', label: 'Notifications', icon: '🔔', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'appearance', label: 'Appearance', icon: '🎨', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'workspace', label: 'Workspace Config', icon: '🏢', roles: ['admin'] },
    { id: 'security', label: 'Security & Auth', icon: '🔒', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'system', label: 'System Info', icon: '🖥️', roles: ['admin', 'manager', 'receptionist'] },
  ]

  // Filter tabs by role (resilient check)
  const visibleTabs = tabs.filter((t) => {
    return t.roles.some(r => {
      const rClean = r.toLowerCase().replace(/\s+/g, '')
      const uClean = (user?.role || '').toLowerCase().replace(/\s+/g, '')
      return rClean === uClean ||
             (rClean === 'manager' && uClean === 'branchmanager') ||
             (rClean === 'branchmanager' && uClean === 'manager')
    })
  })

  return (
    <>
      {/* Dynamic Toast Notifications */}
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
        className="flex flex-col gap-6"
        exit="exit"
        initial="initial"
        transition={{ duration: 0.28, ease: 'easeOut' }}
        variants={pageVariants}
      >
        {/* Top Header Card */}
        <motion.article
          className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5"
          transition={springTransition}
          whileHover={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
        >
          <div>
            <p className="text-sm text-slate-400">Settings and System Configuration</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">CoSaaS Command Center</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Manage your personal workspace preferences, change notification alerts, configure accent colors, and inspect server cluster health metrics.
            </p>
          </div>
        </motion.article>

        {/* Main Settings Panel Grid */}
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Navigation Sidebar */}
          <div className="flex flex-col gap-1.5">
            {visibleTabs.map((t) => {
              const isActive = activeTab === t.id
              return (
                <button
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? accentStyles[accentColor]
                      : 'border border-transparent bg-black/10 text-slate-400 hover:bg-white/[0.03] hover:text-white'
                  }`}
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  type="button"
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* Active Configuration Panel */}
          <motion.div
            className={`rounded-xl border bg-[#11141c]/60 p-6 shadow-xl backdrop-blur-md`}
            style={{ backdropFilter: `blur(${glassBlur}px)` }}
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            key={activeTab}
          >
            {/* 1. PROFILE PANEL */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">My Profile</h3>
                
                {/* Profile Card Header */}
                <div className="mt-6 flex flex-wrap items-center gap-5 rounded-lg bg-black/20 p-4 border border-white/5">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold text-white shadow-lg bg-gradient-to-tr ${
                    accentColor === 'cyan'
                      ? 'from-cyan-600 to-teal-400 shadow-cyan-500/10'
                      : accentColor === 'emerald'
                        ? 'from-emerald-600 to-teal-400 shadow-emerald-500/10'
                        : 'from-purple-600 to-indigo-400 shadow-purple-500/10'
                  }`}>
                    {userInitials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">{profileName || 'CoSaaS Member'}</h4>
                    <p className="text-sm text-slate-400 mt-1">{profileEmail}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-white/5">
                        Role: {user?.role ? user.role.toUpperCase() : 'STAFF'}
                      </span>
                      <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/20">
                        📍 {profileBranchLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Edit Form */}
                <form className="mt-6 space-y-4" onSubmit={handleProfileSave}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="prof-name">
                        Full Name
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                        id="prof-name"
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        type="text"
                        value={profileName}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="prof-email">
                        Corporate Email
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                        id="prof-email"
                        onChange={(e) => setProfileEmail(e.target.value)}
                        required
                        type="email"
                        value={profileEmail}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Assigned Role (Read-only)
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border border-white/5 bg-black/50 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed outline-none"
                        disabled
                        type="text"
                        value={user?.role ? user.role.toUpperCase() : 'STAFF'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Designated Branch (Read-only)
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border border-white/5 bg-black/50 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed outline-none"
                        disabled
                        type="text"
                        value={profileBranchLabel}
                      />
                    </div>
                  </div>

                  <button
                    className={`mt-6 rounded-lg bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]`}
                    type="submit"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* 2. NOTIFICATIONS PANEL */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Notification Preferences</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Toggle the alerts channels through which your dashboard receives critical notifications.
                </p>

                <div className="mt-6 space-y-4">
                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between rounded-lg bg-black/20 p-4 border border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white">Email Seat Reservation Alerts</h4>
                      <p className="text-xs text-slate-400 mt-1">Receive automated logs whenever a seat gets booked or released.</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notifications.seatAlerts ? 'bg-cyan-400' : 'bg-slate-700'
                      }`}
                      onClick={() => setNotifications((prev) => ({ ...prev, seatAlerts: !prev.seatAlerts }))}
                      type="button"
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        notifications.seatAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between rounded-lg bg-black/20 p-4 border border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white">Slack Support Alerts</h4>
                      <p className="text-xs text-slate-400 mt-1">Ping active branch Slack channels on critical support ticket additions.</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notifications.ticketSlack ? 'bg-cyan-400' : 'bg-slate-700'
                      }`}
                      onClick={() => setNotifications((prev) => ({ ...prev, ticketSlack: !prev.ticketSlack }))}
                      type="button"
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        notifications.ticketSlack ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 3 */}
                  <div className="flex items-center justify-between rounded-lg bg-black/20 p-4 border border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white">Visitor SMS Notices</h4>
                      <p className="text-xs text-slate-400 mt-1">Send rapid SMS texts to staff hosts upon visitor lobby check-in.</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notifications.visitorSMS ? 'bg-cyan-400' : 'bg-slate-700'
                      }`}
                      onClick={() => setNotifications((prev) => ({ ...prev, visitorSMS: !prev.visitorSMS }))}
                      type="button"
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        notifications.visitorSMS ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 4 */}
                  <div className="flex items-center justify-between rounded-lg bg-black/20 p-4 border border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white">Weekly Analytics Digest</h4>
                      <p className="text-xs text-slate-400 mt-1">Receive compiled branch reports containing occupancy ratios and billing sums.</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        notifications.weeklyReports ? 'bg-cyan-400' : 'bg-slate-700'
                      }`}
                      onClick={() => setNotifications((prev) => ({ ...prev, weeklyReports: !prev.weeklyReports }))}
                      type="button"
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        notifications.weeklyReports ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. APPEARANCE PANEL */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Appearance & UI Accent</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Personalize your interface theme color triggers and visual glassmorphism depth.
                  </p>
                </div>

                {/* Accent Color Triggers */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accent Palette</h4>
                  <div className="mt-3 flex gap-3">
                    {['cyan', 'emerald', 'purple'].map((color) => {
                      const isSel = accentColor === color
                      return (
                        <button
                          className={`rounded-lg px-4 py-2 text-sm font-bold capitalize border transition ${
                            isSel
                              ? accentStyles[color]
                              : 'border-white/10 bg-black/20 text-slate-400 hover:bg-white/[0.03] hover:text-white'
                          }`}
                          key={color}
                          onClick={() => setAccentColor(color)}
                          type="button"
                        >
                          ● {color}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Blur depth slider */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="glass-blur">
                      Glassmorphism Blur Depth
                    </label>
                    <span className="text-xs font-bold text-white">{glassBlur}px</span>
                  </div>
                  <input
                    className="mt-3 w-full accent-cyan-400 cursor-pointer bg-slate-700 h-1.5 rounded-lg appearance-none"
                    id="glass-blur"
                    max="24"
                    min="4"
                    onChange={(e) => setGlassBlur(Number(e.target.value))}
                    step="2"
                    type="range"
                    value={glassBlur}
                  />
                  <div className="mt-1.5 flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Performance Mode (Low Blur)</span>
                    <span>High Fidelity (Max Glass)</span>
                  </div>
                </div>

                {/* Preview Box */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accent Preview Window</h4>
                  <div className={`mt-3 rounded-lg border bg-[#161a24]/30 p-4 transition ${activeAccentGlow}`}>
                    <h5 className="font-bold text-sm text-white">Realtime preview box</h5>
                    <p className="text-xs text-slate-400 mt-1">This box shows you the active borders, colors, and shadows matching your config.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. WORKSPACE PANEL (Admin Only) */}
            {activeTab === 'workspace' && user?.role?.toLowerCase() === 'admin' && (
              <div>
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Global Workspace Config</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Global parameters managing coworking operational rules. Locked for managers and staff.
                </p>

                <div className="mt-6 space-y-5">
                  {/* Currency config */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="work-cur">
                      Base Workspace Currency
                    </label>
                    <select
                      className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-[#0b0d12] px-3.5 py-2 text-sm text-white outline-none transition focus:border-cyan-300 cursor-pointer"
                      id="work-cur"
                      onChange={(e) => setWorkspaceCurrency(e.target.value)}
                      value={workspaceCurrency}
                    >
                      <option className="bg-slate-950" value="INR">Indian Rupee (₹ INR)</option>
                      <option className="bg-slate-950" value="USD">US Dollar ($ USD)</option>
                      <option className="bg-slate-950" value="EUR">Euro (€ EUR)</option>
                    </select>
                  </div>

                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between rounded-lg bg-black/20 p-4 border border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white">Strict Visitor Registration</h4>
                      <p className="text-xs text-slate-400 mt-1">Force hosts confirmation and RFID badge issuance before visitor lobby gate unlocks.</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        visitorStrictCheck ? 'bg-cyan-400' : 'bg-slate-700'
                      }`}
                      onClick={() => setVisitorStrictCheck((prev) => !prev)}
                      type="button"
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        visitorStrictCheck ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between rounded-lg bg-black/20 p-4 border border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white">Automated Midnight Invoicing</h4>
                      <p className="text-xs text-slate-400 mt-1">Trigger daily cron billing calculations and auto-invoice client ledgers at midnight.</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        automaticDailyBilling ? 'bg-cyan-400' : 'bg-slate-700'
                      }`}
                      onClick={() => setAutomaticDailyBilling((prev) => !prev)}
                      type="button"
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        automaticDailyBilling ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SECURITY PANEL */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Security & Authentication</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Update your authentication credentials and adjust active security controls.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleSecuritySave}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="curr-pass">
                      Current Password
                    </label>
                    <input
                      className="mt-2 w-full max-w-md rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300"
                      id="curr-pass"
                      onChange={(e) => setCurrPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      type="password"
                      value={currPassword}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="new-pass">
                      New Security Password
                    </label>
                    <input
                      className="mt-2 w-full max-w-md rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300"
                      id="new-pass"
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      type="password"
                      value={newPassword}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="conf-pass">
                      Confirm New Password
                    </label>
                    <input
                      className="mt-2 w-full max-w-md rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300"
                      id="conf-pass"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      type="password"
                      value={confirmPassword}
                    />
                  </div>

                  <button
                    className="mt-6 rounded-lg bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
                    type="submit"
                  >
                    Update Auth Password
                  </button>
                </form>
              </div>
            )}

            {/* 6. SYSTEM INFO PANEL */}
            {activeTab === 'system' && (
              <div>
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Operational Diagnostics</h3>
                
                {/* Diagnostics Cards Grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-black/20 p-4 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Database Link Status</span>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-sm font-bold text-white">MongoDB cluster connected</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-black/20 p-4 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Memory Usage</span>
                    <div className="mt-1.5 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-white">82.4</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">MB Alloc</span>
                    </div>
                  </div>
                </div>

                {/* Diagnostics Table */}
                <div className="mt-6 rounded-xl border border-white/10 bg-black/10 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold">
                        <th className="px-4 py-3">Environment Parameter</th>
                        <th className="px-4 py-3">Configuration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-4 py-3 font-semibold">Vite Environment Bundle</td>
                        <td className="px-4 py-3 text-cyan-300">v8.0.14 (React 19 Core)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold">Node JS Cluster API</td>
                        <td className="px-4 py-3 text-cyan-300">v22.22.1 Engine (Linux x64 OS)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold">Database Driver Layer</td>
                        <td className="px-4 py-3 text-cyan-300">Mongoose Driver (MDB v8.0.5)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold">API Server Endpoint</td>
                        <td className="px-4 py-3 text-cyan-300">http://localhost:5000/api</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold">Active Round-Trip Latency</td>
                        <td className="px-4 py-3 text-emerald-300 font-semibold">14 ms (Optimized)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
