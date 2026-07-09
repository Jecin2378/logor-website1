"use client";

import React, { useState } from "react";
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
  X,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    title: "NFC Business Cards",
    description: "Smart NFC cards that instantly share business information with one tap.",
    icon: Smartphone,
    detailedDescription: "Upgrade from paper to smart contactless networking. One tap on a smartphone shares your digital profile, contact details, social links, and website instantly without needing any app.",
    features: [
      "No App Required to scan or save contacts",
      "Instantly update card info anytime from anywhere",
      "Eco-friendly, durable premium materials & matte finishes",
      "Integrated with Google Reviews & social channels"
    ]
  },
  {
    title: "Digital Landing Pages",
    description: "Professional mobile-first landing pages for every business.",
    icon: Globe,
    detailedDescription: "Get a highly optimized, lightning-fast, mobile-first business landing page. Show your services, products, contact forms, and reviews in one beautifully designed URL.",
    features: [
      "Optimized for mobile conversions & speed",
      "Custom branding, matching your theme perfectly",
      "One-click actions (Call, WhatsApp, Maps directions)",
      "Seamless integration with our CRM database"
    ]
  },
  {
    title: "Google Business Profile Setup",
    description: "Create and optimize Google Business Profiles to improve local visibility.",
    icon: MapPin,
    detailedDescription: "Get discovered by local customers. We set up, verify, and optimize your Google Business Profile (Maps) to rank higher in local search results and drive direct foot traffic.",
    features: [
      "Complete profile setup & local SEO optimization",
      "Keyword optimization for local search queries",
      "Product catalog & service list uploads",
      "Strategic verification & review collection assistance"
    ]
  },
  {
    title: "QR Code Solutions",
    description: "Custom QR Codes for menus, payments, reviews, and digital profiles.",
    icon: QrCode,
    detailedDescription: "Smart custom QR codes for your storefront, menus, flyers, and table tents. Direct customers instantly to your reviews page, digital menu, or contactless payment.",
    features: [
      "Custom colors with your brand logo integrated",
      "Dynamic destination URL (change target URL anytime)",
      "High-resolution print-ready vector files provided",
      "Scan analytics & traffic tracking metrics"
    ]
  },
  {
    title: "Google Review Solutions",
    description: "Increase customer reviews using NFC and QR-powered review systems.",
    icon: Star,
    detailedDescription: "The fastest way to gather 5-star Google Reviews. We provide custom NFC tap-cards and QR displays designed to prompt customers on the spot, boosting your local ranking.",
    features: [
      "Direct link bypasses search (1-tap to review screen)",
      "Countertop displays & NFC tap-points for checkout",
      "Staff training guide to asking for reviews effectively",
      "Boost local SEO and trust factor in weeks"
    ]
  },
  {
    title: "Digital Business Profiles",
    description: "Create a complete online identity for local businesses.",
    icon: UserCheck,
    detailedDescription: "A comprehensive digital profile representing your business. Host all your phone numbers, addresses, social channels, and payment details in a premium digital bio-link.",
    features: [
      "Interactive social link directories & contact sharing",
      "Embed video introductions & photo galleries",
      "Include active Google Maps direction buttons",
      "Lead capture forms to collect visitor queries"
    ]
  },
  {
    title: "Contact Saving",
    description: "Allow customers to save business contact details instantly.",
    icon: UserPlus,
    detailedDescription: "Make it effortless for clients to save your number. When tapped or scanned, our system prompts their phone to instantly download your complete contact card (.vcf).",
    features: [
      "Includes profile photo, phone, email, & address details",
      "One-tap download directly to native contacts app",
      "Works on both iOS and Android natively out of the box",
      "Ensures customers never lose your contact number"
    ]
  },
  {
    title: "WhatsApp Business Integration",
    description: "Enable one-tap communication through WhatsApp Business.",
    icon: MessageCircle,
    detailedDescription: "Connect directly with customers where they are. We set up pre-filled WhatsApp links, floating chat widgets, and basic quick-replies to automate customer support.",
    features: [
      "Floating contact widget on your landing page",
      "Custom pre-filled greeting message templates",
      "Quick-reply templates for customer FAQs",
      "Multi-agent link routing for larger teams"
    ]
  },
  {
    title: "Customer Engagement",
    description: "Drive repeat customers through digital interactions.",
    icon: Users,
    detailedDescription: "Nurture customer relationships digitally. Drive repeat visits and reviews by setting up smart customer touchpoints, digital coupons, and interactive feedback loops.",
    features: [
      "Feedback capturing to stop negative reviews before posting",
      "Digital loyalty card & discount coupon templates",
      "Promotional design assets for your local marketing",
      "Automated WhatsApp redirect for review acquisition"
    ]
  },
  {
    title: "Online Reputation Management",
    description: "Build trust with Google Reviews and digital credibility.",
    icon: ShieldCheck,
    detailedDescription: "Take control of your online ratings. Monitor reviews, highlight positive feedback, and respond strategically to negative feedback to build a trusted brand online.",
    features: [
      "Review monitoring dashboard integration",
      "Professional response templates for positive and negative feedback",
      "Google Maps ratings analysis & reputation reports",
      "Review acquisition booster campaigns"
    ]
  },
  {
    title: "Search Engine Optimization",
    description: "Improve online visibility in Google Search.",
    icon: TrendingUp,
    detailedDescription: "Dominate search results in your city. We optimize your website code, setup local backlink schemas, and build landing pages that rank high for local terms.",
    features: [
      "On-page technical SEO matching Next.js best practices",
      "Local citation building on high-authority directories",
      "High-volume local keyword targeting & integration",
      "Monthly search rank progress and traffic reporting"
    ]
  },
  {
    title: "Marketing Automation",
    description: "Marketing and CRM systems working for you automatically.",
    icon: Sliders,
    detailedDescription: "Put your marketing on autopilot. Capture leads via forms, and set up automated email notifications, SMS greetings, and CRM updates to scale operations.",
    features: [
      "Automatic lead capture & instant email/SMS notifications",
      "Custom forms mapping fields to your CRM",
      "Automated follow-up sequences for hot leads",
      "Database synchronization powered by Supabase"
    ]
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState<typeof services[0] | null>(null);

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
                whileHover={{ y: -6, scale: 1.02 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-panel border border-white/5 hover:border-[#FF6A00]/30 hover:shadow-[0_10px_30px_rgba(255,106,0,0.1)] rounded-2xl p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.03) 100%)",
                  backdropFilter: "blur(16px)"
                }}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF6A00]/10 flex items-center justify-center border border-[#FF6A00]/20 text-[#FF6A00] mb-6 backdrop-blur-sm group-hover:bg-[#FF6A00]/20 group-hover:border-[#FF6A00]/40 transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF6A00] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveService(service)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-black bg-[#FF6A00] hover:bg-[#D5C625] transition-all duration-300 shadow-[0_4px_12px_rgba(255,106,0,0.25)] hover:shadow-[0_4px_18px_rgba(213,198,37,0.4)] inline-flex items-center gap-1 hover:scale-[1.02] cursor-pointer"
                  >
                    Learn more &rarr;
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal Popup Overlay */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-[#0E0E0E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_50px_rgba(255,106,0,0.15)] overflow-hidden z-10 flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="absolute top-4 right-4 p-2 rounded-full border border-white/5 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/15 transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Service Header Info */}
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/25 flex items-center justify-center text-[#FF6A00] shrink-0">
                  {React.createElement(activeService.icon, { className: "w-7 h-7" })}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {activeService.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6A00]">
                    Core Local Service
                  </span>
                </div>
              </div>

              {/* Detailed Explanation */}
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {activeService.detailedDescription}
                </p>

                {/* Features Checklist */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold uppercase text-[#D5C625] tracking-widest">
                    What is Included:
                  </h4>
                  <ul className="space-y-2">
                    {activeService.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-400 leading-relaxed">
                        <Check className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Call to Action Inside Modal */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="flex-1 py-3 text-xs sm:text-sm font-semibold text-center rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-white transition-all duration-200 cursor-pointer"
                >
                  Close Info
                </button>
                <a
                  href="#contact"
                  onClick={() => setActiveService(null)}
                  className="flex-1 py-3 text-xs sm:text-sm font-bold text-center rounded-xl text-black bg-[#FF6A00] hover:bg-[#D5C625] hover:shadow-[0_0_20px_rgba(213,198,37,0.35)] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
