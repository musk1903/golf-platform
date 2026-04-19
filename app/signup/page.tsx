"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Signup successful! Please login.')
      router.push('/login')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4 p-8'>
      <h1 className='text-3xl font-bold text-gray-900'>Sign Up</h1>
      <input
        type='email'
        placeholder='Email'
        className='w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password (min 6 chars)'
        className='w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type='text'
        placeholder='Full Name'
        className='w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className='w-full max-w-md bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium'
        disabled={!email || !password}
      >
        Sign Up
      </button>
    </div>
  )
}

