"use client";

import React from "react";
import { MessageSquare, Settings, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Select & Consult",
    desc: "Choose a Starter or Business package and book a consultation. Tell us about your local business goals.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Quick Setup (24h)",
    desc: "We configure your customized NFC smart cards, design your digital landing page, and optimize your Google profile.",
    icon: Settings,
  },
  {
    step: "03",
    title: "One Tap. Unlimited Growth",
    desc: "Start tapping cards or showing QR codes to clients. Watch your ratings grow, and store customer contacts instantly.",
    icon: TrendingUp,
  },
];

export default function HowItWorks() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-[#FF6A00] uppercase tracking-widest text-xs font-semibold">
            How It Works
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Digital Transformation in 3 Steps.
          </p>
          <p className="text-gray-400 text-sm">
            We handle all technical configurations. In one day, your business is fully ready to take off in the digital market.
          </p>
        </div>

        {/* Steps Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connector line (Desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#FF6A00]/20 to-transparent -translate-y-12 pointer-events-none" />

          {steps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative text-center space-y-6 flex flex-col items-center group"
              >
                {/* Step Number Circle */}
                <div className="w-16 h-16 rounded-full glass-panel border border-[#FF6A00]/20 flex items-center justify-center text-white font-bold relative z-10 group-hover:border-[#FF6A00] transition-colors duration-300 group-hover:shadow-[0_0_30px_rgba(255,106,0,0.2)]">
                  <IconComponent className="w-6 h-6 text-[#FF6A00]" />
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF6A00] text-black">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-3 max-w-sm">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FF6A00] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 p-8 rounded-2xl glass-panel border border-white/5 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6A00]/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Our Core Mission</h3>
          <p className="text-[#FF8833] text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed italic relative z-10">
            &ldquo;Bridge India&apos;s informal economy to the digital economy through simple, affordable digital solutions powered by NFC, QR Codes, and cloud technology.&rdquo;
          </p>
        </motion.div>

      </div>
    </section>
  );
}
