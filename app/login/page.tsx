"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { getUserRole } from "@/lib/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          const role = await getUserRole(user.id)
          if (role === "admin") {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        } catch (err) {
          alert("Failed to fetch role")
          router.push("/dashboard")
        }
      }
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full max-w-md bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        disabled={!email || !password}
      >
        Login
      </button>
    </div>
  )
}

