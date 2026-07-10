"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "bot" | "user"; text: string; quick?: string[] };

const WHATSAPP_PHONE = "917305313682";
const WHATSAPP_MSG = encodeURIComponent(
  "Hi Logor, I was chatting with your assistant and want to talk to a human."
);

const PRICING = `Our pricing is simple and <b>one-time</b> (no subscription):

• <b>Starter — ₹999</b> — for individuals & freelancers
• <b>Business — ₹1,999</b> — for shops & small businesses

Setup is included and done within 24 hours.`;

const GREETING: Msg = {
  role: "bot",
  text: `Namaste! 🙏 I'm <b>Logor Assistant</b> — we help small Indian businesses go digital with NFC cards, QR codes & Google reviews. How can I help?`,
  quick: ["Pricing", "What is an NFC card?", "Setup time", "Book consultation"],
};

const QUICK_FOLLOWUPS = ["Pricing", "NFC cards", "Google reviews", "Book consultation"];

function waCta() {
  return `<a href="https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MSG}" target="_blank" rel="noopener noreferrer" class="logor-wa-cta">Chat with our team on WhatsApp →</a>`;
}

function reply(input: string): Msg {
  const m = input.toLowerCase();
  const has = (...k: string[]) => k.some((w) => m.includes(w));

  if (has("price", "pricing", "cost", "how much", "fee", "charge", "₹", "rs"))
    return { role: "bot", text: PRICING, quick: QUICK_FOLLOWUPS };

  if (has("nfc", "smart card", "tap card", "card"))
    return {
      role: "bot",
      text: `Our <b>NFC smart cards</b> let customers tap their phone on your card to instantly open your digital profile — save contact, view services, leave a Google review, or message you on WhatsApp. One tap, no app needed.${waCta()}`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("qr"))
    return {
      role: "bot",
      text: `We generate a custom <b>QR code</b> for your business that links to your digital landing page. Print it on your card, counter, or bill — customers scan and instantly reach you online.`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("review", "rating", "google review"))
    return {
      role: "bot",
      text: `We help you <b>collect Google reviews</b> easily. With a tap/scan, happy customers go straight to your Google review page. More reviews = better local ranking & trust.`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("whatsapp"))
    return {
      role: "bot",
      text: `Yes! We set up <b>WhatsApp Business</b> with your profile, catalog & auto-replies so customers can reach you instantly.${waCta()}`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("google business", "gbp", "google profile", "listing", "google my"))
    return {
      role: "bot",
      text: `We create & optimize your <b>Google Business Profile</b> so you show up in local searches and on Google Maps — essential for nearby customers finding your shop.`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("seo"))
    return {
      role: "bot",
      text: `We do basic <b>local SEO</b> — optimizing your profile & landing page so you rank higher when people nearby search for what you offer.`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("setup", "how long", "time", "fast", "install", "24 hour", "24h"))
    return {
      role: "bot",
      text: `The whole setup is handled by our team and completed within <b>24 hours</b>. You don't need any technical skills — we do everything for you.`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("business", "shop", "who", "eligible", "suitable", "industries", "my business"))
    return {
      role: "bot",
      text: `We help all kinds of local businesses: retail shops, restaurants, tea shops, salons, clinics, freelancers & more. If you serve local customers, we can digitize you. 🇮🇳`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("consult", "book", "demo", "call", "talk", "contact", "reach", "human", "agent"))
    return {
      role: "bot",
      text: `Great! Book a free consultation and our team will reach out within 24 hours via WhatsApp or phone.${waCta()}<br><br>Or fill the consultation form on this page.`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("service", "offer", "do you", "help with", "what do"))
    return {
      role: "bot",
      text: `Logor helps small Indian businesses go digital. We offer:<br>• NFC smart cards & QR codes<br>• Digital landing pages<br>• Google Business Profile setup<br>• WhatsApp Business integration<br>• Google review collection<br>• Local SEO & reputation management<br><br>Setup in 24 hours.`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("location", "where", "based", "city", "area", "puducherry"))
    return {
      role: "bot",
      text: `We're based in <b>Puducherry, India</b> 🇮🇳 and serve local businesses across India. Everything is done online, so location isn't a barrier.`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("payment", "pay", "online", "upi"))
    return {
      role: "bot",
      text: `It's a one-time payment (no subscription). You can pay via UPI, bank transfer, or other standard methods — our team will guide you after consultation.${waCta()}`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("hi", "hello", "hey", "namaste", "vanakkam"))
    return { role: "bot", text: GREETING.text, quick: GREETING.quick };

  if (has("thanks", "thank", "great", "awesome", "cool", "nice"))
    return {
      role: "bot",
      text: `You're welcome! 😊 Want me to connect you with our team on WhatsApp?${waCta()}`,
      quick: QUICK_FOLLOWUPS,
    };

  if (has("bye", "goodbye", "see you"))
    return { role: "bot", text: `Goodbye! 🙏 Feel free to reach out anytime.${waCta()}`, quick: [] };

  return {
    role: "bot",
    text: `I can help with pricing, NFC cards, QR codes, Google reviews, WhatsApp setup, SEO, and booking a free consultation. Pick an option below, or tell me more 👇`,
    quick: ["Pricing", "NFC cards", "Setup time", "Book consultation"],
  };
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, isOpen]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: t }]);
    setTyping(true);
    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      const r = reply(t);
      setTyping(false);
      setMessages((prev) => [...prev, r]);
    }, delay);
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="mb-4 w-[340px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[calc(100vh-7rem)] flex flex-col bg-charcoal/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-600/20 to-orange-500/5 border-b border-white/10">
              <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center font-bold text-orange-400">
                L
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Logor Assistant</span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Online • replies instantly
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="ml-auto text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto px-3 py-4 space-y-3 logor-scroll"
            >
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed [&_a]:block [&_a]:mt-2 [&_a]:text-center [&_a]:bg-[#25D366] [&_a]:text-black [&_a]:no-underline [&_a]:py-2 [&_a]:rounded-lg [&_a]:text-[12px] [&_a]:font-semibold [&_b]:font-semibold ${
                      m.role === "user"
                        ? "self-end bg-orange-500 text-white rounded-br-md"
                        : "self-start bg-white/5 text-gray-100 border border-white/10 rounded-bl-md"
                    }`}
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                  {m.quick && m.quick.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-1">
                      {m.quick.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          className="px-2.5 py-1.5 text-[11.5px] rounded-full bg-orange-500/10 text-orange-300 border border-orange-400/20 hover:bg-orange-500/20 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="self-start bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-white/10 bg-charcoal/80">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send(input);
                }}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-[13px] text-white placeholder:text-gray-500 outline-none focus:border-orange-400/40"
              />
              <button
                onClick={() => send(input)}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-[0_0_20px_rgba(255,106,0,0.4)] hover:shadow-[0_0_30px_rgba(255,106,0,0.8)] border border-orange-400/30 transition-all duration-300 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle Logor assistant"
      >
        <span className="absolute inset-0 rounded-full bg-orange-500/20 blur-md group-hover:bg-orange-500/40 transition-all duration-300" />
        <div className="relative w-6 h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg
                key="close"
                className="w-6 h-6 fill-current absolute"
                viewBox="0 0 24 24"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                className="w-6 h-6 fill-current absolute"
                viewBox="0 0 24 24"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.38C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.66 0-3.22-.46-4.54-1.26l-.32-.19-3.02.82.82-3.02-.2-.32C3.46 15.22 3 13.66 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9-4.04 9-9 9zm5-9.5c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-3 0c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-5 0c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}
