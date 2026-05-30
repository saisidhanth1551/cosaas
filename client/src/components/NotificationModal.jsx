import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function NotificationModal({
  selectedNotif,
  notifDetail,
  onClose,
  onMarkRead,
  loading
}) {
  // Handle escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!selectedNotif) return null

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-[calc(100vw-24px)] md:w-[90vw] md:max-w-[800px] max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d12]/95 shadow-2xl backdrop-blur-2xl text-left"
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              selectedNotif.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
              selectedNotif.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {selectedNotif.priority} Priority
            </span>
            <span className="text-[10px] text-slate-500">{selectedNotif.timestamp}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto overflow-x-hidden flex-1">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
            </div>
          ) : notifDetail ? (
            <>
              <div>
                <h3 className="text-xl font-bold text-white">{notifDetail.title || selectedNotif.title}</h3>
                {notifDetail.metrics && (
                  <p className="mt-2 text-sm font-semibold text-cyan-400 bg-cyan-950/20 border border-cyan-500/10 px-3 py-2 rounded-lg font-mono">
                    {notifDetail.metrics}
                  </p>
                )}
              </div>

              {notifDetail.analysis && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Model Analysis</h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5">
                    {notifDetail.analysis}
                  </p>
                </div>
              )}

              {notifDetail.recommendation && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommended Intervention</h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5">
                    {notifDetail.recommendation}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">Failed to retrieve analysis details.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4 bg-black/10 shrink-0">
          <button
            onClick={() => onMarkRead(selectedNotif.id)}
            className="rounded-lg border border-white/10 hover:bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition cursor-pointer"
          >
            Mark as Read
          </button>
          {notifDetail?.actionLink && (
            <NavLink
              to={notifDetail.actionLink}
              onClick={onClose}
              className="rounded-lg bg-cyan-500 hover:bg-cyan-600 px-4 py-2 text-sm font-semibold text-slate-950 transition cursor-pointer"
            >
              View Related Page
            </NavLink>
          )}
        </div>
      </motion.div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
