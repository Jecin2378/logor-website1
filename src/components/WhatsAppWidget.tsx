"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Check, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Structured Knowledge Base for Logor's Services
const KNOWLEDGE_BASE = [
  {
    keywords: ["nfc", "card", "business card", "how it works", "nfc card", "tap"],
    response: "NFC (Near Field Communication) business cards let you share your digital profile, contact details, maps, and review buttons instantly by tapping the card on any modern smartphone. No app installation is required! It works natively on both iOS and Android."
  },
  {
    keywords: ["app", "download", "install", "need app", "customer app", "browser"],
    response: "No! Your customers do not need to install any app. Tapping the NFC card or scanning the custom QR code opens your digital profile instantly in their default mobile browser."
  },
  {
    keywords: ["price", "pricing", "cost", "how much", "rate", "plan", "package", "fees"],
    response: "We offer two transparent pricing plans:\n\n1. **Starter Plan (₹999 Onetime)**: Premium NFC Card, Digital Business Profile, one-tap contact saving, WhatsApp chat button, social links, and profile QR code.\n\n2. **Business Plan (₹1,999 Onetime - Most Popular)**: Everything in Starter + Google Business Profile Setup, Custom Landing Page, Google Review Booster, Google Maps Citations, and full WhatsApp Business integration."
  },
  {
    keywords: ["setup", "time", "how long", "duration", "days", "turnaround", "shipping"],
    response: "We configure your digital presence (Google profile optimization, custom landing page, digital profile, and QR codes) within 24 hours of receiving your business details. Physical NFC cards are shipped to your address in India and usually arrive within 3-5 business days."
  },
  {
    keywords: ["review", "google review", "booster", "rating", "google page"],
    response: "Our Google Review Booster makes getting reviews seamless. When customers tap your NFC card or scan your counter QR, a prominent 'Review Us on Google' button appears. Clicking it redirects them straight to your Google Review input page with the 5-star rating window already popped open, helping them leave a review in under 5 seconds!"
  },
  {
    keywords: ["whatsapp", "integration", "whatsapp integration", "chat button", "wa.me"],
    response: "WhatsApp Integration places a one-tap chat button on your digital profile that launches WhatsApp directly. Customers can start messaging your business instantly without needing to manually type or save your phone number."
  },
  {
    keywords: ["services", "what you do", "offer", "features", "solutions"],
    response: "We help local businesses in India become digital in 24 hours. Our services include:\n- Premium NFC Business Cards\n- Custom Mobile-First Landing Pages\n- Google Business Profile (GBP) optimization\n- Google Review Booster (10x review growth)\n- WhatsApp Business Integration\n- Local SEO & Google Maps citations\n\nWould you like to book a free consultation to discuss further?"
  },
  {
    keywords: ["contact", "phone", "number", "email", "support", "address", "location", "office"],
    response: "You can reach us directly:\n- **Phone/WhatsApp**: +91 7305313682\n- **Email**: consulting@logor.in\n- **Office**: Puducherry, India\n\nYou can also click the WhatsApp or Telegram icon in the chat header to talk to a human directly!"
  },
  {
    keywords: ["qr", "qr code", "scan", "quick response"],
    response: "We generate custom QR codes for your storefront, menus, flyers, and table tents. These scan directly to your mobile business profile, letting customers view menus, pay, or submit reviews instantly."
  },
  {
    keywords: ["eligible", "who", "business type", "suitable", "shops", "for", "whom"],
    response: "We support all kinds of local businesses in India! This includes retail stores, salons, restaurants, clinics, cafes, hotels, professional service providers, and freelancers. Any business looking to attract local customers can benefit."
  },
  {
    keywords: ["hello", "hi", "hey", "greetings", "anyone there", "start", "about"],
    response: "Hello! 👋 I'm the Logor AI Assistant. How can I help you digitize your business today? You can ask about our NFC cards, pricing, setup time, or select one of the quick options below."
  }
];

// Helper to match user text to knowledge base responses
function getAIResponse(userText: string): string {
  const text = userText.toLowerCase().trim();
  
  // Clean punctuation
  const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  const words = cleanText.split(/\s+/);
  
  let bestMatch = null;
  let maxMatchedKeywords = 0;
  
  for (const item of KNOWLEDGE_BASE) {
    let matchCount = 0;
    for (const keyword of item.keywords) {
      if (cleanText.includes(keyword)) {
        if (words.includes(keyword)) {
          matchCount += 2; // Higher weight for exact word match
        } else {
          matchCount += 1;
        }
      }
    }
    
    if (matchCount > maxMatchedKeywords) {
      maxMatchedKeywords = matchCount;
      bestMatch = item;
    }
  }
  
  if (maxMatchedKeywords > 0 && bestMatch) {
    return bestMatch.response;
  }
  
  return "I'm not sure I fully understand that question. 😅 I can answer anything about our NFC business cards, pricing, Google Review booster, or setup timeline.\n\nAlternatively, you can book a free consultation or chat with our team directly on WhatsApp!";
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
}

interface BookingData {
  fullName: string;
  businessName: string;
  phone: string;
  servicesInterested: string[];
}

const servicesList = [
  "NFC Business Cards",
  "Digital Landing Pages",
  "Google Business Profile Setup",
  "QR Code Solutions",
  "Google Review Booster",
  "WhatsApp Business Integration"
];

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [whatsappConfirmUrl, setWhatsappConfirmUrl] = useState("");

  // Conversational Booking Flow States
  const [bookingState, setBookingState] = useState<"idle" | "name" | "business" | "phone" | "services" | "completed">("idle");
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: "",
    businessName: "",
    phone: "",
    servicesInterested: []
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const phoneNumber = "917305313682";
  const defaultMessage = "Hi Logor, I am interested in your digital transformation services. Please share more details.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const telegramBotUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "logorcrmbot";
  const telegramUrl = `https://t.me/${telegramBotUsername}`;

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: "Hi! I am the Logor AI Assistant. 🟧 I help local businesses in India set up NFC cards, Google Review boosters, and custom landing pages. Ask me anything, or let's book a free consultation!",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Pulse badge reminder if chat not open
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const addMessage = (sender: "ai" | "user", text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender,
      text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage("user", text);
    setInputText("");

    // If in booking flow, handle step progression
    if (bookingState !== "idle") {
      handleBookingStep(text);
      return;
    }

    // Normal AI chat mode
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = getAIResponse(text);
      addMessage("ai", response);
    }, 1000);
  };

  // State machine for booking consultation conversationally
  const handleBookingStep = (text: string) => {
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);

      if (bookingState === "name") {
        setBookingData((prev) => ({ ...prev, fullName: text.trim() }));
        setBookingState("business");
        addMessage("ai", `Nice to meet you, ${text.trim()}! 🏢 What is the name of your business/shop?`);
      } else if (bookingState === "business") {
        setBookingData((prev) => ({ ...prev, businessName: text.trim() }));
        setBookingState("phone");
        addMessage("ai", `Got it! What is your phone or WhatsApp number so our team can reach you?`);
      } else if (bookingState === "phone") {
        // Simple numeric/length validation
        const cleanPhone = text.replace(/[^0-9+]/g, "");
        if (cleanPhone.length < 8) {
          addMessage("ai", "⚠️ That phone number looks a bit short. Please enter a valid mobile number (e.g., +91 98765 43210):");
          return;
        }
        setBookingData((prev) => ({ ...prev, phone: text.trim() }));
        setBookingState("services");
        addMessage("ai", `Perfect. Almost done! Please select the services you are interested in from the list below and click the submit button.`);
      }
    }, 800);
  };

  // Handle service selection pills click
  const handleServiceSelect = (service: string) => {
    setBookingData((prev) => {
      const exists = prev.servicesInterested.includes(service);
      const updated = exists
        ? prev.servicesInterested.filter((s) => s !== service)
        : [...prev.servicesInterested, service];
      return { ...prev, servicesInterested: updated };
    });
  };

  // Complete lead insertion into Supabase
  const handleBookingSubmit = async () => {
    setIsTyping(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("leads").insert({
        full_name: bookingData.fullName,
        business_name: bookingData.businessName,
        phone: bookingData.phone,
        services_interested: bookingData.servicesInterested.length > 0 ? bookingData.servicesInterested : ["General Strategy Inquiry"],
        message: "Submitted via AI Chatbot Widget",
        status: "new"
      });

      setIsTyping(false);
      if (error) throw error;

      // Prefill confirmation URL
      const confirmUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        `Hi Logor! I just booked a free consultation via the AI chatbot.\n\nName: ${bookingData.fullName}\nBusiness: ${bookingData.businessName}\nServices: ${bookingData.servicesInterested.join(", ") || "General Inquiry"}`
      )}`;
      setWhatsappConfirmUrl(confirmUrl);

      // Return to idle state so they can continue typing next
      setBookingState("idle");

      // Save names for success message
      const savedName = bookingData.fullName;
      const savedBusiness = bookingData.businessName;
      const savedPhone = bookingData.phone;

      // Clear local booking data
      setBookingData({ fullName: "", businessName: "", phone: "", servicesInterested: [] });

      addMessage(
        "ai",
        `🎉 *Consultation Request Submitted successfully!*\n\nThank you, ${savedName}. We have registered ${savedBusiness} for our digital acceleration review. Our team will contact you at ${savedPhone} shortly!\n\nClick the button below to confirm on WhatsApp, or continue asking questions here!`
      );
    } catch (err) {
      setIsTyping(false);
      console.error("Chatbot lead submission error:", err);
      addMessage("ai", "❌ Oops! Something went wrong saving your details. Please try again or reach us directly on WhatsApp.");
    }
  };

  // Start/cancel booking flow
  const startBookingFlow = () => {
    setBookingState("name");
    addMessage("user", "Book a Free Consultation");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage("ai", "Excellent! Let's get some basic details to set up your consultation. First, what is your *Full Name*?");
    }, 600);
  };

  const resetChat = () => {
    setBookingState("idle");
    setBookingData({ fullName: "", businessName: "", phone: "", servicesInterested: [] });
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: "Hi again! Let's start fresh. How can I help you digitize your business? Ask any question or click below to book a consultation.",
        timestamp: new Date()
      }
    ]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Book Consultation 📅") {
      startBookingFlow();
    } else if (suggestion === "Chat with Human 📞") {
      addMessage("user", "I want to chat with a human");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage("ai", "No problem! You can chat with our support team directly. Click the green WhatsApp button in the header of this window, or message our Telegram bot at any time.");
      }, 800);
    } else {
      // Strip emojis from trigger query to help NLP keyword matching
      const cleanSuggestion = suggestion.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
      handleSend(cleanSuggestion);
    }
  };

  // Suggestion pills shown in idle state
  const suggestionPills = [
    "What is an NFC card? 💳",
    "How does Review Booster work? 📈",
    "Pricing & Plans 💰",
    "QR Codes 📲",
    "Who is this for? 🏢",
    "Book Consultation 📅",
    "Chat with Human 📞"
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  const bookingWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    `Hi Logor! I just booked a free consultation via the AI chatbot.\n\nName: ${bookingData.fullName}\nBusiness: ${bookingData.businessName}\nServices: ${bookingData.servicesInterested.join(", ") || "General Inquiry"}`
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="mb-4 w-[360px] sm:w-[380px] h-[520px] sm:h-[580px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-50"
          >
            {/* Chat Header */}
            <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00] font-bold text-sm relative">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="13" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="12" cy="3" r="1" fill="currentColor" />
                    <line x1="12" y1="4" x2="12" y2="6" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 11H3M21 11H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="8.5" cy="11.5" r="1.5" fill="currentColor" />
                    <circle cx="15.5" cy="11.5" r="1.5" fill="currentColor" />
                    <path d="M9 15C10.5 16 13.5 16 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0A0A0A]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Logor AI Assistant</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-gray-400 font-medium">Answers instantly</span>
                    <Sparkles className="w-3 h-3 text-[#FF6A00] animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                {/* WhatsApp Link */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all duration-200"
                  title="Chat on WhatsApp"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>

                {/* Telegram Link */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] hover:bg-[#0088cc]/20 transition-all duration-200"
                  title="Telegram Support Bot"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.93 1.22-5.46 3.6-.52.35-.98.53-1.4.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.75 3.88-1.69 6.46-2.8 7.74-3.34 3.69-1.54 4.45-1.81 4.95-1.82.11 0 .35.03.51.16.14.12.18.29.2.46.01.07.02.24 0 .32z" />
                  </svg>
                </a>

                {/* Close Button */}
                <button
                  onClick={handleToggle}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 select-text">
              {messages.map((msg) => {
                const isAi = msg.sender === "ai";
                const isSuccessMessage = msg.text.includes("Consultation Request Submitted successfully!");
                return (
                  <div key={msg.id} className="flex flex-col gap-2">
                    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[85%] whitespace-pre-line ${
                          isAi
                            ? "bg-white/[0.03] border border-white/5 text-gray-200 rounded-tl-none"
                            : "bg-gradient-to-r from-[#FF6A00] to-[#FF8833] text-black font-semibold rounded-tr-none shadow-[0_4px_15px_rgba(255,106,0,0.15)]"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                    {isSuccessMessage && whatsappConfirmUrl && (
                      <div className="flex flex-col gap-2 max-w-[85%] self-start w-full">
                        <a
                          href={whatsappConfirmUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl text-center shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all duration-200 flex items-center justify-center gap-1.5"
                        >
                          Confirm via WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Inline Booking Interactive Panel */}
              {bookingState === "services" && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 max-w-[90%]">
                  <h5 className="text-xs font-bold text-[#FF6A00] tracking-wide uppercase">Select Services</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {servicesList.map((service) => {
                      const isSelected = bookingData.servicesInterested.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => handleServiceSelect(service)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-semibold transition-all duration-200 ${
                            isSelected
                              ? "bg-[#FF6A00]/10 text-white border-[#FF6A00]"
                              : "bg-white/[0.01] text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                          }`}
                        >
                          <span>{service}</span>
                          <span className={`w-4 h-4 rounded flex items-center justify-center border text-[9px] font-bold ${
                            isSelected ? "bg-[#FF6A00] border-[#FF6A00] text-black" : "border-gray-600"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleBookingSubmit}
                    className="w-full py-3 bg-[#FF6A00] hover:bg-[#FF8833] text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,106,0,0.3)] transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    Complete Booking
                  </button>
                </div>
              )}

              {/* Bouncing Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-none p-3.5 w-16">
                    <span className="w-1.5 h-1.5 bg-[#FF6A00] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#FF6A00] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#FF6A00] rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* suggestion chips area */}
            {bookingState === "idle" && (
              <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] flex gap-2 overflow-x-auto scrollbar-none no-scrollbar">
                {suggestionPills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => handleSuggestionClick(pill)}
                    className="bg-white/[0.03] border border-white/5 hover:border-[#FF6A00]/40 text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-xs transition-all duration-200 whitespace-nowrap cursor-pointer hover:bg-[#FF6A00]/5 flex-shrink-0"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Footer Input / CTA button */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              {bookingState === "services" ? (
                <div className="text-[10px] text-center text-gray-500 font-medium">
                  Please check the services you need above to complete submission.
                </div>
              ) : (
                <div className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
                    placeholder={
                      bookingState === "name"
                        ? "Enter your name..."
                        : bookingState === "business"
                        ? "Enter business name..."
                        : bookingState === "phone"
                        ? "Enter phone/WhatsApp number..."
                        : "Ask about NFC, pricing, review booster..."
                    }
                    className="w-full pl-4 pr-11 py-3 bg-white/[0.03] border border-white/10 focus:border-[#FF6A00]/50 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                  />
                  <button
                    onClick={() => handleSend(inputText)}
                    disabled={!inputText.trim()}
                    className="absolute right-1 w-9 h-9 rounded-full bg-[#FF6A00] disabled:bg-white/5 text-black disabled:text-gray-600 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        onClick={handleToggle}
        className="flex items-center justify-center w-14 h-14 bg-[#FF6A00] text-white rounded-full shadow-[0_0_20px_rgba(255,106,0,0.4)] hover:shadow-[0_0_35px_rgba(255,106,0,0.8)] border border-orange-400/30 transition-all duration-300 relative group cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant Chatbot"
      >
        <span className="absolute inset-0 rounded-full bg-orange-500/20 blur-md group-hover:bg-orange-500/40 transition-all duration-300" />

        {/* Pulse badge notification reminder */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FF6A00] text-[9px] text-black font-extrabold items-center justify-center">1</span>
          </span>
        )}

        {/* Robot Chatbot Logo / Close SVG */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <motion.div
            className="absolute"
            animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1, scale: isOpen ? 0.5 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Custom Premium Robot Chatbot Face SVG */}
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="6" width="18" height="13" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="12" cy="3.5" r="1.25" fill="currentColor" />
              <line x1="12" y1="4.5" x2="12" y2="6" stroke="currentColor" strokeWidth="2" />
              <path d="M2 11.5h1M21 11.5h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="8" cy="11" r="1.5" fill="currentColor" />
              <circle cx="16" cy="11" r="1.5" fill="currentColor" />
              <path d="M8 15.5c1 1.5 5 1.5 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close (X) Icon */}
            <X className="w-6 h-6 stroke-[2.5]" />
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
}

