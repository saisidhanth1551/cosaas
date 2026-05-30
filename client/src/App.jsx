import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Armchair,
  UserCheck,
  Users,
  CreditCard,
  Ticket,
  Settings,
  LogOut,
  TrendingUp,
  Sparkles,
  Lightbulb,
  DoorOpen,
  Activity,
  Brain,
  UserPlus,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Clock,
  HelpCircle,
  Play,
  Check,
  DollarSign,
  AlertTriangle,
  Plus,
  Save,
  Edit,
  Trash2,
  Filter,
  Search,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Bell,
  X
} from 'lucide-react'
import './App.css'
import NotificationModal from './components/NotificationModal'
import CosmoAssistant from './components/ai/CosmoAssistant'
import CRMPage from './CRMPage'
import { AuthProvider, useAuth } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import UnauthorizedPage from './UnauthorizedPage'
import BillingPage from './BillingPage'
import ConferenceRoomsPage from './ConferenceRoomsPage'
import TicketsPage from './TicketsPage'
import SettingsPage from './SettingsPage'
import { API_BASE } from './config'

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
  { label: 'Dashboard', path: '/dashboard', eyebrow: 'Operations dashboard', title: 'Workspace overview', roles: ['admin', 'manager', 'receptionist'], icon: LayoutDashboard },
  { label: 'Floor Map', path: '/floor-map', eyebrow: 'Space planning', title: 'Floor map', roles: ['admin', 'manager', 'receptionist'], icon: Map },
  { label: 'Bookings', path: '/bookings', eyebrow: 'Reservations', title: 'Bookings', roles: ['admin', 'manager', 'receptionist'], icon: Armchair },
  { label: 'Visitors', path: '/visitors', eyebrow: 'Front desk', title: 'Visitors', roles: ['admin', 'manager', 'receptionist'], icon: UserCheck },
  { label: 'CRM', path: '/crm', eyebrow: 'Customer pipeline', title: 'CRM', roles: ['admin', 'manager'], icon: Users },
  { label: 'Billing', path: '/billing', eyebrow: 'Revenue operations', title: 'Billing', roles: ['admin', 'manager'], icon: CreditCard },
  { label: 'Tickets', path: '/tickets', eyebrow: 'Support queue', title: 'Tickets', roles: ['admin', 'manager', 'receptionist'], icon: Ticket },
  { label: 'Settings', path: '/settings', eyebrow: 'Workspace controls', title: 'Settings', roles: ['admin', 'manager', 'receptionist'], icon: Settings },
  { label: 'BI-Board', path: '/ai-insights/bi-board', eyebrow: 'AI Insights > BI-Board', title: 'BI-Board', roles: ['admin', 'manager', 'receptionist'], icon: BarChart3 },
  { label: 'Occupancy Forecasting', path: '/ai-insights/forecasting', eyebrow: 'AI Insights > Forecasting', title: 'Occupancy Forecasting', roles: ['admin', 'manager', 'receptionist'], icon: Sparkles },
  { label: 'Branch Intelligence', path: '/ai-insights/branch-intelligence', eyebrow: 'AI Insights > Branch Intelligence', title: 'Branch Intelligence', roles: ['admin', 'manager', 'receptionist'], icon: Brain },
  { label: 'Recommendations', path: '/ai-insights/recommendations', eyebrow: 'AI Insights > Recommendations', title: 'AI Recommendations', roles: ['admin', 'manager', 'receptionist'], icon: Lightbulb },
  { label: 'Renewal Intelligence', path: '/crm/renewal-intelligence', eyebrow: 'CRM > Renewal Intelligence', title: 'Renewal Intelligence', roles: ['admin', 'manager', 'receptionist'], icon: ShieldAlert },
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

const weekChartData = [
  { day: 'Mon', value: 64 },
  { day: 'Tue', value: 72 },
  { day: 'Wed', value: 78 },
  { day: 'Thu', value: 69 },
  { day: 'Fri', value: 86 },
  { day: 'Sat', value: 58 },
  { day: 'Sun', value: 74 },
]

const monthChartData = [
  { day: 'W1', value: 71 },
  { day: 'W2', value: 83 },
  { day: 'W3', value: 76 },
  { day: 'W4', value: 89 },
]

const yearChartData = [
  { day: 'Q1', value: 68 },
  { day: 'Q2', value: 79 },
  { day: 'Q3', value: 85 },
  { day: 'Q4', value: 92 },
]

const branches = [
  { name: 'Bengaluru Indiranagar', occupancy: '91%', seats: '384 seats' },
  { name: 'Mumbai BKC', occupancy: '87%', seats: '428 seats' },
  { name: 'Gurugram Cyber City', occupancy: '82%', seats: '352 seats' },
  { name: 'Hyderabad HITEC', occupancy: '78%', seats: '280 seats' },
  { name: 'Bangalore Koramangala', occupancy: '85%', seats: '320 seats' },
  { name: 'Chennai OMR', occupancy: '74%', seats: '260 seats' },
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
  const { user } = useAuth()
  const [globalBranch, setGlobalBranch] = useState('all')

  useEffect(() => {
    if (user) {
      if (user.role?.toLowerCase() !== 'admin' && user.branch) {
        setGlobalBranch(user.branch.toLowerCase())
      } else {
        setGlobalBranch('all')
      }
    }
  }, [user])

  const isAuthPage = ['/login', '/register', '/unauthorized'].includes(location.pathname)

  if (isAuthPage) {
    return (
      <Routes key={location.pathname} location={location}>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
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
          <TopNavbar globalBranch={globalBranch} setGlobalBranch={setGlobalBranch} />
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:gap-6 lg:py-6">
            <AnimatePresence mode="wait">
              <Routes key={location.pathname} location={location}>
                <Route element={<Navigate replace to="/dashboard" />} path="/" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <Dashboard globalBranch={globalBranch} />
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
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <BIBoardPage globalBranch={globalBranch} />
                  </ProtectedRoute>
                } path="/ai-insights/bi-board" />
                <Route element={<Navigate replace to="/ai-insights/bi-board" />} path="/ai-insights" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <OccupancyForecastingPage globalBranch={globalBranch} />
                  </ProtectedRoute>
                } path="/ai-insights/forecasting" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <BranchIntelligencePage globalBranch={globalBranch} />
                  </ProtectedRoute>
                } path="/ai-insights/branch-intelligence" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <RecommendationsPage globalBranch={globalBranch} />
                  </ProtectedRoute>
                } path="/ai-insights/recommendations" />
                <Route element={
                  <ProtectedRoute allowedRoles={['admin', 'manager', 'receptionist']}>
                    <RenewalIntelligencePage globalBranch={globalBranch} />
                  </ProtectedRoute>
                } path="/crm/renewal-intelligence" />
                <Route element={<Navigate replace to="/dashboard" />} path="*" />
              </Routes>
            </AnimatePresence>
          </div>
        </section>
      </div>
      <CosmoAssistant />
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
        {allowedRoutes.filter(r => !r.path.startsWith('/ai-insights') && !r.path.startsWith('/crm')).map((item) => (
          <NavLink
            className={({ isActive }) =>
              `relative flex items-center justify-between overflow-hidden rounded-lg px-3 py-2.5 text-sm transition group ${isActive ? 'text-slate-950 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
                <motion.span className="relative z-10 flex items-center gap-3" whileHover={{ x: 3 }}>
                  {item.icon && <item.icon className={`h-4.5 w-4.5 stroke-[1.8] ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />}
                  <span>{item.label}</span>
                </motion.span>
                {isActive && <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </>
            )}
          </NavLink>
        ))}

        {/* CRM Suite Cohesive Section Header */}
        <div className="pt-4 pb-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span>CRM Suite</span>
          </p>
        </div>

        {allowedRoutes.filter(r => r.path.startsWith('/crm')).map((item) => (
          <NavLink
            className={({ isActive }) =>
              `relative flex items-center justify-between overflow-hidden rounded-lg px-3 py-2 text-sm transition group ${isActive ? 'text-slate-950 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
                <motion.span className="relative z-10 flex items-center gap-3 pl-2" whileHover={{ x: 3 }}>
                  {item.icon && <item.icon className={`h-4.5 w-4.5 stroke-[1.8] ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />}
                  <span>{item.label}</span>
                </motion.span>
                {isActive && <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </>
            )}
          </NavLink>
        ))}

        {/* AI Insights Cohesive Section Header */}
        <div className="pt-4 pb-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI Insights</span>
          </p>
        </div>

        {allowedRoutes.filter(r => r.path.startsWith('/ai-insights')).map((item) => (
          <NavLink
            className={({ isActive }) =>
              `relative flex items-center justify-between overflow-hidden rounded-lg px-3 py-2 text-sm transition group ${isActive ? 'text-slate-950 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
                <motion.span className="relative z-10 flex items-center gap-3 pl-2" whileHover={{ x: 3 }}>
                  {item.icon && <item.icon className={`h-4.5 w-4.5 stroke-[1.8] ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />}
                  <span>{item.label}</span>
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
            className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 font-bold text-rose-300 transition hover:bg-rose-500/20 cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="h-3.5 w-3.5 stroke-[2]" />
            Logout
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

function TopNavbar({ globalBranch, setGlobalBranch }) {
  const location = useLocation()
  const { token, user } = useAuth()

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

  // --- NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [notifDetail, setNotifDetail] = useState(null)

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
          setUnreadCount(data.length)
        }
      } catch (err) {
        console.error('Failed to load notifications:', err)
      }
    }
    if (token) {
      fetchNotifications()
    }
  }, [token])

  // Clicking on a notification summary opens the detailed modal
  const handleNotifClick = async (notif) => {
    setDropdownOpen(false)
    setSelectedNotif(notif)
    setModalOpen(true)
    setDetailLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/notifications/${notif.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const detail = await response.json()
        setNotifDetail(detail)
      }
    } catch (err) {
      console.error('Failed to load notification details:', err)
    } finally {
      setDetailLoading(false)
    }
  }

  // Mark a notification as read (client side filtered status + decremented count)
  const handleMarkRead = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    setUnreadCount(c => Math.max(0, c - 1))
    setModalOpen(false)
    setSelectedNotif(null)
    setNotifDetail(null)
  }

  // Mark all read
  const handleMarkAllRead = () => {
    setNotifications([])
    setUnreadCount(0)
    setDropdownOpen(false)
  }

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

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {['/', '/dashboard', '/ai-insights/bi-board', '/ai-insights/forecasting', '/ai-insights/branch-intelligence', '/crm/renewal-intelligence', '/ai-insights/recommendations'].includes(location.pathname) && (
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label className="sr-only" htmlFor="branch">
                Select branch
              </label>
              <select
                className="min-h-10 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-cyan-300 sm:w-48 sm:flex-none disabled:cursor-not-allowed disabled:opacity-50"
                value={globalBranch}
                onChange={(e) => setGlobalBranch(e.target.value)}
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
                <option className="bg-slate-950" value="hyderabad">
                  Hyderabad HITEC
                </option>
                <option className="bg-slate-950" value="bangalore">
                  Bangalore Koramangala
                </option>
                <option className="bg-slate-950" value="chennai">
                  Chennai OMR
                </option>
              </select>
            </div>
          )}

          {/* AI Notification System */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative rounded-lg border border-white/10 bg-white/[0.04] p-2.5 text-slate-400 hover:text-white transition cursor-pointer active:scale-95"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* TryHackMe/GitHub-Style Glassmorphic Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#0c0e14]/95 p-4 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <h4 className="font-bold text-white text-sm">AI Alerts Queue</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className="group flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.06] transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition text-left">
                          {notif.title}
                        </span>
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${notif.priority === 'high' ? 'bg-rose-500' :
                            notif.priority === 'medium' ? 'bg-amber-500' :
                              'bg-emerald-500'
                          }`} />
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                        <span className="capitalize">{notif.priority} Priority</span>
                        <span>{notif.timestamp}</span>
                      </div>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-6">All systems operational. No unread advisories.</p>
                  )}
                </div>
              </div>
            )}
          </div>
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

      {/* Dynamic AI Insights Notification Modal */}
      <AnimatePresence>
        {modalOpen && selectedNotif && (
          <NotificationModal
            selectedNotif={selectedNotif}
            notifDetail={notifDetail}
            onClose={() => { setModalOpen(false); setSelectedNotif(null); setNotifDetail(null); }}
            onMarkRead={handleMarkRead}
            loading={detailLoading}
          />
        )}
      </AnimatePresence>
    </header>
  )
}

function BIBoardPage({ globalBranch }) {
  const [loadScores, setLoadScores] = useState([])
  const [forecast, setForecast] = useState(null)
  const [renewals, setRenewals] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const { token, user } = useAuth()

  useEffect(() => {
    const fetchBIData = async () => {
      setLoading(true)
      try {
        const headers = { 'Authorization': `Bearer ${token}` }
        const branchQuery = globalBranch && globalBranch !== 'all' ? `?branch=${globalBranch}` : ''

        const [resForecast, resLoad, resRenewals, resRecs] = await Promise.all([
          fetch(`${API_BASE}/api/forecast${branchQuery}`, { headers }),
          fetch(`${API_BASE}/api/load-score${branchQuery}`, { headers }),
          fetch(`${API_BASE}/api/renewal-predictions${branchQuery}`, { headers }),
          fetch(`${API_BASE}/api/recommendations${branchQuery}`, { headers })
        ])

        const forecastData = resForecast.ok ? await resForecast.json() : null
        const loadData = resLoad.ok ? await resLoad.json() : []
        const renewalData = resRenewals.ok ? await resRenewals.json() : []
        const recData = resRecs.ok ? await resRecs.json() : []

        setForecast(forecastData)
        setLoadScores(loadData)
        setRenewals(renewalData)
        setRecommendations(recData)
      } catch (err) {
        console.error('Failed to load BI-Board aggregate data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchBIData()
    }
  }, [token, globalBranch])

  const handleApplyAction = (rec) => {
    const notificationId = Date.now()
    const newNotification = {
      id: notificationId,
      message: `Successfully executed: "${rec.recommendation}" for ${rec.branch}.`
    }
    setNotifications(prev => [newNotification, ...prev])
    setRecommendations(prev => prev.filter(r => !(r.title === rec.title && r.branch === rec.branch)))

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    }, 4000)
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    )
  }

  // 1. Calculations for Executive Summary
  const avgOccupancy = forecast?.currentOccupancy || (loadScores.length > 0
    ? Math.round(loadScores.reduce((acc, curr) => acc + (curr.metrics?.occupancy || 0), 0) / loadScores.length)
    : 0)

  const avgLoadScore = loadScores.length > 0
    ? Math.round(loadScores.reduce((acc, curr) => acc + curr.score, 0) / loadScores.length)
    : 0

  const highRiskCount = renewals.filter(r => r.renewalProbability < 50).length
  const totalAlertsCount = recommendations.length

  // Determine Overall Health
  let brandHealth = 'Stable'
  let brandHealthColor = 'text-cyan-400'
  if (avgLoadScore > 80) {
    brandHealth = 'Overloaded'
    brandHealthColor = 'text-rose-400'
  } else if (avgLoadScore < 50) {
    brandHealth = 'Underutilized'
    brandHealthColor = 'text-amber-400'
  } else {
    brandHealth = 'Optimal'
    brandHealthColor = 'text-emerald-400'
  }

  // 2. Average Operational Health Metrics
  const avgRoomUtil = loadScores.length > 0
    ? Math.round(loadScores.reduce((acc, curr) => acc + (curr.metrics?.roomUtilization || 0), 0) / loadScores.length)
    : 0
  const avgTicketLoad = loadScores.length > 0
    ? Math.round(loadScores.reduce((acc, curr) => acc + (curr.metrics?.ticketLoad || 0), 0) / loadScores.length)
    : 0
  const avgBookingDensity = loadScores.length > 0
    ? Math.round(loadScores.reduce((acc, curr) => acc + (curr.metrics?.bookingDensity || 0), 0) / loadScores.length)
    : 0

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification Container */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-[#0e1713]/90 px-4 py-3 text-sm text-emerald-400 shadow-2xl backdrop-blur-md"
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              key={n.id}
            >
              <Check className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 p-0.5" />
              <span>{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-cyan-400" />
            <span>BI-Board</span>
          </h2>
          <p className="text-sm text-slate-400">AI-Powered Business Intelligence Command Center</p>
        </div>
      </div>

      {/* Section 1: Executive Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Occupancy Summary */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl transition hover:border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Occupancy</p>
              <h3 className="mt-2 text-3xl font-black text-white">{avgOccupancy}%</h3>
            </div>
            <div className="rounded-lg bg-cyan-500/10 p-2.5">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="h-4.5 w-4.5" />
            <span>Dynamic OLS Projections active</span>
          </div>
        </div>

        {/* Load Summary */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl transition hover:border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand Load Rating</p>
              <h3 className="mt-2 text-3xl font-black text-white">{avgLoadScore}</h3>
            </div>
            <div className="rounded-lg bg-cyan-500/10 p-2.5">
              <Brain className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Status:</span>
            <span className={`font-semibold ${brandHealthColor}`}>{brandHealth}</span>
          </div>
        </div>

        {/* Churn Risk Summary */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl transition hover:border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">High Churn Risks</p>
              <h3 className="mt-2 text-3xl font-black text-white">{highRiskCount}</h3>
            </div>
            <div className="rounded-lg bg-rose-500/10 p-2.5">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-rose-400">
            <span>Requires active customer engagement</span>
          </div>
        </div>

        {/* Operations Advisor Alerts */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl transition hover:border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Alerts Pending</p>
              <h3 className="mt-2 text-3xl font-black text-white">{totalAlertsCount}</h3>
            </div>
            <div className="rounded-lg bg-amber-500/10 p-2.5">
              <Lightbulb className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
            <span>Executive actions available</span>
          </div>
        </div>
      </div>

      {/* Grid: 2-Columns for Forecasting and Operational Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Forecast Trends Card */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <span>Demand & Occupancy Forecast Projections</span>
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Current Occupancy</span>
                <span className="font-semibold text-white">{avgOccupancy}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${avgOccupancy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Tomorrow Forecast (OLS Linear Regression)</span>
                <span className="font-semibold text-cyan-300">{(forecast?.tomorrowForecast) || Math.round(avgOccupancy * 1.05)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-cyan-400" style={{ width: `${(forecast?.tomorrowForecast) || Math.round(avgOccupancy * 1.05)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Weekly Projected Demand</span>
                <span className="font-semibold text-emerald-300">{(forecast?.weeklyForecast) || Math.round(avgOccupancy * 1.10)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(forecast?.weeklyForecast) || Math.round(avgOccupancy * 1.10)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Monthly Projected Demand</span>
                <span className="font-semibold text-amber-300">{(forecast?.monthlyForecast) || Math.round(avgOccupancy * 1.15)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${(forecast?.monthlyForecast) || Math.round(avgOccupancy * 1.15)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Health Metrics Card */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <span>Operational Health Indicators</span>
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Room Utilization */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room Utilization</span>
              <div className="mt-3 relative flex items-center justify-center">
                <span className="text-2xl font-black text-white">{avgRoomUtil}%</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Active conference suites usage</p>
            </div>

            {/* Ticket Load */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Load</span>
              <div className="mt-3 relative flex items-center justify-center">
                <span className="text-2xl font-black text-white">{avgTicketLoad}%</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Open support queue load</p>
            </div>

            {/* Booking Density */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Density</span>
              <div className="mt-3 relative flex items-center justify-center">
                <span className="text-2xl font-black text-white">{avgBookingDensity}%</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Desks + conference bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Branch Comparison (Or current branch summary) */}
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Map className="h-5 w-5 text-cyan-400" />
          <span>Branch Comparative Load Rankings</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="pb-3 pr-4">Branch</th>
                <th className="pb-3 px-4">Load Score</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Occupancy</th>
                <th className="pb-3 px-4">Room Util.</th>
                <th className="pb-3 pl-4">Support Load</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadScores.map((row) => (
                <tr className="hover:bg-white/[0.02] transition" key={row.branch}>
                  <td className="py-4 pr-4 font-semibold text-white">{row.branch}</td>
                  <td className="py-4 px-4 font-mono font-black text-cyan-400">{row.score}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${row.score > 80 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        row.score > 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">{row.metrics?.occupancy || 0}%</td>
                  <td className="py-4 px-4">{row.metrics?.roomUtilization || 0}%</td>
                  <td className="py-4 pl-4">{row.metrics?.ticketLoad || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: 2-Columns for Churn Risks and Recommendation Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Churn Risk Panel */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <span>High Churn Risk Intervention Opportunities</span>
          </h3>

          <div className="space-y-4">
            {renewals.filter(r => r.renewalProbability < 50).slice(0, 4).map((client) => (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" key={client._id}>
                <div>
                  <h4 className="font-semibold text-white">{client.company}</h4>
                  <p className="text-xs text-slate-400">{client.clientName} • {client.branch.toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Renewal Probability</p>
                    <p className="text-sm font-black text-rose-400">{client.renewalProbability}%</p>
                  </div>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
                    High Risk
                  </span>
                </div>
              </div>
            ))}
            {renewals.filter(r => r.renewalProbability < 50).length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">All clients in healthy threshold status.</p>
            )}
          </div>
        </div>

        {/* AI Recommendations Command Preview */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            <span>Operations Advisor Recommended Interventions</span>
          </h3>

          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-3 justify-between" key={`${rec.title}-${index}`}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 ${rec.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        rec.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                      {rec.priority} Priority
                    </span>
                    <h4 className="font-semibold text-white">{rec.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{rec.recommendation}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-medium">{rec.branch}</span>
                </div>
                <button
                  className="rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition cursor-pointer self-start"
                  onClick={() => handleApplyAction(rec)}
                >
                  Apply Suggestion
                </button>
              </div>
            ))}
            {recommendations.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">All operational processes optimized. No advisories pending.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OccupancyForecastingPage({ globalBranch }) {
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true)
      try {
        const url = globalBranch && globalBranch !== 'all'
          ? `${API_BASE}/api/forecast?branch=${globalBranch}`
          : `${API_BASE}/api/forecast`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setForecast(data)
        } else {
          console.error('Failed to load occupancy forecast')
        }
      } catch (err) {
        console.error('Forecast fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchForecast()
    }
  }, [token, globalBranch])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    )
  }

  if (!forecast) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.07] p-8 text-center backdrop-blur-xl">
        <p className="text-slate-400">Failed to load predictive occupancy details.</p>
      </div>
    )
  }

  const getTrendConfig = (trendStr) => {
    switch (trendStr?.toLowerCase()) {
      case 'high demand':
        return { icon: '🔥', label: 'High Demand', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
      case 'increasing':
        return { icon: '↗', label: 'Increasing', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      default: // stable
        return { icon: '→', label: 'Stable', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    }
  }

  const trendConfig = getTrendConfig(forecast.trend)

  const cards = [
    { label: 'Current Occupancy', value: forecast.currentOccupancy, desc: 'Live desk usage index', accent: 'from-cyan-400 to-sky-500' },
    { label: 'Tomorrow Forecast', value: forecast.tomorrowForecast, desc: 'Next-day load estimate', accent: 'from-teal-400 to-emerald-500' },
    { label: 'Weekly Forecast', value: forecast.weeklyForecast, desc: '7-day rolling projection', accent: 'from-amber-300 to-orange-500' },
    { label: 'Monthly Forecast', value: forecast.monthlyForecast, desc: '30-day structural projection', accent: 'from-rose-400 to-pink-500' }
  ]

  const timelineData = [
    { day: 'Today', value: forecast.currentOccupancy, desc: 'Realtime live occupancy' },
    { day: 'Tomorrow', value: forecast.tomorrowForecast, desc: 'Predictive next-day forecast' },
    { day: '7-Day Rolling', value: forecast.weeklyForecast, desc: 'Predictive rolling week' },
    { day: '30-Day Outlook', value: forecast.monthlyForecast, desc: 'Predictive strategic month' }
  ]

  const svgWidth = 800
  const svgHeight = 320
  const padX = 80
  const padY = 50
  const chartW = svgWidth - padX * 2
  const chartH = svgHeight - padY * 2

  const pts = timelineData.map((item, idx) => {
    const x = padX + (idx * chartW) / (timelineData.length - 1)
    const y = svgHeight - padY - (item.value * chartH) / 100
    return { x, y, val: item.value, day: item.day, desc: item.desc }
  })

  const linePathD = pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPathD = `${linePathD} L ${pts[pts.length - 1].x} ${svgHeight - padY} L ${pts[0].x} ${svgHeight - padY} Z`

  const gridLines = [25, 50, 75, 100].map(pct => {
    const y = svgHeight - padY - (pct * chartH) / 100
    return { y, label: `${pct}%` }
  })

  return (
    <motion.div
      animate="animate"
      className="flex flex-col gap-6"
      exit="exit"
      initial="initial"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      variants={pageVariants}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold text-white">Occupancy Trends & Heuristics</h2>
          <p className="mt-1 text-sm text-slate-400">
            Calculated utilizing live booking frequencies and seat allocations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Current Trend:</span>
          <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${trendConfig.color}`}>
            <span>{trendConfig.icon}</span>
            <span>{trendConfig.label}</span>
          </span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <motion.div
            className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            key={card.label}
            transition={springTransition}
            whileHover={{ y: -6, borderColor: 'rgba(255,255,255,0.22)' }}
          >
            <div>
              <p className="text-sm text-slate-400">{card.label}</p>
              <h3 className="mt-4 text-4xl font-bold text-white">
                {card.value}%
              </h3>
            </div>

            <div className="mt-6 space-y-2">
              <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${card.accent}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${card.value}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[11px] text-slate-500">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Premium Glassmorphic Predictive Timeline Area Chart */}
      <motion.article
        className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl"
        transition={springTransition}
        whileHover={{ borderColor: 'rgba(34, 211, 238, 0.28)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white">AI Occupancy Predictive Timeline</h3>
            <p className="mt-1 text-xs text-slate-400">
              Heuristic progression visualization based on automated desk bookings and seating capacities.
            </p>
          </div>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300 font-medium">
            Predictive Model
          </span>
        </div>

        <div className="mt-8 rounded-lg border border-white/10 bg-black/30 p-5 backdrop-blur-xl overflow-x-auto">
          <div className="min-w-[650px] relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Lines & Labels */}
              {gridLines.map((line) => (
                <g key={line.label}>
                  <line
                    x1={padX}
                    y1={line.y}
                    x2={svgWidth - padX}
                    y2={line.y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padX - 15}
                    y={line.y + 4}
                    fill="rgba(255, 255, 255, 0.4)"
                    fontSize="10"
                    textAnchor="end"
                    className="font-medium"
                  >
                    {line.label}
                  </text>
                </g>
              ))}

              {/* Area Path */}
              <motion.path
                d={areaPathD}
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
              />

              {/* Line Path */}
              <motion.path
                d={linePathD}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />

              {/* Points & Interactive Nodes */}
              {pts.map((p, idx) => (
                <g key={p.day}>
                  {/* Glowing Pulse Ring */}
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: idx * 0.3 }}
                  />

                  {/* Core Circle */}
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#0ea5e9"
                    strokeWidth="3"
                    filter="url(#glow)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: idx * 0.15 }}
                    whileHover={{ scale: 1.35 }}
                    className="cursor-pointer"
                  />

                  {/* Horizontal Labels at the Bottom */}
                  <text
                    x={p.x}
                    y={svgHeight - 15}
                    fill="#94a3b8"
                    fontSize="11"
                    textAnchor="middle"
                    className="font-semibold"
                  >
                    {p.day}
                  </text>
                  <text
                    x={p.x}
                    y={svgHeight - 2}
                    fill="#475569"
                    fontSize="9"
                    textAnchor="middle"
                    className="hidden sm:block"
                  >
                    {p.desc}
                  </text>

                  {/* Direct Floating Value Badge */}
                  <g>
                    <rect
                      x={p.x - 20}
                      y={p.y - 28}
                      width="40"
                      height="18"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.85)"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={p.y - 16}
                      fill="#22d3ee"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {p.val}%
                    </text>
                  </g>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}

function BranchIntelligencePage({ globalBranch }) {
  const [loads, setLoads] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, user } = useAuth()

  useEffect(() => {
    const fetchLoads = async () => {
      setLoading(true)
      try {
        const url = user?.role === 'admin' && globalBranch && globalBranch !== 'all'
          ? `${API_BASE}/api/load-score?branch=${globalBranch}`
          : `${API_BASE}/api/load-score`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setLoads(data)
        } else {
          console.error('Failed to load branch load scores')
        }
      } catch (err) {
        console.error('Error fetching load scoring:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchLoads()
    }
  }, [token, globalBranch, user?.role])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    )
  }

  if (!loads || loads.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.07] p-8 text-center backdrop-blur-xl">
        <p className="text-slate-400">No branch scoring parameters available.</p>
      </div>
    )
  }

  const getStatusBadge = (statusStr) => {
    switch (statusStr?.toLowerCase()) {
      case 'high load':
        return {
          color: 'text-red-400 bg-red-500/10 border-red-500/20',
          icon: AlertTriangle,
          barColor: 'from-rose-500 to-red-600'
        };
      case 'medium load':
        return {
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          icon: Activity,
          barColor: 'from-amber-400 to-orange-500'
        };
      default: // low load
        return {
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          icon: CheckCircle,
          barColor: 'from-emerald-400 to-teal-500'
        };
    }
  }

  return (
    <motion.div
      animate="animate"
      className="flex flex-col gap-6"
      exit="exit"
      initial="initial"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      variants={pageVariants}
    >
      <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-xl backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-white">Dynamic Branch Load Parameters</h2>
        <p className="mt-1 text-sm text-slate-400">
          Executive operational weights: Occupancy (50%), Room Utilization (25%), Open Tickets (15%), Booking Density (10%).
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loads.map((item) => {
          const statusCfg = getStatusBadge(item.status)
          const StatusIcon = statusCfg.icon

          return (
            <motion.article
              className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl flex flex-col justify-between"
              key={item.branch}
              transition={springTransition}
              whileHover={{
                y: -5,
                borderColor: 'rgba(255, 255, 255, 0.22)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white text-base tracking-tight">{item.branch}</span>
                  <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusCfg.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    <span>{item.status}</span>
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between text-xs text-slate-400">
                    <span>Load index score</span>
                    <span className="text-xl font-bold text-white">{item.score}<span className="text-xs text-slate-500 font-normal">/100</span></span>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${statusCfg.barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Occupancy (50% w)</span>
                    <span className="text-slate-300 font-medium">{item.metrics?.occupancy || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Room Utilization (25% w)</span>
                    <span className="text-slate-300 font-medium">{item.metrics?.roomUtilization || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Open Tickets (15% w)</span>
                    <span className="text-slate-300 font-medium">{item.metrics?.ticketLoad || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Booking Density (10% w)</span>
                    <span className="text-slate-300 font-medium">{item.metrics?.bookingDensity || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-white/5 bg-black/30 p-3 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Recommendation</span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {item.recommendation}
                </p>
              </div>
            </motion.article>
          )
        })}
      </div>
    </motion.div>
  )
}

function RenewalIntelligencePage({ globalBranch }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [sortBy, setSortBy] = useState('contract') // contract, risk, prob-low
  const [expandedClient, setExpandedClient] = useState(null)

  const { token, user } = useAuth()

  useEffect(() => {
    const fetchRenewals = async () => {
      setLoading(true)
      try {
        const url = user?.role === 'admin' && globalBranch && globalBranch !== 'all'
          ? `${API_BASE}/api/renewal-predictions?branch=${globalBranch}`
          : `${API_BASE}/api/renewal-predictions`
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setClients(data)
        } else {
          console.error('Failed to load renewals')
        }
      } catch (err) {
        console.error('Renewals fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchRenewals()
    }
  }, [token, globalBranch, user])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    )
  }

  // Filter clients
  let filteredClients = clients.filter(c => {
    // Search filter
    const matchesSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())

    // Risk level filter
    const matchesRisk = riskFilter === 'all' || c.riskLevel.toLowerCase() === riskFilter.toLowerCase()

    // Branch filter (either sidebar globalBranch OR table-level dropdown filter for Admins)
    const activeBranch = user?.role === 'admin' ? branchFilter : 'all'
    const matchesBranch = activeBranch === 'all' || c.branch.toLowerCase() === activeBranch.toLowerCase()

    return matchesSearch && matchesRisk && matchesBranch
  })

  // Sort clients
  filteredClients.sort((a, b) => {
    if (sortBy === 'contract') {
      return new Date(a.contractEndDate) - new Date(b.contractEndDate)
    } else if (sortBy === 'prob-low') {
      return a.renewalProbability - b.renewalProbability
    } else if (sortBy === 'risk') {
      // High Risk first, then Medium, then Low
      const riskWeight = { 'high risk': 3, 'medium risk': 2, 'low risk': 1 }
      return riskWeight[b.riskLevel.toLowerCase()] - riskWeight[a.riskLevel.toLowerCase()]
    }
    return 0
  })

  const getRiskBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'high risk':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'medium risk':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: // low risk
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  }

  const getRiskBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high risk':
        return 'bg-rose-500';
      case 'medium risk':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  }

  return (
    <motion.div
      animate="animate"
      className="flex flex-col gap-6"
      exit="exit"
      initial="initial"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      variants={pageVariants}
    >
      {/* Upper info panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold text-white">CRM Renewal Retention Pipeline</h2>
          <p className="mt-1 text-sm text-slate-400">
            Churn risk forecasting based on contract durations, solved support ticket ratings, desk occupancy frequencies, and workspace checks.
          </p>
        </div>
        <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300 font-semibold flex items-center gap-1">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Active Intelligence</span>
        </div>
      </div>

      {/* Dynamic Search & Filtering Panel */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-xl backdrop-blur-xl">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="w-full min-h-10 rounded-lg border border-white/10 bg-black/20 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-400 transition"
            placeholder="Search client, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {user?.role === 'admin' && (
          <div className="min-w-[160px]">
            <select
              className="w-full min-h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-cyan-400 transition"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="all" className="bg-slate-950">All Locations</option>
              <option value="indiranagar" className="bg-slate-950">Bengaluru Indiranagar</option>
              <option value="mumbai-bkc" className="bg-slate-950">Mumbai BKC</option>
              <option value="gurugram-cyber-city" className="bg-slate-950">Gurugram Cyber</option>
              <option value="hyderabad" className="bg-slate-950">Hyderabad HITEC</option>
              <option value="bangalore" className="bg-slate-950">Bangalore Koramangala</option>
              <option value="chennai" className="bg-slate-950">Chennai OMR</option>
            </select>
          </div>
        )}

        <div className="min-w-[160px]">
          <select
            className="w-full min-h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-cyan-400 transition"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all" className="bg-slate-950">All Risk Levels</option>
            <option value="low risk" className="bg-slate-950">Low Risk</option>
            <option value="medium risk" className="bg-slate-950">Medium Risk</option>
            <option value="high risk" className="bg-slate-950">High Risk</option>
          </select>
        </div>

        <div className="min-w-[160px]">
          <select
            className="w-full min-h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-cyan-400 transition"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="contract" className="bg-slate-950">Contract Expiry</option>
            <option value="prob-low" className="bg-slate-950">Lowest Probability</option>
            <option value="risk" className="bg-slate-950">Highest Risk First</option>
          </select>
        </div>
      </div>

      {/* Main CRM Tenant Table */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur-xl">
        {filteredClients.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No matching accounts found for the applied filter configurations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4">Client / Company</th>
                  <th className="px-5 py-4">Branch</th>
                  <th className="px-5 py-4">Renewal Probability</th>
                  <th className="px-5 py-4">Risk Status</th>
                  <th className="px-5 py-4">Contract Expiry</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => {
                  const isExpanded = expandedClient === client._id
                  const badgeClass = getRiskBadge(client.riskLevel)
                  const progressBarColor = getRiskBadgeColor(client.riskLevel)
                  const expiryDate = new Date(client.contractEndDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })

                  return (
                    <React.Fragment key={client._id}>
                      <tr
                        className={`hover:bg-white/[0.02] transition cursor-pointer ${isExpanded ? 'bg-white/[0.02]' : ''}`}
                        onClick={() => setExpandedClient(isExpanded ? null : client._id)}
                      >
                        <td className="px-5 py-4.5">
                          <div className="font-semibold text-white">{client.clientName}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{client.company}</div>
                        </td>
                        <td className="px-5 py-4.5">
                          <span className="text-sm font-medium text-slate-300 capitalize">{client.branch}</span>
                        </td>
                        <td className="px-5 py-4.5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white w-10">{client.renewalProbability}%</span>
                            <div className="h-2 w-28 rounded-full bg-white/10 overflow-hidden hidden sm:block">
                              <motion.div
                                className={`h-full rounded-full ${progressBarColor}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${client.renewalProbability}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${badgeClass}`}>
                            {client.riskLevel}
                          </span>
                        </td>
                        <td className="px-5 py-4.5">
                          <div className="text-sm text-slate-300 font-medium">{expiryDate}</div>
                        </td>
                        <td className="px-5 py-4.5 text-center">
                          <button
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition duration-150"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedClient(isExpanded ? null : client._id)
                            }}
                          >
                            {isExpanded ? 'Hide Details' : 'View Metrics'}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Churn Parameter Sub-Panel */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="6" className="px-6 py-5 bg-black/40 border-t border-b border-white/5">
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="grid gap-6 md:grid-cols-2"
                            >
                              {/* Left Panel: Contact info & Recommendation */}
                              <div className="flex flex-col justify-between gap-4">
                                <div className="space-y-2">
                                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Account Diagnostics</h4>
                                  <div className="text-sm text-slate-300">
                                    <p className="flex items-center gap-2">
                                      <span className="text-slate-500 w-16">Email:</span>
                                      <span className="text-white font-medium">{client.email}</span>
                                    </p>
                                    <p className="flex items-center gap-2 mt-1.5">
                                      <span className="text-slate-500 w-16">Phone:</span>
                                      <span className="text-white font-medium">{client.phone}</span>
                                    </p>
                                    <p className="flex items-center gap-2 mt-1.5">
                                      <span className="text-slate-500 w-16">Start Date:</span>
                                      <span className="text-white font-medium">
                                        {new Date(client.contractStartDate).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <div className="rounded-lg border border-white/5 bg-white/[0.04] p-4">
                                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Retention Action Plan</span>
                                  <p className="text-xs font-semibold text-slate-200 mt-1.5 leading-relaxed">
                                    {client.recommendation}
                                  </p>
                                </div>
                              </div>

                              {/* Right Panel: Metric parameter scores breakdown */}
                              <div className="space-y-3">
                                <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Scoring Heuristics</h4>
                                {[
                                  { label: 'Occupancy Duration', value: client.metrics.occupancyDuration, weight: '30%', color: 'from-cyan-400 to-sky-500' },
                                  { label: 'Booking Frequency', value: client.metrics.bookingFrequency, weight: '25%', color: 'from-teal-400 to-emerald-500' },
                                  { label: 'Room Usage', value: client.metrics.roomUsage, weight: '20%', color: 'from-amber-400 to-orange-500' },
                                  { label: 'Ticket Satisfaction', value: client.metrics.ticketSatisfaction, weight: '15%', color: 'from-rose-400 to-pink-500' },
                                  { label: 'Recent Activity', value: client.metrics.recentActivity, weight: '10%', color: 'from-indigo-400 to-purple-500' }
                                ].map((score) => (
                                  <div key={score.label} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-slate-300 font-medium">{score.label} <span className="text-slate-500">({score.weight})</span></span>
                                      <span className="font-bold text-white">{score.value}/100</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                                      <motion.div
                                        style={{
                                          width: `${score.value}%`,
                                          backgroundImage: score.color.includes('from-') ? undefined : score.color
                                        }}
                                        className={`h-full rounded-full bg-gradient-to-r ${score.color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${score.value}%` }}
                                        transition={{ duration: 0.5 }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function RecommendationsPage({ globalBranch }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [notifications, setNotifications] = useState([])

  const { token, user } = useAuth()

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        const url = user?.role === 'admin' && globalBranch && globalBranch !== 'all'
          ? `${API_BASE}/api/recommendations?branch=${globalBranch}`
          : `${API_BASE}/api/recommendations`
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setRecommendations(data)
        } else {
          console.error('Failed to load AI recommendations')
        }
      } catch (err) {
        console.error('Recommendations fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchRecommendations()
    }
  }, [token, globalBranch, user])

  const handleApplyAction = (rec) => {
    const id = Date.now();
    const newNotification = {
      id,
      message: `Successfully executed: "${rec.recommendation}" for ${rec.branch}.`
    };
    setNotifications(prev => [newNotification, ...prev]);

    setRecommendations(prev => prev.filter(r => !(r.title === rec.title && r.branch === rec.branch)));

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    )
  }

  const filteredRecs = recommendations.filter(r => {
    if (categoryFilter === 'all') return true;
    return r.type.toLowerCase() === categoryFilter.toLowerCase();
  });

  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  }

  const getCategoryIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'capacity':
        return <Sparkles className="h-5 w-5 text-cyan-400" />;
      case 'retention':
        return <ShieldAlert className="h-5 w-5 text-rose-400" />;
      case 'support':
        return <Ticket className="h-5 w-5 text-amber-400" />;
      default:
        return <Settings className="h-5 w-5 text-emerald-400" />;
    }
  }

  return (
    <motion.div
      animate="animate"
      className="flex flex-col gap-6"
      exit="exit"
      initial="initial"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      variants={pageVariants}
    >
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="pointer-events-auto flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-950/90 px-4 py-3 text-sm text-emerald-300 shadow-xl backdrop-blur-md"
            >
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4.5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Interventions</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-400">{highPriorityCount}</span>
            <span className="text-xs text-rose-300/60">High Priority alerts</span>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4.5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Advisory Items</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{recommendations.length}</span>
            <span className="text-xs text-slate-400">Total active recommendations</span>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4.5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations Efficiency</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400">
              {recommendations.length > 0 ? Math.round((1 - highPriorityCount / recommendations.length) * 100) : 100}%
            </span>
            <span className="text-xs text-emerald-300/60">Target workspace score</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Recommendations' },
            { id: 'capacity', label: 'Capacity Planning' },
            { id: 'retention', label: 'Retention' },
            { id: 'support', label: 'Support Queue' },
            { id: 'operations', label: 'Operations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide border transition cursor-pointer ${categoryFilter === tab.id
                  ? 'bg-white text-slate-950 border-white'
                  : 'bg-white/[0.04] text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5 text-cyan-300" />
          <span>AI Operations Advisor</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredRecs.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-2 rounded-lg border border-white/5 bg-white/[0.03] p-10 text-center text-slate-400"
            >
              No active advisor items in this category tab. All systems nominal!
            </motion.div>
          ) : (
            filteredRecs.map((rec, index) => {
              const priorityClass = getPriorityBadgeColor(rec.priority);
              const icon = getCategoryIcon(rec.type);

              return (
                <motion.div
                  key={`${rec.title}-${rec.branch}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-lg backdrop-blur-xl hover:border-white/15 transition flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-black/30 border border-white/5">
                        {icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base leading-snug">{rec.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 capitalize font-medium">{rec.branch} Location</p>
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityClass}`}>
                      {rec.priority}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium bg-black/10 border border-white/5 rounded-lg p-3">
                    {rec.recommendation}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider capitalize">Category: {rec.type}</span>
                    <button
                      onClick={() => handleApplyAction(rec)}
                      className="rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs px-3.5 py-1.5 transition active:scale-95 cursor-pointer shadow-md shadow-cyan-400/10 flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Apply Suggestion</span>
                    </button>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function Dashboard({ globalBranch }) {
  const [timeframe, setTimeframe] = useState('week')
  const [dbStats, setDbStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = globalBranch && globalBranch !== 'all'
          ? `${API_BASE}/api/dashboard/stats?branch=${globalBranch}`
          : `${API_BASE}/api/dashboard/stats`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setDbStats(data)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setLoadingStats(false)
      }
    }
    if (token) {
      fetchStats()
    }
  }, [token, globalBranch])

  // Scale chart utilization relative to live database occupancy
  const baseScale = dbStats ? (dbStats.occupancyRate / 74) : 1
  const timeframeData = timeframe === 'week'
    ? weekChartData
    : timeframe === 'month'
      ? monthChartData
      : yearChartData;

  const currentChartData = timeframeData.map(item => ({
    ...item,
    value: Math.min(100, Math.round(item.value * baseScale))
  }))

  const currentChartTitle = timeframe === 'week'
    ? 'Weekly desk utilization'
    : timeframe === 'month'
      ? 'Monthly desk utilization'
      : 'Yearly desk utilization';

  const displayStats = [
    {
      label: 'Total occupancy',
      value: dbStats ? `${dbStats.occupancyRate}%` : '84%',
      change: '+5.8%',
      detail: dbStats ? `${dbStats.occupiedSeats} / ${dbStats.totalSeats} desks in use` : 'Peak utilization',
      accent: 'from-emerald-400 to-teal-500',
      icon: TrendingUp
    },
    {
      label: 'Open desks',
      value: dbStats ? `${dbStats.availableSeats}` : '392',
      change: 'Instant booking active',
      detail: 'Available now',
      accent: 'from-amber-300 to-orange-500',
      icon: Sparkles
    },
    {
      label: 'Active room bookings',
      value: dbStats ? `${dbStats.activeRoomBookings}` : '0',
      change: dbStats ? `${dbStats.totalRooms} suites online` : 'In use',
      detail: 'Live conference booking',
      accent: 'from-rose-300 to-pink-500',
      icon: DoorOpen
    },
    {
      label: 'Open tickets',
      value: dbStats ? `${dbStats.openTickets}` : '0',
      change: dbStats ? `Resolved: ${dbStats.resolvedTickets}` : 'Active Support Queue',
      detail: 'Priority support handling',
      accent: 'from-cyan-400 to-blue-500',
      icon: Activity
    }
  ]

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
        {displayStats.map((stat) => (
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
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.accent} opacity-90 flex items-center justify-center text-slate-950`}
                whileHover={{ rotate: 8, scale: 1.08 }}
              >
                {stat.icon && <stat.icon className="h-5 w-5 stroke-[2]" />}
              </motion.div>
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
              <h2 className="mt-1 text-lg font-semibold text-white">{currentChartTitle}</h2>
            </div>
            <div className="flex rounded-lg border border-white/10 bg-black/20 p-1 text-sm text-slate-400">
              <button
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition duration-150 cursor-pointer ${timeframe === 'week' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                onClick={() => setTimeframe('week')}
              >
                Week
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition duration-150 cursor-pointer ${timeframe === 'month' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                onClick={() => setTimeframe('month')}
              >
                Month
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition duration-150 cursor-pointer ${timeframe === 'year' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                onClick={() => setTimeframe('year')}
              >
                Year
              </button>
            </div>
          </div>

          <div className="mt-8 h-[500px] rounded-lg border border-white/10 bg-black/20 pt-8 pb-4 px-4 backdrop-blur-xl">
            <div className="flex h-full items-end gap-3 sm:gap-5">
              {currentChartData.map((item, index) => (
                <div className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3" key={item.day}>
                  <div className="relative flex flex-1 items-end rounded-md bg-white/[0.03]">
                    <motion.div
                      key={`${timeframe}-${index}`}
                      animate={{ scaleY: 1 }}
                      className="w-full rounded-md bg-gradient-to-t from-cyan-500 to-emerald-300 shadow-lg shadow-cyan-950/40"
                      initial={{ scaleY: 0 }}
                      style={{ height: `${item.value}%`, transformOrigin: 'bottom' }}
                      transition={{ delay: 0.05 + index * 0.05, duration: 0.6, ease: 'easeOut' }}
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

        <div className="flex flex-col gap-5">

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
        </div>
      </section>
    </motion.div>
  )
}

const seatCoordinates = {
  // A1-A2: Reception
  'A1': { x: 120, y: 495, zone: 'Reception' },
  'A2': { x: 180, y: 495, zone: 'Reception' },
  // A3-A4: Pantry counter
  'A3': { x: 790, y: 490, zone: 'Pantry' },
  'A4': { x: 850, y: 490, zone: 'Pantry' },
  // A5-A8: Lounge Area
  'A5': { x: 395, y: 460, zone: 'Collaboration Lounge' },
  'A6': { x: 445, y: 460, zone: 'Collaboration Lounge' },
  'A7': { x: 575, y: 460, zone: 'Collaboration Lounge' },
  'A8': { x: 625, y: 460, zone: 'Collaboration Lounge' },

  // B1-B2: Executive Cabin 1
  'B1': { x: 95, y: 110, zone: 'Executive Cabin 1' },
  'B2': { x: 95, y: 155, zone: 'Executive Cabin 1' },
  // B3-B4: Executive Cabin 2
  'B3': { x: 185, y: 110, zone: 'Executive Cabin 2' },
  'B4': { x: 185, y: 155, zone: 'Executive Cabin 2' },
  // B5-B6: Executive Cabin 3
  'B5': { x: 275, y: 110, zone: 'Executive Cabin 3' },
  'B6': { x: 275, y: 155, zone: 'Executive Cabin 3' },

  // B7-B8, C1-C2: Phone Booths
  'B7': { x: 842, y: 85, zone: 'Phone Booth 1' },
  'B8': { x: 917, y: 85, zone: 'Phone Booth 2' },
  'C1': { x: 842, y: 165, zone: 'Phone Booth 3' },
  'C2': { x: 917, y: 165, zone: 'Phone Booth 4' },

  // C3-C6: Small Meeting Room A
  'C3': { x: 795, y: 290, zone: 'Meeting Room A' },
  'C4': { x: 795, y: 335, zone: 'Meeting Room A' },
  'C5': { x: 895, y: 290, zone: 'Meeting Room A' },
  'C6': { x: 895, y: 335, zone: 'Meeting Room A' },

  // C7-C8, D1-D2: Small Meeting Room B
  'C7': { x: 575, y: 290, zone: 'Meeting Room B' },
  'C8': { x: 575, y: 335, zone: 'Meeting Room B' },
  'D1': { x: 665, y: 290, zone: 'Meeting Room B' },
  'D2': { x: 665, y: 335, zone: 'Meeting Room B' },

  // D3-D8, E5-E8: Open Workspace
  'D3': { x: 110, y: 275, zone: 'Open Co-Working Zone' },
  'D4': { x: 160, y: 275, zone: 'Open Co-Working Zone' },
  'D5': { x: 110, y: 335, zone: 'Open Co-Working Zone' },
  'D6': { x: 160, y: 335, zone: 'Open Co-Working Zone' },
  'D7': { x: 260, y: 275, zone: 'Open Co-Working Zone' },
  'D8': { x: 310, y: 275, zone: 'Open Co-Working Zone' },
  'E5': { x: 360, y: 275, zone: 'Open Co-Working Zone' },
  'E6': { x: 260, y: 335, zone: 'Open Co-Working Zone' },
  'E7': { x: 310, y: 335, zone: 'Open Co-Working Zone' },
  'E8': { x: 360, y: 335, zone: 'Open Co-Working Zone' },

  // E1-E4: Large Conference Room
  'E1': { x: 570, y: 110, zone: 'Large Conference Room' },
  'E2': { x: 620, y: 110, zone: 'Large Conference Room' },
  'E3': { x: 670, y: 110, zone: 'Large Conference Room' },
  'E4': { x: 720, y: 110, zone: 'Large Conference Room' }
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
        const response = await fetch(`${API_BASE}/api/seats`, {
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

  const seats = (seatMap[activeBranch] || []).map(seat => {
    const coords = seatCoordinates[seat.id] || { x: 0, y: 0, zone: 'Open Co-Working Zone' }
    return {
      ...seat,
      x: coords.x,
      y: coords.y,
      zone: coords.zone
    }
  })
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
      const response = await fetch(`${API_BASE}/api/seats/${selectedSeat.id}`, {
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
        <section className="flex flex-col gap-6">
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

            <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-3 backdrop-blur-xl sm:p-5">
              <div className="w-full">
                <div className="mb-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-400 font-semibold tracking-wider uppercase">METRIC LEGEND:</span>
                    {Object.keys(statusLabels).map((status) => (
                      <span className="inline-flex items-center gap-2" key={status}>
                        <span className={`h-3.5 w-3.5 rounded-md border ${status === 'available' ? 'border-emerald-400 bg-emerald-400/20' :
                            status === 'occupied' ? 'border-rose-500 bg-rose-500/20' :
                              'border-amber-400 bg-amber-400/20'
                          }`} />
                        <span className="text-slate-300 font-semibold">{statusLabels[status]}</span>
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded-full animate-pulse">
                    LIVE VIEW · {branchLabel}
                  </span>
                </div>

                <div className="relative border border-white/10 rounded-lg overflow-hidden bg-slate-950/80 shadow-2xl">
                  <svg viewBox="0 0 1000 600" className="w-full h-auto select-none block">
                    <defs>
                      <pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                      </pattern>
                      <linearGradient id="glass-walls" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.01)" />
                      </linearGradient>
                      <filter id="glow-emerald">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="glow-rose">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="glow-amber">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Floor Base */}
                    <rect width="1000" height="600" fill="url(#floor-grid)" />

                    {/* Architectural Spatial Boundaries */}

                    {/* 1. Executive Cabins (Top Left) */}
                    <g>
                      <rect x="50" y="50" width="270" height="150" fill="url(#glass-walls)" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Cabins dividers */}
                      <line x1="140" y1="50" x2="140" y2="200" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1.5" />
                      <line x1="230" y1="50" x2="230" y2="200" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1.5" />
                      {/* Labels */}
                      <text x="95" y="75" textAnchor="middle" className="text-[10px] font-extrabold fill-cyan-200 uppercase tracking-widest font-mono">CABIN 1</text>
                      <text x="185" y="75" textAnchor="middle" className="text-[10px] font-extrabold fill-cyan-200 uppercase tracking-widest font-mono">CABIN 2</text>
                      <text x="275" y="75" textAnchor="middle" className="text-[10px] font-extrabold fill-cyan-200 uppercase tracking-widest font-mono">CABIN 3</text>
                    </g>

                    {/* 2. Large Conference Room (Top Middle-Right) */}
                    <g>
                      <rect x="520" y="50" width="260" height="120" fill="url(#glass-walls)" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="1.5" />
                      {/* Boardroom Table */}
                      <rect x="555" y="95" width="190" height="30" rx="15" fill="rgba(129, 140, 248, 0.08)" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="1" />
                      <text x="650" y="75" textAnchor="middle" className="text-[10px] font-extrabold fill-indigo-200 uppercase tracking-widest font-mono">BOARDROOM</text>
                    </g>

                    {/* 3. Phone Booths (Top Right) */}
                    <g>
                      <rect x="810" y="50" width="140" height="150" fill="url(#glass-walls)" stroke="rgba(236, 72, 153, 0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Dividers */}
                      <line x1="880" y1="50" x2="880" y2="200" stroke="rgba(236, 72, 153, 0.15)" strokeWidth="1.5" />
                      <line x1="810" y1="125" x2="950" y2="125" stroke="rgba(236, 72, 153, 0.15)" strokeWidth="1.5" />
                      {/* Labels */}
                      <text x="845" y="70" textAnchor="middle" className="text-[8px] font-extrabold fill-pink-200 uppercase tracking-widest font-mono">PB 1</text>
                      <text x="915" y="70" textAnchor="middle" className="text-[8px] font-extrabold fill-pink-200 uppercase tracking-widest font-mono">PB 2</text>
                      <text x="845" y="145" textAnchor="middle" className="text-[8px] font-extrabold fill-pink-200 uppercase tracking-widest font-mono">PB 3</text>
                      <text x="915" y="145" textAnchor="middle" className="text-[8px] font-extrabold fill-pink-200 uppercase tracking-widest font-mono">PB 4</text>
                    </g>

                    {/* 4. Open Hot Desk Co-Working Zone (Middle Left) */}
                    <g>
                      <rect x="50" y="230" width="440" height="160" fill="rgba(16, 185, 129, 0.02)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" />
                      {/* Desks Islands */}
                      <rect x="90" y="295" width="90" height="20" rx="4" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
                      <rect x="240" y="295" width="140" height="20" rx="4" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
                      <text x="270" y="250" textAnchor="middle" className="text-[10px] font-extrabold fill-emerald-200 uppercase tracking-widest font-mono">OPEN HOT DESKS ZONE</text>
                    </g>

                    {/* 5. Small Meeting Room B (Middle Center-Right) */}
                    <g>
                      <rect x="520" y="240" width="200" height="140" fill="url(#glass-walls)" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" />
                      {/* Center Table */}
                      <rect x="585" y="295" width="70" height="30" rx="10" fill="rgba(34, 211, 238, 0.05)" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" />
                      <text x="620" y="265" textAnchor="middle" className="text-[9px] font-extrabold fill-cyan-200 uppercase tracking-widest font-mono">MEETING ROOM B</text>
                    </g>

                    {/* 6. Small Meeting Room A (Middle Right) */}
                    <g>
                      <rect x="740" y="240" width="210" height="140" fill="url(#glass-walls)" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" />
                      {/* Center Table */}
                      <rect x="805" y="295" width="80" height="30" rx="10" fill="rgba(34, 211, 238, 0.05)" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" />
                      <text x="845" y="265" textAnchor="middle" className="text-[9px] font-extrabold fill-cyan-200 uppercase tracking-widest font-mono">MEETING ROOM A</text>
                    </g>

                    {/* 7. Reception & Entry Lobby (Bottom Left) */}
                    <g>
                      <rect x="50" y="420" width="250" height="130" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                      {/* Reception Desk */}
                      <rect x="100" y="450" width="100" height="20" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      {/* Glass doors entrance indicator */}
                      <line x1="120" y1="550" x2="180" y2="550" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="3" />
                      <text x="150" y="535" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-200 uppercase tracking-widest font-mono">RECEPTION & ENTRANCE</text>
                    </g>

                    {/* 8. Collaboration Lounge (Bottom Center) */}
                    <g>
                      <rect x="330" y="420" width="360" height="130" fill="rgba(245, 158, 11, 0.02)" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" />
                      {/* Circular soft seats */}
                      <circle cx="410" cy="485" r="20" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx="610" cy="485" r="20" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="510" y="445" textAnchor="middle" className="text-[9px] font-extrabold fill-amber-200 uppercase tracking-widest font-mono">COLLABORATION LOUNGE</text>
                    </g>

                    {/* 9. Pantry & Cafeteria (Bottom Right) */}
                    <g>
                      <rect x="720" y="420" width="230" height="130" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                      {/* Kitchen high counter */}
                      <rect x="750" y="455" width="170" height="15" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      <text x="835" y="530" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-200 uppercase tracking-widest font-mono">PANTRY & CAFETERIA</text>
                    </g>

                    {/* Hallways & Walkways Visual Path labels */}
                    <text x="400" y="215" textAnchor="middle" className="text-[8px] font-bold fill-slate-300 uppercase tracking-widest font-mono">MAIN CORRIDOR A</text>
                    <text x="400" y="408" textAnchor="middle" className="text-[8px] font-bold fill-slate-300 uppercase tracking-widest font-mono">MAIN CORRIDOR B</text>
                    <text x="507" y="300" textAnchor="middle" className="text-[8px] font-bold fill-slate-300 uppercase tracking-widest font-mono" transform="rotate(-90, 507, 300)">CENTRAL CROSSING PASSAGE</text>

                    {/* Render Interactive Coordinate seats */}
                    {seats.map((seat) => {
                      const isSelected = selectedSeat?.id === seat.id;

                      let seatColorClass = "rgba(16, 185, 129, 0.15)";
                      let seatStroke = "#10b981";
                      let seatFilter = "url(#glow-emerald)";
                      let seatHoverClass = "hover:fill-emerald-400/25";

                      if (seat.status === 'occupied') {
                        seatColorClass = "rgba(244, 63, 94, 0.12)";
                        seatStroke = "#f43f5e";
                        seatFilter = "url(#glow-rose)";
                        seatHoverClass = "hover:fill-rose-500/25";
                      } else if (seat.status === 'reserved') {
                        seatColorClass = "rgba(245, 158, 11, 0.15)";
                        seatStroke = "#f59e0b";
                        seatFilter = "url(#glow-amber)";
                        seatHoverClass = "hover:fill-amber-400/25";
                      }

                      return (
                        <g
                          className="cursor-pointer group"
                          key={seat.id}
                          onClick={() => openSeatModal(seat)}
                        >
                          <title>{`${seat.id} · ${statusLabels[seat.status]} · ${seat.assignedTo || 'Unassigned'}`}</title>
                          {/* Seat box */}
                          <rect
                            x={seat.x - 13}
                            y={seat.y - 13}
                            width="26"
                            height="26"
                            rx="5"
                            fill={seatColorClass}
                            stroke={seatStroke}
                            strokeWidth={isSelected ? "2.5" : "1.2"}
                            filter={seatFilter}
                            className={`transition-all duration-200 ${seatHoverClass}`}
                          />
                          {/* Selected highlighted outer ring */}
                          {isSelected && (
                            <rect
                              x={seat.x - 17}
                              y={seat.y - 17}
                              width="34"
                              height="34"
                              rx="8"
                              fill="none"
                              stroke="#22d3ee"
                              strokeWidth="1.5"
                              strokeDasharray="2 2"
                            />
                          )}
                          {/* Seat identifier label */}
                          <text
                            x={seat.x}
                            y={seat.y + 3}
                            textAnchor="middle"
                            className="text-[9px] font-black fill-white font-mono tracking-tighter"
                          >
                            {seat.id}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.aside
            className="w-full rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
            transition={springTransition}
            whileHover={{ borderColor: 'rgba(34, 211, 238, 0.24)' }}
          >
            <div>
              <p className="text-sm text-slate-400">Live branch summary</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Seat operations & branches</h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {floorBranches.map((branch) => {
                const branchSeats = seatMap[branch.value] || []
                const availableSeats = branchSeats.filter((seat) => seat.status === 'available').length
                const isAllowed = user?.role?.toLowerCase() === 'admin' || (user?.branch || '').toLowerCase() === branch.value

                return (
                  <motion.button
                    className={`w-full rounded-lg border p-4 text-left transition ${branch.value === activeBranch
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
                    whileHover={isAllowed ? { y: -2, x: 0 } : {}}
                    whileTap={isAllowed ? { scale: 0.98 } : {}}
                    disabled={!isAllowed}
                    type="button"
                  >
                    <div className="flex flex-col justify-between h-full gap-3">
                      <span className="flex items-center justify-between gap-1 text-sm font-medium text-white">
                        <span>{branch.label}</span>
                        {!isAllowed && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
                            🔒 Lock
                          </span>
                        )}
                      </span>
                      <div className="flex items-end justify-between gap-2 mt-2">
                        <span className="text-xs text-slate-400 font-mono">{branch.deskRate}</span>
                        <span className="text-right text-sm font-bold text-emerald-400">
                          {isAllowed ? `${availableSeats} open` : 'Locked'}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="mt-6 rounded-lg bg-white/[0.04] border border-white/5 p-4 text-slate-300">
              <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Booking rule & daily check-ins</p>
              <p className="mt-2 text-sm text-slate-400">
                <span className="text-cyan-400 font-bold font-mono">{activeBranchData?.checkIns || 0}</span> member check-ins today at <span className="font-semibold text-white">{branchLabel}</span>. Seat assignments dynamically map database states between available, occupied, and reserved.
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
                      <span className={`rounded-full border px-3 py-1 text-xs flex items-center gap-1 ${statusStyles[selectedSeat.status]}`}>
                        {selectedSeat.status === 'available' && <CheckCircle className="h-3 w-3 stroke-[2]" />}
                        {selectedSeat.status === 'occupied' && <AlertCircle className="h-3 w-3 stroke-[2]" />}
                        {selectedSeat.status === 'reserved' && <Clock className="h-3 w-3 stroke-[2]" />}
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
          { label: 'Inside now', value: visitorCounts.checkedIn, helper: 'Live visitors', accent: 'from-emerald-400 to-teal-500', icon: UserCheck },
          { label: 'Expected', value: visitorCounts.expected, helper: 'Scheduled today', accent: 'from-cyan-400 to-sky-500', icon: Clock },
          { label: 'Checked out', value: visitorCounts.checkedOut, helper: 'Completed visits', accent: 'from-slate-300 to-slate-500', icon: CheckCircle },
          { label: 'Delayed', value: visitorCounts.delayed, helper: 'Needs follow-up', accent: 'from-amber-300 to-orange-500', icon: AlertTriangle },
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
              <motion.div
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${metric.accent} opacity-90 flex items-center justify-center text-slate-950`}
                whileHover={{ rotate: 8, scale: 1.08 }}
              >
                {metric.icon && <metric.icon className="h-5 w-5 stroke-[2]" />}
              </motion.div>
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
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${visitorStatuses[visitor.status].className}`}>
                        {visitor.status === 'checkedIn' && <CheckCircle className="h-3 w-3 stroke-[2]" />}
                        {visitor.status === 'checkedOut' && <UserCheck className="h-3 w-3 stroke-[2]" />}
                        {visitor.status === 'expected' && <Clock className="h-3 w-3 stroke-[2]" />}
                        {visitor.status === 'delayed' && <AlertTriangle className="h-3 w-3 stroke-[2]" />}
                        {visitorStatuses[visitor.status].label}
                      </span>
                      <p className="mt-2 text-xs text-slate-500">
                        In {visitor.checkIn || '--'} · Out {visitor.checkOut || '--'}
                      </p>
                    </div>
                    <div className="flex min-w-0 flex-wrap gap-2">
                      <button
                        className="min-h-9 flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40 xl:flex-none flex items-center gap-1 cursor-pointer"
                        disabled={visitor.status === 'checkedIn'}
                        onClick={() => checkInVisitor(visitor.id)}
                        type="button"
                      >
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        Check in
                      </button>
                      <button
                        className="min-h-9 flex-1 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 xl:flex-none flex items-center gap-1 cursor-pointer"
                        disabled={visitor.status !== 'checkedIn'}
                        onClick={() => checkOutVisitor(visitor.id)}
                        type="button"
                      >
                        <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
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
              className="min-h-11 rounded-lg bg-white px-4 text-sm font-bold text-slate-950 transition hover:bg-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              type="submit"
            >
              <UserPlus className="h-4 w-4 stroke-[2]" />
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
