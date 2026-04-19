"use client"

import AdminLayout from "./layout"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  const fetchBookingsByStatus = async (status: string) => {
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      router.replace('/login')
      return
    }

    const user = sessionData.session.user

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.replace('/dashboard')
      return
    }

    const query = supabase
      .from("bookings")
      .select(`
        *,
        profiles!user_id_fkey (full_name)
      `)
      .order("created_at", { ascending: false })

    if (status !== 'all') {
      query.eq("status", status)
    }

    const { data: bookingData } = await query

    setBookings(bookingData || [])
  }

  const loadData = async () => {
    await fetchBookingsByStatus(filter)
    const { data: usersData } = await supabase
      .from('profiles')
      .select('*')
    setUsers(usersData || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel("bookings-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          console.log("Admin - Change detected:", payload);
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, filter])

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter((b: any) => b.status === filter.toLowerCase())

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center min-h-[80vh]'>
          <p className='text-xl text-white'>Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='space-y-8'>
        <div>
          <h1 className='text-4xl font-bold mb-2 text-white'>Golf Admin Dashboard</h1>
          <p className='text-[#9CA3AF]'>Manage tee times and users</p>
        </div>

        <div>
          <h2 className='text-2xl font-bold mb-6 text-white'>Users ({users.length})</h2>
          <div className='bg-[#163A24] backdrop-blur-lg shadow-2xl rounded-2xl border border-[#FBBF24]/30 overflow-hidden'>
            <table className='w-full'>
              <thead>
                <tr className='bg-[#1F2937]'>
                  <th className='px-8 py-4 text-left text-sm font-semibold text-white'>Full Name</th>
                  <th className='px-8 py-4 text-left text-sm font-semibold text-white'>Role</th>
                  <th className='px-8 py-4 text-left text-sm font-semibold text-white'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#FBBF24]/30'>
                {users.map((user) => (
                  <tr key={user.id} className='hover:bg-[#1F2937]/50 transition-colors'>
                    <td className='px-8 py-6 font-semibold text-white'>{user.full_name || 'No name'}</td>
                    <td className='px-8 py-6'>
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        user.role === 'admin' 
                          ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-400/30' 
                          : 'bg-gradient-to-r from-[#A3E635]/20 to-[#84CC16]/20 text-[#A3E635] border border-[#A3E635]/30'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className='px-8 py-6'>
                      <button
                        className='bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D97706] text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 border border-[#FBBF24]/50'
                        onClick={async () => {
                          const newRole = user.role === 'admin' ? 'user' : 'admin'
                          const { error } = await supabase
                            .from('profiles')
                            .update({ role: newRole })
                            .eq('id', user.id)
                          if (!error) {
                            const { data } = await supabase
                              .from('profiles')
                              .select('*')
                            setUsers(data || [])
                          }
                        }}
                      >
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 mb-4 text-white z-10 relative">
          <button 
            onClick={() => setFilter("all")}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all"
          >
            All
          </button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 font-bold rounded-xl transition-all ${
              filter === 'pending' ? 'bg-yellow-600 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter("approved")}
            className={`px-6 py-3 font-bold rounded-xl transition-all ${
              filter === 'approved' ? 'bg-green-600 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Approved
          </button>
          <button 
            onClick={() => setFilter("cancelled")}
            className={`px-6 py-3 font-bold rounded-xl transition-all ${
              filter === 'cancelled' ? 'bg-gray-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Cancelled
          </button>
          <button 
            onClick={() => setFilter("rejected")}
            className={`px-6 py-3 font-bold rounded-xl transition-all ${
              filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Rejected
          </button>
        </div>

        <div>
          <h2 className='text-2xl font-bold mb-6 text-white'>All Bookings ({filteredBookings.length})</h2>
          <div className='space-y-6'>
            {filteredBookings.length === 0 ? (
              <div className='bg-[#163A24] shadow-2xl rounded-2xl p-16 text-center border border-[#FBBF24]/30 backdrop-blur-lg'>
                <p className='text-[#9CA3AF] text-xl font-bold'>No bookings match current filter</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className='bg-[#163A24] hover:bg-[#1F2937] shadow-2xl hover:shadow-3xl rounded-2xl p-8 border border-[#FBBF24]/30 backdrop-blur-lg transition-all duration-300 hover:-translate-y-2'>
                  <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center space-x-6'>
                      <div className='w-20 h-20 bg-gradient-to-br from-[#FBBF24] to-[#A3E635] rounded-2xl flex items-center justify-center shadow-2xl'>
                        <span className='text-white font-black text-2xl'>⛳</span>
                      </div>
                      <div>
                        <h3 className='font-black text-3xl text-white'>
                          {booking.profiles?.full_name || booking.user_id?.slice(0,8) + '...'}
                        </h3>
                        <p className='text-[#9CA3AF] text-xl mt-2'>{booking.date} at {booking.time}</p>
                      </div>
                    </div>
                    <span className={`px-6 py-3 rounded-2xl text-lg font-bold border ${
                      booking.status === 'pending' ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 border-yellow-400/50' :
                      booking.status === 'approved' ? 'bg-gradient-to-r from-[#A3E635]/20 to-[#84CC16]/20 text-[#A3E635] border-[#A3E635]/30' :
                      booking.status === 'cancelled' ? 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-400/50' :
                      booking.status === 'rejected' ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-red-400/50' :
                      'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-400/50'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className='flex gap-4 pt-8 border-t border-[#FBBF24]/30'>
                    <button
                      className="flex-1 bg-gradient-to-r from-[#A3E635] to-[#84CC16] hover:from-[#84CC16] hover:to-[#65A30D] text-white py-5 px-8 rounded-2xl font-black text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl hover:-translate-y-2 border border-[#A3E635]/50"
                      onClick={async () => {
                        const { error } = await supabase
                          .from("bookings")
                          .update({ status: "approved" })
                          .eq("id", booking.id)
                        if (!error) loadData()
                      }}
                    >
                      ✅ APPROVE
                    </button>
                    <button
                      className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-5 px-8 rounded-2xl font-black text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl hover:-translate-y-2 border border-slate-400/50"
                      onClick={async () => {
                        const { error } = await supabase
                          .from("bookings")
                          .update({ status: "cancelled" })
                          .eq("id", booking.id)
                        if (!error) loadData()
                      }}
                    >
                      ⏸️ CANCEL
                    </button>
                    <button
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-5 px-8 rounded-2xl font-black text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl hover:-translate-y-2 border border-red-400/50"
                      onClick={async () => {
                        const { error } = await supabase
                          .from("bookings")
                          .update({ status: "rejected" })
                          .eq("id", booking.id)
                        if (!error) loadData()
                      }}
                    >
                      ❌ REJECT
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
