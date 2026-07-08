"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "917305313682";
  const message = "Hi Logor, I am interested in your digital transformation services. Please share more details.";
  const encodedMessage = encodeURIComponent(message);
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  const telegramBotUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "logor_support_bot";
  const telegramUrl = `https://t.me/${telegramBotUsername}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Menu Option Cards */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 flex flex-col gap-3 p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-40 w-48"
          >
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-1">
              Select Channel
            </div>

            {/* WhatsApp Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 group/item"
            >
              <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 flex items-center justify-center text-[#25D366] group-hover/item:bg-[#25D366]/20 transition-all duration-200">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white group-hover/item:text-[#25D366] transition-colors duration-200">WhatsApp</span>
                <span className="text-[10px] text-gray-400">Direct Chat</span>
              </div>
            </a>

            {/* Telegram Link */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 group/item"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0088cc]/15 flex items-center justify-center text-[#0088cc] group-hover/item:bg-[#0088cc]/20 transition-all duration-200">
                <svg className="w-4.5 h-4.5 fill-current relative right-[1px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.944 0C5.372 0 0 5.372 0 11.944c0 5.27 3.42 9.742 8.167 11.32.06.01.12.02.182.02.348 0 .634-.286.634-.634v-3.76l6.906 4.02c.164.095.352.146.544.146.338 0 .647-.156.845-.425l6.452-9.678c.176-.263.27-.573.27-.893 0-.012-.001-.024-.002-.036-.02-.857-.597-1.583-1.428-1.796L8.98 8.016l3.655-3.655c.245-.245.245-.642 0-.887s-.642-.245-.887 0L8.016 7.202 3.978 3.164C3.418 2.604 2.656 2.296 1.865 2.296c-.347 0-.687.058-1.01.173L10.3 12.056l3.32-3.32c.245-.245.642-.245.887 0s.245.642 0 .887l-3.875 3.875c-.245.245-.642.245-.887 0L6.425 10.18l-3.36 3.36c-.245.245-.245.642 0 .887s.642.245.887 0l2.915-2.915 6.906 4.02c.078.045.166.07.256.07.245 0 .458-.162.528-.4l3.32-11.2C17.982 4.002 14.982 2.002 11.944 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white group-hover/item:text-[#0088cc] transition-colors duration-200">Telegram</span>
                <span className="text-[10px] text-gray-400">Interactive Bot</span>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating action button toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-[#FF6A00] text-white rounded-full shadow-[0_0_20px_rgba(255,106,0,0.4)] hover:shadow-[0_0_30px_rgba(255,106,0,0.8)] border border-orange-400/30 transition-all duration-300 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle contact channels"
      >
        <span className="absolute inset-0 rounded-full bg-orange-500/20 blur-md group-hover:bg-orange-500/40 transition-all duration-300" />
        
        {/* Toggle Icon Animating between message & close */}
        <div className="relative w-7 h-7 flex items-center justify-center">
          <motion.svg
            className="w-7 h-7 fill-current absolute"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1, scale: isOpen ? 0.5 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Standard Message Icon */}
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm0 4h12v2H6v-2zm0-8h12v2H6V5z" />
          </motion.svg>
          <motion.svg
            className="w-7 h-7 fill-current absolute"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close (X) Icon */}
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </motion.svg>
        </div>
      </motion.button>
    </div>
  );
}
