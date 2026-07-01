"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Glass footer background */}
      <div className="absolute inset-0 glass-panel -z-10" />

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF6A00]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Info & Brand */}
          <div className="md:col-span-5 space-y-6">
            <a href="#home" className="flex items-center gap-2 group">
              <Image
                src="/logor-logo.png"
                alt="Logor Logo"
                width={120}
                height={40}
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(255,106,0,0.3)]"
              />
            </a>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Bridging local offline businesses to the digital economy in Puducherry and across India. Grow your business with smart NFC business cards and modern local SEO tools.
            </p>
            
            {/* Custom Instagram Banner inside footer */}
            <div className="p-4 rounded-xl glass-card max-w-sm space-y-3">
              <p className="text-xs text-gray-300">
                Follow our journey, digital marketing tips, and product releases on Instagram!
              </p>
              <a
                href="https://www.instagram.com/logorbusiness?igsh=cDd2NzhkdDA2dXI2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-[#FF6A00] text-white text-xs font-bold transition-transform duration-200 hover:scale-[1.02]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Follow @logorbusiness</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-semibold uppercase text-[#FF6A00] tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services Directory</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Solutions</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Our Pricing Plans</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-sm font-semibold uppercase text-[#FF6A00] tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF6A00] shrink-0 mt-1" />
                <span>Moolakulam, Puducherry, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <a href="tel:+917305313682" className="hover:text-white transition-colors">+91 7305313682</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <a
                  href="https://wa.me/917305313682"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Chat on WhatsApp Business
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <a href="mailto:logorconsulting@gmail.com" className="hover:text-white transition-colors">
                  logorconsulting@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 border-t border-white/5 pt-3">
                <Clock className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <span>Business Hours: 9:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {currentYear} Logor. All rights reserved. Moolakulam, Puducherry.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/logorbusiness?igsh=cDd2NzhkdDA2dXI2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5 text-[#FF6A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
            <button
              onClick={handleScrollTop}
              className="hover:text-white transition-colors flex items-center gap-1"
              aria-label="Scroll to top"
            >
              Back to Top
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
