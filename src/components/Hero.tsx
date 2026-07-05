"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [businessName, setBusinessName] = useState("YOUR BUSINESS NAME");
  const [category, setCategory] = useState("TAP TO CONNECT");
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden"
    >
      {/* Section-local glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6A00]/10 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#FF6A00]/5 rounded-full blur-[80px] pointer-events-none"
        animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side Info */}
        <div className="lg:col-span-7 text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-xs font-semibold text-[#FF6A00]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Transformation Agency</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
          >
            One Tap.<br />
            <span className="orange-text-gradient">Grow Your Business.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl leading-relaxed"
          >
            Helping Indian local businesses become digital in one day. Boost your Google reviews, save contact numbers instantly, and drive repeat customers through NFC, QR Codes, and smart engagement.
          </motion.p>

          {/* Quick value indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4 pt-2 max-w-md text-sm text-gray-300"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0" />
              <span>Become Digital in 1 Day</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0" />
              <span>NFC & QR Code Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0" />
              <span>Double Google Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0" />
              <span>Zero Technical Code Needed</span>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-xl font-bold bg-[#FF6A00] text-black shadow-[0_4px_20px_rgba(255,106,0,0.3)] hover:shadow-[0_4px_30px_rgba(255,106,0,0.5)] transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]"
            >
              Book Free Consultation
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pricing"
              className="px-8 py-3.5 rounded-xl font-semibold border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
            >
              Get Started
            </a>
          </motion.div>
        </div>

        {/* Right Side Visual (Glowing Luxury Glassmorphism NFC Card) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            style={{
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(5, 5, 5, 0.98) 100%)",
            }}
            className="relative w-80 sm:w-96 aspect-[1.586/1] rounded-2xl p-8 border border-white/10 glass-panel overflow-hidden orange-glow flex flex-col justify-between group shadow-2xl animate-pulse-glow cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />

            {/* Absolute vector details */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#FF6A00]/20 to-transparent rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-110" />

            {/* Brand Header with Logo and Contactless waves */}
            <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
              <div className="flex items-center gap-2">
                <Image
                  src="/logor-logo.png"
                  alt="Logor"
                  width={110}
                  height={38}
                  className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]"
                />
              </div>
              
              {/* Wireless Wave Icon (Contactless NFC symbol) */}
              <div className="text-[#FF6A00]/70 group-hover:text-[#FF6A00] transition-colors duration-300">
                <svg className="w-8 h-8 transform rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a0.5 0.5 0 1 1 0-1 0.5 0 0 1 0 1z" />
                </svg>
              </div>
            </div>

            {/* NFC Contact Center Tap Point */}
            <div className="flex justify-center items-center my-auto" style={{ transform: "translateZ(40px)" }}>
              <div className="relative w-16 h-16 rounded-full border border-dashed border-[#FF6A00]/20 flex items-center justify-center group-hover:border-[#FF6A00]/50 transition-all duration-500">
                <div className="w-10 h-10 rounded-full bg-[#FF6A00]/5 border border-[#FF6A00]/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,106,0,0.2)]">
                  <svg className="w-5 h-5 text-[#FF6A00]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card Holder Name */}
            <div className="flex justify-between items-end mt-auto" style={{ transform: "translateZ(30px)" }}>
              <div>
                <p className="text-sm text-white/90 tracking-widest font-mono uppercase font-bold truncate max-w-[240px]">{businessName}</p>
                <p className="text-[10px] text-[#FF6A00] tracking-wider font-semibold uppercase mt-0.5">{category}</p>
              </div>
              
              {/* NFC circular badge */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500/20 via-yellow-500/10 to-transparent border border-white/10 flex items-center justify-center text-[8px] text-white/40 font-mono tracking-tighter">
                NFC
              </div>
            </div>
          </motion.div>

          {/* Real-time Customizer Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full max-w-sm p-4 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex flex-col gap-3 relative z-10"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#FF6A00]" />
              <span>Interactive Card Preview</span>
            </p>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Business Name</label>
                <input
                  type="text"
                  placeholder="Enter business name..."
                  maxLength={24}
                  value={businessName === "YOUR BUSINESS NAME" ? "" : businessName}
                  onChange={(e) => setBusinessName(e.target.value.trim() === "" ? "YOUR BUSINESS NAME" : e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#FF6A00]/50 focus:bg-white/10 transition-all font-semibold"
                />
              </div>
              <div className="w-[120px]">
                <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Subtext</label>
                <input
                  type="text"
                  placeholder="Tap to connect..."
                  maxLength={18}
                  value={category === "TAP TO CONNECT" ? "" : category}
                  onChange={(e) => setCategory(e.target.value.trim() === "" ? "TAP TO CONNECT" : e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#FF6A00]/50 focus:bg-white/10 transition-all font-mono font-semibold"
                />
              </div>
            </div>
          </motion.div>

          {/* Underlay glow circle */}
          <motion.div
            className="absolute -z-10 w-72 h-44 bg-[#FF6A00]/20 blur-3xl rounded-full transform -rotate-12"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

      </div>
    </section>
  );
}
