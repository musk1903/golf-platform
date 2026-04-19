"use client"

export const dynamic = 'force-dynamic'

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function SubscribePage() {
  const handleMonthly = async () => {
    const stripe = await stripePromise
    stripe?.redirectToCheckout({
      lineItems: [{ price: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE!, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/subscribe?cancel=true`,
    })
  }

  const handleYearly = async () => {
    const stripe = await stripePromise
    stripe?.redirectToCheckout({
      lineItems: [{ price: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE!, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/subscribe?cancel=true`,
    })
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-black mb-12 text-center">Choose Plan</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-black p-12 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all cursor-pointer group" onClick={handleMonthly}>
          <h2 className="text-4xl font-black mb-4">Monthly</h2>
          <p className="text-5xl font-black">$29</p>
          <p className="opacity-80 mb-8">per month</p>
          <ul className="space-y-2 mb-8 opacity-90">
            <li>• All tee times access</li>
            <li>• Priority booking</li>
            <li>• Score tracking</li>
          </ul>
          <button className="w-full bg-white font-black py-4 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all">Choose Monthly</button>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-black p-12 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all cursor-pointer group relative" onClick={handleYearly}>
          <div className="absolute top-6 right-6 bg-white/30 px-4 py-1 rounded-full text-sm font-bold">SAVE 20%</div>
          <h2 className="text-4xl font-black mb-4">Yearly</h2>
          <p className="text-5xl font-black">$278</p>
          <p className="opacity-80 mb-8">billed yearly</p>
          <ul className="space-y-2 mb-8 opacity-90">
            <li>• All tee times access</li>
            <li>• Priority booking</li>
            <li>• Score tracking</li>
          </ul>
          <button className="w-full bg-white font-black py-4 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all">Choose Yearly (Best Value)</button>
        </div>
      </div>

      <p className="text-center mt-16 text-lg opacity-70">Cancel anytime. No contracts.</p>
    </div>
  )
}
