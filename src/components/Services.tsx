"use client";

import React from "react";
import {
  Smartphone,
  Globe,
  MapPin,
  QrCode,
  Star,
  UserCheck,
  UserPlus,
  MessageCircle,
  Users,
  ShieldCheck,
  TrendingUp,
  Sliders,
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "NFC Business Cards",
    description: "Smart NFC cards that instantly share business information with one tap.",
    icon: Smartphone,
  },
  {
    title: "Digital Landing Pages",
    description: "Professional mobile-first landing pages for every business.",
    icon: Globe,
  },
  {
    title: "Google Business Profile Setup",
    description: "Create and optimize Google Business Profiles to improve local visibility.",
    icon: MapPin,
  },
  {
    title: "QR Code Solutions",
    description: "Custom QR Codes for menus, payments, reviews, and digital profiles.",
    icon: QrCode,
  },
  {
    title: "Google Review Solutions",
    description: "Increase customer reviews using NFC and QR-powered review systems.",
    icon: Star,
  },
  {
    title: "Digital Business Profiles",
    description: "Create a complete online identity for local businesses.",
    icon: UserCheck,
  },
  {
    title: "Contact Saving",
    description: "Allow customers to save business contact details instantly.",
    icon: UserPlus,
  },
  {
    title: "WhatsApp Business Integration",
    description: "Enable one-tap communication through WhatsApp Business.",
    icon: MessageCircle,
  },
  {
    title: "Customer Engagement",
    description: "Drive repeat customers through digital interactions.",
    icon: Users,
  },
  {
    title: "Online Reputation Management",
    description: "Build trust with Google Reviews and digital credibility.",
    icon: ShieldCheck,
  },
  {
    title: "Search Engine Optimization",
    description: "Improve online visibility in Google Search.",
    icon: TrendingUp,
  },
  {
    title: "Marketing Automation",
    description: "Automate customer follow-ups and marketing campaigns.",
    icon: Sliders,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF6A00]/5 rounded-full blur-[100px] pointer-events-none"
        animate={{ x: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-[#FF6A00] uppercase tracking-widest text-xs font-semibold">
            Our Core Services
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Everything You Need To Grow Online.
          </p>
          <p className="text-gray-400 text-sm">
            We provide full-service digital solutions designed to help Indian local businesses succeed, without requiring any complex tech skills from you.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF6A00]/10 flex items-center justify-center border border-[#FF6A00]/20 text-[#FF6A00] mb-6 backdrop-blur-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF6A00] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href="#contact"
                    className="text-xs font-semibold text-[#FF6A00] hover:text-[#FF8833] inline-flex items-center gap-1 transition-colors"
                  >
                    Learn more &rarr;
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
