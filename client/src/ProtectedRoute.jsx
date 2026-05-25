import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { motion } from 'framer-motion'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  // Beautiful loading screen during auth hydration
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090d] flex flex-col items-center justify-center text-slate-100 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[30%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[20%] w-[25rem] h-[25rem] rounded-full bg-emerald-500/8 blur-[100px] pointer-events-none" />

        <div className="flex flex-col items-center gap-5 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="h-12 w-12 rounded-full border-t-2 border-r-2 border-cyan-400 border-b-0 border-l-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          />

          <div className="text-center">
            <p className="text-sm font-semibold tracking-wider uppercase text-cyan-300">
              CoSaaS OS
            </p>

            <p className="text-xs text-slate-500 mt-1.5">
              Synchronizing workspace session...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location }}
        to="/login"
      />
    )
  }

  // Role-based authorization
  if (allowedRoles) {
    const hasAccess = allowedRoles.some((allowedRole) => {
      const allowedClean = allowedRole
        .toLowerCase()
        .replace(/\s+/g, '')

      const userClean = (user?.role || '')
        .toLowerCase()
        .replace(/\s+/g, '')

      return allowedClean === userClean ||
             (allowedClean === 'manager' && userClean === 'branchmanager') ||
             (allowedClean === 'branchmanager' && userClean === 'manager')
    })

    if (!hasAccess) {
      return <Navigate replace to="/unauthorized" />
    }
  }

  return children
}