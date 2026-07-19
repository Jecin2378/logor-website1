"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Utensils,
  Coffee,
  Scissors,
  Wrench,
  Smartphone,
  Activity,
  GraduationCap,
  Home,
  User,
  HeartHandshake,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  { name: "Retail Shops", icon: ShoppingBag, useCase: "Display custom QR code on billing counters. Customers tap or scan to share location and reviews." },
  { name: "Restaurants", icon: Utensils, useCase: "NFC menu stands on tables. Customers scan custom QR codes to view the digital menu and write quick feedback." },
  { name: "Tea Shops", icon: Coffee, useCase: "Fast-tap review link at the register. Helps build hundreds of local Google ratings easily." },
  { name: "Salons", icon: Scissors, useCase: "Direct WhatsApp booking and digital portfolio integration. Customers save business contacts with one tap." },
  { name: "Mechanics", icon: Wrench, useCase: "High-visibility Google Business profile setup to bring nearby vehicle-breakdown leads straight to your shop." },
  { name: "Mobile Repair", icon: Smartphone, useCase: "NFC cards to share service prices, contact numbers, and drive review building upon device delivery." },
  { name: "Clinics", icon: Activity, useCase: "Setup clean Google Business listing displaying clinic hours, emergency contacts, and maps location." },
  { name: "Tuition Centres", icon: GraduationCap, useCase: "Digital Landing Pages showcasing success rates, contact forms, and locations for new student admissions." },
  { name: "Churches", icon: HeartHandshake, useCase: "Digital directory QR codes to share service timings, location guides, and parish newsletters." },
  { name: "Freelancers", icon: User, useCase: "Luxury NFC business card to instantly hand over portfolio links, contact, and socials to prospects." },
  { name: "Real Estate Agents", icon: Home, useCase: "NFC card to share digital portfolio links. Clients can save agent number instantly in meetings." },
  { name: "Small Businesses", icon: Briefcase, useCase: "A comprehensive digital transformation package that builds trust and increases repeat business." },
];

export default function Industries() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="industries" className="py-24 relative overflow-hidden">
      {/* Glow */}
      <motion.div
        className="absolute left-10 bottom-10 w-96 h-96 bg-[#FF6A00]/5 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-[#FF6A00] uppercase tracking-widest text-xs font-semibold">
            Who We Serve
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Tailored For Every Local Business.
          </p>
          <p className="text-gray-400 text-sm">
            Whether you own a tea shop, manage a clinic, or work as a freelancer, we design NFC and digital profiles customized for your industry.
          </p>
        </div>

        {/* Tab / Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Buttons List */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {industries.map((ind, index) => {
              const IconComp = ind.icon;
              const isActive = activeIndex === index;
              return (
                <button
                  key={ind.name}
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-semibold transition-all duration-300 backdrop-blur-sm ${
                    isActive
                      ? "bg-[#FF6A00] text-black border-[#FF6A00] shadow-[0_4px_20px_rgba(255,106,0,0.3)] scale-[1.02]"
                      : "bg-white/[0.02] text-gray-400 border-white/5 hover:border-white/10 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-black" : "text-[#FF6A00]"}`} />
                  <span>{ind.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side: Interactive Card Display */}
          <div className="lg:col-span-7 h-full flex flex-col justify-center">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-2xl glass-panel border border-white/10 flex flex-col gap-6 md:flex-row items-start md:items-center relative overflow-hidden"
            >
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF6A00]/10 to-transparent rounded-bl-full pointer-events-none" />
              
              {/* Big Icon */}
              <div className="w-16 h-16 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] shrink-0 backdrop-blur-sm relative z-10">
                {React.createElement(industries[activeIndex].icon, { className: "w-8 h-8" })}
              </div>

              {/* Text */}
              <div className="space-y-3 relative z-10">
                <span className="text-xs uppercase tracking-widest text-[#FF6A00] font-bold">Industry Focus</span>
                <h3 className="text-2xl font-bold text-white">{industries[activeIndex].name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {industries[activeIndex].useCase}
                </p>
                <div className="pt-2">
                  <a
                    href="#contact"
                    className="text-xs font-semibold text-[#FF6A00] hover:underline flex items-center gap-1"
                  >
                    Get setup for {industries[activeIndex].name} &rarr;
                  </a>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
