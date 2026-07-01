"use client";

import React from "react";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  "Business is difficult to find online",
  "Low Google Review counts",
  "No web/digital presence",
  "No business website",
  "Customers lose contact numbers",
  "No WhatsApp Business profile",
  "Poor customer engagement",
  "Low repeat visit numbers",
  "Weak local SEO optimization",
  "Lack of modern digital identity",
];

const outcomes = [
  "More Google Reviews",
  "More Customer Trust",
  "Better Google Search Ranking",
  "More Repeat Customers",
  "Higher Local Visibility",
  "Professional Business Identity",
  "Faster Customer Communication",
  "Improved Customer Experience",
  "Business Available Online 24x7",
];

export default function Solutions() {
  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute right-0 top-1/4 w-80 h-80 bg-[#FF6A00]/5 rounded-full blur-[120px] pointer-events-none"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-[#FF6A00] uppercase tracking-widest text-xs font-semibold">
            Problems & Outcomes
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transforming Challenges Into Growth.
          </p>
          <p className="text-gray-400 text-sm">
            We help local Indian businesses transition from offline-only operations to powerful digital hubs with one tap.
          </p>
        </div>

        {/* Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Problems Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 p-8 rounded-2xl glass-panel border border-white/5 space-y-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold text-white">Common Local Business Pain Points</h3>
              </div>
              <p className="text-gray-400 text-xs mb-6">
                Offline operations limit your business reach. Customers search online and choose competitors because of these issues.
              </p>
              <ul className="space-y-3.5">
                {problems.map((problem) => (
                  <li key={problem} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 mt-2 shrink-0" />
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-6 border-t border-white/5 mt-6 text-gray-500 text-xs flex items-center gap-2">
              <span>Is your business facing these problems?</span>
            </div>
          </motion.div>

          {/* Connect Arrow Visual (Hidden on mobile) */}
          <div className="hidden lg:col-span-2 lg:flex items-center justify-center">
            <motion.div
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-[#FF6A00]/20 text-[#FF6A00]"
              animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 10px rgba(255,106,0,0.1)", "0 0 25px rgba(255,106,0,0.3)", "0 0 10px rgba(255,106,0,0.1)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Solutions Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 p-8 rounded-2xl glass-card-orange border relative overflow-hidden"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-bold text-white">What You Achieve With Logor</h3>
              </div>
              <p className="text-gray-300 text-xs mb-6">
                In just 24 hours, our NFC-based cards and digital setup transform your business into a digital powerhouse.
              </p>
              <ul className="space-y-3.5">
                {outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-sm text-gray-100">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                    <span className="font-medium">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-[#FF6A00]/20 mt-6">
              <a
                href="#contact"
                className="w-full py-3 rounded-xl bg-[#FF6A00] text-black font-bold text-sm text-center block transition-all duration-300 hover:bg-[#FF8833] hover:shadow-[0_4px_20px_rgba(255,106,0,0.4)]"
              >
                Start Digital Transformation
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
