"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'

import { supabase } from '@/lib/supabase'

export default function BookPage() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [checking, setChecking] = useState(false)

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', 
    '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00'
  ].map(t => {
    const hour = parseInt(t.slice(0,2))
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour.toString().padStart(2, '0')}:${t.slice(3)} ${period}`
  })

  const checkAvailability = async () => {
    if (!date || !time) return

    setChecking(true)
    const rawTime = time.split(' ')[0]
    const { data: existing } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", date)
      .eq("time", rawTime)
      .in("status", ["pending", "approved"])

    setIsAvailable(!!(existing && existing.length === 0))
    setChecking(false)
  }

  useEffect(() => {
    checkAvailability()
  }, [date, time])

  const handleBooking = async () => {
    setLoading(true)
    const rawTime = time.split(' ')[0]

    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      alert('Please login first!')
      setLoading(false)
      return
    }

    const user = sessionData.session.user

    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      date,
      time: rawTime,
      status: 'pending'
    })

    if (error) {
      alert('Booking failed: ' + error.message)
    } else {
      alert('🛳️ Tee time booked successfully! Check your dashboard.')
      setDate('')
      setTime('')
      setIsAvailable(true)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className='bg-[var(--card)] backdrop-blur-xl shadow-2xl rounded-3xl p-12 border border-[var(--card-border)]'>
        <h1 className='text-5xl font-black text-[var(--foreground)] mb-12 text-center drop-shadow-2xl'>⛳ Book Tee Time</h1>
        
        <div className='space-y-8'>
          <div>
            <label className='block text-xl font-bold text-[var(--foreground)] mb-4'>📅 Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-6 border-2 border-[var(--card-border)] rounded-2xl bg-[var(--card)] text-[var(--foreground)] font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] text-2xl backdrop-blur-lg"
              required
            />
          </div>

          <div>
            <label className='block text-xl font-bold text-[var(--foreground)] mb-4'>🕐 Choose Time Slot</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-6 border-2 border-[var(--card-border)] rounded-2xl bg-[var(--card)] text-[var(--foreground)] font-bold focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] text-2xl backdrop-blur-lg"
              required
            >
              <option value="">Select time slot...</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className='flex gap-4'>
            <button
              onClick={checkAvailability}
              disabled={checking || !date || !time}
              className='flex-1 bg-gradient-to-r from-[var(--accent)] to-orange-500 hover:from-orange-500 hover:to-amber-600 text-black font-black py-6 px-8 rounded-2xl text-xl transition-all duration-200 shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--accent)]/50'
            >
              {checking ? 'Checking...' : 'Check Availability'}
            </button>

            <button
              onClick={handleBooking}
              disabled={loading || !isAvailable || !date || !time}
              className={`flex-1 font-black py-6 px-8 rounded-2xl text-xl transition-all duration-200 shadow-2xl hover:shadow-3xl hover:-translate-y-1 border font-black ${
                isAvailable 
                  ? 'bg-[var(--primary)] hover:bg-green-500 text-black border-[var(--primary)]/50' 
                  : 'bg-gray-500 text-gray-300 border-gray-400/50 cursor-not-allowed'
              }`}
            >
              {loading ? 'Booking...' : isAvailable ? '✅ Book Slot' : '❌ Slot Unavailable'}
            </button>
          </div>

          {time && (
            <div className={`p-4 rounded-2xl font-bold text-xl text-center transition-all ${
              isAvailable ? 'bg-green-500/20 border border-green-400/50 text-green-100' : 'bg-red-500/20 border border-red-400/50 text-red-100'
            }`}>
              {isAvailable ? '✅ Slot Available!' : '❌ Slot Already Booked'}
            </div>
          )}
        </div>

        <div className='mt-12 p-6 bg-[var(--card)]/50 rounded-2xl border border-[var(--card-border)] backdrop-blur-lg text-center'>
          <p className='text-lg text-[var(--foreground)]/80 mb-2'>💡 Pro Tip</p>
          <p className='text-[var(--foreground)]/70'>Book early for prime tee times! Dawn slots (6-8AM) are popular.</p>
        </div>
      </div>
    </div>
  )
}
