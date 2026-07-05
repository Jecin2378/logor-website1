"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is an NFC Business Card and how does it work?",
    answer: "NFC (Near Field Communication) business cards let you share your digital profile, contact details, maps, and review buttons instantly by tapping the card on any modern smartphone. No app installation is required!",
  },
  {
    question: "Do my customers need an app to scan the QR code or tap the card?",
    answer: "No! Your customers do not need to install any app. Tapping the NFC card or scanning the custom QR code opens your digital profile instantly in their default mobile browser.",
  },
  {
    question: "How long does the setup take?",
    answer: "We configure your digital presence (Google profile optimization, custom landing page, digital profile, and QR codes) within 24 hours of receiving your business details. Physical NFC cards are shipped to your address in India.",
  },
  {
    question: "Will the QR codes and digital links work forever?",
    answer: "Yes! The custom QR codes and NFC chips direct to your digital business profile, which stays active 24/7 online. There are no recurring subscription fees for basic listings.",
  },
  {
    question: "How does the Google Review booster work?",
    answer: "When customers tap your card or scan your counter QR, a prominent 'Review Us on Google' button appears on their screen. Clicking it redirects them straight to your Google Review input page with the rating window already popped open, helping them leave a review in 5 seconds.",
  },
  {
    question: "What is the WhatsApp Business Integration?",
    answer: "It places a one-tap chat button on your digital profile that launches WhatsApp directly, allowing customers to start messaging your business instantly without manually typing or saving your phone number.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <motion.div
        className="absolute right-10 bottom-10 w-96 h-96 bg-[#FF6A00]/5 rounded-full blur-[100px] pointer-events-none"
        animate={{ x: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-[#FF6A00] uppercase tracking-widest text-xs font-semibold">
            Got Questions?
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions.
          </p>
          <p className="text-gray-400 text-sm">
            Everything you need to know about our services, setup time, and NFC compatibility.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-xl border overflow-hidden transition-all duration-300 backdrop-blur-sm relative ${
                  isOpen
                    ? "border-[#FF6A00]/30 bg-white/[0.03] shadow-[0_4px_20px_rgba(255,106,0,0.05)]"
                    : "border-white/5 bg-white/[0.01] hover:border-white/10"
                }`}
              >
                {/* Active Indicator Bar */}
                {isOpen && (
                  <motion.div
                    layoutId="faq-indicator"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF6A00]"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center justify-between p-6 text-left font-semibold text-sm sm:text-base hover:bg-white/5 transition-all duration-200 ${
                    isOpen ? "text-[#FF6A00]" : "text-white"
                  }`}
                >
                  <span>{faq.question}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-4 transition-all duration-300 ${
                    isOpen ? "bg-[#FF6A00]/20 text-[#FF6A00]" : "bg-white/5 text-[#FF6A00]"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 border-t border-white/5 text-gray-400 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
