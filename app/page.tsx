"use client"

import { motion } from "framer-motion"
import { Parallax, ParallaxLayer } from '@react-spring/parallax'

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-[#0F2E1D] to-[#163A24] text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 border-4 border-[#A3E635]/30 rounded-full animate-pulse" />
          <div className="absolute bottom-32 right-32 w-48 h-48 border-4 border-emerald-400/20 rounded-full animate-ping delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-[#A3E635] to-transparent rounded-full blur-xl animate-spin slow-spin" />
        </div>

        {/* Main Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 relative max-w-4xl mx-auto px-6"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-[#A3E635] via-emerald-400 to-[#84CC16] bg-clip-text text-transparent drop-shadow-2xl mb-6">
              EMERALD GOLF
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#A3E635] to-transparent mx-auto rounded-full shadow-lg" />
          </motion.div>

          <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Book premium tee times at the world's finest courses. 
            Live availability, instant approvals, pro-grade scheduling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
<motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/book'}
              className="bg-gradient-to-r from-[#A3E635] to-emerald-600 text-black font-black text-lg px-12 py-6 rounded-3xl shadow-2xl hover:shadow-emerald/50 hover:-translate-y-1 transition-all duration-300 min-w-[200px] cursor-pointer"
            >
              ⛳ Book Tee Time
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/50 backdrop-blur-xl text-white font-bold text-lg px-12 py-6 rounded-3xl hover:bg-white/10 transition-all duration-300 min-w-[200px]"
            >
              View Courses
            </motion.button>
          </div>
        </motion.div>

        {/* Floating Golf Balls */}
        <motion.div 
          className="absolute bottom-20 right-20 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-2xl"
          animate={{ y: [0, -20, 0], rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ⛳
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-[#163A24]/50 to-[#0F2E1D]/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-5xl md:text-6xl font-black text-center mb-24 bg-gradient-to-r from-[#A3E635] via-emerald-400 to-[#84CC16] bg-clip-text text-transparent drop-shadow-2xl"
          >
            Why Choose Emerald Golf?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-[#A3E635] to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all">
                ⚡
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 text-center bg-gradient-to-r from-[#A3E635] to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">Lightning Fast</h3>
              <p className="text-lg md:text-xl text-white text-center leading-relaxed max-w-md mx-auto">
                Book tee times instantly. Live availability with zero wait.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-[#84CC16] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all">
                👑
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 text-center bg-gradient-to-r from-emerald-400 to-[#84CC16] bg-clip-text text-transparent drop-shadow-lg">Premium Courses</h3>
              <p className="text-lg md:text-xl text-white text-center leading-relaxed max-w-md mx-auto">
                Access the world's most exclusive golf courses and tee times.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-[#163A24] to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all">
                🔒
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 text-center bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-lg">Secure Booking</h3>
              <p className="text-lg md:text-xl text-white text-center leading-relaxed max-w-md mx-auto">
                Admin approval system ensures perfect scheduling coordination.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
