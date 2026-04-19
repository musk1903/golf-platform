"use client"

export default function CharitiesPage() {
  const charities = [
    { id: 1, name: 'Golfers Against Hunger', desc: 'Feeding communities through golf events', img: '🥗' },
    { id: 2, name: 'Juniors First Tee', desc: 'Youth golf programs for underprivileged kids', img: '👦⛳' },
    { id: 3, name: 'Green Courses Forever', desc: 'Sustainable golf course preservation', img: '🌿' },
  ]

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-black mb-12">Choose Your Charity</h1>
      <p className="text-xl opacity-80 mb-12">10%+ of subscription goes to your selected charity</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {charities.map(c => (
          <div key={c.id} className="bg-[var(--card)] backdrop-blur-xl p-8 rounded-3xl border border-[var(--card-border)] hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
            <div className="text-5xl mb-6">{c.img}</div>
            <h2 className="text-2xl font-bold mb-4">{c.name}</h2>
            <p className="opacity-80 mb-8">{c.desc}</p>
            <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold py-4 rounded-2xl group-hover:shadow-xl transition-all">
              Select Charity (10%)
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
