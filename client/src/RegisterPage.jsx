import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Branch Manager' },
  { value: 'receptionist', label: 'Receptionist' }
]

const BRANCHES = [
  { value: 'indiranagar', label: 'Bengaluru Indiranagar' },
  { value: 'mumbai-bkc', label: 'Mumbai BKC' },
  { value: 'gurugram-cyber-city', label: 'Gurugram Cyber City' },
  { value: 'hyderabad', label: 'Hyderabad Hitech' },
  { value: 'bangalore', label: 'Bangalore General' },
  { value: 'chennai', label: 'Chennai T-Nagar' }
]

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('manager')
  const [branch, setBranch] = useState('indiranagar')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { registerUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !role || !branch) {
      setError('Please fill in all the required fields')
      return
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const result = await registerUser(name, email, password, role, branch)
    setIsSubmitting(false)

    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#08090d] flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100">
      {/* Dynamic ambient background glowing bubbles */}
      <div className="absolute top-[20%] left-[10%] w-[32rem] h-[32rem] rounded-full bg-cyan-500/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[28rem] h-[28rem] rounded-full bg-emerald-500/6 blur-[110px] pointer-events-none" />

      {/* Main card */}
      <motion.article
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg border border-white/10 bg-[#0b0d12]/60 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-2xl z-10 flex flex-col gap-6"
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 240, damping: 25 }}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-white text-slate-950 font-bold text-lg flex items-center justify-center shadow-lg shadow-white/5">
            Co
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Create CoSaaS Workspace</h1>
            <p className="text-xs text-slate-500 mt-1">Register new corporate staff and initialize local branch dashboards</p>
          </div>
        </div>

        {/* Error notification banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 flex items-start gap-2.5 shadow-md shadow-rose-950/10"
              exit={{ opacity: 0, y: -5 }}
              initial={{ opacity: 0, y: -5 }}
            >
              <svg className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            {/* Full Name */}
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
              Staff Full Name
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  className="min-h-11 w-full pl-10 rounded-xl border border-white/10 bg-white/[0.04] pr-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.06]"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required
                  type="text"
                  value={name}
                />
              </div>
            </label>

            {/* Email Address */}
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
              Corporate Email Address
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  className="min-h-11 w-full pl-10 rounded-xl border border-white/10 bg-white/[0.04] pr-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.06]"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@cosaas.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </label>

            {/* Password */}
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
              User Password
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  className="min-h-11 w-full pl-10 rounded-xl border border-white/10 bg-white/[0.04] pr-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.06]"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </label>

            {/* Role and Branch Selectors */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                System Role
                <select
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0b0d12] px-3 text-sm text-white outline-none transition focus:border-cyan-300/60 cursor-pointer"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                >
                  {ROLES.map(r => (
                    <option className="bg-[#0b0d12]" key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
                Assigned Branch
                <select
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0b0d12] px-3 text-sm text-white outline-none transition focus:border-cyan-300/60 cursor-pointer"
                  onChange={(e) => setBranch(e.target.value)}
                  value={branch}
                >
                  {BRANCHES.map(b => (
                    <option className="bg-[#0b0d12]" key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              className="w-full min-h-11 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition duration-200 cursor-pointer shadow-lg active:scale-95 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Toggle Switch */}
          <p className="text-xs text-center text-slate-400 mt-2">
            Already have an account?{' '}
            <Link className="text-cyan-400 font-bold hover:underline transition ml-1" to="/login">
              Sign In
            </Link>
          </p>
        </form>
      </motion.article>
    </div>
  )
}
