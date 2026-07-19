"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Users, Star } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring, useAnimationFrame, useInView } from "framer-motion";

export default function Hero() {
  const [businessName, setBusinessName] = useState("YOUR BUSINESS NAME");
  const [category, setCategory] = useState("TAP TO CONNECT");
  const [cardColor, setCardColor] = useState<"black" | "gold" | "blue" | "orange" | "white" | "ops">("ops");
  const [isHovering, setIsHovering] = useState(false);
  // Scroll gating: pause 3D animation loop when section is scrolled out of viewport
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.05 });

  // 3D Card Rotation Motion Values (X, Y, and Z axes)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 25 });
  const rotateZ = useSpring(useTransform(z, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 25 });

  // Perpetual realistic 3D floating and swirling motion using multi-frequency harmonic loops
  useAnimationFrame((t) => {
    if (!isInView) return; // Skip updates when off-screen to save battery and CPU cycles
    if (!isHovering) {
      // Combining multiple sine waves with prime/non-divisible frequencies
      // simulates a highly realistic, fluid noise-like floating motion on X, Y, and Z
      const rx = Math.sin(t * 0.001) * 8 + Math.cos(t * 0.0016) * 4; // complex X swing
      const ry = Math.cos(t * 0.0008) * 10 + Math.sin(t * 0.0013) * 3; // complex Y swing
      const rz = Math.sin(t * 0.0006) * 2.5; // subtle roll/Z swing

      // Normalize values to map back to standard spring bounds
      x.set(ry / 15);
      y.set(rx / -15);
      z.set(rz / 4);
    }
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates between -0.5 and 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
    z.set((mouseX / width) * 0.25); // Subtle responsive roll based on mouse X position
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset rotation when cursor leaves the card
    x.set(0);
    y.set(0);
    z.set(0);
  };

  // Style configurations for each theme
  const themes = {
    black: {
      card: {
        background: "#121212", // Solid Matte Black
        border: "border-white/10",
        text: "text-white",
        accent: "text-[#FF6A00]",
        accentBg: "bg-[#FF6A00]/10",
        accentBorder: "border-[#FF6A00]/20",
        badgeGradient: "from-white/10 to-transparent",
        logoFilter: "none",
        nfcText: "text-white/40",
        badgeBorder: "border-white/10"
      }
    },
    gold: {
      card: {
        background: "linear-gradient(135deg, #ECC86A 0%, #C39B3B 50%, #A37C24 100%)", // Rich matte brushed gold look
        border: "border-stone-950/20",
        text: "text-stone-950", // Engraved dark text - highest contrast
        accent: "text-stone-950",
        accentBg: "bg-stone-950/10",
        accentBorder: "border-stone-950/20",
        badgeGradient: "from-stone-950/15 to-transparent",
        logoFilter: "none",
        nfcText: "text-stone-950/60",
        badgeBorder: "border-stone-950/20"
      }
    },
    blue: {
      card: {
        background: "#0F3D8C", // Solid Matte Dark Royal Blue
        border: "border-white/20",
        text: "text-white",
        accent: "text-blue-100",
        accentBg: "bg-white/15",
        accentBorder: "border-white/30",
        badgeGradient: "from-white/15 to-transparent",
        logoFilter: "none",
        nfcText: "text-white/60",
        badgeBorder: "border-white/20"
      }
    },
    orange: {
      card: {
        background: "linear-gradient(135deg, #FF8800 0%, #FF6A00 50%, #E04F00 100%)", // Rich brand orange gradient
        border: "border-white/15",
        text: "text-white",
        accent: "text-white",
        accentBg: "bg-white/15",
        accentBorder: "border-white/25",
        badgeGradient: "from-white/15 to-transparent",
        logoFilter: "none",
        nfcText: "text-white/50",
        badgeBorder: "border-white/15"
      }
    },
    white: {
      card: {
        background: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 60%, #E5E5E7 100%)", // Premium matte white / silver
        border: "border-stone-900/10",
        text: "text-stone-900",
        accent: "text-stone-950",
        accentBg: "bg-stone-950/5",
        accentBorder: "border-stone-950/10",
        badgeGradient: "from-stone-950/5 to-transparent",
        logoFilter: "none",
        nfcText: "text-stone-950/45",
        badgeBorder: "border-stone-950/10"
      }
    },
    ops: {
      card: {
        background: "#080D1A", // Deep Obsidian Navy Blue
        border: "border-blue-500/20",
        text: "text-white",
        accent: "text-[#FF6A00]",
        accentBg: "bg-white/10",
        accentBorder: "border-white/20",
        badgeGradient: "from-blue-500/20 to-transparent",
        logoFilter: "none",
        nfcText: "text-white/50",
        badgeBorder: "border-blue-500/20"
      }
    }
  };

  const currentTheme = themes[cardColor];
  return (
    <section
      ref={containerRef}
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
            One Tap.
            <br />
            Grow Your
            <br />
            <span className="orange-text-gradient">Business.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl leading-relaxed"
          >
            Helping Indian local businesses become digital in one day. Boost your Google reviews, save contact numbers instantly, and drive repeat customers through NFC, QR Codes, and smart engagement.
          </motion.p>

          {/* Social Proof: Live counter with trust metrics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap gap-6 pt-1"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="animate-count-shimmer text-lg font-extrabold">250+</p>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Businesses Transformed</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Star className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="animate-count-shimmer text-lg font-extrabold">4.9★</p>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Avg. Client Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="animate-count-shimmer text-lg font-extrabold">50+</p>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Cities Across India</p>
              </div>
            </div>
          </motion.div>

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

        {/* Right Side Visuals (NFC Card Customizer) */}
        <div className="lg:col-span-6 flex items-center justify-center relative w-full">
          
          {/* Card & Inputs Left Stack */}
          <div className="flex flex-col gap-6 items-center w-full max-w-sm sm:w-auto z-10" style={{ perspective: 1000 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: currentTheme.card.background,
                rotateX,
                rotateY,
                rotateZ,
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`relative w-72 sm:w-80 aspect-[1.586/1] rounded-xl p-6 border ${currentTheme.card.border} overflow-hidden flex flex-col justify-between group shadow-2xl cursor-pointer hover:scale-[1.02] transition-shadow duration-300`}
            >
              {/* 3D Diagonal Stripes for OPS theme */}
              {cardColor === "ops" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl" style={{ transformStyle: "preserve-3d" }}>
                  {/* Blue Stripe */}
                  <div
                    className="absolute w-5 h-[350px] bg-[#0F3D8C] opacity-80"
                    style={{
                      left: "15%",
                      top: "-50px",
                      transform: "translate3d(0, 0, 10px) rotate(-35deg)",
                      boxShadow: "0 0 15px rgba(15, 61, 140, 0.4)",
                    }}
                  />
                  {/* White Stripe */}
                  <div
                    className="absolute w-5 h-[350px] bg-white opacity-85"
                    style={{
                      left: "30%",
                      top: "-50px",
                      transform: "translate3d(0, 0, 16px) rotate(-35deg)",
                      boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                    }}
                  />
                  {/* Orange Stripe */}
                  <div
                    className="absolute w-7 h-[350px] bg-[#FF6A00] opacity-95"
                    style={{
                      left: "44%",
                      top: "-50px",
                      transform: "translate3d(0, 0, 22px) rotate(-35deg)",
                      boxShadow: "0 0 20px rgba(255, 106, 0, 0.5)",
                    }}
                  />
                </div>
              )}
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Absolute vector details */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-110" />

              {/* Brand Header with Logo and Contactless waves */}
              <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
                <div className="flex items-center gap-2">
                  <Image
                    src="/logor-logo.png"
                    alt="Logor"
                    width={90}
                    height={32}
                    className="h-7 w-auto object-contain transition-all duration-500"
                    style={{ filter: currentTheme.card.logoFilter }}
                  />
                </div>
                
                {/* Wireless Wave Icon (Contactless NFC symbol) */}
                <div className={`transition-colors duration-500 ${currentTheme.card.accent}`}>
                  <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a0.5 0.5 0 1 1 0-1 0.5 0 0 1 0 1z" />
                  </svg>
                </div>
              </div>

              {/* NFC Contact Center Tap Point */}
              <div className="flex justify-center items-center my-auto" style={{ transform: "translateZ(40px)" }}>
                <div className={`relative w-12 h-12 rounded-full border border-dashed ${currentTheme.card.accentBorder} flex items-center justify-center transition-all duration-500`}>
                  <div className={`w-8 h-8 rounded-full ${currentTheme.card.accentBg} border ${currentTheme.card.accentBorder} flex items-center justify-center transition-all duration-500`}>
                    <svg className={`w-4 h-4 transition-colors duration-500 ${currentTheme.card.accent}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Holder Name */}
              <div className="flex justify-between items-end mt-auto" style={{ transform: "translateZ(30px)" }}>
                <div>
                  <p className={`text-xs ${currentTheme.card.text} tracking-widest font-mono uppercase font-bold truncate max-w-[180px]`}>{businessName}</p>
                  <p className={`text-[9px] tracking-wider font-semibold uppercase mt-0.5 transition-colors duration-500 ${currentTheme.card.accent}`}>{category}</p>
                </div>
                
                {/* NFC circular badge */}
                <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${currentTheme.card.badgeGradient} to-transparent border ${currentTheme.card.badgeBorder} flex items-center justify-center text-[7px] ${currentTheme.card.nfcText} font-mono tracking-tighter transition-all duration-500`}>
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
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCardColor("black")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "black"
                        ? "bg-white/10 text-white border-white/20 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    Matte Black
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardColor("gold")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "gold"
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/30 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    Gold
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardColor("blue")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "blue"
                        ? "bg-blue-400/20 text-blue-300 border-blue-400/30 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    Blue
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardColor("orange")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "orange"
                        ? "bg-orange-500/20 text-orange-300 border-orange-400/30 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    Orange
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardColor("white")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "white"
                        ? "bg-stone-100 text-stone-900 border-stone-300 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    White
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardColor("ops")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      cardColor === "ops"
                        ? "bg-gradient-to-r from-blue-600 via-orange-500 to-stone-100 text-white border-blue-400 shadow-md"
                        : "bg-white/2 text-gray-400 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    OPS Card
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

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
