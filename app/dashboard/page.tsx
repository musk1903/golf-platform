"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  full_name: string
  role: string
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push('/login')
        return
      }

      const user = userData.user

      // Check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!data) {
        // If profile doesn't exist → create it with admin role
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: 'New User',
          role: 'admin',
        })

        setProfile({
          id: user.id,
          full_name: 'New User',
          role: 'admin',
        })
      } else {
        setProfile(data)
      }

      // Fetch user bookings
      const { data: bookingData } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setBookings(bookingData || [])

      setLoading(false)
    }

    fetchProfile()

    const channel = supabase
      .channel("user-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          console.log("Dashboard - Booking change detected")
          fetchProfile()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>
  }

  return (
    <div className='max-w-4xl mx-auto py-16 px-6'>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className='text-4xl font-black mb-2'>My Dashboard</h1>
          <p className='text-xl opacity-80'>Manage your tee times</p>
        </div>
        <button
          onClick={handleLogout}
          className='bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl'
        >
          Logout
        </button>
      </div>

      {profile ? (
        <div className='space-y-8'>
          <div className='bg-[#163A24]/80 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/30'>
            <h2 className='text-2xl font-bold mb-4'>👋 Welcome back</h2>
            <p className='text-xl'>{profile.full_name}</p>
            <p className='text-lg opacity-80'>Role: <span className='font-semibold'>{profile.role}</span></p>
          </div>

          <div>
            <h2 className='text-2xl font-bold mb-8'>⛳ My Tee Times</h2>
            
            {bookings.length === 0 ? (
              <div className='bg-[#163A24]/50 backdrop-blur-xl p-16 rounded-3xl text-center border border-emerald-500/20'>
                <p className='text-2xl opacity-70 mb-4'>No tee times booked</p>
                <a href='/book' className='bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold px-12 py-4 rounded-2xl hover:shadow-xl transition-all inline-block'>
                  Book Now →
                </a>
              </div>
            ) : (
              <div className='grid gap-6'>
                {bookings.map((booking) => (
                  <div key={booking.id} className='bg-[#163A24]/80 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/30 hover:shadow-2xl transition-all'>
                    <div className='flex justify-between items-start mb-6'>
                      <div>
                        <p className='text-3xl font-black'>📅 {booking.date}</p>
                        <p className='text-2xl opacity-80'>⏰ {booking.time}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-2xl font-bold text-sm ${
                        booking.status === "approved" ? "bg-emerald-500 text-black" :
                        booking.status === "rejected" ? "bg-red-500 text-white" :
                        booking.status === "cancelled" ? "bg-gray-500 text-white" :
                        "bg-amber-500 text-black"
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    {booking.status === "pending" && (
                      <button
                        onClick={async () => {
                          await supabase
                            .from("bookings")
                            .update({ status: "cancelled" })
                            .eq("id", booking.id)

                          // Refresh bookings
                          const { data } = await supabase
                            .from("bookings")
                            .select("*")
                            .eq("user_id", profile!.id)
                            .order("created_at", { ascending: false })

                          setBookings(data || [])
                        }}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl w-full"
                      >
                        Cancel Tee Time
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className='text-xl opacity-70'>Loading profile...</p>
      )}
    </div>
  )
}

