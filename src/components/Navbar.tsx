"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Solutions", href: "#solutions" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "py-3 glass-navbar"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <Image
              src="/logor-logo.png"
              alt="Logor Logo"
              width={120}
              height={40}
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(255,106,0,0.3)]"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#FF6A00] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/portal/"
              className="text-xs font-semibold text-gray-300 hover:text-white px-4 py-2 bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              Client Portal
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-transparent border border-white/10 hover:border-[#FF6A00] rounded-full transition-all duration-300 hover:bg-[#FF6A00]/10 hover:shadow-[0_0_20px_rgba(255,106,0,0.15)] backdrop-blur-sm"
            >
              Book Free Consultation
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
 
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[72px] z-30 glass-navbar md:hidden"
          >
            <nav className="flex flex-col p-6 gap-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5"
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-2">
                <a
                  href="/portal/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-center transition-transform duration-200 hover:scale-[1.02]"
                >
                  Client Portal
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#FF6A00] text-black font-semibold rounded-xl text-center shadow-lg transition-transform duration-200 hover:scale-[1.02]"
                >
                  <PhoneCall className="w-4 h-4" />
                  Book Free Consultation
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
