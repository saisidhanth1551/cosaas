import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from './AuthContext'

export default function UnauthorizedPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center px-4 relative overflow-hidden text-slate-200">
      {/* Background gradients */}
      <div className="absolute top-[25%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[20%] w-[25rem] h-[25rem] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <motion.article
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-md w-full border border-white/10 bg-[#0b0d12]/60 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-2xl text-center space-y-6 z-10"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        {/* Glow Warning shield */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-950/20">
          <svg className="h-8 w-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your CoSaaS user account role does not have authorization to view this module.
          </p>
        </div>

        {/* Identity Details */}
        {user && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Active Identity</span>
              <span className="font-semibold text-white">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email Login</span>
              <span className="text-slate-300 break-all">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Role</span>
              <span className="font-bold text-rose-300 uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link
            className="w-full min-h-11 inline-flex items-center justify-center rounded-lg bg-white text-slate-950 font-bold hover:bg-slate-200 transition duration-200 cursor-pointer shadow-lg active:scale-95 text-sm"
            to="/login"
          >
            Return to Dashboard
          </Link>
        </div>

        <p className="text-[10px] text-slate-600">
          Need access? Please contact your workspace system administrator.
        </p>
      </motion.article>
    </div>
  )
}
