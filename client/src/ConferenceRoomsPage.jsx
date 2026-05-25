import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './AuthContext'

const floorBranches = [
  { label: 'Bengaluru Indiranagar', value: 'indiranagar', deskRate: '₹9,500/mo' },
  { label: 'Mumbai BKC', value: 'mumbai-bkc', deskRate: '₹14,200/mo' },
  { label: 'Gurugram Cyber City', value: 'gurugram-cyber-city', deskRate: '₹11,800/mo' },
  { label: 'Hyderabad HITEC', value: 'hyderabad', deskRate: '₹10,500/mo' },
  { label: 'Bangalore Koramangala', value: 'bangalore', deskRate: '₹9,800/mo' },
  { label: 'Chennai OMR', value: 'chennai', deskRate: '₹8,900/mo' },
]

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM'
]

const today = new Date().toISOString().split('T')[0]

// Spring transition configs for animations
const springTransition = { type: 'spring', stiffness: 300, damping: 22 }

const pageVariants = {
  initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(8px)' },
}

export default function ConferenceRoomsPage() {
  const { user, token } = useAuth()
  const [activeBranch, setActiveBranch] = useState(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      return user.branch.toLowerCase()
    }
    return 'indiranagar'
  })
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Booking Form State
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [organizer, setOrganizer] = useState('')
  const [bookingDate, setBookingDate] = useState(today)
  const [bookingTimeSlot, setBookingTimeSlot] = useState(timeSlots[0])
  const [bookingDuration, setBookingDuration] = useState('1 hour')
  const [toast, setToast] = useState(null)

  // Sync active branch to user profile location for non-admins
  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin' && user.branch) {
      setActiveBranch(user.branch.toLowerCase())
    }
  }, [user])

  // Fetch Rooms
  const fetchRooms = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/rooms?branch=${activeBranch}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRooms(data)
      } else {
        console.error('Failed to load conference rooms')
      }
    } catch (err) {
      console.error('Rooms fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchRooms()
    }
  }, [activeBranch, token])

  // Toast Auto-Dismiss
  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timeout)
  }, [toast])

  const activeBranchData = floorBranches.find((branch) => branch.value === activeBranch)
  const branchLabel = activeBranchData?.label || 'Indiranagar'

  // Handle Bookings Submit
  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!organizer.trim()) return

    try {
      const response = await fetch(`/api/rooms/${selectedRoom._id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          organizer: organizer.trim(),
          date: bookingDate,
          timeSlot: bookingTimeSlot,
          duration: bookingDuration
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Update local room status
        setRooms(prev => prev.map(r => r._id === data._id ? data : r))
        setSelectedRoom(null)
        setOrganizer('')
        setToast({
          message: `Booking Confirmed!`,
          desc: `${selectedRoom.name} successfully reserved for ${organizer.trim()} at ${bookingTimeSlot}.`,
          type: 'success'
        })
      } else {
        setToast({
          message: 'Booking Failed',
          desc: data.error || 'Conflict detected. Please try another slot.',
          type: 'error'
        })
      }
    } catch (err) {
      console.error('Error reserving room:', err)
      setToast({
        message: 'Network Error',
        desc: 'Connection failed. Please check if your server is running.',
        type: 'error'
      })
    }
  }

  // Get Room Type Icons
  const getRoomIcon = (name) => {
    if (name.toLowerCase().includes('boardroom')) return '🏢'
    if (name.toLowerCase().includes('pod')) return '🎧'
    return '👥'
  }

  return (
    <>
      {/* Toast Notifications */}
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
        {/* Top Header Card */}
        <motion.article
          className="rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5"
          transition={springTransition}
          whileHover={{ borderColor: 'rgba(34, 211, 238, 0.24)' }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Collaborations & Boardrooms</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{branchLabel} Meetings</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Book premium conference spaces, brainstorming pods, and executive boardrooms.
                Managers are restricted to booking spaces at their designated branches.
              </p>
            </div>

            {/* Dropdown Selection */}
            <div className="w-full sm:w-56">
              <label className="text-xs font-medium uppercase text-slate-500" htmlFor="room-branch">
                Branch Location
              </label>
              <select
                className={`mt-2 min-h-10 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3 text-sm text-white outline-none transition focus:border-cyan-300 ${
                  user?.role?.toLowerCase() !== 'admin' ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                }`}
                id="room-branch"
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
                  🔒 Branch Locked to {user?.branch}
                </span>
              )}
            </div>
          </div>
        </motion.article>

        {/* Room Display Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              <span className="inline-block animate-spin text-2xl mr-2">🌀</span>
              Loading premium spaces...
            </div>
          ) : rooms.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-white/10 rounded-xl bg-black/20">
              No rooms registered for this branch.
            </div>
          ) : (
            rooms.map((room) => {
              const todaysBookings = room.bookings.filter(b => b.date === today)

              return (
                <motion.div
                  className="flex flex-col rounded-xl border border-white/10 bg-[#11141c]/60 p-5 shadow-xl backdrop-blur-md"
                  key={room._id}
                  whileHover={{ y: -3, borderColor: 'rgba(34, 211, 238, 0.24)' }}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{getRoomIcon(room.name)}</span>
                      <div>
                        <h3 className="font-semibold text-white text-base leading-tight">{room.name}</h3>
                        <span className="mt-1 inline-block text-[11px] font-medium text-slate-400">
                          👥 Cap: {room.capacity} Pax
                        </span>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      room.status === 'available'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {room.status}
                    </span>
                  </div>

                  {/* Amenities Bullets */}
                  <div className="mt-5 flex-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Premium Specs</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {room.amenities.map((item) => (
                        <span
                          className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-300"
                          key={item}
                        >
                          ⚡ {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Upcoming Schedule */}
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Today's Schedule</p>
                    {todaysBookings.length === 0 ? (
                      <p className="mt-2 text-xs text-emerald-400 font-medium">✨ Open Reservation (No slots booked)</p>
                    ) : (
                      <div className="mt-2 space-y-1.5">
                        {todaysBookings.map((b) => (
                          <div className="flex items-center justify-between rounded bg-black/30 px-2 py-1.5 text-xs border border-white/5" key={b._id}>
                            <span className="font-medium text-slate-300 truncate max-w-[120px]">{b.organizer}</span>
                            <span className="text-cyan-300 text-[10px]">{b.timeSlot}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    className="mt-6 w-full rounded-lg bg-cyan-400 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
                    onClick={() => {
                      setSelectedRoom(room)
                      setBookingDate(today)
                      setBookingTimeSlot(timeSlots[0])
                      setOrganizer('')
                    }}
                    type="button"
                  >
                    📅 Book Space
                  </button>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>

      {/* Booking Form Dialog Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setSelectedRoom(null)}
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
                  <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Reservation System</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedRoom.name}</h3>
                </div>
                <button
                  className="rounded-full bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setSelectedRoom(null)}
                  type="button"
                >
                  ✖
                </button>
              </div>

              {/* Existing Bookings for Selected Date helper widget */}
              <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Busy Slots for {bookingDate}</h4>
                {selectedRoom.bookings.filter(b => b.date === bookingDate).length === 0 ? (
                  <p className="mt-1 text-xs text-emerald-400">🎉 Safe! All time slots are completely open.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedRoom.bookings
                      .filter(b => b.date === bookingDate)
                      .map(b => (
                        <span key={b._id} className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] text-rose-300 font-medium">
                          🚫 {b.timeSlot}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleBookingSubmit}>
                {/* Organizer Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="org-name">
                    Organizer Name
                  </label>
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-300"
                    id="org-name"
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="Enter corporate team/client name"
                    required
                    type="text"
                    value={organizer}
                  />
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="book-date">
                    Meeting Date
                  </label>
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-white outline-none transition focus:border-cyan-300 cursor-pointer"
                    id="book-date"
                    min={today}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    type="date"
                    value={bookingDate}
                  />
                </div>

                {/* Time Slot Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="book-slot">
                    Hourly Time Slot
                  </label>
                  <select
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300 cursor-pointer"
                    id="book-slot"
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    value={bookingTimeSlot}
                  >
                    {timeSlots.map((slot) => {
                      const isTaken = selectedRoom.bookings.some(b => b.date === bookingDate && b.timeSlot === slot)
                      return (
                        <option className="bg-slate-950" key={slot} value={slot} disabled={isTaken}>
                          {slot} {isTaken ? '(Occupied 🔒)' : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Duration Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="book-dur">
                    Duration
                  </label>
                  <select
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300 cursor-pointer"
                    id="book-dur"
                    onChange={(e) => setBookingDuration(e.target.value)}
                    value={bookingDuration}
                  >
                    <option className="bg-slate-950" value="1 hour">1 Hour</option>
                    <option className="bg-slate-950" value="2 hours">2 Hours</option>
                    <option className="bg-slate-950" value="Half Day">Half Day</option>
                    <option className="bg-slate-950" value="Full Day">Full Day</option>
                  </select>
                </div>

                {/* Submit Action */}
                <button
                  className="mt-6 w-full rounded-lg bg-cyan-400 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!organizer.trim()}
                  type="submit"
                >
                  Confirm Reservation Slots
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
