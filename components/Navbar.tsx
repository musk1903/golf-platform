"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Navbar() {
const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      if (data.user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
        setProfile(prof)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => setProfile(data))
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="flex justify-between p-8 backdrop-blur-xl bg-[var(--card)] border-b border-[var(--card-border)] shadow-2xl">
      <Link href="/" className="text-2xl font-black bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent drop-shadow-lg">⛳ Golf Platform</Link>

      <div className="flex gap-6 items-center">
{user ? (
  <>
    <Link href="/dashboard" className="text-[var(--accent)] hover:text-[var(--primary)] font-bold text-lg transition-all duration-200 hover:underline underline-offset-4">Dashboard</Link>
    <Link href="/book" className="text-[var(--primary)] hover:text-[var(--accent)] font-bold text-lg transition-all duration-200 hover:underline underline-offset-4">Book Tee Time</Link>

{user && profile?.role === 'admin' && (
  <Link href="/admin" className="bg-[var(--accent)] text-black font-black px-6 py-3 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1">Admin Panel</Link>
)}
            <button 
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black px-6 py-3 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-[var(--accent)] hover:text-[var(--primary)] font-bold text-lg transition-all duration-200 hover:underline underline-offset-4">Login</Link>
            <Link href="/signup" className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--primary)] text-black font-black px-6 py-3 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1">Join Now</Link>
          </>
        )}
      </div>
    </nav>
  )
}
