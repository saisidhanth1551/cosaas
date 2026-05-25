import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import CRMPage from './CRMPage'
import { AuthProvider, useAuth } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from './LoginPage'
import UnauthorizedPage from './UnauthorizedPage'
import BillingPage from './BillingPage'
import ConferenceRoomsPage from './ConferenceRoomsPage'
import TicketsPage from './TicketsPage'
import SettingsPage from './SettingsPage'

const BRANCHES = {
  'indiranagar': 'Bengaluru Indiranagar',
  'mumbai-bkc': 'Mumbai BKC',
  'gurugram-cyber-city': 'Gurugram Cyber City',
  'hyderabad': 'Hyderabad HITEC',
  'bangalore': 'Bangalore Koramangala',
  'chennai': 'Chennai OMR',
}

const pageVariants = {
  initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(8px)' },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

const springTransition = { type: 'spring', stiffness: 260, damping: 24 }

const routes = [
  { label: 'Dashboard', path: '/dashboard', eyebrow: 'Operations dashboard', title: 'Workspace overview', roles: ['admin', 'manager', 'receptionist'] },
  { label: 'Floor Map', path: '/floor-map', eyebrow: 'Space planning', title: 'Floor map', roles: ['admin', 'manager', 'receptionist'] },
  { label: 'Bookings', path: '/bookings', eyebrow: 'Reservations', title: 'Bookings', roles: ['admin', 'manager', 'receptionist'] },
  { label: 'Visitors', path: '/visitors', eyebrow: 'Front desk', title: 'Visitors', roles: ['admin', 'manager', 'receptionist'] },
  { label: 'CRM', path: '/crm', eyebrow: 'Customer pipeline', title: 'CRM', roles: ['admin', 'manager'] },
  { label: 'Billing', path: '/billing', eyebrow: 'Revenue operations', title: 'Billing', roles: ['admin', 'manager'] },
  { label: 'Tickets', path: '/tickets', eyebrow: 'Support queue', title: 'Tickets', roles: ['admin', 'manager', 'receptionist'] },
  { label: 'Settings', path: '/settings', eyebrow: 'Workspace controls', title: 'Settings', roles: ['admin', 'manager', 'receptionist'] },
]

const stats = [
  {
    label: 'Total occupancy',
    value: '84%',
    change: '+5.8%',
    detail: '2,186 active seats',
    accent: 'from-cyan-400 to-sky-500',
  },
  {
    label: 'Monthly revenue',
    value: '₹1.48Cr',
    change: '+11.6%',
    detail: 'Across 11 Indian branches',
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    label: 'Open desks',
    value: '392',
    change: '-28',
    detail: 'Peak demand at 3 PM IST',
    accent: 'from-amber-300 to-orange-500',
  },
  {
    label: 'Enterprise renewals',
    value: '93%',
    change: '+3.2%',
    detail: 'Bengaluru leads growth',
    accent: 'from-rose-300 to-pink-500',
  },
]

const chartData = [
  { day: 'Mon', value: 64, heightClass: 'chart-bar--64' },
  { day: 'Tue', value: 72, heightClass: 'chart-bar--72' },
  { day: 'Wed', value: 78, heightClass: 'chart-bar--78' },
  { day: 'Thu', value: 69, heightClass: 'chart-bar--69' },
  { day: 'Fri', value: 86, heightClass: 'chart-bar--86' },
  { day: 'Sat', value: 58, heightClass: 'chart-bar--58' },
  { day: 'Sun', value: 74, heightClass: 'chart-bar--74' },
]

const branches = [
  { name: 'Bengaluru Indiranagar', occupancy: '91%', seats: '384 seats' },
  { name: 'Mumbai BKC', occupancy: '87%', seats: '428 seats' },
  { name: 'Gurugram Cyber City', occupancy: '82%', seats: '352 seats' },
]

const floorBranches = [
  { label: 'Bengaluru Indiranagar', value: 'indiranagar', deskRate: '₹9,500/mo', checkIns: 286 },
  { label: 'Mumbai BKC', value: 'mumbai-bkc', deskRate: '₹14,200/mo', checkIns: 318 },
  { label: 'Gurugram Cyber City', value: 'gurugram-cyber-city', deskRate: '₹11,800/mo', checkIns: 244 },
  { label: 'Hyderabad HITEC', value: 'hyderabad', deskRate: '₹10,500/mo', checkIns: 198 },
  { label: 'Bangalore Koramangala', value: 'bangalore', deskRate: '₹9,800/mo', checkIns: 256 },
  { label: 'Chennai OMR', value: 'chennai', deskRate: '₹8,900/mo', checkIns: 172 },
]

const clientNames = [
  'Razorpay Ops',
  'Zepto Growth',
  'Urban Company',
  'Swiggy Instamart',
  'PhonePe Finance',
  'Lenskart Retail',
  'Ather Energy',
  'Groww Markets',
]

const statusStyles = {
  available: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25',
  occupied: 'border-rose-400/40 bg-rose-400/15 text-rose-200 hover:bg-rose-400/25',
  reserved: 'border-amber-300/50 bg-amber-300/15 text-amber-100 hover:bg-amber-300/25',
}

const statusLabels = {
  available: 'Available',
  occupied: 'Occupied',
  reserved: 'Reserved',
}

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
]

const bookingDurations = ['2 hours', '4 hours', 'Full day', 'Monthly pass']

const today = new Date().toISOString().slice(0, 10)

const visitorStatuses = {
  checkedIn: {
    label: 'Checked in',
    className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  },
  expected: {
    label: 'Expected',
    className: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100',
  },
  checkedOut: {
    label: 'Checked out',
    className: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  },
  delayed: {
    label: 'Delayed',
    className: 'border-amber-300/40 bg-amber-300/10 text-amber-100',
  },
}

const initialVisitors = [
  {
    id: 'VIS-2401',
    name: 'Aarav Mehta',
    company: 'Tata 1mg',
    host: 'Nisha Rao',
    branch: 'Bengaluru Indiranagar',
    purpose: 'Partnership meeting',
    checkIn: '10:15 AM',
    checkOut: '',
    status: 'checkedIn',
  },
  {
    id: 'VIS-2402',
    name: 'Meera Iyer',
    company: 'Zoho People',
    host: 'Rahul Nair',
    branch: 'Bengaluru Indiranagar',
    purpose: 'Product demo',
    checkIn: '11:00 AM',
    checkOut: '',
    status: 'checkedIn',
  },
  {
    id: 'VIS-2403',
    name: 'Kabir Malhotra',
    company: 'HDFC Bank',
    host: 'Ananya Singh',
    branch: 'Mumbai BKC',
    purpose: 'Enterprise renewal',
    checkIn: '12:30 PM',
    checkOut: '02:20 PM',
    status: 'checkedOut',
  },
  {
    id: 'VIS-2404',
    name: 'Priya Menon',
    company: 'Infosys',
    host: 'Vikram Sethi',
    branch: 'Gurugram Cyber City',
    purpose: 'Workspace tour',
    checkIn: '03:00 PM',
    checkOut: '',
    status: 'expected',
  },
  {
    id: 'VIS-2405',
    name: 'Rohan Kapoor',
    company: 'PhonePe',
    host: 'Tanvi Shah',
    branch: 'Mumbai BKC',
    purpose: 'Finance review',
    checkIn: '03:30 PM',
    checkOut: '',
    status: 'delayed',
  },
  {
    id: 'VIS-2406',
    name: 'Sana Khan',
    company: 'Urban Company',
    host: 'Arjun Bhat',
    branch: 'Gurugram Cyber City',
    purpose: 'Hiring drive',
    checkIn: '09:40 AM',
    checkOut: '11:45 AM',
    status: 'checkedOut',
  },
]

const initialFloorSeats = {
  indiranagar: buildSeats(['available', 'occupied', 'reserved', 'available', 'available', 'occupied']),
  'mumbai-bkc': buildSeats(['reserved', 'available', 'available', 'occupied', 'available', 'reserved']),
  'gurugram-cyber-city': buildSeats(['available', 'available', 'occupied', 'reserved', 'available', 'available']),
}

function buildSeats(pattern) {
  return Array.from({ length: 40 }, (_, index) => {
    const status = pattern[index % pattern.length]
    const zone = index < 16 ? 'Hot Desk Bay' : index < 28 ? 'Meeting Pods' : 'Focus Zone'

    return {
      id: `${String.fromCharCode(65 + Math.floor(index / 8))}${(index % 8) + 1}`,
      assignedTo: status === 'available' ? '' : clientNames[index % clientNames.length],
      status,
      zone,
    }
  })
}

const moduleSummaries = {
  '/floor-map': {
    metric: '2,374 seats',
    copy: 'Visualize occupied desks, quiet zones, cabins, and meeting rooms by branch.',
    rows: ['North wing: 91% full', 'Pods: 14 available', 'Meeting rooms: 8 in use'],
  },
  '/bookings': {
    metric: '512 today',
    copy: 'Track desk, meeting room, day-pass, and enterprise bookings across Indian metros.',
    rows: ['68 pending approvals', '19 meeting room conflicts', '94% auto-confirmed'],
  },
  '/visitors': {
    metric: '184 checked in',
    copy: 'Manage guest arrivals, host notifications, Aadhaar-aware badge workflows, and front-desk exceptions.',
    rows: ['31 expected in next hour', '12 badges pending', '6 enterprise visits'],
  },
  '/crm': {
    metric: '₹7.2Cr pipeline',
    copy: 'Follow leads, renewals, account health, and expansion opportunities across Bengaluru, Mumbai, and NCR.',
    rows: ['38 warm leads', '14 renewals this week', '6 at-risk accounts'],
  },
  '/billing': {
    metric: '₹1.48Cr MRR',
    copy: 'Monitor GST invoices, UPI payments, plans, credits, and revenue leakage across locations.',
    rows: ['46 invoices due', '₹18.6L overdue', '98.7% collection rate'],
  },
  '/tickets': {
    metric: '37 open',
    copy: 'Prioritize maintenance, IT, access, and member support tickets by SLA.',
    rows: ['6 urgent tickets', '14 awaiting staff', '2 SLA breaches'],
  },
  '/settings': {
    metric: '9 branches',
    copy: 'Configure branches, roles, access rules, integrations, and operating preferences.',
    rows: ['12 admins', '5 active integrations', 'Audit logs enabled'],
  },
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const location = useLocation()

  // Handle direct layout exclusion for auth views
  const isAuthPage = ['/login', '/unauthorized'].includes(location.pathname)

  if (isAuthPage) {
    return (
      <Routes key={location.pathname} location={location}>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<UnauthorizedPage />} path="/unauthorized" />
        <Route element={<Navigate replace to="/login" />} path="*" />
      </Routes>
    )
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <section className="flex min-w-0 flex-1 flex-col">
          <TopNavbar />
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:gap-6 lg:py-6">
            <AnimatePresence mode="wait">
              <Routes key={location.pathname} location={location}>
                <Route element={<Navigate replace to="/dashboard" />} path="/" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <Dashboard />
                  </ProtectedRoute>
                } path="/dashboard" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <FloorMapPage />
                  </ProtectedRoute>
                } path="/floor-map" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <ConferenceRoomsPage />
                  </ProtectedRoute>
                } path="/bookings" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <VisitorManagementPage />
                  </ProtectedRoute>
                } path="/visitors" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <CRMPage />
                  </ProtectedRoute>
                } path="/crm" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <BillingPage />
                  </ProtectedRoute>
                } path="/billing" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <TicketsPage />
                  </ProtectedRoute>
                } path="/tickets" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <SettingsPage />
                  </ProtectedRoute>
                } path="/settings" />
                <Route element={<Navigate replace to="/dashboard" />} path="*" />
              </Routes>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  )
}

function Sidebar() {
  const { user, logout } = useAuth()

  // Filter sidebar links based on user credentials (resilient check)
  const allowedRoutes = routes.filter(route => {
    if (!route.roles) return true
    return route.roles.some(r => {
      const rClean = r.toLowerCase().replace(/\s+/g, '')
      const uClean = (user?.role || '').toLowerCase().replace(/\s+/g, '')
      return rClean === uClean ||
        (rClean === 'manager' && uClean === 'branchmanager') ||
        (rClean === 'branchmanager' && uClean === 'manager')
    })
  })

  return (
    <motion.aside
      animate={{ opacity: 1, x: 0 }}
      className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0b0d12]/75 px-5 py-5 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:flex lg:flex-col"
      initial={{ opacity: 0, x: -18 }}
      transition={springTransition}
    >
      <motion.div className="flex items-center gap-3" whileHover={{ x: 2 }}>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-sm font-semibold text-slate-950 shadow-lg shadow-white/10">
          Co
        </div>
        <div>
          <p className="text-sm font-semibold text-white">CoSaaS</p>
          <p className="text-xs text-slate-500">Workspace OS</p>
        </div>
      </motion.div>

      <nav className="mt-8 space-y-1">
        {allowedRoutes.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `relative flex items-center justify-between overflow-hidden rounded-lg px-3 py-2.5 text-sm transition ${isActive ? 'text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
            key={item.path}
            to={item.path}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-white"
                    layoutId="active-sidebar-pill"
                    transition={springTransition}
                  />
                )}
                <motion.span className="relative z-10" whileHover={{ x: 3 }}>
                  {item.label}
                </motion.span>
                {isActive && <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {/* Branch stats target progress */}
        <motion.div
          className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/20 backdrop-blur-xl"
          whileHover={{ y: -3, borderColor: 'rgba(34, 211, 238, 0.35)' }}
        >
          <p className="text-sm font-medium text-white">Utilization target</p>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <motion.div
              animate={{ width: '84%' }}
              className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              initial={{ width: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">84% of the monthly operating goal reached.</p>
        </motion.div>

        {/* User context identity & Logout button */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{user?.name || 'Nisha Rao'}</p>
            <p className="truncate text-slate-500 capitalize">{user?.role || 'admin'} · {BRANCHES[user?.branch]?.split(' ').pop() || 'Indiranagar'}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 font-bold text-rose-300 transition hover:bg-rose-500/20 cursor-pointer active:scale-95 flex items-center gap-1 shrink-0"
          >
            Logout
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

function TopNavbar() {
  const location = useLocation()
  const { user } = useAuth()

  // Filter mobile menu routes based on user credentials (resilient check)
  const allowedRoutes = routes.filter(route => {
    if (!route.roles) return true
    return route.roles.some(r => {
      const rClean = r.toLowerCase().replace(/\s+/g, '')
      const uClean = (user?.role || '').toLowerCase().replace(/\s+/g, '')
      return rClean === uClean ||
        (rClean === 'manager' && uClean === 'branchmanager') ||
        (rClean === 'branchmanager' && uClean === 'manager')
    })
  })

  const activeRoute = (allowedRoutes.find((route) => route.path === location.pathname) ?? allowedRoutes[0]) || routes[0]

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#08090d]/70 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-2xl sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-xs font-semibold text-slate-950 lg:hidden">
            Co
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">{activeRoute.eyebrow}</p>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">{activeRoute.title}</h1>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label className="sr-only" htmlFor="branch">
            Select branch
          </label>
          <select
            className="min-h-10 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-cyan-300 sm:w-48 sm:flex-none disabled:cursor-not-allowed disabled:opacity-50"
            value={user?.role?.toLowerCase() === 'admin' ? undefined : user?.branch || 'all'}
            disabled={user?.role?.toLowerCase() !== 'admin'}
            id="branch"
          >
            <option className="bg-slate-950" value="all">
              All branches
            </option>
            <option className="bg-slate-950" value="indiranagar">
              Bengaluru Indiranagar
            </option>
            <option className="bg-slate-950" value="mumbai-bkc">
              Mumbai BKC
            </option>
            <option className="bg-slate-950" value="gurugram-cyber-city">
              Gurugram Cyber City
            </option>
          </select>
          <button className="min-h-10 rounded-lg bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-200">
            Export
          </button>
        </div>
      </div>

      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {allowedRoutes.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `shrink-0 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`
            }
            key={item.path}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

function Dashboard() {
  return (
    <motion.div
      animate="animate"
      className="flex flex-col gap-5 lg:gap-6"
      exit="exit"
      initial="initial"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      variants={pageVariants}
    >
      <motion.section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={staggerContainer}>
        {stats.map((stat) => (
          <motion.article
            className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
            key={stat.label}
            transition={springTransition}
            variants={cardVariants}
            whileHover={{
              y: -6,
              scale: 1.015,
              borderColor: 'rgba(255,255,255,0.22)',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.36)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
              <motion.div
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.accent} opacity-90`}
                whileHover={{ rotate: 8, scale: 1.08 }}
              />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-emerald-300">{stat.change}</span>
              <span className="truncate text-slate-500">{stat.detail}</span>
            </div>
          </motion.article>
        ))}
      </motion.section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <motion.article
          className="min-w-0 rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5"
          transition={springTransition}
          whileHover={{ borderColor: 'rgba(34, 211, 238, 0.28)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Occupancy trend</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Weekly desk utilization</h2>
            </div>
            <div className="flex rounded-lg border border-white/10 bg-black/20 p-1 text-sm text-slate-400">
              <button className="rounded-md bg-white px-3 py-1.5 font-medium text-slate-950">Week</button>
              <button className="px-3 py-1.5 transition hover:text-white">Month</button>
              <button className="px-3 py-1.5 transition hover:text-white">Year</button>
            </div>
          </div>

          <div className="mt-8 h-72 rounded-lg border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
            <div className="flex h-full items-end gap-3 sm:gap-5">
              {chartData.map((item, index) => (
                <div className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3" key={item.day}>
                  <div className="relative flex flex-1 items-end rounded-md bg-white/[0.03]">
                    <motion.div
                      animate={{ scaleY: 1 }}
                      className={`chart-bar ${item.heightClass} w-full rounded-md bg-gradient-to-t from-cyan-500 to-emerald-300 shadow-lg shadow-cyan-950/40`}
                      initial={{ scaleY: 0 }}
                      transition={{ delay: 0.15 + index * 0.08, duration: 0.7, ease: 'easeOut' }}
                      whileHover={{ filter: 'brightness(1.18)' }}
                    />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-400">
                      {item.value}%
                    </span>
                  </div>
                  <span className="text-center text-xs text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.aside
          className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5"
          transition={springTransition}
          whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.18)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Branch health</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Top locations</h2>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              Live
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {branches.map((branch) => (
              <motion.div
                className="rounded-lg border border-white/10 bg-black/20 p-4"
                key={branch.name}
                whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{branch.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{branch.seats}</p>
                  </div>
                  <p className="text-xl font-semibold text-white">{branch.occupancy}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-white p-4 text-slate-950">
            <p className="text-sm font-semibold">Next action</p>
            <p className="mt-2 text-sm text-slate-600">
              Add overflow seating at Bengaluru Indiranagar before afternoon bookings open.
            </p>
          </div>
        </motion.aside>
      </section>
    </motion.div>
  )
}

function FloorMapPage() {
  const { user, token } = useAuth()
  const [activeBranch, setActiveBranch] = useState(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      return user.branch.toLowerCase()
    }
    return 'indiranagar'
  })
  const [seatMap, setSeatMap] = useState({})
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [clientName, setClientName] = useState('')
  const [bookingDate, setBookingDate] = useState(today)
  const [bookingTime, setBookingTime] = useState(timeSlots[2])
  const [bookingDuration, setBookingDuration] = useState(bookingDurations[1])
  const [toast, setToast] = useState(null)

  // Sync active branch once user context is hydrated
  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      setActiveBranch(user.branch.toLowerCase())
    }
  }, [user])

  // Fetch all seats and group them by branch
  useEffect(() => {
    const fetchAllSeats = async () => {
      try {
        const response = await fetch('/api/seats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          const grouped = data.reduce((acc, seat) => {
            if (!acc[seat.branch]) acc[seat.branch] = []
            acc[seat.branch].push(seat)
            return acc
          }, {})
          setSeatMap(grouped)
        }
      } catch (err) {
        console.error('Failed to fetch seats:', err)
      }
    }
    if (token) {
      fetchAllSeats()
    }
  }, [token])

  const seats = seatMap[activeBranch] || []
  const activeBranchData = floorBranches.find((branch) => branch.value === activeBranch)
  const branchLabel = activeBranchData?.label
  const counts = seats.reduce(
    (total, seat) => ({
      ...total,
      [seat.status]: total[seat.status] + 1,
    }),
    { available: 0, occupied: 0, reserved: 0 },
  )
  const canSaveBooking =
    selectedSeat?.status !== 'occupied' &&
    clientName.trim().length > 1 &&
    bookingDate.length > 0 &&
    bookingTime.length > 0 &&
    bookingDuration.length > 0

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3200)

    return () => window.clearTimeout(timeoutId)
  }, [toast])

  function openSeatModal(seat) {
    setSelectedSeat(seat)
    setClientName(seat.assignedTo)
    setBookingDate(today)
    setBookingTime(timeSlots[2])
    setBookingDuration(bookingDurations[1])
  }

  async function reserveSeat() {
    if (!selectedSeat || !canSaveBooking) {
      return
    }

    const assignedTo = clientName.trim()
    const payload = {
      status: 'reserved',
      assignedTo,
      bookingDate,
      bookingTime,
      duration: bookingDuration,
      branch: activeBranch
    }

    try {
      const response = await fetch(`/api/seats/${selectedSeat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const updatedSeat = await response.json()

        setSeatMap((current) => ({
          ...current,
          [activeBranch]: current[activeBranch].map((seat) =>
            seat.id === selectedSeat.id ? updatedSeat : seat
          ),
        }))

        setSelectedSeat(null)
        setToast({
          message: `${selectedSeat.id} assigned to ${assignedTo}`,
          meta: `${branchLabel} · ${bookingDate} · ${bookingTime} · ${bookingDuration}`,
        })
      } else {
        console.error('Failed to update seat in database')
      }
    } catch (err) {
      console.error('Error reserving seat:', err)
    }
  }

  return (
    <>
      <motion.div
        animate="animate"
        className="flex flex-col gap-5"
        exit="exit"
        initial="initial"
        transition={{ duration: 0.28, ease: 'easeOut' }}
        variants={pageVariants}
      >
        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <motion.article
            className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5"
            transition={springTransition}
            whileHover={{ borderColor: 'rgba(34, 211, 238, 0.24)' }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Interactive seat map</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{branchLabel}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Click any seat to inspect live allocation. Available seats can be assigned to a client, while reserved
                  seats can be updated by the front desk team.
                </p>
              </div>

              <div className="w-full sm:w-56">
                <label className="text-xs font-medium uppercase text-slate-500" htmlFor="floor-branch">
                  Branch
                </label>
                <select
                  className={`mt-2 min-h-10 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3 text-sm text-white outline-none transition focus:border-cyan-300 ${user?.role?.toLowerCase() !== 'admin' ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  id="floor-branch"
                  disabled={user?.role?.toLowerCase() !== 'admin'}
                  onChange={(event) => {
                    setActiveBranch(event.target.value)
                    setSelectedSeat(null)
                  }}
                  value={activeBranch}
                >
                  {floorBranches.map((branch) => (
                    <option className="bg-slate-950" key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {Object.entries(counts).map(([status, count]) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-white/10 bg-black/20 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  key={status}
                  whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.06)' }}
                >
                  <p className="text-xs uppercase text-slate-500">{statusLabels[status]}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{count}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 overflow-x-auto rounded-lg border border-white/10 bg-black/20 p-3 backdrop-blur-xl sm:p-5">
              <div className="min-w-[620px]">
                <div className="mb-4 grid grid-cols-[1fr_1.3fr_1fr] gap-3 text-center text-xs text-slate-500">
                  <span className="rounded-md border border-white/10 bg-white/[0.03] py-2">Hot Desk Bay</span>
                  <span className="rounded-md border border-white/10 bg-white/[0.03] py-2">Meeting Pods</span>
                  <span className="rounded-md border border-white/10 bg-white/[0.03] py-2">Focus Zone</span>
                </div>

                <div className="grid grid-cols-8 gap-3">
                  {seats.map((seat) => (
                    <motion.button
                      className={`group relative aspect-square rounded-lg border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${selectedSeat?.id === seat.id
                          ? 'ring-2 ring-cyan-300 ring-offset-2 ring-offset-[#0a0c11]'
                          : ''
                        } ${statusStyles[seat.status]}`}
                      key={seat.id}
                      layout
                      onClick={() => openSeatModal(seat)}
                      title={`${seat.id} · ${statusLabels[seat.status]} · ${seat.assignedTo || 'Unassigned'}`}
                      whileHover={{
                        y: -4,
                        scale: 1.05,
                        boxShadow: '0 16px 34px rgba(0, 0, 0, 0.35)',
                      }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                    >
                      <span className="flex h-full flex-col items-center justify-center gap-1">
                        <span>{seat.id}</span>
                        {seat.assignedTo && (
                          <span className="max-w-14 truncate text-[10px] font-medium opacity-80">
                            {seat.assignedTo}
                          </span>
                        )}
                      </span>
                      <span className="pointer-events-none absolute -top-10 left-1/2 z-20 hidden w-max -translate-x-1/2 rounded-md border border-white/10 bg-slate-950/95 px-2 py-1 text-[11px] font-medium text-slate-200 shadow-xl group-hover:block">
                        {statusLabels[seat.status]} · {seat.assignedTo || 'Unassigned'}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-400">
                  {Object.keys(statusLabels).map((status) => (
                    <span className="inline-flex items-center gap-2" key={status}>
                      <span className={`h-3 w-3 rounded-full border ${statusStyles[status]}`} />
                      {statusLabels[status]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>

          <motion.aside
            className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
            transition={springTransition}
            whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.18)' }}
          >
            <p className="text-sm text-slate-400">Live branch summary</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Seat operations</h2>
            <div className="mt-6 space-y-3">
              {floorBranches.map((branch) => {
                const branchSeats = seatMap[branch.value] || []
                const availableSeats = branchSeats.filter((seat) => seat.status === 'available').length
                const isAllowed = user?.role?.toLowerCase() === 'admin' || (user?.branch || '').toLowerCase() === branch.value

                return (
                  <motion.button
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${branch.value === activeBranch
                        ? 'border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_8px_rgba(34,211,238,0.1)]'
                        : isAllowed
                          ? 'border-white/10 bg-black/20 hover:bg-white/[0.04] cursor-pointer'
                          : 'border-white/5 bg-black/40 opacity-45 cursor-not-allowed'
                      }`}
                    key={branch.value}
                    onClick={() => {
                      if (!isAllowed) return
                      setActiveBranch(branch.value)
                      setSelectedSeat(null)
                    }}
                    whileHover={isAllowed ? { x: 4 } : {}}
                    whileTap={isAllowed ? { scale: 0.98 } : {}}
                    disabled={!isAllowed}
                    type="button"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                        {branch.label}
                        {!isAllowed && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
                            🔒 Locked
                          </span>
                        )}
                      </span>
                      <span className="text-right text-sm text-emerald-300">
                        {isAllowed ? `${availableSeats} open` : 'Locked'}
                        <span className="block text-xs text-slate-500">{branch.deskRate}</span>
                      </span>
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <div className="mt-6 rounded-lg bg-white p-4 text-slate-950">
              <p className="text-sm font-semibold">Booking rule</p>
              <p className="mt-2 text-sm text-slate-600">
                {activeBranchData?.checkIns} member check-ins today. Assignments convert available seats into reserved
                seats for the selected client.
              </p>
            </div>
          </motion.aside>
        </section>
      </motion.div>

      <AnimatePresence>
        {selectedSeat && (
          <motion.div
            animate={{ opacity: 1 }}
            className="booking-modal-overlay bg-black/70 backdrop-blur-xl"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="booking-modal-panel rounded-lg border border-white/10 bg-[#0b0d12]/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-6"
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={springTransition}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Seat allocation</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">
                    Seat {selectedSeat.id}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {branchLabel} · {selectedSeat.zone}
                  </p>
                </div>
                <button
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.06] text-slate-300 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setSelectedSeat(null)}
                  type="button"
                >
                  X
                </button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs uppercase text-slate-500">Selected seat</p>
                  <div className={`mt-4 grid aspect-square place-items-center rounded-lg border text-4xl font-semibold ${statusStyles[selectedSeat.status]}`}>
                    {selectedSeat.id}
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-400">Status</span>
                      <span className={`rounded-full border px-3 py-1 text-xs ${statusStyles[selectedSeat.status]}`}>
                        {statusLabels[selectedSeat.status]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-400">Zone</span>
                      <span className="font-medium text-white">{selectedSeat.zone}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-400">Client</span>
                      <span className="max-w-32 truncate font-medium text-white">
                        {selectedSeat.assignedTo || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
                      Client name
                      <input
                        className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={selectedSeat.status === 'occupied'}
                        onChange={(event) => setClientName(event.target.value)}
                        placeholder="e.g. Zoho People"
                        value={clientName}
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-300">
                      Booking date
                      <input
                        className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-white outline-none transition [color-scheme:dark] focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={selectedSeat.status === 'occupied'}
                        min={today}
                        onChange={(event) => setBookingDate(event.target.value)}
                        type="date"
                        value={bookingDate}
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-300">
                      Time slot
                      <select
                        className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-white outline-none transition focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={selectedSeat.status === 'occupied'}
                        onChange={(event) => setBookingTime(event.target.value)}
                        value={bookingTime}
                      >
                        {timeSlots.map((slot) => (
                          <option className="bg-slate-950" key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
                      Duration
                      <select
                        className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-white outline-none transition focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={selectedSeat.status === 'occupied'}
                        onChange={(event) => setBookingDuration(event.target.value)}
                        value={bookingDuration}
                      >
                        {bookingDurations.map((duration) => (
                          <option className="bg-slate-950" key={duration} value={duration}>
                            {duration}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-medium text-white">Booking summary</p>
                    <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                      <span>{branchLabel}</span>
                      <span>{selectedSeat.zone}</span>
                      <span>{bookingDate || 'Select date'}</span>
                      <span>{bookingTime} · {bookingDuration}</span>
                    </div>
                  </div>

                  {selectedSeat.status === 'occupied' && (
                    <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
                      This seat is already occupied and cannot be reassigned from the floor map.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  className="min-h-10 rounded-lg border border-white/10 px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                  onClick={() => setSelectedSeat(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="min-h-10 rounded-lg bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canSaveBooking}
                  onClick={reserveSeat}
                  type="button"
                >
                  Confirm booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm rounded-lg border border-emerald-400/30 bg-[#0b0d12]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:w-full"
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={springTransition}
          >
            <div className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/40" />
              <div>
                <p className="text-sm font-semibold text-white">Booking confirmed</p>
                <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
                <p className="mt-1 text-xs text-slate-500">{toast.meta}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function VisitorManagementPage() {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState(initialVisitors)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      return BRANCHES[user.branch.toLowerCase()] || 'all'
    }
    return 'all'
  })
  const [newVisitor, setNewVisitor] = useState(() => {
    const defaultBranch = (user && user.role?.toLowerCase() !== 'admin' && user.branch)
      ? (BRANCHES[user.branch.toLowerCase()] || 'Bengaluru Indiranagar')
      : 'Bengaluru Indiranagar'
    return {
      name: '',
      company: '',
      host: 'Nisha Rao',
      branch: defaultBranch,
      purpose: '',
    }
  })

  // Sync visitor branches once user context is hydrated
  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      const bName = BRANCHES[user.branch.toLowerCase()] || 'Bengaluru Indiranagar'
      setBranchFilter(bName)
      setNewVisitor((current) => ({ ...current, branch: bName }))
    }
  }, [user])

  const filteredVisitors = visitors.filter((visitor) => {
    const searchable = `${visitor.name} ${visitor.company} ${visitor.host} ${visitor.branch} ${visitor.purpose}`.toLowerCase()
    const matchesSearch = searchable.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter
    const matchesBranch = branchFilter === 'all' || visitor.branch === branchFilter

    return matchesSearch && matchesStatus && matchesBranch
  })

  const visitorCounts = visitors.reduce(
    (total, visitor) => ({
      ...total,
      [visitor.status]: total[visitor.status] + 1,
    }),
    { checkedIn: 0, expected: 0, checkedOut: 0, delayed: 0 },
  )

  function checkInVisitor(visitorId) {
    setVisitors((current) =>
      current.map((visitor) =>
        visitor.id === visitorId
          ? { ...visitor, checkIn: visitor.checkIn || 'Now', checkOut: '', status: 'checkedIn' }
          : visitor,
      ),
    )
  }

  function checkOutVisitor(visitorId) {
    setVisitors((current) =>
      current.map((visitor) =>
        visitor.id === visitorId ? { ...visitor, checkOut: 'Now', status: 'checkedOut' } : visitor,
      ),
    )
  }

  function addVisitor(event) {
    event.preventDefault()

    if (!newVisitor.name.trim() || !newVisitor.company.trim() || !newVisitor.purpose.trim()) {
      return
    }

    setVisitors((current) => [
      {
        ...newVisitor,
        id: `VIS-${2401 + current.length}`,
        checkIn: '',
        checkOut: '',
        status: 'expected',
      },
      ...current,
    ])
    setSearchTerm('')
    setStatusFilter('all')
    setBranchFilter((user && user.role?.toLowerCase() !== 'admin' && user.branch)
      ? (BRANCHES[user.branch.toLowerCase()] || 'all')
      : 'all')
    setNewVisitor({
      name: '',
      company: '',
      host: 'Nisha Rao',
      branch: (user && user.role?.toLowerCase() !== 'admin' && user.branch)
        ? (BRANCHES[user.branch.toLowerCase()] || 'Bengaluru Indiranagar')
        : 'Bengaluru Indiranagar',
      purpose: '',
    })
  }

  return (
    <motion.div
      animate="animate"
      className="flex flex-col gap-5"
      exit="exit"
      initial="initial"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      variants={pageVariants}
    >
      <motion.section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={staggerContainer}>
        {[
          { label: 'Inside now', value: visitorCounts.checkedIn, helper: 'Live visitors', accent: 'from-emerald-400 to-teal-500' },
          { label: 'Expected', value: visitorCounts.expected, helper: 'Scheduled today', accent: 'from-cyan-400 to-sky-500' },
          { label: 'Checked out', value: visitorCounts.checkedOut, helper: 'Completed visits', accent: 'from-slate-300 to-slate-500' },
          { label: 'Delayed', value: visitorCounts.delayed, helper: 'Needs follow-up', accent: 'from-amber-300 to-orange-500' },
        ].map((metric) => (
          <motion.article
            className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
            key={metric.label}
            variants={cardVariants}
            whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-500">{metric.helper}</p>
              </div>
              <span className={`h-10 w-10 rounded-lg bg-gradient-to-br ${metric.accent}`} />
            </div>
          </motion.article>
        ))}
      </motion.section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <motion.article
          className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5"
          transition={springTransition}
          whileHover={{ borderColor: 'rgba(34, 211, 238, 0.22)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Visitor desk</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Today&apos;s visitor log</h2>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              {filteredVisitors.length} shown
            </span>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_220px]">
            <input
              className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search visitor, company, host, or purpose"
              value={searchTerm}
            />
            <select
              className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition focus:border-cyan-300"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option className="bg-slate-950" value="all">All statuses</option>
              {Object.entries(visitorStatuses).map(([value, status]) => (
                <option className="bg-slate-950" key={value} value={value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              className={`min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition focus:border-cyan-300 ${user?.role?.toLowerCase() !== 'admin' ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                }`}
              onChange={(event) => setBranchFilter(event.target.value)}
              value={branchFilter}
              disabled={user?.role?.toLowerCase() !== 'admin'}
            >
              <option className="bg-slate-950" value="all">All branches</option>
              {branches.map((branch) => (
                <option className="bg-slate-950" key={branch.name} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-black/20">
            <div className="hidden grid-cols-[1.2fr_0.9fr_1fr_1fr_1fr_1fr] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase text-slate-500 xl:grid">
              <span>Visitor</span>
              <span>Host</span>
              <span>Branch</span>
              <span>Purpose</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="grid gap-3 p-3">
              <AnimatePresence initial={false}>
                {filteredVisitors.map((visitor) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="grid min-w-0 gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300 xl:grid-cols-[1.2fr_0.9fr_1fr_1fr_1fr_1fr] xl:items-center"
                    exit={{ opacity: 0, y: 8 }}
                    initial={{ opacity: 0, y: 8 }}
                    key={visitor.id}
                    layout
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{visitor.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{visitor.company} · {visitor.id}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase text-slate-500 xl:hidden">Host</p>
                      <p className="truncate">{visitor.host}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase text-slate-500 xl:hidden">Branch</p>
                      <p className="break-words">{visitor.branch}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase text-slate-500 xl:hidden">Purpose</p>
                      <p className="break-words">{visitor.purpose}</p>
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${visitorStatuses[visitor.status].className}`}>
                        {visitorStatuses[visitor.status].label}
                      </span>
                      <p className="mt-2 text-xs text-slate-500">
                        In {visitor.checkIn || '--'} · Out {visitor.checkOut || '--'}
                      </p>
                    </div>
                    <div className="flex min-w-0 flex-wrap gap-2">
                      <button
                        className="min-h-9 flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40 xl:flex-none"
                        disabled={visitor.status === 'checkedIn'}
                        onClick={() => checkInVisitor(visitor.id)}
                        type="button"
                      >
                        Check in
                      </button>
                      <button
                        className="min-h-9 flex-1 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 xl:flex-none"
                        disabled={visitor.status !== 'checkedIn'}
                        onClick={() => checkOutVisitor(visitor.id)}
                        type="button"
                      >
                        Check out
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.article>

        <motion.aside
          className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
          transition={springTransition}
          whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.18)' }}
        >
          <p className="text-sm text-slate-400">Front desk</p>
          <h2 className="mt-1 text-lg font-semibold text-white">New visitor</h2>

          <form className="mt-5 grid gap-4" onSubmit={addVisitor}>
            <input
              className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
              onChange={(event) => setNewVisitor((current) => ({ ...current, name: event.target.value }))}
              placeholder="Visitor name"
              required
              value={newVisitor.name}
            />
            <input
              className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
              onChange={(event) => setNewVisitor((current) => ({ ...current, company: event.target.value }))}
              placeholder="Company"
              required
              value={newVisitor.company}
            />
            <select
              className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition focus:border-cyan-300"
              onChange={(event) => setNewVisitor((current) => ({ ...current, host: event.target.value }))}
              value={newVisitor.host}
            >
              {['Nisha Rao', 'Rahul Nair', 'Ananya Singh', 'Vikram Sethi', 'Tanvi Shah'].map((host) => (
                <option className="bg-slate-950" key={host} value={host}>{host}</option>
              ))}
            </select>
            <select
              className={`min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition focus:border-cyan-300 ${user?.role?.toLowerCase() !== 'admin' ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                }`}
              onChange={(event) => setNewVisitor((current) => ({ ...current, branch: event.target.value }))}
              value={newVisitor.branch}
              disabled={user?.role?.toLowerCase() !== 'admin'}
            >
              {branches.map((branch) => (
                <option className="bg-slate-950" key={branch.name} value={branch.name}>{branch.name}</option>
              ))}
            </select>
            <input
              className="min-h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
              onChange={(event) => setNewVisitor((current) => ({ ...current, purpose: event.target.value }))}
              placeholder="Purpose of visit"
              required
              value={newVisitor.purpose}
            />
            <button
              className="min-h-11 rounded-lg bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
              type="submit"
            >
              Add expected visitor
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-medium text-white">Security note</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Hosts receive arrival alerts when visitors are checked in. Front desk can check out active guests from the log.
            </p>
          </div>
        </motion.aside>
      </section>
    </motion.div>
  )
}

function ModulePage() {
  const location = useLocation()
  const activeRoute = routes.find((route) => route.path === location.pathname) ?? routes[0]
  const summary = moduleSummaries[activeRoute.path]

  return (
    <motion.section
      animate="animate"
      className="grid gap-5 xl:grid-cols-[1fr_360px]"
      exit="exit"
      initial="initial"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      variants={pageVariants}
    >
      <motion.article
        className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
        transition={springTransition}
        whileHover={{ borderColor: 'rgba(34, 211, 238, 0.24)' }}
      >
        <p className="text-sm text-slate-400">{activeRoute.eyebrow}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{activeRoute.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{summary.copy}</p>
          </div>
          <p className="text-3xl font-semibold text-white">{summary.metric}</p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {summary.rows.map((row) => (
            <motion.div
              className="rounded-lg border border-white/10 bg-black/20 p-4"
              key={row}
              whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              <p className="text-sm text-slate-300">{row}</p>
            </motion.div>
          ))}
        </div>
      </motion.article>

      <motion.aside
        className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
        transition={springTransition}
        whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.18)' }}
      >
        <p className="text-sm font-medium text-white">Branch context</p>
        <div className="mt-5 space-y-3">
          {branches.map((branch) => (
            <motion.div
              className="flex items-center justify-between rounded-lg bg-black/20 px-4 py-3"
              key={branch.name}
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              <span className="text-sm text-slate-300">{branch.name}</span>
              <span className="text-sm font-medium text-white">{branch.occupancy}</span>
            </motion.div>
          ))}
        </div>
      </motion.aside>
    </motion.section>
  )
}

export default App
