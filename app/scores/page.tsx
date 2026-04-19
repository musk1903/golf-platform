"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format, isValid } from 'date-fns'

export default function ScoresPage() {
  const [scores, setScores] = useState([])
  const [newScore, setNewScore] = useState({ date: '', score: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .order('date', { ascending: false })
      .limit(5)
    setScores(data || [])
  }

  const addScore = async () => {
    if (!newScore.date || !newScore.score || newScore.score < 1 || newScore.score > 45) {
      setMessage('Score 1-45 + valid date')
      return
    }

    setLoading(true)
    const { data: session } = await supabase.auth.getSession()
    const { error } = await supabase
      .from('scores')
      .insert({ user_id: session.session.user.id, date: newScore.date, score: parseInt(newScore.score) })

    if (error) setMessage('Date already exists')
    else {
      setMessage('Score saved! (rolling 5 max)')
      setNewScore({ date: '', score: '' })
      fetchScores()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-black mb-12">Stableford Scores</h1>
      
      <div className="space-y-8">
        <div className="bg-[var(--card)] p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Add Score (1-45)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input 
              type="date" 
              value={newScore.date} 
              onChange={(e) => setNewScore({...newScore, date: e.target.value})}
              className="p-4 border rounded-xl text-lg"
            />
            <input 
              type="number" 
              min="1" max="45" 
              value={newScore.score} 
              onChange={(e) => setNewScore({...newScore, score: e.target.value})}
              className="p-4 border rounded-xl text-lg"
              placeholder="Score"
            />
            <button 
              onClick={addScore} 
              disabled={loading}
              className="bg-emerald-500 text-black font-bold p-4 rounded-xl hover:bg-emerald-600"
            >
              Add
            </button>
          </div>
          {message && <p className="mt-4 p-3 bg-yellow-100 rounded-xl">{message}</p>}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6">Last 5 Scores</h3>
          {scores.length ? (
            <div className="space-y-3">
              {scores.map((s, i) => (
                <div key={s.id} className="bg-[var(--card)] p-6 rounded-xl flex justify-between">
                  <span>{format(new Date(s.date), 'MMM dd')} </span>
                  <span className="font-bold text-2xl">{s.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No scores yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
