"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [businessName, setBusinessName] = useState("YOUR BUSINESS NAME");
  const [category, setCategory] = useState("TAP TO CONNECT");
  const [cardColor, setCardColor] = useState<"black" | "gold" | "blue">("black");

  // Style configurations for each theme
  const themes = {
    black: {
      background: "linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(5, 5, 5, 0.98) 100%)",
      border: "border-white/10",
      accent: "text-[#FF6A00]",
      accentBg: "bg-[#FF6A00]/10",
      accentBorder: "border-[#FF6A00]/20",
      badgeGradient: "from-orange-500/20 via-yellow-500/10",
      iconGlow: "drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]"
    },
    gold: {
      background: "linear-gradient(135deg, rgba(30, 24, 10, 0.95) 0%, rgba(15, 12, 5, 0.98) 100%)",
      border: "border-amber-500/20",
      accent: "text-amber-400",
      accentBg: "bg-amber-400/10",
      accentBorder: "border-amber-400/20",
      badgeGradient: "from-amber-500/30 via-yellow-500/20",
      iconGlow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
    },
    blue: {
      background: "linear-gradient(135deg, rgba(10, 15, 30, 0.95) 0%, rgba(5, 8, 15, 0.98) 100%)",
      border: "border-blue-500/20",
      accent: "text-blue-400",
      accentBg: "bg-blue-400/10",
      accentBorder: "border-blue-400/20",
      badgeGradient: "from-blue-500/30 via-indigo-500/20",
      iconGlow: "drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
    }
  };

  const currentTheme = themes[cardColor];
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

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side Info */}
        <div className="lg:col-span-6 text-left space-y-6">
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

        {/* Right Side Visuals (NFC Card Customizer & Mobile Landing Page Preview Side-by-Side) */}
        <div className="lg:col-span-6 flex flex-col md:flex-row items-center justify-center relative gap-8 w-full">
          
          {/* Card & Inputs Left Stack */}
          <div className="flex flex-col gap-6 items-center w-full max-w-sm sm:w-auto z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              style={{
                background: currentTheme.background,
              }}
              className={`relative w-72 sm:w-80 aspect-[1.586/1] rounded-xl p-6 border ${currentTheme.border} glass-panel overflow-hidden orange-glow flex flex-col justify-between group shadow-2xl animate-pulse-glow cursor-pointer hover:scale-[1.02] transition-transform duration-300`}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />

              {/* Absolute vector details */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#FF6A00]/20 to-transparent rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-110" />

              {/* Brand Header with Logo and Contactless waves */}
              <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
                <div className="flex items-center gap-2">
                  <Image
                    src="/logor-logo.png"
                    alt="Logor"
                    width={90}
                    height={32}
                    className={`h-7 w-auto object-contain transition-all duration-500 ${currentTheme.iconGlow}`}
                  />
                </div>
                
                {/* Wireless Wave Icon (Contactless NFC symbol) */}
                <div className={`transition-colors duration-500 ${currentTheme.accent}`}>
                  <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a0.5 0.5 0 1 1 0-1 0.5 0 0 1 0 1z" />
                  </svg>
                </div>
              </div>

              {/* NFC Contact Center Tap Point */}
              <div className="flex justify-center items-center my-auto" style={{ transform: "translateZ(40px)" }}>
                <div className={`relative w-12 h-12 rounded-full border border-dashed ${currentTheme.accentBorder} flex items-center justify-center transition-all duration-500`}>
                  <div className={`w-8 h-8 rounded-full ${currentTheme.accentBg} border ${currentTheme.accentBorder} flex items-center justify-center transition-all duration-500`}>
                    <svg className={`w-4 h-4 transition-colors duration-500 ${currentTheme.accent}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Holder Name */}
              <div className="flex justify-between items-end mt-auto" style={{ transform: "translateZ(30px)" }}>
                <div>
                  <p className="text-xs text-white/95 tracking-widest font-mono uppercase font-bold truncate max-w-[180px]">{businessName}</p>
                  <p className={`text-[9px] tracking-wider font-semibold uppercase mt-0.5 transition-colors duration-500 ${currentTheme.accent}`}>{category}</p>
                </div>
                
                {/* NFC circular badge */}
                <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${currentTheme.badgeGradient} to-transparent border border-white/10 flex items-center justify-center text-[7px] text-white/40 font-mono tracking-tighter transition-all duration-500`}>
                  NFC
                </div>
              </div>
            </motion.div>

            {/* Real-time Customizer Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-full p-4 rounded-xl border border-white/5 bg-white/2 backdrop-blur-md flex flex-col gap-3 relative z-10"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#FF6A00]" />
                <span>Interactive Card Preview</span>
              </p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[9px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Business Name</label>
                  <input
                    type="text"
                    placeholder="Enter business name..."
                    maxLength={24}
                    value={businessName === "YOUR BUSINESS NAME" ? "" : businessName}
                    onChange={(e) => setBusinessName(e.target.value.trim() === "" ? "YOUR BUSINESS NAME" : e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#FF6A00]/50 focus:bg-white/10 transition-all font-semibold"
                  />
                </div>
                <div className="w-[100px]">
                  <label className="block text-[9px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Subtext</label>
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

              {/* Color Swapper Controls */}
              <div>
                <label className="block text-[9px] text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">Card Finish / Theme</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCardColor("black")}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "black"
                        ? "bg-white/10 text-white border-white/20 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    Matte Black
                  </button>
                  <button
                    onClick={() => setCardColor("gold")}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "gold"
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/30 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    Gold
                  </button>
                  <button
                    onClick={() => setCardColor("blue")}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "blue"
                        ? "bg-blue-400/20 text-blue-300 border-blue-400/30 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    Blue
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Profile Mockup Device */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="w-[250px] h-[440px] rounded-[36px] border-[5px] border-white/15 bg-black/60 relative overflow-hidden shadow-2xl flex flex-col shrink-0 z-10"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255,255,255,0.05)"
            }}
          >
            {/* Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-10 h-1 bg-white/10 rounded-full" />
            </div>

            {/* Screen Content Wrapper */}
            <div className="flex-1 p-4 pt-7 flex flex-col justify-between relative z-10 select-none font-sans text-white">
              {/* Profile Header info */}
              <div className="flex flex-col items-center text-center mt-2">
                {/* Brand Logo Avatar Frame */}
                <div className={`relative w-14 h-14 rounded-full border border-dashed p-1 ${currentTheme.accentBorder} mb-2 flex items-center justify-center`}>
                  <div className={`w-10 h-10 rounded-full ${currentTheme.accentBg} flex items-center justify-center border ${currentTheme.accentBorder} shadow-[0_0_12px_rgba(255,106,0,0.15)]`}>
                    <Image
                      src="/logor-logo.png"
                      alt="Logor"
                      width={38}
                      height={12}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF6A00] flex items-center justify-center border border-black shadow">
                    <CheckCircle2 className="w-3 h-3 text-black" fill="currentColor" />
                  </div>
                </div>

                {/* Business details dynamically matching customizations */}
                <h3 className="text-xs font-bold tracking-wide uppercase truncate max-w-[180px] text-white/95">
                  {businessName}
                </h3>
                <p className={`text-[8px] font-semibold uppercase tracking-widest mt-0.5 ${currentTheme.accent}`}>
                  {category}
                </p>
              </div>

              {/* Action Buttons Link Grid */}
              <div className="flex flex-col gap-2 my-auto">
                {/* Save Contact action */}
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <div className={`w-7 h-7 rounded-md ${currentTheme.accentBg} flex items-center justify-center border ${currentTheme.accentBorder}`}>
                    <svg className={`w-3.5 h-3.5 ${currentTheme.accent}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-9-3.5h.008v.008H3.75V6m0 3h.008v.008H3.75V9zm0 3h.008v.008H3.75v-.008zm0 3h.008v.008H3.75v-.008zm0 3h.008v.008H3.75v-.008z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white leading-tight">Save Contact</p>
                    <p className="text-[7px] text-gray-500 font-semibold leading-tight">Download VCF card</p>
                  </div>
                </div>

                {/* WhatsApp Chat link */}
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.07 1.95 12.01 1.95c-5.438 0-9.865 4.373-9.87 9.802-.001 1.77.463 3.5 1.34 5.016l-.988 3.606 3.69-.974h.015z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white leading-tight">WhatsApp Me</p>
                    <p className="text-[7px] text-gray-500 font-semibold leading-tight">Start chat instantly</p>
                  </div>
                </div>

                {/* Google review link */}
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <div className="w-7 h-7 rounded-md bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white leading-tight">Google Reviews</p>
                    <p className="text-[7px] text-gray-500 font-semibold leading-tight">Rate us & leave feedback</p>
                  </div>
                </div>

                {/* Instagram feed link */}
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <div className="w-7 h-7 rounded-md bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                    <svg className="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white leading-tight">Instagram Feed</p>
                    <p className="text-[7px] text-gray-500 font-semibold leading-tight">View latest posts</p>
                  </div>
                </div>
              </div>

              {/* Mock Tap Connection Indicator */}
              <div className="flex flex-col items-center gap-1.5 mt-auto">
                <div className="w-12 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-[#FF6A00] rounded-full animate-shimmer" />
                </div>
                <p className="text-[7px] font-semibold tracking-wider text-gray-600 uppercase">
                  Powered by Logor NFC
                </p>
              </div>
            </div>

            {/* Glowing accent border bottom */}
            <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-${cardColor === "black" ? "orange" : cardColor}-500/20 to-transparent`} />
          </motion.div>

          {/* Underlay glow circle */}
          <motion.div
            className="absolute -z-10 w-96 h-56 bg-[#FF6A00]/15 blur-3xl rounded-full transform -rotate-12"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}
