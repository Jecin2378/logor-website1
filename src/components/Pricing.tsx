"use client";

import React, { useState, useEffect } from "react";
import { Check, Zap, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const starterFeatures = [
  "Premium NFC Business Card",
  "Digital Business Profile",
  "One-tap Contact Saving",
  "Direct WhatsApp Chat Button",
  "Social Media Links Integration",
  "Custom Profile QR Code",
];

const popularFeatures = [
  "Everything in Starter",
  "Google Business Profile (GBP) Setup",
  "Custom Mobile-First Landing Page",
  "One-tap Google Review Link",
  "Google Maps Local Citation",
  "One-tap Direct Call Button",
  "WhatsApp Business Integration",
];

export default function Pricing() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  
  // Scarcity: countdown timer (anchoring effect + urgency)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6A00]/5 rounded-full blur-[140px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-[#FF6A00] uppercase tracking-widest text-xs font-semibold">
            Simple Pricing
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Choose Your Digital Growth Plan
          </p>
          <p className="text-gray-400 text-sm">
            One-time investment. Lifetime results. No hidden fees, no recurring charges.
          </p>
          
          {/* Urgency: Countdown timer (scarcity trigger) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-rose-500/5 border border-rose-500/10"
          >
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold text-rose-300">
              Limited time pricing —{" "}
              <span className="font-extrabold text-rose-200 tabular-nums">
                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
              </span>
              {" "}remaining
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          
          {/* ─── STARTER PLAN ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-3xl p-8 flex flex-col justify-between border border-white/5"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Starter</h3>
                  <p className="text-gray-400 text-xs mt-1">For individuals & freelancers</p>
                </div>
              </div>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">₹1,299</span>
                <span className="text-gray-500 text-sm font-medium"> / Onetime</span>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Includes:</p>
                <ul className="space-y-3">
                  {starterFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-[#FF6A00] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="#contact"
                className="w-full py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm text-center block transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
              >
                Choose Starter
              </a>
            </div>
          </motion.div>

          {/* ─── BUSINESS PLAN (Recommended — Target Choice) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card-orange rounded-3xl p-8 flex flex-col justify-between border relative overflow-hidden animate-decoy-pulse"
          >
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0 bg-[#FF6A00] text-black text-[10px] font-bold tracking-widest uppercase py-1 px-4 rounded-bl-xl flex items-center gap-1.5 z-10">
              <Zap className="w-3 h-3 fill-current" />
              Best Value
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Business</h3>
                  <p className="text-orange-200/60 text-xs mt-1">For shops & local businesses</p>
                </div>
              </div>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">₹3,999</span>
                <span className="text-orange-200/50 text-sm font-medium"> / Onetime</span>
              </div>

              {/* Anchoring: Show value comparison */}
              <div className="mb-5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">Value if bought separately:</span>
                <span className="text-xs font-bold text-rose-400 line-through">₹4,999</span>
              </div>

              <div className="border-t border-[#FF6A00]/20 pt-6 space-y-4">
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Everything in Starter +</p>
                <ul className="space-y-3">
                  {popularFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-100">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      <span className={feature === "Everything in Starter" ? "font-bold text-[#FF6A00]" : ""}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="#contact"
                className="w-full py-3.5 rounded-xl bg-[#FF6A00] text-black font-bold text-sm text-center block transition-all duration-300 hover:bg-[#FF8833] hover:shadow-[0_4px_20px_rgba(255,106,0,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Choose Business</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
